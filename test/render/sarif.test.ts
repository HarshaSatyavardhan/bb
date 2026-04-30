import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runScan } from '../../src/core/scanner.js';
import { renderSarif } from '../../src/cli/render/sarif.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, '../../test-fixtures');

describe('SARIF renderer', () => {
  it('emits valid SARIF 2.1.0 structure', async () => {
    const root = path.join(FIXTURES, 'bob-vulnerable');
    const result = await runScan({ rootDir: root });
    const sarif = JSON.parse(renderSarif(result, root));
    expect(sarif.version).toBe('2.1.0');
    expect(sarif.runs).toHaveLength(1);
    expect(sarif.runs[0].tool.driver.name).toBe('PromptShield');
    expect(sarif.runs[0].tool.driver.rules.length).toBeGreaterThan(0);
    expect(sarif.runs[0].results.length).toBe(result.findings.length);
    for (const r of sarif.runs[0].results) {
      expect(r.ruleId).toBeDefined();
      expect(r.locations[0].physicalLocation.artifactLocation.uri).toBeDefined();
      expect(r.locations[0].physicalLocation.region.startLine).toBeGreaterThan(0);
      expect(r.fingerprints['promptshield/v1']).toBeDefined();
      // Paths should be forward-slash
      expect(r.locations[0].physicalLocation.artifactLocation.uri).not.toMatch(/\\/);
    }
  });
});
