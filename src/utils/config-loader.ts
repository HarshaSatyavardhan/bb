import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { parse as parseJsonc } from 'jsonc-parser';

export interface LoadedFile<T> {
  text: string;
  doc: T | null;
}

async function safeRead(file: string): Promise<string | null> {
  try {
    return await readFile(file, 'utf8');
  } catch {
    return null;
  }
}

export async function loadYaml<T = unknown>(file: string): Promise<LoadedFile<T>> {
  const text = await safeRead(file);
  if (text === null) return { text: '', doc: null };
  try {
    return { text, doc: parseYaml(text) as T };
  } catch {
    return { text, doc: null };
  }
}

export async function loadJsonc<T = unknown>(file: string): Promise<LoadedFile<T>> {
  const text = await safeRead(file);
  if (text === null) return { text: '', doc: null };
  try {
    return { text, doc: parseJsonc(text) as T };
  } catch {
    return { text, doc: null };
  }
}
