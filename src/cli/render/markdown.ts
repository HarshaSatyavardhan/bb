import path from 'node:path';
import type { ScanResult, Severity } from '../../types/index.js';
import { countBySeverity } from '../../utils/severity-counts.js';

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

function titleCaseSeverity(severity: Severity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function inline(text: string): string {
  return text.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

function relPath(absPath: string, rootDir: string): string {
  return path.relative(rootDir, absPath) || absPath;
}

export function renderMarkdown(result: ScanResult, rootDir: string): string {
  const lines: string[] = [];
  const counts = countBySeverity(result.findings);

  lines.push('# PromptShield Scan Report');
  lines.push('');
  lines.push(`- **Scanned root:** \`${rootDir}\``);
  lines.push(`- **Files scanned:** ${result.scannedFiles.length}`);
  lines.push(`- **Total findings:** ${result.findings.length}`);
  lines.push(`- **Scan duration:** ${result.durationMs} ms`);
  lines.push(`- **Tool version:** ${result.toolVersion}`);
  lines.push(`- **Signatures version:** ${result.signaturesVersion}`);
  lines.push(`- **Detectors run:** ${result.detectorsRun.join(', ')}`);
  lines.push('');

  lines.push('## Severity Summary');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('| --- | ---: |');
  for (const severity of SEVERITY_ORDER) {
    lines.push(`| ${titleCaseSeverity(severity)} | ${counts[severity]} |`);
  }
  lines.push('');

  if (result.findings.length === 0) {
    lines.push('## Findings');
    lines.push('');
    lines.push('No findings detected.');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('## Findings by Severity');
  lines.push('');

  for (const severity of SEVERITY_ORDER) {
    const findingsForSeverity = result.findings.filter((finding) => finding.severity === severity);
    if (findingsForSeverity.length === 0) continue;

    lines.push(`### ${titleCaseSeverity(severity)} (${findingsForSeverity.length})`);
    lines.push('');

    for (const finding of findingsForSeverity) {
      const loc = `${relPath(finding.location.path, rootDir)}:${finding.location.startLine}`;
      lines.push(`#### ${finding.ruleId}: ${inline(finding.title)}`);
      lines.push('');
      lines.push(`- **Detector ID:** \`${finding.detectorId}\``);
      lines.push(`- **Location:** \`${loc}\``);
      lines.push(`- **Description:** ${inline(finding.description)}`);
      lines.push(`- **Evidence source:** ${inline(finding.evidence.primarySource)}`);
      lines.push(`- **Remediation:** ${inline(finding.remediation.summary)}`);
      lines.push(`- **Auto-fix available:** ${finding.remediation.autoFixAvailable ? 'Yes' : 'No'}`);
      if (finding.evidence.references.length > 0) {
        lines.push('- **References:**');
        for (const reference of finding.evidence.references) {
          lines.push(`  - ${inline(reference)}`);
        }
      }
      lines.push('');
    }
  }

  if (result.detectorErrors.length > 0) {
    lines.push('## Detector Errors');
    lines.push('');
    for (const detectorError of result.detectorErrors) {
      lines.push(`- \`${detectorError.detectorId}\`: ${inline(detectorError.message)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
