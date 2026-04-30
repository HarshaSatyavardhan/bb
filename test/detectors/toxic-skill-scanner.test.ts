import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import detector from '../../src/detectors/toxic-skill-scanner.js';
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

describe('PS-002 toxic-skill-scanner', () => {
  it('flags multiple Snyk patterns in a malicious Bob skill', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'bob-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThan(0);
    // Should match curl|sh (critical), "ignore previous instructions" (high),
    // "you are now" (high), hidden HTML comment (high).
    const sigs = findings.map((f) => f.title).join('\n');
    expect(sigs).toMatch(/PS-002-S003/); // curl|sh => critical
    expect(sigs).toMatch(/PS-002-S001/); // ignore previous instructions
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('does not flag a clean repo', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'clean'));
    const findings = await detector.scan(ctx);
    expect(findings).toEqual([]);
  });
});
