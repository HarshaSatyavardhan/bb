import { describe, it, expect } from 'vitest';
import { tokenizeAllowEntry, containsShellMeta, hasInterpolation } from '../../src/utils/shell-tokenizer.js';

describe('shell-tokenizer', () => {
  it('tokenizes bare command', () => {
    expect(tokenizeAllowEntry('echo')).toEqual(['echo']);
    expect(tokenizeAllowEntry('  echo ')).toEqual(['echo']);
  });

  it('strips quotes', () => {
    expect(tokenizeAllowEntry('"echo"')).toEqual(['echo']);
    expect(tokenizeAllowEntry("'cat'")).toEqual(['cat']);
  });

  it('detects multi-token entries', () => {
    expect(tokenizeAllowEntry('npm test').length).toBe(2);
  });

  it('detects shell metas', () => {
    expect(containsShellMeta('echo > /tmp/x')).toBe(true);
    expect(containsShellMeta('echo $(pwd)')).toBe(true);
    expect(containsShellMeta('echo `id`')).toBe(true);
    expect(containsShellMeta('echo')).toBe(false);
  });

  it('detects interpolation', () => {
    expect(hasInterpolation('${HOME}/bin')).toBe(true);
    expect(hasInterpolation('$HOME')).toBe(true);
    expect(hasInterpolation('`pwd`')).toBe(true);
    expect(hasInterpolation('/usr/bin/foo')).toBe(false);
  });
});
