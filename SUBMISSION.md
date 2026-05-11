# PromptShield for IBM Bob

## Short Description

PromptShield is a security engine that IBM Bob can call over MCP to scan repositories for AI-assistant configuration risks before they become incidents.

## Long Description

PromptShield protects the new AI-development attack surface: MCP server config, assistant skills, custom modes, and CI workflows that hand untrusted text to coding agents.  
It detects five exploit classes (PS-001 through PS-005), cites public disclosures, and returns remediation guidance in terminal, JSON, SARIF, HTML, and MCP tool responses.

For hackathon demos, IBM Bob is the operator experience and PromptShield is the deterministic security backend:

- Bob calls `scan_project` for full-repo risk detection.
- Bob calls `explain_finding` for contextual remediation.
- Bob calls `apply_fix` in dry-run or approval-gated apply mode.

## Tags

- IBM Bob
- MCP
- Application Security
- AI Security
- DevSecOps

## Problem

AI coding assistants now execute repo-defined tools and prompts. Teams inherit security risk from:

- over-broad MCP `alwaysAllow` permissions,
- shell-based MCP commands with interpolation and metacharacters,
- malicious or prompt-injected skill text,
- over-privileged custom modes without rules guardrails,
- and comment-driven CI workflows that pass attacker text into agent CLIs.

Most teams do not have a repeatable review process for these artifacts.

## Solution

PromptShield statically audits these files and returns severity-ranked findings:

- `.bob/mcp.json`, `.claude/settings*.json`, `.cursor/*`
- `.bob/skills/**/SKILL.md`, `.claude/skills/**/SKILL.md`
- `.bob/custom_modes.yaml` with sibling `rules-<slug>/`
- `.github/workflows/*.yml`

It supports:

- CLI scans (`promptshield scan`)
- machine output (`--json`, `--sarif`, `--html`)
- MCP-native operation (`--mcp`) for Bob workflows
- auto-fix planning and optional apply for select findings

## How IBM Bob Is Used

IBM Bob is the primary user journey:

1. Bob connects to PromptShield via `.bob/mcp.json` using stdio.
2. User asks Bob to scan current workspace.
3. Bob calls PromptShield MCP tools (`scan_project`, `explain_finding`, `apply_fix`).
4. Bob summarizes findings and remediation in-chat.

Bob skills and custom modes are included in this repo for consistent demos.

## Technical Architecture

1. File discovery locates assistant config and workflow files.
2. Detector engine (PS-001..PS-005) evaluates known exploit patterns.
3. Aggregator computes severity counts and exit behavior.
4. Renderers emit TTY, JSON, SARIF, and HTML output.
5. MCP server wraps scanner/fixer functions as Bob-callable tools.

## Judging Criteria Mapping

### Application of Technology

- MCP-native security tooling for IBM Bob.
- Deterministic multi-detector analysis with source-linked evidence.
- Multiple output formats for IDE, CI, and security teams.

### Presentation

- Bob-first README and end-to-end Bob runbook.
- Demo script, transcript template, and slide structure included.
- Reproducible vulnerable fixture with expected output.

### Business Value

- Audience: platform engineering leads, AppSec teams, security-conscious founders.
- Outcome: catches risky AI config before merge and creates CI evidence (SARIF).
- Reduces manual review overhead for rapidly growing AI-agent workflows.

### Originality

- Focuses on AI-assistant configuration attack surfaces, not only app code vulnerabilities.
- Combines Bob orchestration with specialized detector logic for emerging exploit classes.

## Demo Script (2-3 Minutes)

1. Open `test-fixtures/bob-vulnerable` in IBM Bob.
2. Prompt Bob to run `scan_project`.
3. Show severity summary and critical findings.
4. Prompt Bob to run `explain_finding` on one critical issue.
5. Prompt Bob to run `apply_fix` dry-run and show proposed operations.
6. Close with business value and CI integration via SARIF.

## Known Limitations

- Auto-fix currently targets a subset of findings.
- Patch artifact is a remediation preview format, not guaranteed git-apply format.
- Certain dependency audit issues may remain in dev-only tooling chains.

## Future Roadmap

- Expand auto-fix coverage across more detectors.
- Add strict scan mode that fails on detector runtime errors.
- Improve patch generation to full unified diff compatibility.
- Add CI policy packs and organization-level baselines.

## Links

- Repository: https://github.com/HarshaSatyavardhan/bb
- Bob runbook: [docs/RUNNING_WITH_BOB.md](docs/RUNNING_WITH_BOB.md)
- Bob transcript template: [docs/BOB_DEMO_TRANSCRIPT.md](docs/BOB_DEMO_TRANSCRIPT.md)
- Video script: [docs/VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md)
- Slides outline: [docs/SLIDES.md](docs/SLIDES.md)
- Hosted demo plan: [docs/HOSTED_DEMO.md](docs/HOSTED_DEMO.md)
