import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { SignatureDB } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cached: SignatureDB | null = null;

export async function loadSignatures(): Promise<SignatureDB> {
  if (cached) return cached;
  // dist/cli.js will look for src/signatures/signatures.json relative to package root
  const candidates = [
    // Same dir (when imported as src/signatures/loader.ts)
    path.resolve(__dirname, 'signatures.json'),
    // tsup bundled: dist/cli.js + dist/signatures/signatures.json
    path.resolve(__dirname, 'signatures', 'signatures.json'),
    // Sibling fallback
    path.resolve(__dirname, '..', 'signatures', 'signatures.json'),
    // Source fallback during dev / when running from monorepo root
    path.resolve(__dirname, '..', '..', 'src', 'signatures', 'signatures.json'),
    path.resolve(process.cwd(), 'src', 'signatures', 'signatures.json'),
  ];
  for (const p of candidates) {
    try {
      const raw = await readFile(p, 'utf8');
      cached = JSON.parse(raw) as SignatureDB;
      return cached;
    } catch {
      continue;
    }
  }
  // Fallback: empty
  cached = { version: 'empty', signatures: [] };
  return cached;
}
