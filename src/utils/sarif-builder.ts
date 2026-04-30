import type { Finding, Severity } from '../types/index.js';
import path from 'node:path';

interface SarifResult {
  ruleId: string;
  level: 'error' | 'warning' | 'note';
  message: { text: string };
  locations: Array<{
    physicalLocation: {
      artifactLocation: { uri: string };
      region: { startLine: number; startColumn?: number };
    };
  }>;
  fingerprints: Record<string, string>;
}

interface SarifRule {
  id: string;
  name: string;
  shortDescription: { text: string };
  fullDescription?: { text: string };
  helpUri?: string;
  defaultConfiguration: { level: 'error' | 'warning' | 'note' };
}

const SEV_TO_LEVEL: Record<Severity, 'error' | 'warning' | 'note'> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'note',
  info: 'note',
};

export function buildSarif(findings: Finding[], rootDir: string, version: string): object {
  const ruleMap = new Map<string, SarifRule>();
  for (const f of findings) {
    if (!ruleMap.has(f.ruleId)) {
      ruleMap.set(f.ruleId, {
        id: f.ruleId,
        name: f.detectorId,
        shortDescription: { text: f.title },
        fullDescription: { text: f.description },
        helpUri: `https://promptshield.dev/${f.ruleId}`,
        defaultConfiguration: { level: SEV_TO_LEVEL[f.severity] },
      });
    }
  }

  const results: SarifResult[] = findings.map((f) => {
    let uri = f.location.path;
    try {
      uri = path.relative(rootDir, f.location.path) || f.location.path;
    } catch {
      // keep uri as-is
    }
    // SARIF wants forward slashes
    uri = uri.split(path.sep).join('/');
    return {
      ruleId: f.ruleId,
      level: SEV_TO_LEVEL[f.severity],
      message: { text: f.title },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri },
            region: { startLine: Math.max(1, f.location.startLine) },
          },
        },
      ],
      fingerprints: { 'promptshield/v1': f.fingerprint },
    };
  });

  return {
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'PromptShield',
            version,
            informationUri: 'https://promptshield.dev',
            rules: Array.from(ruleMap.values()),
          },
        },
        results,
      },
    ],
  };
}
