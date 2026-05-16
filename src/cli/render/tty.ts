import path from 'node:path';
import type { ScanResult, Severity } from '../../types/index.js';
import { countBySeverity } from '../../utils/severity-counts.js';

const isTTY = process.stdout.isTTY === true;

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
};

function c(color: keyof typeof COLORS, s: string): string {
  if (!isTTY) return s;
  return `${COLORS[color]}${s}${COLORS.reset}`;
}

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'CRITICAL',
  high: 'HIGH    ',
  medium: 'MEDIUM  ',
  low: 'LOW     ',
  info: 'INFO    ',
};

function colorBySev(sev: Severity, s: string): string {
  switch (sev) {
    case 'critical': return c('brightRed', s);
    case 'high': return c('red', s);
    case 'medium': return c('yellow', s);
    case 'low': return c('cyan', s);
    case 'info': return c('gray', s);
  }
}

function iconBySev(sev: Severity): string {
  switch (sev) {
    case 'critical':
    case 'high':
      return colorBySev(sev, '✗');
    case 'medium':
      return colorBySev(sev, '⚠');
    case 'low':
    case 'info':
      return colorBySev(sev, 'ℹ');
  }
}

export function renderTty(result: ScanResult, rootDir: string): string {
  const out: string[] = [];
  out.push('');
  out.push(
    `${c('bold', 'PromptShield')} ${c('gray', `v${result.toolVersion}`)}   ⏱  scanned ${result.scannedFiles.length} files in ${result.durationMs}ms`,
  );
  out.push(c('gray', `signatures: ${result.signaturesVersion}  detectors: ${result.detectorsRun.join(', ')}`));
  if (result.detectorErrors.length > 0) {
    out.push(c('yellow', `warnings: ${result.detectorErrors.length} detector(s) failed during scan`));
  }
  out.push('');

  if (result.findings.length === 0) {
    out.push(c('green', '  ✓ No findings. AI tooling configuration looks clean.'));
    out.push('');
    return out.join('\n');
  }

  for (const f of result.findings) {
    const rel = path.relative(rootDir, f.location.path) || f.location.path;
    out.push(
      `  ${iconBySev(f.severity)} ${colorBySev(f.severity, SEVERITY_LABEL[f.severity])}  ${c('bold', f.ruleId)}  ${c('cyan', `${rel}:${f.location.startLine}`)}`,
    );
    out.push(`              ${f.title}`);
    out.push(c('gray', `              → ${f.evidence.primarySource}`));
    if (f.remediation.autoFixAvailable) {
      out.push(c('gray', `              ↳ run \`npx promptshield fix\` to remediate`));
    }
    out.push('');
  }

  // Summary
  const counts = countBySeverity(result.findings);
  const summary = `${result.detectorsRun.length} detectors run.  ${result.findings.length} findings  (${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low)`;
  out.push(summary);
  if (result.detectorErrors.length > 0) {
    out.push(c('yellow', 'Detector errors:'));
    for (const detectorError of result.detectorErrors) {
      out.push(c('yellow', `  - ${detectorError.detectorId}: ${detectorError.message}`));
    }
  }
  out.push(`Exit ${result.exitCode}.  See https://promptshield.dev for details.`);
  out.push('');
  return out.join('\n');
}
