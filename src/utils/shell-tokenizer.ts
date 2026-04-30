export const SHELL_META_DANGEROUS = ['>', '>>', '|', '&&', ';', '$(', '`', '&', '||', '<'];

/**
 * Naive tokenizer for allowlist entries. Splits on whitespace; strips quotes.
 * Returns the leading tokens of an allowlist entry.
 *
 * Used by PS-001 to determine whether an entry is a "bare command" (single token).
 */
export function tokenizeAllowEntry(entry: string): string[] {
  if (typeof entry !== 'string') return [];
  const trimmed = entry.trim();
  if (!trimmed) return [];
  const stripped = trimmed.replace(/^["'](.*)["']$/, '$1').trim();
  return stripped.split(/\s+/);
}

export function containsShellMeta(s: string): boolean {
  if (typeof s !== 'string') return false;
  for (const meta of SHELL_META_DANGEROUS) {
    if (s.includes(meta)) return true;
  }
  return false;
}

export function hasInterpolation(s: string): boolean {
  if (typeof s !== 'string') return false;
  return /\$\{[^}]+\}|\$[A-Za-z_][A-Za-z0-9_]*|`[^`]+`/.test(s);
}
