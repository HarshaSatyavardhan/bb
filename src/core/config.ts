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

function mergeConfig(user: unknown): PromptShieldConfig {
  const userObj = typeof user === 'object' && user !== null ? (user as Record<string, unknown>) : {};
  const severityOverrides =
    typeof userObj.severityOverrides === 'object' && userObj.severityOverrides !== null
      ? (userObj.severityOverrides as Record<string, PromptShieldConfig['severityOverrides'][string]>)
      : DEFAULT_CONFIG.severityOverrides;
  const mcpObj =
    typeof userObj.mcp === 'object' && userObj.mcp !== null
      ? (userObj.mcp as Record<string, unknown>)
      : {};
  const outputObj =
    typeof userObj.output === 'object' && userObj.output !== null
      ? (userObj.output as Record<string, unknown>)
      : {};

  return {
    ignore: Array.isArray(userObj.ignore) ? userObj.ignore as PromptShieldConfig['ignore'] : DEFAULT_CONFIG.ignore,
    severityOverrides,
    mcp: {
      trusted_servers: Array.isArray(mcpObj.trusted_servers)
        ? mcpObj.trusted_servers as string[]
        : DEFAULT_CONFIG.mcp.trusted_servers,
    },
    output: {
      sarifPath: typeof outputObj.sarifPath === 'string' ? outputObj.sarifPath : undefined,
      htmlPath: typeof outputObj.htmlPath === 'string' ? outputObj.htmlPath : undefined,
    },
  };
}
