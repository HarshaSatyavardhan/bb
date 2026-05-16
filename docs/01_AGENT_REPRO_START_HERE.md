# 01 — Agent Reproduction Start Here

Use this file as the first prompt/context chunk for any agent that must reproduce this project.

## Goal

Reproduce PromptShield build, validation, architecture understanding, and operational prompts in strict order.

## Mandatory order (feed one-by-one)

1. [02_AGENT_REPRO_BUILD_AND_VALIDATE.md](./02_AGENT_REPRO_BUILD_AND_VALIDATE.md)
2. [03_AGENT_REPRO_ENGINEERING_RUNBOOK.md](./03_AGENT_REPRO_ENGINEERING_RUNBOOK.md)
3. [04_AGENT_REPRO_PROMPT_BOOK.md](./04_AGENT_REPRO_PROMPT_BOOK.md)
4. [05_AGENT_REPRO_BOB_GUIDE.md](./05_AGENT_REPRO_BOB_GUIDE.md)

Do not skip order. Each file assumes previous file context is already applied.

## Stop conditions

If any command in step 02 fails:

- stop,
- report the exact failing command and output,
- fix and re-run from the start of step 02.

## Deliverable expected from agent after file 05

- reproducible build proof,
- detector verification proof (PS-001..PS-005),
- MCP contract proof,
- real-repo scan proof,
- concise summary of current system status and known risks.
