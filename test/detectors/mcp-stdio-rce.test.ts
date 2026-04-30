import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import detector from '../../src/detectors/mcp-stdio-rce.js';
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

describe('PS-003 mcp-stdio-rce', () => {
  it('flags shell -c, interpolated command, and unknown server', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'bob-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(3);
    const titles = findings.map((f) => f.title).join('\n');
    expect(titles).toMatch(/shell with -c/);
    expect(titles).toMatch(/interpolation/);
    expect(titles).toMatch(/trusted-server allowlist/);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('flags Claude .mcp.json bash -c', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'claude-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('does not flag a clean repo', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'clean'));
    const findings = await detector.scan(ctx);
    expect(findings).toEqual([]);
  });
});
