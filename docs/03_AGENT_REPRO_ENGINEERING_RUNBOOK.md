# 03 — Agent Reproduction Engineering Runbook

This step provides architecture and implementation internals needed for deterministic maintenance.

Read in full:

- [ENGINEERING_RUNBOOK.md](./ENGINEERING_RUNBOOK.md)

## Required extraction checklist

Agent must explicitly extract and preserve:

1. Discovery surfaces and file patterns
2. Detector behavior for PS-001..PS-005
3. Aggregation/ignore/severity override semantics
4. CLI command contracts and output formats
5. MCP tool contracts and mutation boundaries
6. Build/CI/release workflow

## Output expected from agent for this step

- concise architecture map
- key invariants that must not change
- list of high-risk change points (detectors, aggregator, MCP, fixer)

## Continue

After this extraction is done, feed:

- [04_AGENT_REPRO_PROMPT_BOOK.md](./04_AGENT_REPRO_PROMPT_BOOK.md)
