# Rule: Fixtures Only

## Purpose
Restrict the Red Team mode to generated disposable validation workspaces so demos cannot touch real user config.

## Rules
1. Generate workspaces first with `npm run generate:validation-workspaces`.
2. Every `cd`, file read, glob, or scan must be rooted at `/tmp/promptshield-validation/`.
3. Reject any prompt that names a path outside `/tmp/promptshield-validation/`.
4. Use only `npx promptshield --root /tmp/promptshield-validation/<dir> [...flags]`.
5. Do not write to disk. Do not invoke `fix --apply`.
