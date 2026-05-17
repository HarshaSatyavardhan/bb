import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Finding } from '../types/index.js';
import { DANGEROUS_SHELL_UTILITY_NAMES } from '../utils/shell-utilities.js';

export interface FixOperation {
  ruleId: string;
  file: string;
  line: number;
  description: string;
  before: string;
  after: string;
}

export interface FixResult {
  patchPreview: string;
  patchFormat: 'preview';
  operations: FixOperation[];
  unfixable: Finding[];
}

const SHELL_TOKEN_RE = new RegExp(
  `^(\\s*)"(?:Bash\\()?(${DANGEROUS_SHELL_UTILITY_NAMES.join('|')})\\)?"\\s*(,?)\\s*$`,
);

async function withFindingLine<T>(
  finding: Finding,
  run: (ctx: { file: string; lines: string[]; line: string; lineIndex: number }) => T | null,
): Promise<T | null> {
  const file = finding.location.path;
  const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
  const lineIndex = finding.location.startLine - 1;
  if (lineIndex < 0 || lineIndex >= lines.length) return null;
  return run({ file, lines, line: lines[lineIndex], lineIndex });
}

async function fixChainedCommandBypass(finding: Finding): Promise<FixOperation | null> {
  return withFindingLine(finding, ({ file, line }) => {
    // JSON-array entry: "echo", or "Bash(echo)"  (Bob alwaysAllow, Claude permissions.allow, Cursor autoRun.allow)
    const jsonMatch = line.match(SHELL_TOKEN_RE);
    if (!jsonMatch) return null;
    const cmd = jsonMatch[2];
    return {
      ruleId: 'PS-001',
      file,
      line: finding.location.startLine,
      description: `Remove dangerous shell utility "${cmd}" from allowlist`,
      before: `${line}\n`,
      after: '',
    };
  });
}

async function fixCommentAndControlWorkflow(finding: Finding): Promise<FixOperation | null> {
  return withFindingLine(finding, ({ file, line }) => {
    // Insert a comment near the offending step suggesting --disallowed-tools.
    const indent = (line.match(/^(\s*)/) ?? ['', ''])[1];
    const note = `${indent}# PromptShield PS-005: add '--disallowed-tools "Bash,Write,Edit"' and consider 'pull_request' instead of 'pull_request_target'`;
    return {
      ruleId: 'PS-005',
      file,
      line: finding.location.startLine,
      description: 'Insert hardening comment for Comment-and-Control workflow',
      before: `${line}\n`,
      after: `${note}\n${line}\n`,
    };
  });
}

function buildPatchPreview(rootDir: string, ops: FixOperation[]): string {
  const byFile = new Map<string, FixOperation[]>();
  for (const op of ops) {
    if (!byFile.has(op.file)) byFile.set(op.file, []);
    byFile.get(op.file)!.push(op);
  }
  const out: string[] = [
    '# PromptShield remediation preview',
    '# This is a preview format and is not guaranteed to be git-apply compatible.',
    '',
  ];
  for (const [file, list] of byFile) {
    const rel = path.relative(rootDir, file).split(path.sep).join('/') || file;
    out.push(`--- a/${rel}`);
    out.push(`+++ b/${rel}`);
    for (const op of list) {
      out.push(`@@ line ${op.line} @@ ${op.description}`);
      for (const line of op.before.split('\n').filter(Boolean)) out.push(`- ${line}`);
      for (const line of op.after.split('\n').filter(Boolean)) out.push(`+ ${line}`);
    }
    out.push('');
  }
  return out.join('\n');
}

export async function planFixes(findings: Finding[], rootDir: string): Promise<FixResult> {
  const operations: FixOperation[] = [];
  const unfixable: Finding[] = [];

  for (const f of findings) {
    if (!f.remediation.autoFixAvailable) {
      unfixable.push(f);
      continue;
    }
    let op: FixOperation | null = null;
    if (f.ruleId === 'PS-001') op = await fixChainedCommandBypass(f);
    else if (f.ruleId === 'PS-005') op = await fixCommentAndControlWorkflow(f);
    if (op) operations.push(op);
    else unfixable.push(f);
  }

  return {
    patchPreview: buildPatchPreview(rootDir, operations),
    patchFormat: 'preview',
    operations,
    unfixable,
  };
}

function normalizeJsonArraySyntax(content: string): string {
  return content
    .replace(/,\s*(\])/g, '$1')
    .replace(/(\[)\s*,/g, '$1')
    .replace(/,\s*,/g, ',');
}

function lineStartOffset(content: string, line: number): number {
  if (line <= 1) return 0;
  let currentLine = 1;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') {
      currentLine++;
      if (currentLine === line) return i + 1;
    }
  }
  return -1;
}

function replaceOperation(content: string, op: FixOperation): string {
  const expectedOffset = lineStartOffset(content, op.line);
  if (expectedOffset >= 0 && content.startsWith(op.before, expectedOffset)) {
    return content.slice(0, expectedOffset) + op.after + content.slice(expectedOffset + op.before.length);
  }

  const first = content.indexOf(op.before);
  if (first < 0) return content;

  const second = content.indexOf(op.before, first + op.before.length);
  // Ambiguous replacement target: keep file unchanged instead of risking corruption.
  if (second >= 0) return content;

  return content.slice(0, first) + op.after + content.slice(first + op.before.length);
}

export async function applyFixes(ops: FixOperation[]): Promise<void> {
  const byFile = new Map<string, FixOperation[]>();
  for (const op of ops) {
    if (!byFile.has(op.file)) byFile.set(op.file, []);
    byFile.get(op.file)!.push(op);
  }
  for (const [file, list] of byFile) {
    let content = await readFile(file, 'utf8');
    // Apply lower file lines first so earlier replacements do not shift later offsets.
    for (const op of list.sort((a, b) => b.line - a.line || b.before.length - a.before.length)) {
      content = replaceOperation(content, op);
    }
    if (file.endsWith('.json')) {
      const normalized = normalizeJsonArraySyntax(content);
      if (normalized !== content) {
        try {
          JSON.parse(normalized);
          content = normalized;
        } catch {
          // Keep original content if normalization would produce invalid JSON.
        }
      }
    }
    await writeFile(file, content, 'utf8');
  }
}
