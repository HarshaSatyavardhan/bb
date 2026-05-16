# 05 — Agent Reproduction Bob Guide

This final step covers Bob-specific MCP integration and demo operation.

Read in full:

- [RUNNING_WITH_BOB.md](./RUNNING_WITH_BOB.md)

## Required checks

1. MCP registration uses absolute path to `dist/cli.js`
2. Only read-only tools are auto-allowed:
   - `scan_project`
   - `list_detectors`
   - `explain_finding`
3. `apply_fix` remains approval-gated
4. Bob scan works against generated workspace:
   - `/tmp/promptshield-validation/all-vulnerable`

## Final deliverable from agent

- complete reproduction report containing:
  - build evidence,
  - detector matrix evidence,
  - MCP contract evidence,
  - Bob integration evidence,
  - final system status verdict.
