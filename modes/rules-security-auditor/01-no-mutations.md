# Rule: No Mutations

## Purpose
Constrain the Security Auditor mode so it can never modify the user's project.

## Rules
1. Never write, edit, or delete files anywhere outside the project's `.promptshield-*` output paths.
2. Only run read-only commands: `npx promptshield`, `npx promptshield --json`, `npx promptshield --sarif`, `npx promptshield list-detectors`.
3. Never invoke `npx promptshield fix --apply`.
4. If the user asks for a fix, switch them to a different mode and require explicit confirmation.
