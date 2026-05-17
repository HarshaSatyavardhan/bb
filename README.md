# PromptShield

![PromptShield cover](ChatGPT%20Image%20May%2017%2C%202026%2C%2007_21_34%20PM.png)

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

For submission-focused Bob usage and report export guidance, see [docs/00_HACKATHON_BOB_PROOF_GUIDE.md](docs/00_HACKATHON_BOB_PROOF_GUIDE.md).

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

# Auto-fix preview (dry-run)
npx promptshield fix --root /path/to/repo
```

## MCP Tools

PromptShield exposes four MCP tools when started with `--mcp`:

- `scan_project`
- `list_detectors`
- `explain_finding`
- `apply_fix`

## Reports

- JSON for automation and pipelines
- SARIF for code scanning integrations
- HTML for security review handoff

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

- Hackathon Bob proof guide (requirements + exact Bob sessions + export flow): [docs/00_HACKATHON_BOB_PROOF_GUIDE.md](docs/00_HACKATHON_BOB_PROOF_GUIDE.md)
- Exported IBM Bob session reports location: [bob-reports/](bob-reports)
