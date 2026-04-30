import chainedCommandBypass from './chained-command-bypass.js';
import toxicSkillScanner from './toxic-skill-scanner.js';
import mcpStdioRce from './mcp-stdio-rce.js';
import customModePrivEsc from './custom-mode-priv-esc.js';
import commentAndControl from './comment-and-control-workflow.js';
import type { Detector } from '../types/index.js';

export const ALL_DETECTORS: readonly Detector[] = [
  chainedCommandBypass,
  toxicSkillScanner,
  mcpStdioRce,
  customModePrivEsc,
  commentAndControl,
] as const;

export {
  chainedCommandBypass,
  toxicSkillScanner,
  mcpStdioRce,
  customModePrivEsc,
  commentAndControl,
};
