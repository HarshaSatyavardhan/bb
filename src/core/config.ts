import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { DEFAULT_CONFIG, type PromptShieldConfig } from '../types/index.js';

export async function loadConfig(rootDir: string): Promise<PromptShieldConfig> {
  const candidates = [
    path.join(rootDir, '.promptshield.yaml'),
    path.join(rootDir, '.promptshield.yml'),
  ];
  for (const p of candidates) {
    try {
      const raw = await readFile(p, 'utf8');
      const parsed = parseYaml(raw) ?? {};
      return mergeConfig(parsed);
    } catch {
      continue;
    }
  }
  return DEFAULT_CONFIG;
}

function mergeConfig(user: any): PromptShieldConfig {
  return {
    ignore: Array.isArray(user.ignore) ? user.ignore : DEFAULT_CONFIG.ignore,
    severityOverrides: typeof user.severityOverrides === 'object' && user.severityOverrides
      ? user.severityOverrides
      : DEFAULT_CONFIG.severityOverrides,
    mcp: {
      trusted_servers: Array.isArray(user?.mcp?.trusted_servers)
        ? user.mcp.trusted_servers
        : DEFAULT_CONFIG.mcp.trusted_servers,
    },
    output: {
      sarifPath: user?.output?.sarifPath,
      htmlPath: user?.output?.htmlPath,
    },
  };
}
