----
name: promptshield-scanner
description: Run PromptShield to scan the current project for AI coding assistant vulnerabilities (Bob, Claude, Cursor configs). Returns critical/high findings with file locations.
----

# PromptShield Scanner

Use this Skill when the user asks about AI security, mentions Bob/Claude/Cursor configs, or asks to audit the project.

## Workflow

1. Prefer MCP first: call `scan_project` on the active workspace root.
2. If MCP is unavailable, run CLI fallback:

   ```bash
   npx promptshield --json
   ```

3. Parse findings and group by `severity` (`critical`, `high`, `medium`, `low`, `info`).
4. For each Critical or High finding, report: file path, line, rule ID, and one-sentence remediation.
5. If findings are present, suggest:
   - `explain_finding` for deep context on critical entries
   - `apply_fix` dry-run for auto-fixable findings

## Rules

- Do not modify files.
- Do not apply fixes without explicit user confirmation.
