# PromptShield Hackathon Video Script (2-3 minutes)

## 0:00-0:20 — Problem

Narration:

AI coding assistants are now wired to MCP servers, skills, and CI automation.  
That creates a new security surface that most teams do not review systematically.

Visual:

- Bob UI open
- quick cut to `.bob/mcp.json`, custom modes, and workflow files

## 0:20-0:40 — Solution

Narration:

PromptShield is a security engine for AI-assistant configurations.  
IBM Bob is the orchestrator. Bob calls PromptShield via MCP tools to scan and explain risks in real time.

Visual:

- architecture slide: Bob -> PromptShield MCP -> findings

## 0:40-1:30 — Live Scan In Bob

Narration:

I am in a vulnerable demo repository. I ask Bob to run PromptShield scan.

On-screen prompt:

```text
use the promptshield MCP server to call scan_project on the current workspace and summarize findings by severity
```

Expected visual:

- Bob calls `scan_project`
- summary shows 17 findings across PS-001 to PS-005

## 1:30-2:05 — Explain One Critical Risk

Narration:

Now I ask Bob to explain one critical finding, including remediation.

On-screen prompt:

```text
for the first critical finding, call explain_finding and show remediation
```

Expected visual:

- rule details, severity, file location, references

## 2:05-2:35 — Dry-Run Fix + Report

Narration:

Next Bob runs a dry-run remediation so we can preview safe changes before applying.

On-screen prompt:

```text
run apply_fix in dry-run mode and summarize proposed operations
```

Then show report command:

```bash
node dist/cli.js scan --root test-fixtures/bob-vulnerable --sarif results.sarif
```

Expected visual:

- operations list
- SARIF artifact shown

## 2:35-3:00 — Business Value + Close

Narration:

PromptShield helps platform and AppSec teams catch risky AI-assistant integrations before merge, with evidence they can use in CI and code scanning.  
IBM Bob provides the developer experience; PromptShield provides the security analysis.
