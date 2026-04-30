import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discover, allDiscoveredFiles } from '../../src/core/discoverer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, '../../test-fixtures');

describe('discoverer', () => {
  it('finds all expected files in bob-vulnerable', async () => {
    const d = await discover({ rootDir: path.join(FIXTURES, 'bob-vulnerable') });
    // Real Bob has no settings.yaml; settingsFiles intentionally stays empty.
    expect(d.bob.settingsFiles).toEqual([]);
    expect(d.bob.skillFiles.length).toBeGreaterThan(0);
    expect(d.bob.modeFiles.length).toBeGreaterThan(0);
    expect(d.bob.mcpFiles.length).toBeGreaterThan(0);
    expect(d.workflows.length).toBeGreaterThan(0);
    expect(allDiscoveredFiles(d).length).toBeGreaterThanOrEqual(4);
  });

  it('returns empty results for empty dir', async () => {
    const d = await discover({ rootDir: path.resolve(__dirname, '..') });
    // test/ dir has no AI configs
    expect(d.bob.skillFiles.length).toBe(0);
  });
});
