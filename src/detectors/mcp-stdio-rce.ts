import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { hasInterpolation, containsShellMeta } from '../utils/shell-tokenizer.js';
import { findLineForString, snippetAround } from '../utils/fs.js';
import { loadJsonc } from '../utils/config-loader.js';
import { buildFinding } from '../utils/finding-builder.js';
import { EVIDENCE } from '../utils/evidence.js';

const DETECTOR_ID = 'mcp-stdio-rce';

const SHELL_BINS = new Set(['bash', 'sh', 'zsh', 'ksh', 'fish', 'cmd', 'powershell', 'pwsh']);
const INTERPRETER_BINS = new Set(['node', 'python', 'python3', 'ruby', 'perl', 'php']);

interface McpServerEntry {
  type?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  disabled?: boolean;
  alwaysAllow?: string[];
}

function isTrustedServer(packageOrCmd: string, trusted: string[]): boolean {
  return trusted.some((prefix) => packageOrCmd.startsWith(prefix));
}

function findingsForServer(
  name: string,
  entry: McpServerEntry,
  file: string,
  text: string,
  trusted: string[],
): Finding[] {
  if (entry.disabled === true) return [];
  const out: Finding[] = [];
  const baseLine = findLineForString(text, `"${name}"`);

  // Streamable-HTTP variant: no command field, but URL must be inspected.
  if (entry.type === 'streamable-http' || entry.url) {
    const url = String(entry.url ?? '');
    if (hasInterpolation(url)) {
      out.push(buildFinding({
        ruleId: 'PS-003',
        detectorId: DETECTOR_ID,
        severity: 'high',
        title: `MCP streamable-http server "${name}" uses variable interpolation in url`,
        description: `Server "${name}" uses streamable-http transport with interpolation in the url. If user-controlled input flows into the url, an attacker can pivot to internal services or arbitrary endpoints.`,
        filePath: file, line: baseLine, snippet: snippetAround(text, baseLine),
        evidence: EVIDENCE.ox(),
        remediation: { summary: 'Hardcode the url, or constrain it to a single trusted origin.', autoFixAvailable: false },
        fingerprintParts: [name, 'http-interp'],
      }));
    }
    if (url && !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(url) && !isTrustedServer(url, trusted)) {
      out.push(buildFinding({
        ruleId: 'PS-003',
        detectorId: DETECTOR_ID,
        severity: 'medium',
        title: `MCP streamable-http server "${name}" points at untrusted origin`,
        description: `Server "${name}" connects to ${url}. Streamable-http MCP servers can both leak agent context and inject untrusted tool definitions.`,
        filePath: file, line: baseLine,
        evidence: EVIDENCE.ox(),
        remediation: { summary: 'Verify the origin or proxy through a trusted gateway. Add the origin to .promptshield.yaml mcp.trusted_servers if audited.', autoFixAvailable: false },
        fingerprintParts: [name, 'http-untrusted'],
      }));
    }
    return out;
  }

  // STDIO variant.
  const cmd = entry.command;
  if (typeof cmd !== 'string' || !cmd) return out;
  const args = Array.isArray(entry.args) ? entry.args : [];

  if (hasInterpolation(cmd)) {
    out.push(buildFinding({
      ruleId: 'PS-003',
      detectorId: DETECTOR_ID,
      severity: 'critical',
      title: `MCP server "${name}" uses variable interpolation in command field`,
      description: `MCP STDIO transport spawns the "command" string as a subprocess. Per OX Security (2026-04-16), interpolation in this field is RCE if any user-controlled input flows in.`,
      filePath: file, line: baseLine, snippet: snippetAround(text, baseLine),
      evidence: EVIDENCE.ox(),
      remediation: { summary: 'Replace interpolation with a hardcoded, audited binary path.', autoFixAvailable: false },
      fingerprintParts: [name, 'interp'],
    }));
  }

  const cmdBase = cmd.split('/').pop()?.toLowerCase() ?? '';
  if (SHELL_BINS.has(cmdBase) && args.includes('-c')) {
    out.push(buildFinding({
      ruleId: 'PS-003',
      detectorId: DETECTOR_ID,
      severity: 'critical',
      title: `MCP server "${name}" invokes a shell with -c`,
      description: `Server "${name}" runs ${cmd} -c <string>. This is the canonical OX Security RCE pattern - any later mutation to the args array becomes shell-injected code.`,
      filePath: file, line: baseLine, snippet: snippetAround(text, baseLine),
      evidence: EVIDENCE.ox(),
      remediation: { summary: 'Move the server to its own binary; do not invoke a shell.', autoFixAvailable: false },
      fingerprintParts: [name, 'shell-c'],
    }));
  }

  for (const a of args) {
    if (typeof a === 'string' && containsShellMeta(a)) {
      out.push(buildFinding({
        ruleId: 'PS-003',
        detectorId: DETECTOR_ID,
        severity: 'critical',
        title: `MCP server "${name}" passes shell metacharacters in args`,
        description: `An argument to the MCP server contains shell metacharacters: ${JSON.stringify(a)}. If a shell wrapper is involved, this is exploitable.`,
        filePath: file, line: baseLine,
        evidence: EVIDENCE.ox(),
        remediation: { summary: 'Remove shell metacharacters; pass discrete arguments only.', autoFixAvailable: false },
        fingerprintParts: [name, 'shell-meta'],
      }));
      break;
    }
  }

  // Untrusted-server warning (only if no critical finding fired for this server).
  let packageRef = cmd;
  if (cmdBase === 'npx') {
    const pkgArg = args.find((a) => typeof a === 'string' && !a.startsWith('-'));
    if (pkgArg) packageRef = pkgArg;
  }
  const isInterpreter = INTERPRETER_BINS.has(cmdBase);
  if (out.length === 0 && !isTrustedServer(packageRef, trusted) && !isInterpreter) {
    const sev: Severity = 'medium';
    out.push(buildFinding({
      ruleId: 'PS-003',
      detectorId: DETECTOR_ID,
      severity: sev,
      title: `MCP server "${name}" is not in the trusted-server allowlist`,
      description: `Package or binary "${packageRef}" does not match any prefix in the trusted list (${trusted.join(', ')}). Review the server's source before trusting it; MCP STDIO grants subprocess execution.`,
      filePath: file, line: baseLine,
      evidence: EVIDENCE.ox(),
      remediation: { summary: 'Add the server to .promptshield.yaml mcp.trusted_servers if you have audited it.', autoFixAvailable: false },
      fingerprintParts: [name, 'untrusted'],
    }));
  }

  return out;
}

const detector: Detector = {
  id: 'PS-003',
  name: 'MCP STDIO RCE',
  description:
    'Detects MCP server configurations vulnerable to OX Security (2026-04-16): shell -c invocation, command interpolation, shell-meta args, untrusted servers, and streamable-http URLs with interpolation or untrusted origins.',

  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    const mcpFiles = [
      ...ctx.discovery.bob.mcpFiles,
      ...ctx.discovery.claude.mcpFiles,
      ...ctx.discovery.cursor.mcpFiles,
    ];
    for (const file of mcpFiles) {
      const { text, doc } = await loadJsonc<any>(file);
      const servers = doc?.mcpServers ?? doc?.mcp_servers ?? doc?.servers;
      if (!servers || typeof servers !== 'object') continue;
      for (const [name, entry] of Object.entries(servers)) {
        if (entry && typeof entry === 'object') {
          findings.push(...findingsForServer(name, entry as McpServerEntry, file, text, ctx.config.mcp.trusted_servers));
        }
      }
    }
    return findings;
  },
};

export default detector;
