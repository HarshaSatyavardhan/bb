import { stat } from 'node:fs/promises';
import path from 'node:path';
import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
import { findLineForString, snippetAround } from '../utils/fs.js';
import { loadYaml } from '../utils/config-loader.js';
import { buildFinding } from '../utils/finding-builder.js';
import { EVIDENCE } from '../utils/evidence.js';
import { readFile } from 'node:fs/promises';

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
    const slug = typeof m.slug === 'string' ? m.slug : undefined;
    const name = String(m.name ?? slug ?? 'unnamed');
    const purpose = String(m.purpose ?? '').toLowerCase();
    if (purpose === 'red-team' || purpose === 'pentest') continue;

    const evalRes = evalGroups(m.groups ?? []);
    evalRes.fileRegex = typeof m.fileRegex === 'string' ? m.fileRegex : undefined;

    const hasRulesDir = slug ? await dirExists(path.join(bobDir, `rules-${slug}`)) : false;
    const sev = severityFor(evalRes, hasRulesDir);
    if (!sev) continue;

    const breadth = describeBreadth(evalRes);
    const line = findLineForString(text, slug ? `slug: ${slug}` : `name: ${name}`);
    out.push(buildFinding({
      ruleId: 'PS-004',
      detectorId: DETECTOR_ID,
      severity: sev,
      title: `Custom mode "${name}" grants ${breadth} permission with no behavioural guardrail`,
      description: `The Bob custom mode "${name}" exposes ${breadth} capabilities with no \`.bob/rules-${slug ?? '<slug>'}/\` guardrail directory. Per arXiv 2601.17548 and Snyk ToxicSkills, this is the AI-agent equivalent of a Linux capability over-grant.`,
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
  const purpose = String(fm.data.purpose ?? '').toLowerCase();
  if (purpose === 'red-team' || purpose === 'pentest') return out;

  const tools = Array.isArray(fm.data['allowed-tools']) ? fm.data['allowed-tools'] : [];
  if (tools.length === 0) return out;
  const evalRes = evalGroups(tools);
  evalRes.fileRegex = typeof fm.data.fileRegex === 'string' ? fm.data.fileRegex
    : typeof fm.data.file_regex === 'string' ? fm.data.file_regex : undefined;

  const sev = severityFor(evalRes, false);
  if (!sev) return out;

  const name = String(fm.data.name ?? path.basename(path.dirname(file)));
  const breadth = describeBreadth(evalRes);
  out.push(buildFinding({
    ruleId: 'PS-004',
    detectorId: DETECTOR_ID,
    severity: sev,
    title: `Skill "${name}" grants ${breadth} permission with no behavioural guardrail`,
    description: `The Claude skill "${name}" exposes ${breadth} capabilities without a narrow fileRegex.`,
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
