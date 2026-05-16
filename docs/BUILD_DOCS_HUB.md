# Build Docs Hub

This is the single entry point for all documentation required to build, verify, and reproduce PromptShield.

## 1) Fast path (build + sanity)

```bash
npm ci
npm run typecheck
npm run build
node dist/cli.js --version
node dist/cli.js list-detectors
```

## 2) Deterministic validation path

Generate disposable validation workspaces and run detector checks:

```bash
npm run generate:validation-workspaces
node dist/cli.js scan --root /tmp/promptshield-validation/all-vulnerable --json --quiet --exit-zero
```

For the complete matrix (CLI, MCP, per-detector checks, acceptance criteria), use:

- [docs/REPLICATION_PLAYBOOK.md](./REPLICATION_PLAYBOOK.md)

## 3) Engineering architecture and operations

For full architecture, detector internals, data flow, contracts, and troubleshooting:

- [docs/ENGINEERING_RUNBOOK.md](./ENGINEERING_RUNBOOK.md)

## 4) Agent/team execution prompts

For reusable role prompts (compactor, bug hunter, verifier, release manager):

- [docs/AGENT_PROMPT_BOOK.md](./AGENT_PROMPT_BOOK.md)

## 5) Bob integration and guided demo

For end-to-end Bob setup and operational examples:

- [docs/RUNNING_WITH_BOB.md](./RUNNING_WITH_BOB.md)

## 6) Recommended team workflow

1. Start here (`BUILD_DOCS_HUB.md`).
2. Run setup + sanity commands in section 1.
3. Execute deterministic validation from the replication playbook.
4. Use the engineering runbook for implementation/debugging details.
5. Use the agent prompt book to coordinate role-based work consistently.
