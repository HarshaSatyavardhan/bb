----
name: promptshield-reporter
description: Generate an HTML or SARIF report from a PromptShield scan, suitable for sharing with security teams.
----

# PromptShield Reporter

Use this Skill when the user asks for a shareable report, audit doc, or wants to upload findings to the GitHub Security tab.

## Workflow

1. Determine output format: HTML (default), SARIF (for GitHub Code Scanning), or JSON.
2. Run the appropriate command:
   - `npx promptshield --html report.html`
   - `npx promptshield --sarif report.sarif`
   - `npx promptshield --json > report.json`
3. Confirm the file was written.
4. If SARIF, explain how to upload via the `github/codeql-action/upload-sarif` action.
