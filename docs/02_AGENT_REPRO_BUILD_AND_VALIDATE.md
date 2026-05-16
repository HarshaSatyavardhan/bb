# 02 — Agent Reproduction Build and Validation

This file is the execution contract for deterministic build and validation.

## A. Environment setup

```bash
git clone https://github.com/HarshaSatyavardhan/bb.git promptshield
cd promptshield
node --version
npm ci
```

Requirement: Node `>= 20.11`.

## B. Build gate (must pass)

```bash
npm run typecheck
npm run build
node dist/cli.js --version
node dist/cli.js list-detectors
```

Expected:

- typecheck/build exit code 0
- detector list includes PS-001..PS-005

## C. Deterministic validation workspaces

```bash
npm run generate:validation-workspaces
```

Default output root: `/tmp/promptshield-validation`.

Expected directories:

- `ps1-chained-command`
- `ps2-toxic-skill`
- `ps3-mcp-rce`
- `ps4-priv-esc`
- `ps5-comment-control`
- `clean`
- `all-vulnerable`

## D. CLI matrix

```bash
VALROOT=/tmp/promptshield-validation
node dist/cli.js scan --root "$VALROOT/clean" --json --quiet --exit-zero
node dist/cli.js scan --root "$VALROOT/all-vulnerable" --json --quiet --exit-zero
node dist/cli.js scan --root "$VALROOT/all-vulnerable" --sarif "$VALROOT/all.sarif" --quiet --exit-zero
node dist/cli.js scan --root "$VALROOT/all-vulnerable" --html "$VALROOT/all.html" --quiet --exit-zero
node dist/cli.js fix --root "$VALROOT/all-vulnerable"
```

Expected:

- clean => zero findings
- all-vulnerable => findings across PS-001..PS-005
- SARIF + HTML files created
- fix defaults to dry-run and writes preview patch

## E. Detector-by-detector filtered checks

```bash
node dist/cli.js scan --root /tmp/promptshield-validation/ps1-chained-command --filter PS-001 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps2-toxic-skill --filter PS-002 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps3-mcp-rce --filter PS-003 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps4-priv-esc --filter PS-004 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps5-comment-control --filter PS-005 --json --quiet --exit-zero
```

Expected: each filtered run returns >=1 finding for that rule.

## F. MCP checks

Verify tool contract over stdio MCP:

- `scan_project`
- `list_detectors`
- `explain_finding`
- `apply_fix`

Dry-run `apply_fix` first (`apply: false`).

## G. Real-world scans

Scan:

- `IBM/bob-demo`
- `Nerfherder16/BrickLayer`
- `iannuttall/mcp-boilerplate`

For each: full JSON scan + per-rule scans + ensure `detectorErrors` is empty.

## H. Continue

After all checks pass, feed:

- [03_AGENT_REPRO_ENGINEERING_RUNBOOK.md](./03_AGENT_REPRO_ENGINEERING_RUNBOOK.md)
