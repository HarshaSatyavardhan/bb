import type { ScanResult } from '../../types/index.js';
import { buildSarif } from '../../utils/sarif-builder.js';

export function renderSarif(result: ScanResult, rootDir: string): string {
  const doc = buildSarif(result.findings, rootDir, result.toolVersion);
  return JSON.stringify(doc, null, 2);
}
