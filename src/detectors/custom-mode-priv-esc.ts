import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
import { hashFingerprint, findLineForString, snippetAround } from '../utils/fs.js';

const PERMISSIVE_REGEXES = new Set(['', '.*', '.+', '^.*$', '^.+$', '.*?']);

const REFS = [
  'https://arxiv.org/abs/2601.17548',
  'https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/',
];

interface ModeEval {
  hasCommand: boolean;
  hasEdit: boolean;
  hasRead: boolean;
  hasMcp: boolean;
  fileRegex?: string;
  hasWhenToUse: boolean;
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
    fileRegex: undefined,
    hasWhenToUse: false,
  };
}

function severityFor(e: ModeEval): Severity | null {
  const tooBroad = !e.fileRegex || PERMISSIVE_REGEXES.has(e.fileRegex);
  if (e.hasCommand && tooBroad) return 'critical';
  if (e.hasEdit && tooBroad) return 'high';
  if (e.hasMcp && tooBroad) return 'high';
  if (e.hasRead && tooBroad) return 'medium';
  return null;
}

function makeFinding(args: {
  file: string;
  line: number;
  modeName: string;
  evaluation: ModeEval;
  severity: Severity;
  source: 'bob-mode' | 'claude-skill';
  snippet?: string;
}): Finding {
  const breadth = args.evaluation.hasCommand
    ? 'command/shell'
    : args.evaluation.hasMcp
      ? 'mcp'
      : args.evaluation.hasEdit
        ? 'edit/write'
        : 'read';
  return {
    ruleId: 'PS-004',
    detectorId: 'custom-mode-privilege-escalation',
    severity: args.severity,
    title: `${args.source === 'bob-mode' ? 'Custom mode' : 'Skill'} "${args.modeName}" grants ${breadth} permission with no narrow fileRegex`,
    description: `The ${args.source === 'bob-mode' ? 'Bob custom mode' : 'Claude skill'} "${args.modeName}" exposes ${breadth} capabilities to any prompt routed through it without a narrow fileRegex. Per arXiv 2601.17548 and Snyk ToxicSkills, this is the AI-agent equivalent of a Linux capability over-grant.`,
    location: { path: args.file, startLine: args.line, snippet: args.snippet },
    evidence: {
      primarySource: 'arXiv 2601.17548 + Snyk ToxicSkills 2026-02-05',
      references: REFS,
    },
    remediation: {
      summary: `Add a fileRegex restricting "${args.modeName}" to the smallest set of files it actually needs.`,
      autoFixAvailable: false,
    },
    fingerprint: hashFingerprint('PS-004', args.file, args.line, args.modeName),
  };
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
  const modes = doc?.custom_modes ?? doc?.customModes;
  if (!Array.isArray(modes)) return out;

  for (const m of modes) {
    if (!m || typeof m !== 'object') continue;
    const name = String(m.name ?? 'unnamed');
    const purpose = String(m.purpose ?? '').toLowerCase();
    if (purpose === 'red-team' || purpose === 'pentest') continue;

    const evalRes = evalGroups(m.groups ?? []);
    evalRes.fileRegex = typeof m.fileRegex === 'string' ? m.fileRegex : undefined;
    evalRes.hasWhenToUse = typeof m.whenToUse === 'string' && m.whenToUse.length > 0;
    evalRes.purpose = purpose;

    const sev = severityFor(evalRes);
    if (!sev) continue;
    const line = findLineForString(content, `name: ${name}`);
    out.push(makeFinding({
      file,
      line,
      modeName: name,
      evaluation: evalRes,
      severity: sev,
      source: 'bob-mode',
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
  const evalRes = evalGroups(tools);
  evalRes.fileRegex =
    typeof fm.data.fileRegex === 'string' ? fm.data.fileRegex :
    typeof fm.data.file_regex === 'string' ? fm.data.file_regex : undefined;
  evalRes.hasWhenToUse = typeof fm.data.whenToUse === 'string' && fm.data.whenToUse.length > 0;

  const sev = severityFor(evalRes);
  if (!sev) return out;
  const name = String(fm.data.name ?? file.split('/').slice(-2, -1)[0] ?? 'unnamed');
  out.push(makeFinding({
    file,
    line: 1,
    modeName: name,
    evaluation: evalRes,
    severity: sev,
    source: 'claude-skill',
    snippet: snippetAround(content, 1, 5),
  }));
  return out;
}

const detector: Detector = {
  id: 'PS-004',
  name: 'Custom-mode privilege escalation',
  description: 'Detects Bob custom modes and Claude skills granting broad permissions without a narrow fileRegex.',
  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    for (const f of ctx.discovery.bob.modeFiles) {
      findings.push(...(await scanBobModes(f)));
    }
    for (const f of [...ctx.discovery.bob.skillFiles, ...ctx.discovery.claude.skillFiles]) {
      findings.push(...(await scanClaudeSkill(f)));
    }
    return findings;
  },
};

export default detector;
