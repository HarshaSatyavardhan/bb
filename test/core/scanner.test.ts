import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runScan } from '../../src/core/scanner.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, '../../test-fixtures');

describe('scanner end-to-end', () => {
  it('reports findings from all 5 detectors against bob-vulnerable', async () => {
    const result = await runScan({ rootDir: path.join(FIXTURES, 'bob-vulnerable') });
    const ruleIds = new Set(result.findings.map((f) => f.ruleId));
    expect(ruleIds.has('PS-001')).toBe(true);
    expect(ruleIds.has('PS-002')).toBe(true);
    expect(ruleIds.has('PS-003')).toBe(true);
    expect(ruleIds.has('PS-004')).toBe(true);
    expect(ruleIds.has('PS-005')).toBe(true);
    expect(result.exitCode).toBe(1);
    expect(result.detectorsRun).toHaveLength(5);
  });

  it('reports zero findings on clean fixture', async () => {
    const result = await runScan({ rootDir: path.join(FIXTURES, 'clean') });
    expect(result.findings).toEqual([]);
    expect(result.exitCode).toBe(0);
  });

  it('respects detector filter', async () => {
    const result = await runScan({
      rootDir: path.join(FIXTURES, 'bob-vulnerable'),
      detectorFilter: ['PS-001'],
    });
    const ruleIds = new Set(result.findings.map((f) => f.ruleId));
    expect(ruleIds).toEqual(new Set(['PS-001']));
    expect(result.detectorsRun).toEqual(['PS-001']);
  });

  it('every finding has a unique fingerprint', async () => {
    const result = await runScan({ rootDir: path.join(FIXTURES, 'bob-vulnerable') });
    const fps = new Set(result.findings.map((f) => f.fingerprint));
    expect(fps.size).toBe(result.findings.length);
  });
});
