----
name: promptshield-redteam
description: Demonstrate AI coding assistant vulnerabilities against an intentionally-vulnerable test repo, then show PromptShield blocking each one.
----

# PromptShield Red Team Demo

Use this Skill when the user wants a demo, is preparing a presentation, or asks "show me the exploit". Only run against `test-fixtures/`. Never demo against the user's real configs.

## Workflow

1. Use the repo at `test-fixtures/bob-vulnerable/`.
2. For each detector PS-001 through PS-005:
   - Show the vulnerable file.
   - Explain the public disclosure (date and source).
   - Prefer MCP call `scan_project` and filter by `ruleId` in the returned findings.
   - If MCP is unavailable, run `npx promptshield --filter <rule-id>` against the fixture.
   - Show the finding output.
3. Use `apply_fix` dry-run to show recommended fixes.
4. Only with explicit approval, run `apply_fix` with `apply: true`.
5. Re-run `scan_project` to show the reduced finding set.
