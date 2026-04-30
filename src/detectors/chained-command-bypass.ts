import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { parse as parseJsonc } from 'jsonc-parser';
import type { Detector, DetectorContext, Finding } from '../types/index.js';
import { tokenizeAllowEntry, containsShellMeta } from '../utils/shell-tokenizer.js';
import { hashFingerprint, findLineForListItem, findLineForString, snippetAround } from '../utils/fs.js';

const DANGEROUS_BARE_COMMANDS = new Set([
  'echo', 'cat', 'printf', 'tee', 'true', 'false', 'pwd',
]);

const REFS = [
  'https://www.promptarmor.com/resources/ibm-ai-(-bob-)-downloads-and-executes-malware',
];

function makeFinding(args: {
  file: string;
  line: number;
  command: string;
  source: 'bob' | 'claude' | 'cursor';
  snippet?: string;
}): Finding {
  return {
    ruleId: 'PS-001',
    detectorId: 'chained-command-bypass',
    severity: 'critical',
    title: `Auto-approved bare command "${args.command}" enables chained-command bypass`,
    description: `${args.source === 'bob' ? "Bob's auto_approve" : args.source === 'claude' ? "Claude Code's permissions.allow" : "Cursor's auto-run"} list accepts "${args.command}" as a bare command. Per PromptArmor (2026-01-07), an attacker can chain shell metacharacters (>, |, &&, ;) onto an allowlisted command to execute arbitrary payloads without user re-approval.`,
    location: {
      path: args.file,
      startLine: args.line,
      snippet: args.snippet,
    },
    evidence: {
      primarySource: 'PromptArmor 2026-01-07',
      references: REFS,
    },
    remediation: {
      summary: `Remove "${args.command}" from the allowlist, or restrict it with a stricter pattern that disallows shell metacharacters.`,
      autoFixAvailable: true,
    },
    fingerprint: hashFingerprint('PS-001', args.file, args.line, args.command),
  };
}

async function scanBobSettings(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const content = await readFile(file, 'utf8');
  let doc: any;
  try {
    doc = parseYaml(content);
  } catch {
    return out;
  }
  if (!doc || typeof doc !== 'object') return out;

  const allow: unknown[] = Array.isArray(doc.auto_approve) ? doc.auto_approve : [];
  const disableRedirect = doc.disable_redirection === true;

  for (let i = 0; i < allow.length; i++) {
    const entry = allow[i];
    if (typeof entry !== 'string') continue;
    const tokens = tokenizeAllowEntry(entry);
    if (
      tokens.length === 1 &&
      DANGEROUS_BARE_COMMANDS.has(tokens[0]) &&
      !disableRedirect &&
      !containsShellMeta(entry)
    ) {
      const line = findLineForListItem(content, 'auto_approve', i);
      out.push(makeFinding({
        file,
        line,
        command: tokens[0],
        source: 'bob',
        snippet: snippetAround(content, line),
      }));
    }
  }
  return out;
}

async function scanClaudeSettings(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const content = await readFile(file, 'utf8');
  let doc: any;
  try {
    doc = parseJsonc(content);
  } catch {
    return out;
  }
  const allow: unknown[] = doc?.permissions?.allow ?? [];
  if (!Array.isArray(allow)) return out;

  for (const entry of allow) {
    if (typeof entry !== 'string') continue;
    // Claude entries look like "Bash(echo)" or "Bash(echo *)" - extract inner command
    const m = entry.match(/^Bash\((.+)\)$/);
    const inner = m ? m[1] : entry;
    const tokens = tokenizeAllowEntry(inner);
    const bare = tokens[0];
    if (
      tokens.length <= 2 &&
      DANGEROUS_BARE_COMMANDS.has(bare) &&
      !containsShellMeta(inner)
    ) {
      const line = findLineForString(content, entry);
      out.push(makeFinding({
        file,
        line,
        command: bare,
        source: 'claude',
        snippet: snippetAround(content, line),
      }));
    }
  }
  return out;
}

async function scanCursorSettings(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const content = await readFile(file, 'utf8');
  let doc: any;
  try {
    doc = parseJsonc(content);
  } catch {
    return out;
  }
  const allow: unknown[] = doc?.autoRun?.allow ?? doc?.auto_run?.allow ?? [];
  if (!Array.isArray(allow)) return out;
  for (const entry of allow) {
    if (typeof entry !== 'string') continue;
    const tokens = tokenizeAllowEntry(entry);
    if (
      tokens.length === 1 &&
      DANGEROUS_BARE_COMMANDS.has(tokens[0]) &&
      !containsShellMeta(entry)
    ) {
      const line = findLineForString(content, entry);
      out.push(makeFinding({
        file,
        line,
        command: tokens[0],
        source: 'cursor',
        snippet: snippetAround(content, line),
      }));
    }
  }
  return out;
}

const detector: Detector = {
  id: 'PS-001',
  name: 'Chained-command bypass in auto-approve allowlist',
  description:
    'Detects allowlist entries vulnerable to PromptArmor-style command chaining via shell redirection or pipes.',
  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    for (const f of ctx.discovery.bob.settingsFiles) {
      findings.push(...(await scanBobSettings(f)));
    }
    for (const f of ctx.discovery.claude.settingsFiles) {
      findings.push(...(await scanClaudeSettings(f)));
    }
    for (const f of ctx.discovery.cursor.settingsFiles) {
      findings.push(...(await scanCursorSettings(f)));
    }
    return findings;
  },
};

export default detector;
