import { describe, it, expect } from 'vitest';
import { aggregate, shouldFail } from '../../src/core/aggregator.js';
import type { Finding, PromptShieldConfig } from '../../src/types/index.js';

function fake(ruleId: string, severity: any, fp: string, p = '/x'): Finding {
  return {
    ruleId,
    detectorId: ruleId.toLowerCase(),
    severity,
    title: `t-${fp}`,
    description: '',
    location: { path: p, startLine: 1 },
    evidence: { primarySource: 's', references: [] },
    remediation: { summary: '', autoFixAvailable: false },
    fingerprint: fp,
  };
}

const baseCfg: PromptShieldConfig = {
  ignore: [],
  severityOverrides: {},
  mcp: { trusted_servers: [] },
  output: {},
};

describe('aggregator', () => {
  it('dedups by fingerprint', () => {
    const r = aggregate([fake('PS-001', 'high', 'f1'), fake('PS-001', 'high', 'f1')], baseCfg, '/');
    expect(r.findings).toHaveLength(1);
  });

  it('respects ignore by ruleId', () => {
    const cfg = { ...baseCfg, ignore: [{ ruleId: 'PS-001', reason: 'test' }] };
    const r = aggregate([fake('PS-001', 'high', 'a'), fake('PS-002', 'high', 'b')], cfg, '/');
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0].ruleId).toBe('PS-002');
  });

  it('applies severity overrides', () => {
    const cfg = { ...baseCfg, severityOverrides: { 'PS-001': 'low' as const } };
    const r = aggregate([fake('PS-001', 'critical', 'a')], cfg, '/');
    expect(r.findings[0].severity).toBe('low');
  });

  it('shouldFail returns false on no high+ findings', () => {
    expect(shouldFail({ critical: 0, high: 0, medium: 5, low: 0, info: 0 })).toBe(false);
    expect(shouldFail({ critical: 0, high: 1, medium: 0, low: 0, info: 0 })).toBe(true);
  });

  it('sorts critical above high', () => {
    const r = aggregate(
      [fake('PS-001', 'high', 'a'), fake('PS-002', 'critical', 'b')],
      baseCfg,
      '/',
    );
    expect(r.findings[0].severity).toBe('critical');
  });
});
