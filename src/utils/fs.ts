import { createHash } from 'node:crypto';

export function hashFingerprint(...parts: (string | number)[]): string {
  const h = createHash('sha256');
  for (const p of parts) h.update(String(p));
  h.update('|');
  return h.digest('hex').slice(0, 32);
}

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Find the line number (1-indexed) of the i-th list item under `key:` in a YAML document.
 * Best-effort: scans textually. Returns 1 on failure.
 */
export function findLineForListItem(content: string, key: string, index: number): number {
  const lines = content.split(/\r?\n/);
  let inKey = false;
  let count = 0;
  let keyIndent = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inKey) {
      const m = line.match(new RegExp(`^(\\s*)${key}\\s*:\\s*(\\[.*\\])?\\s*$`));
      if (m) {
        // Inline list?
        if (m[2]) {
          // [a, b, c] form - return same line
          return i + 1;
        }
        inKey = true;
        keyIndent = m[1].length;
        continue;
      }
    } else {
      // Look for list items at deeper indentation
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;
      const indent = line.length - line.trimStart().length;
      if (indent <= keyIndent) {
        // Out of section
        break;
      }
      if (trimmed.startsWith('- ') || trimmed === '-') {
        if (count === index) return i + 1;
        count++;
      }
    }
  }
  return 1;
}

/**
 * Find the line number of a specific top-level key within a JSON document text.
 */
export function findLineForJsonKey(content: string, key: string): number {
  const lines = content.split(/\r?\n/);
  const re = new RegExp(`"${key}"\\s*:`);
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) return i + 1;
  }
  return 1;
}

export function findLineForString(content: string, needle: string): number {
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(needle)) return i + 1;
  }
  return 1;
}

export function snippetAround(content: string, line: number, ctx = 2): string {
  const lines = content.split(/\r?\n/);
  const start = Math.max(0, line - 1 - ctx);
  const end = Math.min(lines.length, line + ctx);
  return lines.slice(start, end).join('\n');
}
