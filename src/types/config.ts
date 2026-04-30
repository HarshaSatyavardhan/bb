import type { Severity } from './finding.js';

export interface IgnoreRule {
  ruleId?: string;
  path?: string;
  reason: string;
}

export interface PromptShieldConfig {
  ignore: IgnoreRule[];
  severityOverrides: Record<string, Severity>;
  mcp: { trusted_servers: string[] };
  output: { sarifPath?: string; htmlPath?: string };
}

export const DEFAULT_CONFIG: PromptShieldConfig = {
  ignore: [],
  severityOverrides: {},
  mcp: {
    trusted_servers: [
      '@modelcontextprotocol/',
      '@anthropic-ai/',
      '@ibm/',
    ],
  },
  output: {},
};
