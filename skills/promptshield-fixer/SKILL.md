----
name: promptshield-fixer
description: Apply PromptShield-recommended fixes to AI coding assistant configurations. Always dry-runs first.
----

# PromptShield Fixer

Use this Skill when the user explicitly asks to fix or remediate findings from a previous scan.

## Workflow

1. Run `npx promptshield fix` (defaults to dry-run) and capture the patch file at `.promptshield-fixes.patch`.
2. Show the user the patch and the list of files that would change.
3. Wait for explicit confirmation ("apply", "yes", "go ahead").
4. Run `npx promptshield fix --apply`.
5. Re-run `npx promptshield --json` to confirm the findings have been resolved.

## Rules

- Never apply fixes silently.
- Never apply fixes that touch files outside `.bob/`, `.claude/`, `.cursor/`, or `.github/workflows/`.
