import type { Severity } from '../types/index.js';

export type SeverityCounts = Record<Severity, number>;

export function countBySeverity(items: Array<{ severity: Severity }>): SeverityCounts {
  const counts: SeverityCounts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const item of items) counts[item.severity] += 1;
  return counts;
}
