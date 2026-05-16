# 04 — Agent Reproduction Prompt Book

This step operationalizes role-based execution prompts.

Read in full:

- [AGENT_PROMPT_BOOK.md](./AGENT_PROMPT_BOOK.md)

## Required usage mode

Pick one role prompt at a time, run it end-to-end, and record:

- commands executed,
- outputs/evidence,
- pass/fail decision,
- rollback action if failed.

## Mandatory role order for reproduction

1. detector verifier
2. MCP contract verifier
3. bug hunter
4. docs maintainer
5. release manager

## Output expected from agent for this step

- one consolidated verification ledger with sections by role,
- explicit unresolved risks section.

## Continue

After role execution is complete, feed:

- [05_AGENT_REPRO_BOB_GUIDE.md](./05_AGENT_REPRO_BOB_GUIDE.md)
