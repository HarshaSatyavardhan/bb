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

export async function applyFixes(ops: FixOperation[]): Promise<void> {
  const byFile = new Map<string, FixOperation[]>();
  for (const op of ops) {
    if (!byFile.has(op.file)) byFile.set(op.file, []);
    byFile.get(op.file)!.push(op);
  }
  for (const [file, list] of byFile) {
    let content = await readFile(file, 'utf8');
    // Replace longest first to avoid index issues
    for (const op of list.sort((a, b) => b.before.length - a.before.length)) {
      if (content.includes(op.before)) {
        content = content.replace(op.before, op.after);
      }
    }
    if (file.endsWith('.json')) {
      content = normalizeJsonArraySyntax(content);
    }
    await writeFile(file, content, 'utf8');
  }
}
