----
name: promptshield-scanner
description: Run PromptShield to scan the current project for AI coding assistant vulnerabilities (Bob, Claude, Cursor configs). Returns critical/high findings with file locations.
----

# PromptShield Scanner

Use this Skill when the user asks about AI security, mentions Bob/Claude/Cursor configs, or asks to audit the project.

## Workflow

1. Run the following command from the project root:

   ```bash
   npx promptshield --json
   ```

2. Parse the JSON output. Group findings by `severity` (`critical`, `high`, `medium`, `low`).
3. For each Critical or High finding, report: file path, line, rule ID, and one-sentence remediation.
4. If any finding has `remediation.autoFixAvailable: true`, suggest running `npx promptshield fix` (dry-run first).

## Rules

- Do not modify files.
- Do not run `npx promptshield fix --apply` without explicit user confirmation.
