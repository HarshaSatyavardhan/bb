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
  const baseSnippet = snippetAround(text, baseLine);
  const addFinding = (
    severity: Severity,
    title: string,
    description: string,
    fingerprintSuffix: string,
    remediationSummary: string,
    withSnippet = false,
  ) => {
    out.push(buildFinding({
      ruleId: 'PS-003',
      detectorId: DETECTOR_ID,
      severity,
      title,
      description,
      filePath: file,
      line: baseLine,
      snippet: withSnippet ? baseSnippet : undefined,
      evidence: EVIDENCE.ox(),
      remediation: { summary: remediationSummary, autoFixAvailable: false },
      fingerprintParts: [name, fingerprintSuffix],
    }));
  };

  // Streamable-HTTP variant: no command field, but URL must be inspected.
  if (entry.type === 'streamable-http' || entry.url) {
    const url = String(entry.url ?? '');
    if (hasInterpolation(url)) {
      addFinding(
        'high',
        `MCP streamable-http server "${name}" uses variable interpolation in url`,
        `Server "${name}" uses streamable-http transport with interpolation in the url. If user-controlled input flows into the url, an attacker can pivot to internal services or arbitrary endpoints.`,
        'http-interp',
        'Hardcode the url, or constrain it to a single trusted origin.',
        true,
      );
    }
    if (url && !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(url) && !isTrustedServer(url, trusted)) {
      addFinding(
        'medium',
        `MCP streamable-http server "${name}" points at untrusted origin`,
        `Server "${name}" connects to ${url}. Streamable-http MCP servers can both leak agent context and inject untrusted tool definitions.`,
        'http-untrusted',
        'Verify the origin or proxy through a trusted gateway. Add the origin to .promptshield.yaml mcp.trusted_servers if audited.',
      );
    }
    return out;
  }

  // STDIO variant.
  const cmd = entry.command;
  if (typeof cmd !== 'string' || !cmd) return out;
  const args = Array.isArray(entry.args) ? entry.args : [];

  if (hasInterpolation(cmd)) {
    addFinding(
      'critical',
      `MCP server "${name}" uses variable interpolation in command field`,
      'MCP STDIO transport spawns the "command" string as a subprocess. Per OX Security (2026-04-16), interpolation in this field is RCE if any user-controlled input flows in.',
      'interp',
      'Replace interpolation with a hardcoded, audited binary path.',
      true,
    );
  }

  const cmdBase = cmd.split('/').pop()?.toLowerCase() ?? '';
  if (SHELL_BINS.has(cmdBase) && args.includes('-c')) {
    addFinding(
      'critical',
      `MCP server "${name}" invokes a shell with -c`,
      `Server "${name}" runs ${cmd} -c <string>. This is the canonical OX Security RCE pattern - any later mutation to the args array becomes shell-injected code.`,
      'shell-c',
      'Move the server to its own binary; do not invoke a shell.',
      true,
    );
  }

  for (const a of args) {
    if (typeof a === 'string' && containsShellMeta(a)) {
      addFinding(
        'critical',
        `MCP server "${name}" passes shell metacharacters in args`,
        `An argument to the MCP server contains shell metacharacters: ${JSON.stringify(a)}. If a shell wrapper is involved, this is exploitable.`,
        'shell-meta',
        'Remove shell metacharacters; pass discrete arguments only.',
      );
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
    addFinding(
      'medium',
      `MCP server "${name}" is not in the trusted-server allowlist`,
      `Package or binary "${packageRef}" does not match any prefix in the trusted list (${trusted.join(', ')}). Review the server's source before trusting it; MCP STDIO grants subprocess execution.`,
      'untrusted',
      'Add the server to .promptshield.yaml mcp.trusted_servers if you have audited it.',
    );
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
