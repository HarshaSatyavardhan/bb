# PromptShield Slide Outline (8-10 slides)

## 1. Title

- PromptShield for IBM Bob
- One-liner: Security scanning for AI-assistant configurations via MCP

## 2. Problem

- AI assistants execute repo-defined tools and prompts
- Misconfigured MCP/skills/modes/workflows create exploitable paths

## 3. Why IBM Bob

- Bob provides natural in-IDE orchestration
- MCP tools let Bob call PromptShield directly

## 4. Solution

- PromptShield scanner + MCP server
- Bob-first workflow (`scan_project`, `explain_finding`, `apply_fix`)

## 5. Detection Coverage

- PS-001 allowlist bypass
- PS-002 toxic skills/prompt injection
- PS-003 MCP command injection
- PS-004 custom mode privilege escalation
- PS-005 CI comment-and-control workflow abuse

## 6. Live Demo Flow

- Open vulnerable fixture
- Bob runs scan
- Bob explains critical finding
- Bob runs dry-run fix

## 7. Architecture

- Discovery -> detectors -> aggregator -> output renderers
- Outputs: TTY, JSON, SARIF, HTML, MCP

## 8. Business Value

- Target buyers: platform engineering + AppSec
- Reduces manual review burden
- Produces CI-ready evidence

## 9. Differentiation

- AI-assistant configuration security focus
- Bob-native workflow
- Reproducible vulnerable fixture for validation

## 10. Roadmap + Links

- Better auto-fix coverage
- Policy packs and stricter CI controls
- Repo link, docs, video, hosted demo page
