import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Finding } from '../types/index.js';

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

const DANGEROUS_SHELL_TOKENS = [
  'echo', 'cat', 'printf', 'tee', 'true', 'false', 'pwd',
  'sh', 'bash', 'zsh', 'env', 'eval', 'exec',
];

const SHELL_TOKEN_RE = new RegExp(
  `^(\\s*)"(?:Bash\\()?(${DANGEROUS_SHELL_TOKENS.join('|')})\\)?"\\s*(,?)\\s*$`,
);

async function fixChainedCommandBypass(finding: Finding): Promise<FixOperation | null> {
  const file = finding.location.path;
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const li = finding.location.startLine - 1;
  if (li < 0 || li >= lines.length) return null;
  const line = lines[li];

  // JSON-array entry: "echo", or "Bash(echo)"  (Bob's alwaysAllow + Claude's permissions.allow + Cursor's autoRun.allow)
  const jsonMatch = line.match(SHELL_TOKEN_RE);
  if (jsonMatch) {
    const cmd = jsonMatch[2];
    return {
      ruleId: 'PS-001',
      file,
      line: finding.location.startLine,
      description: `Remove dangerous shell utility "${cmd}" from allowlist`,
      before: `${line}\n`,
      after: '',
    };
  }
  return null;
}

async function fixCommentAndControlWorkflow(finding: Finding): Promise<FixOperation | null> {
  const file = finding.location.path;
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const li = finding.location.startLine - 1;
  if (li < 0 || li >= lines.length) return null;

  // Insert a comment near the offending step suggesting --disallowed-tools
  const indent = (lines[li].match(/^(\s*)/) ?? ['', ''])[1];
  const note = `${indent}# PromptShield PS-005: add '--disallowed-tools "Bash,Write,Edit"' and consider 'pull_request' instead of 'pull_request_target'`;
  return {
    ruleId: 'PS-005',
    file,
    line: finding.location.startLine,
    description: 'Insert hardening comment for Comment-and-Control workflow',
    before: `${lines[li]}\n`,
    after: `${note}\n${lines[li]}\n`,
  };
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
