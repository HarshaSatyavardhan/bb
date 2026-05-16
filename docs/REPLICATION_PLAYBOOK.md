# Replication Playbook

This playbook gives deterministic steps to reproduce PromptShield behavior end-to-end.

## 1. Environment setup

```bash
git clone https://github.com/HarshaSatyavardhan/bb.git promptshield
cd promptshield
node --version   # >= 20.11
npm ci
```

## 2. Build and local gate

```bash
npm run typecheck
npm run build
node dist/cli.js --version
node dist/cli.js list-detectors
```

Acceptance:

- Typecheck/build succeed.
- CLI prints version and PS-001..PS-005 detector list.

## 3. Deterministic validation workspaces

Generate disposable vulnerable/clean workspaces:

```bash
npm run generate:validation-workspaces
```

Default output root: `/tmp/promptshield-validation`.

Generated directories:

- `ps1-chained-command`
- `ps2-toxic-skill`
- `ps3-mcp-rce`
- `ps4-priv-esc`
- `ps5-comment-control`
- `clean`
- `all-vulnerable`

## 4. CLI validation matrix

```bash
VALROOT=/tmp/promptshield-validation

# Baseline clean check
node dist/cli.js scan --root "$VALROOT/clean" --json --quiet --exit-zero

# Combined vulnerable corpus
node dist/cli.js scan --root "$VALROOT/all-vulnerable" --json --quiet --exit-zero

# SARIF and HTML outputs
node dist/cli.js scan --root "$VALROOT/all-vulnerable" --sarif "$VALROOT/all.sarif" --quiet --exit-zero
node dist/cli.js scan --root "$VALROOT/all-vulnerable" --html "$VALROOT/all.html" --quiet --exit-zero

# Fix dry-run
node dist/cli.js fix --root "$VALROOT/all-vulnerable"
```

Expected:

- `clean` has zero findings.
- `all-vulnerable` has findings across PS-001..PS-005.
- SARIF/HTML files are created and parseable.
- `fix` dry-run writes `.promptshield-fixes.patch` and does not mutate unless `--apply`.

## 5. Detector-by-detector assertions

Run filtered checks:

```bash
node dist/cli.js scan --root /tmp/promptshield-validation/ps1-chained-command --filter PS-001 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps2-toxic-skill --filter PS-002 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps3-mcp-rce --filter PS-003 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps4-priv-esc --filter PS-004 --json --quiet --exit-zero
node dist/cli.js scan --root /tmp/promptshield-validation/ps5-comment-control --filter PS-005 --json --quiet --exit-zero
```

Expected:

- Each command returns at least one finding for its rule.
- Running the same filters on `/tmp/promptshield-validation/clean` returns zero.

## 6. MCP contract checks

Use MCP client over stdio against `node dist/cli.js --mcp`.

Verify:

1. Tool list contains exactly: `scan_project`, `list_detectors`, `explain_finding`, `apply_fix`.
2. `scan_project` works on `/tmp/promptshield-validation/all-vulnerable`.
3. `explain_finding` works with a fingerprint from `scan_project`.
4. `apply_fix` with `apply: false` returns preview metadata and does not mutate target files.

## 7. Real-world validation scans

Scan representative public repos with real assistant config footprints:

- `IBM/bob-demo`
- `Nerfherder16/BrickLayer`
- `iannuttall/mcp-boilerplate`

For each repo:

1. full scan JSON (`--exit-zero`)
2. per-rule filtered scans (`PS-001`..`PS-005`)
3. confirm `detectorErrors` is empty

## 8. Release acceptance criteria

- AC-01: Build gate passes (`npm ci`, `typecheck`, `build`).
- AC-02: CLI contract intact (`--version`, `list-detectors`, scan outputs).
- AC-03: Generated workspace matrix passes.
- AC-04: MCP tool contract validated.
- AC-05: Real-world scans execute without detector crashes.
- AC-06: No unexplained regression in finding shape or exit policy.

## 9. Rollback

Code rollback:

```bash
git status
git reset --hard HEAD
```

Artifact cleanup:

```bash
rm -f results.sarif promptshield.sarif promptshield-report.html .promptshield-fixes.patch
rm -rf /tmp/promptshield-validation /tmp/promptshield-real-validation
```
