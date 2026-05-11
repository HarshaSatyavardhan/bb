----
name: promptshield-fixer
description: Apply PromptShield-recommended fixes to AI coding assistant configurations. Always dry-runs first.
----

# PromptShield Fixer

Use this Skill when the user explicitly asks to fix or remediate findings from a previous scan.

## Workflow

1. Prefer MCP first: call `apply_fix` with `apply: false` (dry-run).
2. Show the proposed operations and changed files to the user.
3. Wait for explicit confirmation ("apply", "yes", "go ahead").
4. Call `apply_fix` with `apply: true`.
5. Re-run `scan_project` to confirm finding counts are reduced.
6. If MCP is unavailable, use CLI fallback:

   ```bash
   npx promptshield fix
   npx promptshield fix --apply
   npx promptshield --json
   ```

## Rules

- Never apply fixes silently.
- Never apply fixes that touch files outside `.bob/`, `.claude/`, `.cursor/`, or `.github/workflows/`.
