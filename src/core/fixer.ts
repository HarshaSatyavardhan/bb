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
  patch: string;
  operations: FixOperation[];
  unfixable: Finding[];
}

const DANGEROUS_BARE_COMMANDS = new Set([
  'echo', 'cat', 'printf', 'tee', 'true', 'false', 'pwd',
]);

async function fixChainedCommandBypass(finding: Finding): Promise<FixOperation | null> {
  const file = finding.location.path;
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const li = finding.location.startLine - 1;
  if (li < 0 || li >= lines.length) return null;
  const line = lines[li];

  // YAML list item: "  - echo"
  const yamlMatch = line.match(/^(\s*-\s*)["']?([A-Za-z0-9_-]+)["']?\s*$/);
  if (yamlMatch && DANGEROUS_BARE_COMMANDS.has(yamlMatch[2])) {
    const updated = `${yamlMatch[1]}# REMOVED by PromptShield (PS-001): "${yamlMatch[2]}" was vulnerable to chained-command bypass`;
    const before = `${line}\n`;
    const after = `${updated}\n`;
    return {
      ruleId: 'PS-001',
      file,
      line: finding.location.startLine,
      description: `Remove dangerous bare command "${yamlMatch[2]}" from auto_approve allowlist`,
      before,
      after,
    };
  }

  // JSON: "Bash(echo)"
  const jsonMatch = line.match(/^(\s*)("Bash\([A-Za-z0-9_-]+\)")\s*,?\s*$/);
  if (jsonMatch) {
    const updated = `${jsonMatch[1]}// REMOVED by PromptShield (PS-001): ${jsonMatch[2]}`;
    return {
      ruleId: 'PS-001',
      file,
      line: finding.location.startLine,
      description: `Remove dangerous Claude permission ${jsonMatch[2]}`,
      before: `${line}\n`,
      after: `${updated}\n`,
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

function buildUnifiedPatch(rootDir: string, ops: FixOperation[]): string {
  const byFile = new Map<string, FixOperation[]>();
  for (const op of ops) {
    if (!byFile.has(op.file)) byFile.set(op.file, []);
    byFile.get(op.file)!.push(op);
  }
  const out: string[] = [];
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
    patch: buildUnifiedPatch(rootDir, operations),
    operations,
    unfixable,
  };
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
    await writeFile(file, content, 'utf8');
  }
}
