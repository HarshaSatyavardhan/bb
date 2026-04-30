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
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
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

export async function discover(opts: DiscoverOptions): Promise<DiscoveryResult> {
  const root = path.resolve(opts.rootDir);
  const home = os.homedir();

  const bobSettings: string[] = await globMany(root, [
    '.bob/settings.yaml',
    '.bob/settings.yml',
    '**/.bob/settings.yaml',
    '**/.bob/settings.yml',
  ]);
  const bobSkills: string[] = await globMany(root, [
    '.bob/skills/*/SKILL.md',
    '**/.bob/skills/*/SKILL.md',
  ]);
  const bobModes: string[] = await globMany(root, [
    '.bob/custom_modes.yaml',
    '.bob/custom_modes.yml',
    '**/.bob/custom_modes.yaml',
    '**/.bob/custom_modes.yml',
  ]);
  const bobMcp: string[] = await globMany(root, [
    '.bob/mcp.json',
    '.bob/mcp/*.json',
    '.bob/mcp/servers.json',
    '**/.bob/mcp.json',
    '**/.bob/mcp/*.json',
  ]);

  // Real Bob: behavioural guardrails live in .bob/rules-<slug>/*.md.
  // Treat these as skill-like content for PS-002 (toxic-skill scanning).
  const bobRules: string[] = await globMany(root, [
    '.bob/rules-*/*.md',
    '**/.bob/rules-*/*.md',
  ]);

  const claudeSettings: string[] = await globMany(root, [
    '.claude/settings.json',
    '.claude/settings.local.json',
    '**/.claude/settings.json',
    '**/.claude/settings.local.json',
  ]);
  const claudeSkills: string[] = await globMany(root, [
    '.claude/skills/*/SKILL.md',
    '**/.claude/skills/*/SKILL.md',
  ]);
  const claudeMcp: string[] = await globMany(root, [
    '.mcp.json',
    '.claude/mcp.json',
    '**/.claude/mcp.json',
  ]);

  const cursorSettings: string[] = await globMany(root, [
    '.cursor/settings.json',
    '**/.cursor/settings.json',
  ]);
  const cursorRules: string[] = await globMany(root, [
    '.cursorrules',
    '.cursor/rules/*.md',
    '**/.cursor/rules/*.md',
  ]);
  const cursorMcp: string[] = await globMany(root, [
    '.cursor/mcp.json',
    '**/.cursor/mcp.json',
  ]);

  const workflows: string[] = await globMany(root, [
    '.github/workflows/*.yml',
    '.github/workflows/*.yaml',
  ]);

  if (opts.includeHome) {
    const homeFiles = [
      [path.join(home, '.bob', 'settings.yaml'), bobSettings],
      [path.join(home, '.bob', 'custom_modes.yaml'), bobModes],
      [path.join(home, '.claude', 'settings.json'), claudeSettings],
      [path.join(home, '.claude', 'mcp.json'), claudeMcp],
      [path.join(home, '.cursor', 'mcp.json'), cursorMcp],
    ] as const;
    for (const [p, list] of homeFiles) {
      if (await fileExists(p)) list.push(p);
    }
  }

  // Concatenate rule files into the "skill" list so PS-002 scans them too;
  // they're prose-like agent instructions, same threat surface.
  const allSkillish = Array.from(new Set([...bobSkills, ...bobRules]));

  return {
    bob: {
      settingsFiles: bobSettings,
      skillFiles: allSkillish,
      modeFiles: bobModes,
      mcpFiles: bobMcp,
    },
    claude: {
      settingsFiles: claudeSettings,
      skillFiles: claudeSkills,
      mcpFiles: claudeMcp,
    },
    cursor: {
      settingsFiles: cursorSettings,
      rulesFiles: cursorRules,
      mcpFiles: cursorMcp,
    },
    workflows,
    rootDir: root,
  };
}

export function allDiscoveredFiles(d: DiscoveryResult): string[] {
  return [
    ...d.bob.settingsFiles,
    ...d.bob.skillFiles,
    ...d.bob.modeFiles,
    ...d.bob.mcpFiles,
    ...d.claude.settingsFiles,
    ...d.claude.skillFiles,
    ...d.claude.mcpFiles,
    ...d.cursor.settingsFiles,
    ...d.cursor.rulesFiles,
    ...d.cursor.mcpFiles,
    ...d.workflows,
  ];
}
