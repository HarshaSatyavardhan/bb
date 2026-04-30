import type { Finding } from './finding.js';
import type { PromptShieldConfig } from './config.js';
import type { SignatureDB } from './signatures.js';

export interface DiscoveryResult {
  bob: {
    settingsFiles: string[];
    skillFiles: string[];
    modeFiles: string[];
    mcpFiles: string[];
  };
  claude: {
    settingsFiles: string[];
    skillFiles: string[];
    mcpFiles: string[];
  };
  cursor: {
    settingsFiles: string[];
    rulesFiles: string[];
    mcpFiles: string[];
  };
  workflows: string[];
  rootDir: string;
}

export interface DetectorContext {
  discovery: DiscoveryResult;
  config: PromptShieldConfig;
  signatures: SignatureDB;
  abortSignal?: AbortSignal;
}

export interface Detector {
  id: string;
  name: string;
  description: string;
  scan(ctx: DetectorContext): Promise<Finding[]>;
}
