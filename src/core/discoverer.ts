import fg from 'fast-glob';
import path from 'node:path';
import os from 'node:os';
import { stat } from 'node:fs/promises';
import type { DiscoveryResult } from '../types/index.js';

export interface DiscoverOptions {
  rootDir: string;
  includeHome?: boolean;
}

async function fileExists(p: string): Promise<boolean> {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

async function globMany(rootDir: string, patterns: string[]): Promise<string[]> {
  const matches = await fg(patterns, {
    cwd: rootDir,
    absolute: true,
    dot: true,
    suppressErrors: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/coverage/**'],
  });
  return Array.from(new Set(matches));
}

/** Each tuple = [<localPattern>, <recursivePattern>]. The recursive pattern
 *  picks up monorepo workspaces; the local one matches the project root. */
function localAndDeep(...localPatterns: string[]): string[] {
  return [...localPatterns, ...localPatterns.map((p) => `**/${p}`)];
}

export async function discover(opts: DiscoverOptions): Promise<DiscoveryResult> {
  const root = path.resolve(opts.rootDir);
  const home = os.homedir();

  // Real Bob (verified vs github.com/IBM/bob-demo).
  // No `.bob/settings.yaml`; behaviour comes from custom_modes.yaml + rules-<slug>/.
  const bobSkills = await globMany(root, localAndDeep('.bob/skills/*/SKILL.md'));
  const bobRules = await globMany(root, localAndDeep('.bob/rules-*/*.md'));
  const bobModes = await globMany(root, localAndDeep(
    '.bob/custom_modes.yaml', '.bob/custom_modes.yml',
  ));
  const bobMcp = await globMany(root, localAndDeep(
    '.bob/mcp.json',
    // legacy/fictional layout retained so misnamed configs still get scanned.
    '.bob/mcp/*.json',
  ));

  const claudeSettings = await globMany(root, localAndDeep(
    '.claude/settings.json', '.claude/settings.local.json',
  ));
  const claudeSkills = await globMany(root, localAndDeep('.claude/skills/*/SKILL.md'));
  const claudeMcp = await globMany(root, ['.mcp.json', '.claude/mcp.json', '**/.claude/mcp.json']);

  const cursorSettings = await globMany(root, localAndDeep('.cursor/settings.json'));
  const cursorRules = await globMany(root, ['.cursorrules', ...localAndDeep('.cursor/rules/*.md')]);
  const cursorMcp = await globMany(root, localAndDeep('.cursor/mcp.json'));

  const workflows = await globMany(root, [
    '.github/workflows/*.yml',
    '.github/workflows/*.yaml',
  ]);

  if (opts.includeHome) {
    const candidates: Array<[string, string[]]> = [
      [path.join(home, '.bob', 'custom_modes.yaml'), bobModes],
      [path.join(home, '.bob', 'mcp.json'), bobMcp],
      [path.join(home, '.claude', 'settings.json'), claudeSettings],
      [path.join(home, '.claude', 'mcp.json'), claudeMcp],
      [path.join(home, '.cursor', 'mcp.json'), cursorMcp],
    ];
    for (const [p, list] of candidates) {
      if (await fileExists(p)) list.push(p);
    }
  }

  // PS-002 should treat skill content AND rule content as the same threat
  // surface (free-text agent instructions).
  const skillish = Array.from(new Set([...bobSkills, ...bobRules]));

  return {
    bob: { settingsFiles: [], skillFiles: skillish, modeFiles: bobModes, mcpFiles: bobMcp },
    claude: { settingsFiles: claudeSettings, skillFiles: claudeSkills, mcpFiles: claudeMcp },
    cursor: { settingsFiles: cursorSettings, rulesFiles: cursorRules, mcpFiles: cursorMcp },
    workflows,
    rootDir: root,
  };
}

export function allDiscoveredFiles(d: DiscoveryResult): string[] {
  return [
    ...d.bob.skillFiles, ...d.bob.modeFiles, ...d.bob.mcpFiles,
    ...d.claude.settingsFiles, ...d.claude.skillFiles, ...d.claude.mcpFiles,
    ...d.cursor.settingsFiles, ...d.cursor.rulesFiles, ...d.cursor.mcpFiles,
    ...d.workflows,
  ];
}
