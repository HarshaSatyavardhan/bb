# PromptShield

PromptShield is a security scanner for AI coding assistant configurations across IBM Bob, Claude Code, and Cursor.

It audits MCP servers, skills, custom modes, and AI workflow files for known exploit classes, then returns structured findings for terminal, JSON, SARIF, HTML, or MCP-based assistant workflows.

## Quick Start With IBM Bob (Primary Path)

Use IBM Bob as the orchestrator and PromptShield as the security engine.

1. Build PromptShield locally:

```bash
npm ci
npm run build
node dist/cli.js --version
```

2. Register PromptShield in Bob via `~/.bob/mcp.json`:

```json
{
  "mcpServers": {
    "promptshield": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/promptshield/dist/cli.js", "--mcp"],
      "disabled": false,
      "alwaysAllow": [
        "scan_project",
        "list_detectors",
        "explain_finding"
      ]
    }
  }
}
```

Do not add `apply_fix` to `alwaysAllow`; keep it approval-gated.

3. In Bob, open your project and prompt:

```text
use the promptshield MCP server to call scan_project on the current workspace and summarize findings by severity
```

4. Ask Bob to explain one critical issue:

```text
call explain_finding for the first critical result and show remediation
```

5. Optionally preview remediation:

```text
call apply_fix in dry-run mode and summarize proposed changes
```

For a full step-by-step walkthrough, see [docs/RUNNING_WITH_BOB.md](docs/RUNNING_WITH_BOB.md).

## What PromptShield Detects

- **PS-001**: chained-command allowlist bypass risks
- **PS-002**: toxic skill and prompt-injection signatures
- **PS-003**: MCP stdio command-injection and shell execution risks
- **PS-004**: over-privileged custom modes without guardrail rules
- **PS-005**: comment-and-control workflow prompt injection in CI

## CLI Usage

```bash
# Default scan (TTY)
npx promptshield --root /path/to/repo

# JSON for tooling
npx promptshield --root /path/to/repo --json

# SARIF for GitHub code scanning
npx promptshield --root /path/to/repo --sarif results.sarif

# HTML report
npx promptshield --root /path/to/repo --html report.html

# Markdown report
npx promptshield --root /path/to/repo --markdown report.md

# Auto-fix preview (dry-run)
npx promptshield fix --root /path/to/repo
```

## MCP Tools

PromptShield exposes four MCP tools when started with `--mcp`:

- `scan_project`
- `list_detectors`
- `explain_finding`
- `apply_fix`

## Bob Skills And Custom Modes

This repository ships Bob-ready assets:

- Skills in [skills](skills)
- Custom modes and rules in [modes](modes)

These are designed so Bob can use PromptShield MCP tools first, with CLI fallback only when MCP is unavailable.

## Reports

- JSON for automation and pipelines
- SARIF for code scanning integrations
- HTML for security review handoff
- Markdown for shareable human-readable audits

## Development

```bash
npm ci
npm run typecheck
npm run build
npm run lint
```

## Why IBM Bob + PromptShield

IBM Bob provides the agent workflow and tool orchestration in-repo. PromptShield provides deterministic security analysis and remediation guidance for AI-assistant configuration risk. Together they make AI-assisted development safer and faster to review.

## Additional Docs

- Start here (single build/repro docs entry point): [docs/BUILD_DOCS_HUB.md](docs/BUILD_DOCS_HUB.md)
- Hackathon Bob proof guide (requirements + exact Bob sessions + export flow): [docs/00_HACKATHON_BOB_PROOF_GUIDE.md](docs/00_HACKATHON_BOB_PROOF_GUIDE.md)
- Bob video recording script (exact run order + prompts + export checklist): [docs/06_BOB_VIDEO_RECORDING_SCRIPT.md](docs/06_BOB_VIDEO_RECORDING_SCRIPT.md)
- Numbered one-by-one agent reproduction sequence:
  - [docs/00_HACKATHON_BOB_PROOF_GUIDE.md](docs/00_HACKATHON_BOB_PROOF_GUIDE.md)
  - [docs/01_AGENT_REPRO_START_HERE.md](docs/01_AGENT_REPRO_START_HERE.md)
  - [docs/02_AGENT_REPRO_BUILD_AND_VALIDATE.md](docs/02_AGENT_REPRO_BUILD_AND_VALIDATE.md)
  - [docs/03_AGENT_REPRO_ENGINEERING_RUNBOOK.md](docs/03_AGENT_REPRO_ENGINEERING_RUNBOOK.md)
  - [docs/04_AGENT_REPRO_PROMPT_BOOK.md](docs/04_AGENT_REPRO_PROMPT_BOOK.md)
  - [docs/05_AGENT_REPRO_BOB_GUIDE.md](docs/05_AGENT_REPRO_BOB_GUIDE.md)
  - [docs/06_BOB_VIDEO_RECORDING_SCRIPT.md](docs/06_BOB_VIDEO_RECORDING_SCRIPT.md)
- Exported IBM Bob session reports location: [bob-reports/](bob-reports)
- Bob setup and guided demo: [docs/RUNNING_WITH_BOB.md](docs/RUNNING_WITH_BOB.md)
- Engineering architecture and maintenance runbook: [docs/ENGINEERING_RUNBOOK.md](docs/ENGINEERING_RUNBOOK.md)
- Deterministic replication and verification checklist: [docs/REPLICATION_PLAYBOOK.md](docs/REPLICATION_PLAYBOOK.md)
- Agent role prompts for team workflows: [docs/AGENT_PROMPT_BOOK.md](docs/AGENT_PROMPT_BOOK.md)
