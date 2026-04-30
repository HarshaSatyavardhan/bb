import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import detector from '../../src/detectors/comment-and-control-workflow.js';
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

describe('PS-005 comment-and-control-workflow', () => {
  it('flags claude invocation with PR body interpolation under pull_request_target', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'bob-vulnerable'));
    const findings = await detector.scan(ctx);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].severity).toBe('critical');
    expect(findings[0].title).toMatch(/claude|AI/);
  });

  it('does not flag clean repo (no workflows)', async () => {
    const ctx = await makeCtx(path.join(FIXTURES, 'clean'));
    const findings = await detector.scan(ctx);
    expect(findings).toEqual([]);
  });
});
