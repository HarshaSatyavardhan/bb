# Bob Demo Transcript (Recording Script)

This file is a reproducible script and expected transcript template for the hackathon recording.  
It is not an exported live Bob transcript.

## Preconditions

- PromptShield built (`npm run build`)
- Bob has PromptShield MCP server configured
- Bob opened `test-fixtures/bob-vulnerable`

## Prompt 1: Scan Project

User prompt in Bob:

```text
use the promptshield MCP server to call scan_project on the current workspace and summarize findings by severity
```

Expected MCP tool call:

- `scan_project(rootDir=<workspace>)`

Expected summary outcome:

- 5 detectors run
- 17 findings total
- 9 critical, 5 high, 3 medium

## Prompt 2: Explain One Critical Finding

User prompt in Bob:

```text
for the first critical finding, call explain_finding and give me remediation steps
```

Expected MCP tool call:

- `explain_finding(fingerprint=<critical_fingerprint>, rootDir=<workspace>)`

Expected output shape:

- Rule ID and title
- Severity and file line reference
- Description and remediation summary
- References/disclosure links

## Prompt 3: Dry-Run Remediation

User prompt in Bob:

```text
run apply_fix in dry-run mode and summarize what would change
```

Expected MCP tool call:

- `apply_fix(rootDir=<workspace>, apply=false)`

Expected output shape:

- `applied: false`
- operations list with file/line/rule
- `unfixableCount`
- `patchFormat: preview`

## Optional Prompt 4: Generate Shareable Report

If using CLI for report artifacts:

```bash
node dist/cli.js scan --root test-fixtures/bob-vulnerable --sarif results.sarif
node dist/cli.js scan --root test-fixtures/bob-vulnerable --html report.html
```

## Demo Close

Closing line for judges:

```text
IBM Bob orchestrates the workflow and PromptShield provides deterministic security analysis, so teams can catch AI-assistant misconfiguration risk before merge.
```
