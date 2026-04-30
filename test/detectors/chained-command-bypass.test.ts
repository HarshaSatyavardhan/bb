import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import detector from '../../src/detectors/chained-command-bypass.js';
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

describe('PS-001 chained-command-bypass', () => {
  it('flags Bob auto_approve with bare echo/cat/printf', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'bob-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(3);
    const cmds = findings.map((f) => f.title);
    expect(cmds.some((t) => t.includes('"echo"'))).toBe(true);
    expect(cmds.some((t) => t.includes('"cat"'))).toBe(true);
    expect(cmds.some((t) => t.includes('"printf"'))).toBe(true);
    expect(findings.every((f) => f.severity === 'critical')).toBe(true);
  });

  it('flags Claude permissions.allow with bare commands', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'claude-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(2);
    expect(findings.every((f) => f.location.path.endsWith('settings.json'))).toBe(true);
  });

  it('flags Cursor autoRun.allow with bare commands', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'cursor-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(3);
  });

  it('does not flag clean fixture (disable_redirection: true)', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'clean'));
    const findings = await detector.scan(ctx);
    expect(findings).toEqual([]);
  });
});
