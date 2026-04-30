import type { Detector, Finding, PromptShieldConfig, ScanResult, SignatureDB } from '../types/index.js';
import { ALL_DETECTORS } from '../detectors/index.js';
import { discover, allDiscoveredFiles } from './discoverer.js';
import { loadSignatures } from '../signatures/loader.js';
import { aggregate, shouldFail } from './aggregator.js';
import { loadConfig } from './config.js';

export interface ScanOptions {
  rootDir: string;
  detectorFilter?: string[];
  config?: PromptShieldConfig;
  signatures?: SignatureDB;
  includeHome?: boolean;
  toolVersion?: string;
}

export async function runScan(opts: ScanOptions): Promise<ScanResult> {
  const start = Date.now();
  const config = opts.config ?? (await loadConfig(opts.rootDir));
  const signatures = opts.signatures ?? (await loadSignatures());
  const discovery = await discover({ rootDir: opts.rootDir, includeHome: opts.includeHome });

  const detectors = ALL_DETECTORS.filter((d) =>
    !opts.detectorFilter || opts.detectorFilter.includes(d.id),
  );

  const allFindings: Finding[] = [];
  for (const detector of detectors) {
    try {
      const findings = await detector.scan({ discovery, config, signatures });
      allFindings.push(...findings);
    } catch (err) {
      // Continue on detector errors; record nothing for now.
      // eslint-disable-next-line no-console
      console.error(`[promptshield] detector ${detector.id} threw: ${(err as Error).message}`);
    }
  }

  const aggregated = aggregate(allFindings, config, opts.rootDir);
  const exitCode: 0 | 1 = shouldFail(aggregated.countsBySeverity, 'high') ? 1 : 0;

  return {
    findings: aggregated.findings,
    scannedFiles: allDiscoveredFiles(discovery),
    detectorsRun: detectors.map((d) => d.id),
    durationMs: Date.now() - start,
    toolVersion: opts.toolVersion ?? '1.0.0',
    signaturesVersion: signatures.version,
    exitCode,
  };
}
