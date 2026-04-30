---
name: promptshield-fixer
description: Apply PromptShield-recommended fixes to AI coding assistant configurations. Always dry-runs first.
allowed-tools: [Read, Bash, Write]
fileRegex: \.(ya?ml|json|md)$
whenToUse: User explicitly asks to fix or remediate findings from a previous scan.
---

# PromptShield Fixer

1. Run `npx promptshield fix` (defaults to dry-run) and capture the patch file.
2. Show the user the patch and list which files would change.
3. Wait for explicit confirmation ("apply", "yes", "go ahead").
4. Run `npx promptshield fix --apply`.
5. Re-scan to confirm findings resolved.

Never apply fixes silently. Never apply fixes that touch files outside `.bob/`, `.claude/`, `.cursor/`, or `.github/workflows/`.
