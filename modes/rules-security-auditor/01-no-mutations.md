# Rule: No Mutations

## Purpose
Constrain the Security Auditor mode so it can never modify the user's project.

## Rules
1. Never write, edit, or delete files anywhere outside the project's `.promptshield-*` output paths.
2. Prefer read-only MCP tools first: `scan_project`, `list_detectors`, `explain_finding`.
3. If MCP is unavailable, use read-only CLI fallback: `npx promptshield`, `npx promptshield --json`, `npx promptshield --sarif`, `npx promptshield list-detectors`.
4. Never invoke mutation tools in this mode: `apply_fix` (MCP) and `npx promptshield fix --apply` (CLI).
5. If the user asks for a fix, switch to an appropriate mode and require explicit confirmation.
