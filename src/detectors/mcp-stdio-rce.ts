import { readFile } from 'node:fs/promises';
import { parse as parseJsonc } from 'jsonc-parser';
import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { hasInterpolation, containsShellMeta } from '../utils/shell-tokenizer.js';
import { hashFingerprint, findLineForString, snippetAround } from '../utils/fs.js';

const SHELL_BINS = new Set(['bash', 'sh', 'zsh', 'ksh', 'fish', 'cmd', 'powershell', 'pwsh']);
const INTERPRETER_BINS = new Set(['node', 'python', 'python3', 'ruby', 'perl', 'php']);

const REFS = [
  'https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/',
];

function isTrustedServer(packageOrCmd: string, trusted: string[]): boolean {
  for (const prefix of trusted) {
    if (packageOrCmd.startsWith(prefix)) return true;
  }
  return false;
}

interface McpServerEntry {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
}

function inspectServer(
  name: string,
  entry: McpServerEntry,
  file: string,
  content: string,
  trusted: string[],
): Finding[] {
  const findings: Finding[] = [];
  const cmd = entry.command;
  if (typeof cmd !== 'string' || !cmd) return findings;

  const args = Array.isArray(entry.args) ? entry.args : [];
  const baseLine = findLineForString(content, `"${name}"`);

  // 1. Interpolation in command
  if (hasInterpolation(cmd)) {
    findings.push({
      ruleId: 'PS-003',
      detectorId: 'mcp-stdio-rce',
      severity: 'critical',
      title: `MCP server "${name}" uses variable interpolation in command field`,
      description: `MCP STDIO transport spawns the "command" string as a subprocess. Per OX Security (2026-04-16), interpolation in this field is RCE if any user-controlled input flows in. CVE-2026-30615 / CVE-2026-30625 exploited this exact pattern.`,
      location: { path: file, startLine: baseLine, snippet: snippetAround(content, baseLine) },
      evidence: {
        primarySource: 'OX Security 2026-04-16',
        cveIds: ['CVE-2026-30615', 'CVE-2026-30625'],
        references: REFS,
      },
      remediation: { summary: 'Replace interpolation with a hardcoded, audited binary path.', autoFixAvailable: false },
      fingerprint: hashFingerprint('PS-003', file, baseLine, name, 'interp'),
    });
  }

  // 2. Shell binary with -c
  const lcCmd = cmd.toLowerCase();
  const cmdBase = lcCmd.split('/').pop() || lcCmd;
  if (SHELL_BINS.has(cmdBase)) {
    const hasDashC = args.some((a) => typeof a === 'string' && a === '-c');
    if (hasDashC) {
      findings.push({
        ruleId: 'PS-003',
        detectorId: 'mcp-stdio-rce',
        severity: 'critical',
        title: `MCP server "${name}" invokes a shell with -c`,
        description: `Server "${name}" runs ${cmd} -c <string>. This is the canonical OX Security RCE pattern - any later mutation to the args array becomes shell-injected code.`,
        location: { path: file, startLine: baseLine, snippet: snippetAround(content, baseLine) },
        evidence: {
          primarySource: 'OX Security 2026-04-16',
          references: REFS,
        },
        remediation: { summary: 'Move the server to its own binary; do not invoke a shell.', autoFixAvailable: false },
        fingerprint: hashFingerprint('PS-003', file, baseLine, name, 'shell-c'),
      });
    }
  }

  // 3. Shell metas in args
  for (const a of args) {
    if (typeof a === 'string' && containsShellMeta(a)) {
      findings.push({
        ruleId: 'PS-003',
        detectorId: 'mcp-stdio-rce',
        severity: 'critical',
        title: `MCP server "${name}" passes shell metacharacters in args`,
        description: `An argument to the MCP server contains shell metacharacters: ${JSON.stringify(a)}. The MCP SDK passes args via spawn, but a shell wrapper makes this exploitable.`,
        location: { path: file, startLine: baseLine },
        evidence: {
          primarySource: 'OX Security 2026-04-16',
          references: REFS,
        },
        remediation: { summary: 'Remove shell metacharacters; pass discrete arguments only.', autoFixAvailable: false },
        fingerprint: hashFingerprint('PS-003', file, baseLine, name, 'shell-meta'),
      });
      break;
    }
  }

  // 4. Unknown server (warning)
  // Heuristic: extract package from args (if npx -y <pkg>) or use command itself.
  let packageRef = cmd;
  if (cmd === 'npx' || cmdBase === 'npx') {
    const pkgArg = args.find((a) => typeof a === 'string' && !a.startsWith('-'));
    if (pkgArg) packageRef = pkgArg;
  }
  const isTrusted = isTrustedServer(packageRef, trusted);
  const isInterpreter = INTERPRETER_BINS.has(cmdBase);
  if (!isTrusted && !findings.length && !isInterpreter) {
    // Only warn if it's not already a critical finding for this server.
    const sev: Severity = 'medium';
    findings.push({
      ruleId: 'PS-003',
      detectorId: 'mcp-stdio-rce',
      severity: sev,
      title: `MCP server "${name}" is not in the trusted-server allowlist`,
      description: `Package or binary "${packageRef}" does not match any prefix in the trusted list (${trusted.join(', ')}). Review the server's source before trusting it; MCP STDIO grants subprocess execution.`,
      location: { path: file, startLine: baseLine },
      evidence: {
        primarySource: 'OX Security 2026-04-16',
        references: REFS,
      },
      remediation: { summary: 'Add the server to .promptshield.yaml mcp.trusted_servers if you have audited it.', autoFixAvailable: false },
      fingerprint: hashFingerprint('PS-003', file, baseLine, name, 'untrusted'),
    });
  }

  return findings;
}

const detector: Detector = {
  id: 'PS-003',
  name: 'MCP STDIO RCE',
  description: 'Detects MCP server configurations vulnerable to the OX Security disclosure of April 2026.',
  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    const mcpFiles = [
      ...ctx.discovery.bob.mcpFiles,
      ...ctx.discovery.claude.mcpFiles,
      ...ctx.discovery.cursor.mcpFiles,
    ];

    for (const file of mcpFiles) {
      let content: string;
      try {
        content = await readFile(file, 'utf8');
      } catch {
        continue;
      }
      let doc: any;
      try {
        doc = parseJsonc(content);
      } catch {
        continue;
      }
      const servers = doc?.mcpServers ?? doc?.mcp_servers ?? doc?.servers;
      if (!servers || typeof servers !== 'object') continue;
      for (const [name, entry] of Object.entries(servers)) {
        if (entry && typeof entry === 'object') {
          findings.push(
            ...inspectServer(name, entry as McpServerEntry, file, content, ctx.config.mcp.trusted_servers),
          );
        }
      }
    }
    return findings;
  },
};

export default detector;
