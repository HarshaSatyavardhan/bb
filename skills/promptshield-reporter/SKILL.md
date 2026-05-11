----
name: promptshield-reporter
description: Generate an HTML or SARIF report from a PromptShield scan, suitable for sharing with security teams.
----

# PromptShield Reporter

Use this Skill when the user asks for a shareable report, audit doc, or wants to upload findings to the GitHub Security tab.

## Workflow

1. Prefer MCP first:
   - Call `scan_project` to get findings and summary.
   - If a finding needs detail, call `explain_finding`.
2. For shareable files, use CLI output formats:
   - `npx promptshield --html report.html`
   - `npx promptshield --sarif report.sarif`
   - `npx promptshield --json > report.json`
3. Confirm files were written and include where to find them.
4. If SARIF, explain upload via `github/codeql-action/upload-sarif`.
