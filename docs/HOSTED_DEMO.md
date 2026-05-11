# Hosted Demo Plan

## Goal

Provide a simple public URL judges can open that explains the project in under 60 seconds and links to the live assets.

## Recommended Hosting

- GitHub Pages (fastest path, no new infrastructure required)

## Proposed Page Sections

1. One-line value proposition
2. Architecture image/GIF (Bob -> PromptShield MCP -> findings)
3. 45-60 second GIF clip of Bob running `scan_project`
4. Link to full 2-3 minute demo video
5. Quickstart commands (install/build/run)
6. Links to:
   - `README.md`
   - `docs/RUNNING_WITH_BOB.md`
   - `SUBMISSION.md`
   - sample `results.sarif` and `report.html` artifacts

## Asset Checklist

- Hero screenshot: Bob showing PromptShield findings
- Demo GIF: Bob scan + explain + dry-run fix
- Video file upload (YouTube/Vimeo/unlisted)
- Optional downloadable sample reports

## URL Placeholder

Replace before submission:

- `https://harshasatyavardhan.github.io/bb/`

## Fallback Plan

If live Bob execution is not possible during judging:

1. Play recorded demo video
2. Show transcript from `docs/BOB_DEMO_TRANSCRIPT.md`
3. Run CLI scan against `test-fixtures/bob-vulnerable` live in terminal
4. Show generated SARIF/HTML artifacts
