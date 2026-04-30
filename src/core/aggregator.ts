import path from 'node:path';
import type { Finding, PromptShieldConfig, Severity } from '../types/index.js';

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

function matchesIgnore(finding: Finding, rootDir: string, ignore: PromptShieldConfig['ignore']): boolean {
  for (const rule of ignore) {
    const ruleMatches = !rule.ruleId || rule.ruleId === finding.ruleId;
    let pathMatches = !rule.path;
    if (rule.path) {
      try {
        const rel = path.relative(rootDir, finding.location.path);
        const re = new RegExp(rule.path);
        pathMatches = re.test(rel) || re.test(finding.location.path);
      } catch {
        pathMatches = finding.location.path.includes(rule.path);
      }
    }
    if (ruleMatches && pathMatches) return true;
  }
  return false;
}

export interface AggregateResult {
  findings: Finding[];
  countsBySeverity: Record<Severity, number>;
}

export function aggregate(
  raw: Finding[],
  config: PromptShieldConfig,
  rootDir: string,
): AggregateResult {
  // Dedup by fingerprint
  const seen = new Set<string>();
  const unique: Finding[] = [];
  for (const f of raw) {
    if (seen.has(f.fingerprint)) continue;
    seen.add(f.fingerprint);

    // Severity overrides
    const override = config.severityOverrides?.[f.ruleId];
    const finding: Finding = override ? { ...f, severity: override } : f;

    // Ignores
    if (matchesIgnore(finding, rootDir, config.ignore)) continue;
    unique.push(finding);
  }

  // Sort: severity desc, then path
  unique.sort((a, b) => {
    const dr = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (dr !== 0) return dr;
    return a.location.path.localeCompare(b.location.path);
  });

  const counts: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const f of unique) counts[f.severity]++;

  return { findings: unique, countsBySeverity: counts };
}

export function shouldFail(counts: Record<Severity, number>, severityFloor: Severity = 'high'): boolean {
  const floor = SEVERITY_RANK[severityFloor];
  return Object.entries(counts).some(([sev, c]) => c > 0 && SEVERITY_RANK[sev as Severity] >= floor);
}
