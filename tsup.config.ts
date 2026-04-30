import { defineConfig } from 'tsup';
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export default defineConfig({
  entry: {
    cli: 'src/cli/index.ts',
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'node20',
  clean: true,
  dts: false,
  sourcemap: true,
  splitting: false,
  shims: false,
  banner: ({ format }) => (format === 'esm' ? { js: '#!/usr/bin/env node' } : {}),
  async onSuccess() {
    await mkdir('dist/signatures', { recursive: true });
    await copyFile(
      path.resolve('src/signatures/signatures.json'),
      path.resolve('dist/signatures/signatures.json'),
    );
  },
});
