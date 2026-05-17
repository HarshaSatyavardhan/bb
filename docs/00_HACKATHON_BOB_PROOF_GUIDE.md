# 00 — Hackathon IBM Bob Proof Guide

Use this guide to maximize judging score for IBM Bob usage while avoiding wasted Bob credits.

## Official requirement summary (verified)

From the IBM Bob Hackathon page and lablab submission guidelines:

- Your project must clearly demonstrate meaningful IBM Bob use.
- Projects that do not show meaningful Bob use may be disqualified.
- Your public GitHub repository should include exported IBM Bob task/session report(s).
- Required submission assets include:
  - cover image,
  - video presentation,
  - slide presentation,
  - public GitHub repo (with Bob report),
  - demo platform + application URL.
- Bob usage is limited and should be managed.

## Winning strategy for this repository

For PromptShield, the strongest proof is:

1. Bob helped with meaningful development/review work.
2. Bob is the live orchestrator that calls PromptShield via MCP (`scan_project`, `explain_finding`, `apply_fix` dry-run).

This is stronger than spending credits on trivial edits.

## What NOT to spend Bob credits on (already implemented)

- Do not ask Bob to write `test/detectors/*` in this repo unless you explicitly restore a test suite.
- Do not ask Bob to recreate existing red-team rules that are already present.
- Do not ask Bob to redo existing numbered reproduction docs unless Bob finds concrete issues.

## Bob sessions to run (high impact)

Run these sessions in IBM Bob after cloning/building this repo. Export each session report.

### Session 1 — Architecture understanding

Prompt:

```text
Read this repository and explain PromptShield's architecture:
- CLI entrypoint
- MCP server
- scan pipeline
- detectors PS-001 through PS-005
- validation workspace generator

Return a concise engineering summary and what should be verified before production use.
```

### Session 2 — Security/code review

Prompt:

```text
Review src/core/scanner.ts, src/core/aggregator.ts, src/mcp/server.ts, and src/detectors/*.ts for correctness, security risks, false positives, false negatives, and MCP safety concerns.

Return:
1) critical issues
2) medium issues
3) low-risk improvements
4) what looks production-ready
```

### Session 3 — Reproduction docs validation

Prompt:

```text
Use docs/BUILD_DOCS_HUB.md as entry point. Follow docs 00 through 05 in order.

Tell me whether another engineer or agent can reproduce this project fully. Identify missing steps, stale commands, or unclear instructions. If you find real doc issues, propose exact patches.
```

### Session 4 — Live Bob MCP demo (most important)

Prompt:

```text
Generate validation workspaces, then use the promptshield MCP server to scan /tmp/promptshield-validation/all-vulnerable.

Summarize findings by severity, call explain_finding for one critical finding, then call apply_fix in dry-run mode only and summarize the patch preview. Do not apply changes.
```

## Where to store exported Bob reports

Commit exported reports under:

- `bob-reports/`

Use clear names, for example:

- `bob-reports/2026-05-17-architecture-review.pdf`
- `bob-reports/2026-05-17-security-review.pdf`
- `bob-reports/2026-05-17-mcp-demo.pdf`
- `bob-reports/2026-05-17-docs-validation.pdf`

Do not fabricate report files. Only commit real exports from IBM Bob.

## Submission checklist (judge-facing)

- [ ] Public GitHub repository
- [ ] Exported IBM Bob report(s) committed under `bob-reports/`
- [ ] Cover image
- [ ] Video presentation (shows Bob + MCP demo)
- [ ] Slide presentation (PDF)
- [ ] Demo app URL and platform

## Video checklist (2–5 minutes)

1. State problem: AI assistant config/MCP/workflow security risks.
2. Show PromptShield as solution (PS-001..PS-005).
3. Show Bob is configured with PromptShield MCP.
4. Live flow in Bob:
   - `scan_project`
   - `explain_finding`
   - `apply_fix` dry-run
5. Mention exported Bob reports are committed in `bob-reports/`.

## Continue in strict order

After this file, continue with:

1. [01_AGENT_REPRO_START_HERE.md](./01_AGENT_REPRO_START_HERE.md)
2. [02_AGENT_REPRO_BUILD_AND_VALIDATE.md](./02_AGENT_REPRO_BUILD_AND_VALIDATE.md)
3. [03_AGENT_REPRO_ENGINEERING_RUNBOOK.md](./03_AGENT_REPRO_ENGINEERING_RUNBOOK.md)
4. [04_AGENT_REPRO_PROMPT_BOOK.md](./04_AGENT_REPRO_PROMPT_BOOK.md)
5. [05_AGENT_REPRO_BOB_GUIDE.md](./05_AGENT_REPRO_BOB_GUIDE.md)
