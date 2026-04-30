import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
import { hashFingerprint, findLineForString, snippetAround } from '../utils/fs.js';

const PERMISSIVE_REGEXES = new Set(['', '.*', '.+', '^.*$', '^.+$', '.*?']);

const REFS = [
  'https://arxiv.org/abs/2601.17548',
  'https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/',
  'https://bob.ibm.com/docs/ide/features/modes',
];

interface ModeEval {
  hasCommand: boolean;
  hasEdit: boolean;
  hasRead: boolean;
  hasMcp: boolean;
  hasBrowser: boolean;
  fileRegex?: string;
  hasWhenToUse: boolean;
  hasRoleDefinition: boolean;
  purpose?: string;
}

function evalGroups(groups: unknown[]): ModeEval {
  const set = new Set(
    (Array.isArray(groups) ? groups : []).map((g) => String(g).toLowerCase()),
  );
  return {
    hasCommand: set.has('command') || set.has('bash') || set.has('shell') || set.has('execute'),
    hasEdit: set.has('edit') || set.has('write'),
    hasRead: set.has('read'),
    hasMcp: set.has('mcp'),
    hasBrowser: set.has('browser'),
    fileRegex: undefined,
    hasWhenToUse: false,
    hasRoleDefinition: false,
  };
}

/**
 * Decide severity using BOTH guardrails real Bob ships with:
 *  - mode-level fileRegex (some forks / Claude skills support this)
 *  - presence of `.bob/rules-<slug>/` directory (real Bob's actual mechanism)
 */
function severityFor(e: ModeEval, hasRulesDir: boolean): Severity | null {
  const tooBroad =
    (!e.fileRegex || PERMISSIVE_REGEXES.has(e.fileRegex)) && !hasRulesDir;
  if (e.hasCommand && tooBroad) return 'critical';
  if (e.hasMcp && tooBroad) return 'high';
  if (e.hasBrowser && tooBroad) return 'high';
  if (e.hasEdit && tooBroad) return 'high';
  // Pure read-only modes (only `read` group, no edit/command/mcp/browser) are
  // bounded by definition; do not flag them even without a rules-<slug>/ dir.
  return null;
}

function describeBreadth(e: ModeEval): string {
  if (e.hasCommand) return 'command/shell';
  if (e.hasMcp) return 'mcp';
  if (e.hasBrowser) return 'browser';
  if (e.hasEdit) return 'edit/write';
  return 'read';
}

function makeFinding(args: {
  file: string;
  line: number;
  modeName: string;
  evaluation: ModeEval;
  severity: Severity;
  source: 'bob-mode' | 'claude-skill';
  hasRulesDir: boolean;
  snippet?: string;
}): Finding {
  const breadth = describeBreadth(args.evaluation);
  const guardHint = args.source === 'bob-mode'
    ? `Add a \`.bob/rules-<slug>/\` directory with explicit behavioural rules, or restrict the mode's groups list.`
    : `Add a fileRegex restricting "${args.modeName}" to the smallest set of files it actually needs.`;
  return {
    ruleId: 'PS-004',
    detectorId: 'custom-mode-privilege-escalation',
    severity: args.severity,
    title: `${args.source === 'bob-mode' ? 'Custom mode' : 'Skill'} "${args.modeName}" grants ${breadth} permission with no behavioural guardrail`,
    description: `The ${args.source === 'bob-mode' ? 'Bob custom mode' : 'Claude skill'} "${args.modeName}" exposes ${breadth} capabilities ${args.source === 'bob-mode' ? 'with no rules-<slug>/ guardrail directory' : 'without a narrow fileRegex'}. Per arXiv 2601.17548 and Snyk ToxicSkills, this is the AI-agent equivalent of a Linux capability over-grant.`,
    location: { path: args.file, startLine: args.line, snippet: args.snippet },
    evidence: {
      primarySource: 'arXiv 2601.17548 + Snyk ToxicSkills 2026-02-05',
      references: REFS,
    },
    remediation: {
      summary: guardHint,
      autoFixAvailable: false,
    },
    fingerprint: hashFingerprint('PS-004', args.file, args.line, args.modeName),
  };
}

