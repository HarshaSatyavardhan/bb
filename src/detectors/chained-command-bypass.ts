import type { Detector, DetectorContext, Finding } from '../types/index.js';
import { tokenizeAllowEntry, containsShellMeta } from '../utils/shell-tokenizer.js';
import { findLineForString, snippetAround } from '../utils/fs.js';
import { loadYaml, loadJsonc } from '../utils/config-loader.js';
import { buildFinding } from '../utils/finding-builder.js';
import { EVIDENCE } from '../utils/evidence.js';
import { DANGEROUS_SHELL_UTILITY_SET } from '../utils/shell-utilities.js';

/**
 * Shell utilities the PromptArmor exploit (2026-01-07) leveraged.
 * When any of these names appears in an MCP `alwaysAllow` list (Bob),
 * a `permissions.allow` array (Claude), or `autoRun.allow` (Cursor),
 * an attacker can chain shell metacharacters or process substitution
 * to execute arbitrary payloads without re-approval.
 */
/**
 * Process substitution `>(...)` is the specific bypass PromptArmor
 * disclosed: Bob's filter caught `$(...)`, `<(...)`, and backticks but
 * MISSED `>(...)`, allowing attackers to redirect output into a sub-shell
 * that downloads and executes payloads.
 */
const PROCESS_SUBSTITUTION_RE = />\s*\(/;

const DETECTOR_ID = 'chained-command-bypass';

interface AllowEntryFinding {
  bareCommand: string;
}

function inspectAllowEntry(entry: unknown): AllowEntryFinding | null {
  if (typeof entry !== 'string') return null;
  // Strip Claude's `Bash(...)` wrapper if present.
  const inner = entry.match(/^Bash\((.+)\)$/)?.[1] ?? entry;
  if (containsShellMeta(inner)) return null;
  const tokens = tokenizeAllowEntry(inner);
  if (tokens.length === 0) return null;
  const head = tokens[0];
  // Bare or near-bare shell utility -> exploitable via chaining.
  if (tokens.length <= 2 && DANGEROUS_SHELL_UTILITY_SET.has(head)) {
    return { bareCommand: head };
  }
  return null;
}

function findingForAllowEntry(args: {
  source: 'bob-alwaysAllow' | 'claude' | 'cursor';
  serverName?: string;
  command: string;
  file: string;
  line: number;
  text: string;
}): Finding {
  const sourceText = {
    'bob-alwaysAllow': `Bob MCP server "${args.serverName}" alwaysAllow list`,
    claude: 'Claude Code permissions.allow list',
    cursor: 'Cursor autoRun.allow list',
  }[args.source];
  return buildFinding({
    ruleId: 'PS-001',
    detectorId: DETECTOR_ID,
    severity: 'critical',
    title: `Auto-approved shell utility "${args.command}" enables chained-command bypass`,
    description: `${sourceText} accepts "${args.command}" as a bare command. Per PromptArmor (2026-01-07), an attacker can chain shell metacharacters (>, |, &&, ;) or process substitution >(...) onto an allowlisted shell utility to execute arbitrary payloads without user re-approval. Bob's pre-GA filter blocked $(...) and <(...) but missed >(...).`,
    filePath: args.file,
    line: args.line,
    snippet: snippetAround(args.text, args.line),
    evidence: EVIDENCE.promptArmor(),
    remediation: {
      summary: `Remove "${args.command}" from the allowlist. If you need shell access in your AI assistant, scope it through a dedicated MCP server with explicit per-tool permissions, not a raw shell utility.`,
      autoFixAvailable: true,
    },
    fingerprintParts: [args.source, args.serverName ?? '', args.command],
  });
}

function findingsForAllowList(args: {
  source: 'bob-alwaysAllow' | 'claude' | 'cursor';
  serverName?: string;
  file: string;
  text: string;
  allow: unknown[];
  lineNeedle: (entry: unknown) => string;
}): Finding[] {
  const out: Finding[] = [];
  for (const entry of args.allow) {
    const hit = inspectAllowEntry(entry);
    if (!hit) continue;
    out.push(findingForAllowEntry({
      source: args.source,
      serverName: args.serverName,
      command: hit.bareCommand,
      file: args.file,
      line: findLineForString(args.text, args.lineNeedle(entry)),
      text: args.text,
    }));
  }
  return out;
}

function findingForProcessSubstitution(args: {
  file: string;
  line: number;
  text: string;
}): Finding {
  return buildFinding({
    ruleId: 'PS-001',
    detectorId: DETECTOR_ID,
    severity: 'critical',
    title: 'Process-substitution bypass pattern `>(...)` detected',
    description: 'Found a `>(...)` process-substitution pattern in an AI configuration file. This is the exact bypass disclosed by PromptArmor (2026-01-07): Bob\'s shell-meta filter blocked `$(...)`, `<(...)`, and backticks but missed `>(...)`, allowing arbitrary command execution.',
    filePath: args.file,
    line: args.line,
    snippet: snippetAround(args.text, args.line),
    evidence: EVIDENCE.promptArmor(),
    remediation: {
      summary: 'Remove the `>(...)` redirection. Process-substitution should never appear in AI assistant skill, mode, or rule files.',
      autoFixAvailable: false,
    },
    fingerprintParts: ['process-substitution'],
  });
}

async function scanBobMcpAlwaysAllow(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const { text, doc } = await loadJsonc<any>(file);
  if (!doc?.mcpServers || typeof doc.mcpServers !== 'object') return out;

  for (const [serverName, raw] of Object.entries(doc.mcpServers)) {
    const server = raw as { alwaysAllow?: unknown };
    const allow = server?.alwaysAllow;
    if (!Array.isArray(allow)) continue;
    out.push(...findingsForAllowList({
      source: 'bob-alwaysAllow',
      serverName,
      file,
      text,
      allow,
      lineNeedle: (entry) => JSON.stringify(entry),
    }));
  }
  return out;
}

async function scanClaudeSettings(file: string): Promise<Finding[]> {
  const { text, doc } = await loadJsonc<any>(file);
  const allow = doc?.permissions?.allow;
  return Array.isArray(allow)
    ? findingsForAllowList({ source: 'claude', file, text, allow, lineNeedle: (entry) => String(entry) })
    : [];
}

async function scanCursorSettings(file: string): Promise<Finding[]> {
  const { text, doc } = await loadJsonc<any>(file);
  const allow = doc?.autoRun?.allow ?? doc?.auto_run?.allow;
  return Array.isArray(allow)
    ? findingsForAllowList({ source: 'cursor', file, text, allow, lineNeedle: (entry) => String(entry) })
    : [];
}

/**
 * Scan free-text content (skills, rules, role definitions) for the `>(...)`
 * process-substitution bypass disclosed by PromptArmor.
 */
async function scanProcessSubstitutionInTextFiles(files: string[]): Promise<Finding[]> {
  const out: Finding[] = [];
  for (const file of files) {
    const { text } = await loadYaml(file); // loadYaml just gives us the text safely
    if (!text) continue;
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (PROCESS_SUBSTITUTION_RE.test(lines[i])) {
        out.push(findingForProcessSubstitution({ file, line: i + 1, text }));
        break;
      }
    }
  }
  return out;
}

const detector: Detector = {
  id: 'PS-001',
  name: 'Chained-command bypass via auto-approved shell utility',
  description:
    "Detects shell utilities (echo, cat, bash, ...) in Bob's `alwaysAllow`, Claude's `permissions.allow`, or Cursor's `autoRun.allow` — the PromptArmor 2026-01-07 attack surface. Also detects `>(...)` process-substitution bypass patterns in skill, rule, and mode files.",

  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];

    for (const f of ctx.discovery.bob.mcpFiles) findings.push(...(await scanBobMcpAlwaysAllow(f)));
    for (const f of ctx.discovery.claude.settingsFiles) findings.push(...(await scanClaudeSettings(f)));
    for (const f of ctx.discovery.cursor.settingsFiles) findings.push(...(await scanCursorSettings(f)));

    // Process-substitution bypass patterns can hide anywhere in agent prose.
    const proseFiles = [
      ...ctx.discovery.bob.skillFiles,
      ...ctx.discovery.bob.modeFiles,
      ...ctx.discovery.claude.skillFiles,
      ...ctx.discovery.cursor.rulesFiles,
    ];
    findings.push(...(await scanProcessSubstitutionInTextFiles(proseFiles)));

    return findings;
  },
};

export default detector;
