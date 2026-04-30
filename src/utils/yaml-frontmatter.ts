import { parse as parseYaml } from 'yaml';

export interface FrontmatterParsed<T = Record<string, unknown>> {
  data: T | null;
  body: string;
  startLine: number;
  endLine: number;
}

const FM_RE = /^---\s*\n([\s\S]*?)\n---\s*(\n|$)/;

export function parseFrontmatter<T = Record<string, unknown>>(content: string): FrontmatterParsed<T> {
  const m = content.match(FM_RE);
  if (!m) {
    return { data: null, body: content, startLine: 0, endLine: 0 };
  }
  const fmText = m[1];
  let data: T | null = null;
  try {
    data = parseYaml(fmText) as T;
  } catch {
    data = null;
  }
  const body = content.slice(m[0].length);
  // Lines: opening --- is line 1; closing --- is at 1 + lineCount(fmText) + 1
  const fmLines = fmText.split(/\r?\n/).length;
  return {
    data,
    body,
    startLine: 1,
    endLine: 1 + fmLines + 1,
  };
}
