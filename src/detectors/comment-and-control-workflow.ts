import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
import { findLineForString, snippetAround } from '../utils/fs.js';
import { loadYaml } from '../utils/config-loader.js';
import { buildFinding } from '../utils/finding-builder.js';
import { EVIDENCE } from '../utils/evidence.js';

const DETECTOR_ID = 'comment-and-control-workflow';

const AI_BINARIES = ['claude', 'bob', 'gemini', 'cursor-cli', 'aider', 'codex'];
const UNTRUSTED_INTERPOLATIONS = [
  'github.event.pull_request.title',
  'github.event.pull_request.body',
  'github.event.pull_request.head.ref',
  'github.event.pull_request.head.label',
  'github.event.issue.body',
  'github.event.issue.title',
  'github.event.comment.body',
  'github.event.review.body',
  'github.event.discussion.body',
  'github.head_ref',
];

interface StepCheck {
  invokesAi: boolean;
  agentBinary?: string;
  hasUntrustedInterp: boolean;
  interpolatedField?: string;
  hasAllowGuard: boolean;
}

function stepText(step: any): string {
  const parts: string[] = [];
  if (typeof step?.run === 'string') parts.push(step.run);
  if (step?.with && typeof step.with === 'object') {
    for (const v of Object.values(step.with)) if (typeof v === 'string') parts.push(v);
  }
  if (typeof step?.uses === 'string') parts.push(step.uses);
  return parts.join('\n');
}

function checkStep(step: any): StepCheck {
  const text = stepText(step);
  const lower = text.toLowerCase();
  let agentBinary: string | undefined;
  for (const bin of AI_BINARIES) {
    const re = new RegExp(`(^|[\\s/$])${bin}([\\s$]|$|\\b)`, 'i');
    if (re.test(text) || lower.includes(`${bin}-action`) || lower.includes(`anthropic/${bin}`) ||
        lower.includes(`anthropics/claude-code`) || (bin === 'claude' && lower.includes('claude-code'))) {
      agentBinary = bin;
      break;
    }
  }
  let interpolatedField: string | undefined;
  for (const interp of UNTRUSTED_INTERPOLATIONS) {
    if (text.includes(interp)) { interpolatedField = interp; break; }
  }
  return {
    invokesAi: !!agentBinary,
    agentBinary,
    hasUntrustedInterp: !!interpolatedField,
    interpolatedField,
    hasAllowGuard: /--disallowed-tools|--allowed-tools|disallowed_tools|allowed_tools/i.test(text),
  };
}

function severityFromScore(score: number): Severity | null {
  if (score >= 4) return 'critical';
  if (score === 3) return 'high';
  if (score === 2) return 'medium';
  if (score === 1) return 'low';
  return null;
}

async function scanWorkflow(file: string): Promise<Finding[]> {
  const out: Finding[] = [];
  const { text, doc } = await loadYaml<any>(file);
  if (!doc) return out;

  // YAML's `on:` key sometimes parses as the boolean `true`.
  const onTrigger = doc.on ?? doc.true;
  let usesPRTarget = false;
  if (typeof onTrigger === 'string') usesPRTarget = onTrigger === 'pull_request_target';
  else if (Array.isArray(onTrigger)) usesPRTarget = onTrigger.includes('pull_request_target');
  else if (onTrigger && typeof onTrigger === 'object') usesPRTarget = 'pull_request_target' in onTrigger;

  const hasForkGuard = /github\.event\.pull_request\.head\.repo\.full_name\s*==\s*github\.repository/i.test(text);
  const jobs = doc.jobs;
  if (!jobs || typeof jobs !== 'object') return out;

  for (const [jobName, job] of Object.entries(jobs as Record<string, any>)) {
    if (!job || typeof job !== 'object' || !Array.isArray((job as any).steps)) continue;
    const steps = (job as any).steps;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step || typeof step !== 'object') continue;
      const check = checkStep(step);
      if (!check.invokesAi || !check.hasUntrustedInterp) continue;

      let score = 2; // a + b
      if (!check.hasAllowGuard) score++;
      if (usesPRTarget) score++;
      if (hasForkGuard) score--;

      const sev = severityFromScore(score);
      if (!sev) continue;
      const stepName = step.name ?? `step #${i + 1}`;
      const line = findLineForString(text, typeof step.name === 'string' ? step.name : (step.run?.split('\n')[0] ?? jobName));

      out.push(buildFinding({
        ruleId: 'PS-005',
        detectorId: DETECTOR_ID,
        severity: sev,
        title: `GitHub Actions step "${stepName}" passes untrusted PR/comment input to ${check.agentBinary ?? 'AI'} CLI`,
        description: `The workflow invokes the ${check.agentBinary ?? 'AI'} CLI with interpolation from "${check.interpolatedField}" - a Comment-and-Control prompt-injection vector (Aonan Guan + JHU, 2026-04-15).${usesPRTarget ? ' The workflow uses pull_request_target, which exposes secrets to forked PRs.' : ''}${!check.hasAllowGuard ? ' No --disallowed-tools / --allowed-tools guard is configured.' : ''}${hasForkGuard ? ' (Fork guard mitigates exposure - severity reduced.)' : ''}`,
        filePath: file, line, snippet: snippetAround(text, line),
        evidence: EVIDENCE.commentAndControl(),
        remediation: {
          summary: 'Pass untrusted PR text through a step env variable, run AI CLI with --disallowed-tools "Bash,Write,Edit", and prefer pull_request over pull_request_target where possible.',
          autoFixAvailable: true,
        },
        fingerprintParts: [jobName, i],
      }));
    }
  }
  return out;
}

const detector: Detector = {
  id: 'PS-005',
  name: 'Comment-and-Control workflow',
  description:
    'Detects GitHub Actions steps that pass untrusted PR/issue/comment input into AI CLI invocations.',

  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    for (const f of ctx.discovery.workflows) findings.push(...(await scanWorkflow(f)));
    return findings;
  },
};

export default detector;
