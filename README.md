# PromptShield

> Universal security scanner for AI coding assistants — IBM Bob, Claude Code, Cursor.

One command. Five disclosed exploit classes. Every finding maps to a public CVE or named research disclosure.

```bash
npx promptshield
```

## What it scans

| Rule | Detection | Source |
|------|-----------|--------|
| **PS-001** | Chained-command bypass in auto-approve allowlists | PromptArmor (Jan 2026) |
| **PS-002** | Toxic skills: malicious-pattern signatures + supply-chain hashes | Snyk ToxicSkills (Feb 2026) |
| **PS-003** | MCP STDIO RCE: shell -c, command interpolation, untrusted servers | OX Security (Apr 2026) |
| **PS-004** | Custom-mode privilege escalation: missing/permissive `fileRegex` | arXiv 2601.17548 + Snyk |
| **PS-005** | Comment-and-Control GitHub Actions workflows | Aonan Guan + JHU (Apr 2026) |

## Usage

```bash
# Scan current dir, pretty TTY output
npx promptshield

# JSON output for pipelines
npx promptshield --json

# SARIF for GitHub Code Scanning
npx promptshield --sarif results.sarif

# HTML report
npx promptshield --html report.html

# Auto-fix (dry-run by default)
npx promptshield fix
npx promptshield fix --apply

# Filter to specific detectors
npx promptshield --filter PS-001 PS-003

# List detectors
npx promptshield list-detectors

# MCP server mode (for Bob/Claude/Cursor to invoke as a tool)
npx promptshield --mcp
```

## GitHub Actions integration

```yaml
name: PromptShield
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - run: npx promptshield --sarif results.sarif --exit-zero
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

Three lines, and findings appear in your GitHub Security tab.

## Bob Skills

Drop the bundled skills under `.bob/skills/` to invoke PromptShield natively from Bob:

- `promptshield-scanner` — runs a scan and summarizes findings
- `promptshield-fixer` — generates and applies patches with confirmation
- `promptshield-reporter` — emits HTML / SARIF reports
- `promptshield-redteam` — demos exploits against the bundled test fixtures

## Bob Custom Modes

`modes/custom_modes.yaml` ships two modes:

- **SecurityAuditor** — read-only, restricted to config files
- **RedTeam** — read+command, restricted to `test-fixtures/`

## MCP integration

Add to `.mcp.json` (Claude Code), `.bob/mcp/servers.json` (Bob), or `.cursor/mcp.json` (Cursor):

```json
{
  "mcpServers": {
    "promptshield": {
      "command": "npx",
      "args": ["-y", "promptshield", "--mcp"]
    }
  }
}
```

Then ask the assistant: *"scan this repo for AI security issues"*.

## Configuration

Drop a `.promptshield.yaml` at the project root:

```yaml
ignore:
  - ruleId: PS-001
    path: ^vendor/
    reason: third-party config we don't control
severityOverrides:
  PS-003: high   # downgrade from default critical
mcp:
  trusted_servers:
    - "@modelcontextprotocol/"
    - "@anthropic-ai/"
    - "@my-org/"
```

## Architecture

- **Discoverer** — globs Bob/Claude/Cursor configs + workflows from the project root
- **5 detectors** — each maps to a public disclosure; every finding is auditable
- **Aggregator** — dedups by fingerprint, applies user ignores and severity overrides
- **Renderers** — TTY, JSON, SARIF v2.1.0, single-page HTML
- **Fixer** — patch-based, dry-run by default
- **MCP server** — same binary, `--mcp` flag, exposes 4 tools over STDIO

## Design tenets

- **Offline by default.** No telemetry. No auto-update. Network is opt-in.
- **Evidence-based.** Every detector cites a public disclosure. No LLM heuristics in the detection path.
- **Auto-fix is opt-in and reversible.** Patch files first; `--apply` only on explicit request.
- **Minimal dep tree.** A security tool that's itself a supply-chain risk is worse than no tool.

## License

MIT.

## Prior art

- [`everything-claude-code` / `ecc-agentshield`](https://github.com/affaan-m/everything-claude-code) — proved the category for Claude Code; PromptShield generalizes to Bob + Cursor and ships a Bob-native integration.
