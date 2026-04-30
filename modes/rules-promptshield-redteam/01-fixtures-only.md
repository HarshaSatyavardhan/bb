# Rule: Fixtures Only

## Purpose
Restrict the Red Team mode to the bundled `test-fixtures/` directory so demos cannot touch real user config.

## Rules
1. Every `cd`, file read, glob, or scan must be rooted at `test-fixtures/`.
2. Reject any prompt that names a path outside `test-fixtures/`.
3. Use only `npx promptshield --root test-fixtures/<dir> [...flags]`.
4. Do not write to disk. Do not invoke `fix --apply`.
