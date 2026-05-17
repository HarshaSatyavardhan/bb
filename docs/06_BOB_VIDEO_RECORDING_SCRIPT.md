# 06 — Bob Video Recording Script (Submission-Critical)

Use this checklist while recording so the demo stays focused on judging criteria.

## 1) Current validated state (already done)

- PromptShield MCP tools are enabled in Bob:
  - `scan_project`
  - `list_detectors`
  - `explain_finding`
  - `apply_fix`
- Vulnerable validation workspace path:
  - `/tmp/promptshield-validation/all-vulnerable`
- Successful scan evidence captured:
  - 4 files scanned
  - 5 findings total
  - Includes critical PS-004
- PS-004 explanation was completed.
- `apply_fix` was run with dry-run (`apply: false`) and patch preview.

## 2) Pre-recording terminal commands

Run from project root before recording:

```bash
npm run build
npm run generate:validation-workspaces
```

Optional sanity check:

```bash
ls /tmp/promptshield-validation/all-vulnerable
```

## 3) Main Bob prompt for the live demo

Use this in one Bob task/session:

```text
Use the promptshield MCP server to scan /tmp/promptshield-validation/all-vulnerable.

Summarize findings by severity. Then choose the PS-004 critical finding, call explain_finding for it, and call apply_fix in dry-run mode only with patch preview enabled. Do not apply changes.
```

## 4) What the recording must visibly show

1. Bob MCP settings page with PromptShield tools enabled.
2. Bob `scan_project` call and non-empty results.
3. Severity summary with critical findings.
4. Detailed PS-004 explanation.
5. `apply_fix` dry-run response and patch preview.
6. `bob-reports/` folder in GitHub where exported reports are committed.

## 5) Export checklist (required for submission)

After finishing each Bob task/session, export from Bob and commit under `bob-reports/`.

Recommended filenames:

- `bob-reports/2026-05-17-mcp-demo.pdf`
- `bob-reports/2026-05-17-markdown-report-feature.pdf` (if you run the feature-build session)
- `bob-reports/2026-05-17-security-review.pdf` (optional)

Do not fabricate reports. Only commit real Bob exports.

## 6) Optional Bob-built feature session (stronger judging story)

Run this as a separate Bob task/session:

```text
Implement a small production feature in PromptShield: add Markdown report output for scan results while preserving existing JSON/SARIF/HTML behavior. Keep the change minimal, avoid detector logic changes, and run typecheck/build plus one scan command to validate the new output.
```

This supports a stronger claim that Bob was used to improve the product, not only to operate MCP tools.

## 7) 2–5 minute video outline

1. Problem: AI assistant configs/workflows can introduce security risk.
2. Solution: PromptShield detects PS-001 through PS-005.
3. Bob proof: show Bob connected to PromptShield MCP.
4. Live MCP flow: scan -> explain critical PS-004 -> dry-run apply_fix.
5. Show exported Bob reports in `bob-reports/`.
6. State business value: safer AI-assisted engineering with reproducible evidence.

## 8) Final submission checklist

- Public GitHub repository.
- Exported Bob report(s) in `bob-reports/`.
- Cover image.
- Video presentation.
- Slide presentation (PDF).
- Demo platform and application URL.
- Short + long project descriptions on lablab.
