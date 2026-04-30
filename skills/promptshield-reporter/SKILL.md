---
name: promptshield-reporter
description: Generate an HTML or SARIF report from a PromptShield scan, suitable for sharing with security teams.
allowed-tools: [Read, Bash]
fileRegex: \.(html|sarif|json)$
whenToUse: User asks for a shareable report, audit doc, or wants to upload findings to GitHub Security tab.
---

# PromptShield Reporter

1. Determine output format: HTML (default), SARIF (for GitHub), or JSON.
2. Run `npx promptshield --html report.html` or `--sarif report.sarif`.
3. Confirm the file was written.
4. If SARIF: explain how to upload via `github/codeql-action/upload-sarif`.
5. If HTML: open in default browser if user asks.
