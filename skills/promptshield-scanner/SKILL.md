---
name: promptshield-scanner
description: Run PromptShield to scan the current project for AI coding assistant vulnerabilities. Returns critical/high findings with file locations.
allowed-tools: [Read, Bash]
fileRegex: \.(ya?ml|json|md)$
whenToUse: User asks about AI security, mentions Bob/Claude/Cursor configs, or asks to audit the project.
---

# PromptShield Scanner

When the user wants to audit their AI coding assistant configuration:

1. Run `npx promptshield --json` from the project root.
2. Parse the JSON output.
3. Summarize findings grouped by severity.
4. For each Critical/High finding, show: file, line, rule ID, 1-sentence remediation.
5. Suggest the user run `npx promptshield fix` for auto-fixable issues.

Do not modify files. Do not run `fix --apply` without explicit user confirmation.
