import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, mkdir, writeFile, readFile, cp } from 'node:fs/promises';
import os from 'node:os';
import { runScan } from '../../src/core/scanner.js';
import { planFixes, applyFixes } from '../../src/core/fixer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, '../../test-fixtures');

describe('fixer', () => {
  it('plans PS-001 fixes for bob-vulnerable', async () => {
    const result = await runScan({ rootDir: path.join(FIXTURES, 'bob-vulnerable') });
    const plan = await planFixes(result.findings, path.join(FIXTURES, 'bob-vulnerable'));
    expect(plan.operations.length).toBeGreaterThan(0);
    expect(plan.patch).toContain('--- a/');
    expect(plan.operations.some((op) => op.ruleId === 'PS-001')).toBe(true);
  });

  it('applyFixes mutates the alwaysAllow JSON array (in a tmp copy)', async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), 'ps-fix-'));
    await mkdir(path.join(tmp, '.bob'), { recursive: true });
    const dst = path.join(tmp, '.bob', 'mcp.json');
    await cp(path.join(FIXTURES, 'bob-vulnerable', '.bob', 'mcp.json'), dst);

    const result = await runScan({ rootDir: tmp, detectorFilter: ['PS-001'] });
    expect(result.findings.length).toBeGreaterThan(0);
    const plan = await planFixes(result.findings, tmp);
    await applyFixes(plan.operations);

    const after = await readFile(dst, 'utf8');
    expect(after).toContain('REMOVED by PromptShield (PS-001)');

    // Re-scan: PS-001 alwaysAllow findings should drop.
    const after2 = await runScan({ rootDir: tmp, detectorFilter: ['PS-001'] });
    expect(after2.findings.length).toBeLessThan(result.findings.length);
  });
});