async function dirExists(p: string): Promise<boolean> {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function scanBobModes(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const content = await readFile(file, 'utf8');
  let doc: any;
  try {
    doc = parseYaml(content);
  } catch {
    return out;
  }
  // Real Bob uses `customModes` (camelCase). Tolerate the snake form too
  // for any project that copied the spec verbatim.
  const modes = doc?.customModes ?? doc?.custom_modes;
  if (!Array.isArray(modes)) return out;

  const bobDir = path.dirname(file); // .../.bob

  for (const m of modes) {
    if (!m || typeof m !== 'object') continue;
    const slug = typeof m.slug === 'string' ? m.slug : undefined;
    const name = String(m.name ?? slug ?? 'unnamed');
    const purpose = String(m.purpose ?? '').toLowerCase();
    if (purpose === 'red-team' || purpose === 'pentest') continue;

    const evalRes = evalGroups(m.groups ?? []);
    evalRes.fileRegex = typeof m.fileRegex === 'string' ? m.fileRegex : undefined;
    evalRes.hasWhenToUse = typeof m.whenToUse === 'string' && m.whenToUse.length > 0;
    evalRes.hasRoleDefinition =
      typeof m.roleDefinition === 'string' && m.roleDefinition.length > 0;
    evalRes.purpose = purpose;

    // Real Bob guardrail: .bob/rules-<slug>/ directory present.
    const rulesDir = slug ? path.join(bobDir, `rules-${slug}`) : undefined;
    const hasRulesDir = rulesDir ? await dirExists(rulesDir) : false;

    const sev = severityFor(evalRes, hasRulesDir);
    if (!sev) continue;
    const line = findLineForString(content, slug ? `slug: ${slug}` : `name: ${name}`);
    out.push(makeFinding({
      file,
      line,
      modeName: name,
      evaluation: evalRes,
      severity: sev,
      source: 'bob-mode',
      hasRulesDir,
      snippet: snippetAround(content, line),
    }));
  }
  return out;
}

async function scanClaudeSkill(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const content = await readFile(file, 'utf8');
  const fm = parseFrontmatter<any>(content);
  if (!fm.data) return out;

  const purpose = String(fm.data.purpose ?? '').toLowerCase();
  if (purpose === 'red-team' || purpose === 'pentest') return out;

  const tools = Array.isArray(fm.data['allowed-tools']) ? fm.data['allowed-tools'] : [];
  // No tools declared => not in scope for this detector.
  if (tools.length === 0) return out;
  const evalRes = evalGroups(tools);
  evalRes.fileRegex =
    typeof fm.data.fileRegex === 'string' ? fm.data.fileRegex :
    typeof fm.data.file_regex === 'string' ? fm.data.file_regex : undefined;
  evalRes.hasWhenToUse = typeof fm.data.whenToUse === 'string' && fm.data.whenToUse.length > 0;

  // Claude skills don't have a rules-<slug>/ directory analogue; only fileRegex.
  const sev = severityFor(evalRes, false);
  if (!sev) return out;
  const name = String(fm.data.name ?? file.split('/').slice(-2, -1)[0] ?? 'unnamed');
  out.push(makeFinding({
    file,
    line: 1,
    modeName: name,
    evaluation: evalRes,
    severity: sev,
    source: 'claude-skill',
    hasRulesDir: false,
    snippet: snippetAround(content, 1, 5),
  }));
  return out;
}

const detector: Detector = {
  id: 'PS-004',
  name: 'Custom-mode privilege escalation',
  description:
    'Detects Bob custom modes (groups: command/mcp/browser/edit) without a `.bob/rules-<slug>/` guardrail directory, and Claude skills with broad `allowed-tools` without a narrow fileRegex.',
  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    for (const f of ctx.discovery.bob.modeFiles) {
      findings.push(...(await scanBobModes(f)));
    }
    // Claude skills only - Bob skills have a much simpler frontmatter
    // schema (just name + description) and don't declare tool capabilities,
    // so they aren't a privilege-escalation target on the Bob side.
    for (const f of ctx.discovery.claude.skillFiles) {
      findings.push(...(await scanClaudeSkill(f)));
    }
    return findings;
  },
};

export default detector;
