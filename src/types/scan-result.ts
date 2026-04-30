import type { Finding } from './finding.js';

export interface ScanResult {
  findings: Finding[];
  scannedFiles: string[];
  detectorsRun: string[];
  durationMs: number;
  toolVersion: string;
  signaturesVersion: string;
  exitCode: 0 | 1;
}
