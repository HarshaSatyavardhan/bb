import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import detector from '../../src/detectors/custom-mode-priv-esc.js';
import { discover } from '../../src/core/discoverer.js';
import { loadSignatures } from '../../src/signatures/loader.js';
import { DEFAULT_CONFIG } from '../../src/types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, '../../test-fixtures');

async function makeCtx(rootDir: string) {
  const discovery = await discover({ rootDir });
  const signatures = await loadSignatures();
  return { discovery, config: DEFAULT_CONFIG, signatures };
}

describe('PS-004 custom-mode-priv-esc', () => {
  it('flags command-group mode without fileRegex (critical) and edit + .* (high)', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'bob-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(2);
    const sevs = findings.map((f) => f.severity);
    expect(sevs).toContain('critical');
    expect(sevs).toContain('high');
  });

  it('does not flag clean repo (read-only with narrow regex)', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'clean'));
    const findings = await detector.scan(ctx);
    expect(findings).toEqual([]);
  });

  it('skips red-team mode in PromptShield self-fixtures', async () => {
    // Use the project root - our own repo's modes/custom_modes.yaml has a red-team
    // entry which should not flag.
    const ctx = await makeCtx(path.resolve(__dirname, '../..'));
    const findings = await detector.scan(ctx);
    // Should not flag the RedTeam mode (purpose: red-team)
    const redTeam = findings.find((f) => f.title.includes('RedTeam'));
    expect(redTeam).toBeUndefined();
  });
});
