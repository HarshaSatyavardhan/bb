import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
import { findLineForString, snippetAround } from '../utils/fs.js';
import { loadYaml } from '../utils/config-loader.js';
import { buildFinding } from '../utils/finding-builder.js';
import { EVIDENCE } from '../utils/evidence.js';

const DETECTOR_ID = 'custom-mode-privilege-escalation';
const PERMISSIVE_REGEXES = new Set(['', '.*', '.+', '^.*$', '^.+$', '.*?']);

interface ModeEval {
  hasCommand: boolean;
  hasEdit: boolean;
  hasMcp: boolean;
  hasBrowser: boolean;
  hasReadOnly: boolean;
  fileRegex?: string;
}

function evalGroups(groups: unknown[]): ModeEval {
  const set = new Set((Array.isArray(groups) ? groups : []).map((g) => String(g).toLowerCase()));
  const hasCommand = set.has('command') || set.has('bash') || set.has('shell') || set.has('execute');
  const hasEdit = set.has('edit') || set.has('write');
  const hasMcp = set.has('mcp');
  const hasBrowser = set.has('browser');
  const hasRead = set.has('read');
  return {
    hasCommand, hasEdit, hasMcp, hasBrowser,
    hasReadOnly: hasRead && !hasCommand && !hasEdit && !hasMcp && !hasBrowser,
  };
}

function severityFor(e: ModeEval, hasRulesDir: boolean): Severity | null {
  if (e.hasReadOnly) return null;
  const tooBroad = (!e.fileRegex || PERMISSIVE_REGEXES.has(e.fileRegex)) && !hasRulesDir;
  if (!tooBroad) return null;
  if (e.hasCommand) return 'critical';
  if (e.hasMcp || e.hasBrowser || e.hasEdit) return 'high';
  return null;
}

function describeBreadth(e: ModeEval): string {
  if (e.hasCommand) return 'command/shell';
  if (e.hasMcp) return 'mcp';
  if (e.hasBrowser) return 'browser';
  if (e.hasEdit) return 'edit/write';
  return 'read';
}

function isRedTeamPurpose(value: unknown): boolean {
  const purpose = String(value ?? '').toLowerCase();
  return purpose === 'red-team' || purpose === 'pentest';
}

function fileRegexFrom(meta: Record<string, unknown>): string | undefined {
  const fileRegex = meta.fileRegex;
  if (typeof fileRegex === 'string') return fileRegex;
  const snakeRegex = meta.file_regex;
  return typeof snakeRegex === 'string' ? snakeRegex : undefined;
}

function evaluateBroadAccess(
  groups: unknown[],
  fileRegex: string | undefined,
  hasRulesDir: boolean,
): { severity: Severity; breadth: string } | null {
  const evalRes = evalGroups(groups);
  evalRes.fileRegex = fileRegex;
  const severity = severityFor(evalRes, hasRulesDir);
  return severity ? { severity, breadth: describeBreadth(evalRes) } : null;
}

async function dirExists(p: string): Promise<boolean> {
  try { return (await stat(p)).isDirectory(); } catch { return false; }
}

async function scanBobModes(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const { text, doc } = await loadYaml<any>(file);
  const modes = doc?.customModes ?? doc?.custom_modes;
  if (!Array.isArray(modes)) return out;

  const bobDir = path.dirname(file);
  for (const m of modes) {
    if (!m || typeof m !== 'object') continue;
    const mode = m as Record<string, unknown>;
    const slug = typeof mode.slug === 'string' ? mode.slug : undefined;
    const name = String(mode.name ?? slug ?? 'unnamed');
    if (isRedTeamPurpose(mode.purpose)) continue;

    const hasRulesDir = slug ? await dirExists(path.join(bobDir, `rules-${slug}`)) : false;
    const access = evaluateBroadAccess(
      Array.isArray(mode.groups) ? mode.groups : [],
      typeof mode.fileRegex === 'string' ? mode.fileRegex : undefined,
      hasRulesDir,
    );
    if (!access) continue;
    const line = findLineForString(text, slug ? `slug: ${slug}` : `name: ${name}`);
    out.push(buildFinding({
      ruleId: 'PS-004',
      detectorId: DETECTOR_ID,
      severity: access.severity,
      title: `Custom mode "${name}" grants ${access.breadth} permission with no behavioural guardrail`,
      description: `The Bob custom mode "${name}" exposes ${access.breadth} capabilities with no \`.bob/rules-${slug ?? '<slug>'}/\` guardrail directory. Per arXiv 2601.17548 and Snyk ToxicSkills, this is the AI-agent equivalent of a Linux capability over-grant.`,
      filePath: file, line, snippet: snippetAround(text, line),
      evidence: EVIDENCE.customMode(),
      remediation: {
        summary: `Add a \`.bob/rules-${slug ?? '<slug>'}/\` directory with explicit behavioural rules, or restrict the mode's groups list.`,
        autoFixAvailable: false,
      },
      fingerprintParts: [name, slug ?? ''],
    }));
  }
  return out;
}

async function scanClaudeSkill(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  let content: string;
  try { content = await readFile(file, 'utf8'); } catch { return out; }
  const fm = parseFrontmatter<any>(content);
  if (!fm.data) return out;
  if (isRedTeamPurpose(fm.data.purpose)) return out;

  const tools = Array.isArray(fm.data['allowed-tools']) ? fm.data['allowed-tools'] : [];
  if (tools.length === 0) return out;
  const access = evaluateBroadAccess(tools, fileRegexFrom(fm.data), false);
  if (!access) return out;

  const name = String(fm.data.name ?? path.basename(path.dirname(file)));
  out.push(buildFinding({
    ruleId: 'PS-004',
    detectorId: DETECTOR_ID,
    severity: access.severity,
    title: `Skill "${name}" grants ${access.breadth} permission with no behavioural guardrail`,
    description: `The Claude skill "${name}" exposes ${access.breadth} capabilities without a narrow fileRegex.`,
    filePath: file, line: 1, snippet: snippetAround(content, 1, 5),
    evidence: EVIDENCE.customMode(),
    remediation: {
      summary: `Add a fileRegex restricting "${name}" to the smallest set of files it actually needs.`,
      autoFixAvailable: false,
    },
    fingerprintParts: [name],
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
    for (const f of ctx.discovery.bob.modeFiles) findings.push(...(await scanBobModes(f)));
    for (const f of ctx.discovery.claude.skillFiles) findings.push(...(await scanClaudeSkill(f)));
    return findings;
  },
};

export default detector;
