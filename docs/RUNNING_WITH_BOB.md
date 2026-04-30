# Running PromptShield with IBM Bob — end-to-end guide

This guide takes you from "I just heard about Bob" to "Bob calls PromptShield natively and shows me security findings." It takes about **10 minutes** end-to-end.

> Audience: someone who has activated a Bob trial (or has a paid Bob subscription) and wants to demo PromptShield on their machine.

---

## What you'll have at the end

```text
You (in Bob's chat): "scan this repo for AI security issues with promptshield"

Bob:  Calls our scan_project MCP tool, then renders:

      Found 17 PromptShield findings in this project (5 detectors run):

       Critical (9)
        - PS-001  echo in alwaysAllow of MCP server "shell-utility-allowlisted"
        - PS-001  cat in alwaysAllow of MCP server "shell-utility-allowlisted"
        - PS-003  MCP server "vulnerable-server" invokes a shell with -c
        - PS-004  Custom mode "DevHelper" grants command/shell with no rules-<slug>/
        - PS-005  Workflow ai-review.yml passes PR body into claude CLI
        ... 4 more

       High (5)   Medium (3)
```

---

## Step 1 — Install Bob

1. Open the **welcome email** you received from IBM (subject: *"Welcome to IBM Bob - Your New Development Partner!"*).
2. Click **Download Bob**, or go directly to <https://bob.ibm.com/docs/ide/getting-started/install>.
3. Pick your OS and run the installer:

   | Platform | File | Action |
   |---|---|---|
   | macOS    | `IBM-Bob.pkg`     | Double-click, follow the wizard |
   | Windows  | `IBM-Bob.exe`     | Run installer, accept defaults |
   | Linux    | `.deb` or `.rpm`  | `sudo apt install ./IBM-Bob.deb` (or `dnf install ...`) |

4. Launch **Bob** from your applications menu.
5. On first launch, Bob opens your browser for **IBMid sign-in**. Use the same IBMid you used in the SaaS console (e.g. `vasamsettiharsha@gmail.com`).
6. Once authenticated, Bob's chat panel appears.

> Verify Bob is healthy: open Bob, type **`hello`** in the chat. You should get a greeting back. If not, check the firewall guidance in the Bob docs.

---

## Step 2 — Get PromptShield onto your laptop

```bash
# Clone the repo
git clone https://github.com/HarshaSatyavardhan/bb.git promptshield
cd promptshield

# Install + build
npm install
npm run build

# Verify the CLI works
node dist/cli.js --version          # → 1.0.0
node dist/cli.js list-detectors     # → PS-001 ... PS-005
```

If `npm install` fails, make sure you're on Node ≥ 20.11. Check with `node --version`.

---

## Step 3 — Wire PromptShield into Bob (3 surfaces)

Bob can call PromptShield three ways. **You only need surface (a) for a working demo**; (b) and (c) are optional polish.

### (a) Register PromptShield as an MCP server  ←  primary, do this

Bob loads MCP servers from **`~/.bob/mcp.json`** (global) or **`<project>/.bob/mcp.json`** (project-local). Pick global so every project can use it:

```bash
mkdir -p ~/.bob
# absolute path to the dist/cli.js you just built:
PROMPTSHIELD_BIN="$(pwd)/dist/cli.js"

cat > ~/.bob/mcp.json <<EOF
{
  "mcpServers": {
    "promptshield": {
      "type": "stdio",
      "command": "node",
      "args": ["$PROMPTSHIELD_BIN", "--mcp"],
      "disabled": false,
      "alwaysAllow": [
        "scan_project",
        "list_detectors",
        "explain_finding"
      ]
    }
  }
}
EOF
```

> The `alwaysAllow` list above is safe: those tools only read files. Do **not** add `apply_fix` to alwaysAllow — keep that gated.

Restart Bob. The chat sidebar should show **promptshield** under "MCP servers" with 4 tools: `scan_project`, `list_detectors`, `explain_finding`, `apply_fix`.

### (b) Drop in the bundled Bob Skills (optional)

```bash
mkdir -p ~/.bob/skills
cp -r skills/* ~/.bob/skills/
```

This adds 4 skills Bob will auto-suggest: `promptshield-scanner`, `promptshield-fixer`, `promptshield-reporter`, `promptshield-redteam`.

### (c) Drop in the bundled Custom Modes (optional)

```bash
cp modes/custom_modes.yaml  ~/.bob/custom_modes.yaml
cp -r modes/rules-*         ~/.bob/
```

Now when you click the mode selector in Bob, you'll see **🔒 Security Auditor** and **🛡️ PromptShield Red Team**.

---

## Step 4 — Open a project for Bob to scan

You need *something* with AI configs to make the demo interesting. The easiest is to point Bob at the bundled **`test-fixtures/bob-vulnerable/`** directory inside this repo, which intentionally contains all 5 exploit classes.

```bash
# From the promptshield repo root
cp -r test-fixtures/bob-vulnerable ~/Desktop/demo-vulnerable
```

Then in Bob: **File → Open Folder → `~/Desktop/demo-vulnerable`**.

You'll see this layout:
```
demo-vulnerable/
├── .bob/
│   ├── custom_modes.yaml      # 2 vulnerable modes (PS-004 targets)
│   ├── mcp.json                # 5 servers — bash -c, interp, alwaysAllow shell, untrusted (PS-001 + PS-003)
│   └── skills/
│       └── toxic-helper/
│           └── SKILL.md        # malicious patterns (PS-002)
└── .github/
    └── workflows/
        └── ai-review.yml       # Comment-and-Control vulnerable (PS-005)
```

---

## Step 5 — Run the scan from Bob

In Bob's chat panel, type one of these prompts:

### Sample prompt #1 — most natural
> **scan this repo for AI security issues using promptshield**

### Sample prompt #2 — explicit
> **use the promptshield MCP server to call scan_project on the current workspace and summarise findings by severity**

### Sample prompt #3 — focused
> **call promptshield's scan_project, then for each critical finding call explain_finding and show me the remediation**

Bob will:
1. Notice the `promptshield` MCP server is available.
2. Invoke `scan_project` with `rootDir = <your project>`.
3. Render the JSON findings as a Markdown summary.

### Sample expected output

```text
I scanned the project with PromptShield. Here's the summary (5 detectors run, 17 findings):

CRITICAL (9):
 1. PS-001  .bob/mcp.json:14   Auto-approved shell utility "echo" enables chained-command bypass
                                → PromptArmor 2026-01-07
 2. PS-001  .bob/mcp.json:15   Auto-approved shell utility "cat" enables chained-command bypass
 3. PS-001  .bob/mcp.json:16   Auto-approved shell utility "tee" enables chained-command bypass
 4. PS-003  .bob/mcp.json:3    MCP server "vulnerable-server" invokes a shell with -c
                                → OX Security 2026-04-16  (CVE-2026-30615)
 5. PS-003  .bob/mcp.json:8    MCP server "interp-server" uses variable interpolation in command field
 6. PS-003  .bob/mcp.json:3    MCP server "vulnerable-server" passes shell metacharacters in args
 7. PS-004  .bob/custom_modes.yaml:2   "DevHelper" grants command/shell with no .bob/rules-dev-helper/
                                → arXiv 2601.17548 + Snyk ToxicSkills
 8. PS-002  .bob/skills/toxic-helper/SKILL.md:11   curl|sh signature
 9. PS-005  .github/workflows/ai-review.yml:11   "claude" CLI takes PR body via pull_request_target
                                → Aonan Guan + JHU 2026-04-15

HIGH (5):     PS-002 prompt-injection patterns; PS-004 BroadEditor mode
MEDIUM (3):   untrusted MCP servers, streamable-http remote origin

Want me to:
 a) Show full remediation for any finding?  (call explain_finding)
 b) Generate a fix patch?                    (call apply_fix in dry-run)
```

**That's the demo.** You've shown:
- Real Bob calling a third-party MCP server natively
- A security audit covering 5 disclosed 2026 exploits
- Severity-ranked, evidence-cited findings
- An obvious next step (explain / fix)

---

## Step 6 — Going further

### Run via the CLI directly (no Bob)
```bash
# Scan any project directory:
npx promptshield --root /path/to/project

# Pretty terminal output, exit 0 if clean / 1 if any high+ finding:
node dist/cli.js scan --root test-fixtures/bob-vulnerable

# JSON for pipelines:
node dist/cli.js scan --root test-fixtures/bob-vulnerable --json --quiet

# SARIF for GitHub Code Scanning:
node dist/cli.js scan --sarif results.sarif

# HTML report:
node dist/cli.js scan --html report.html && open report.html

# Auto-fix dry run:
node dist/cli.js fix --root test-fixtures/bob-vulnerable
cat .promptshield-fixes.patch

# Apply (only in a copy you don't mind mutating!):
node dist/cli.js fix --root /tmp/copy-of-vulnerable --apply
```

### Install globally (no `node dist/...`)
Once we publish to npm:
```bash
npm install -g promptshield
promptshield --version
promptshield --mcp     # use this command in ~/.bob/mcp.json
```

### Use Bob's native skills
Once you've copied `skills/*` into `~/.bob/skills/`, you can also say:
- *"run the promptshield-scanner skill"*
- *"use promptshield-fixer to remediate the critical findings"*
- *"open the promptshield-redteam skill and demo each exploit"*

Bob will activate the matching skill and follow the instructions in its `SKILL.md`.

### Try it on a clean project
```bash
mkdir ~/Desktop/clean-project
cd ~/Desktop/clean-project
mkdir -p .bob
echo 'customModes:' > .bob/custom_modes.yaml
echo '  - slug: ro' >> .bob/custom_modes.yaml
echo '    name: ReadOnly' >> .bob/custom_modes.yaml
echo '    whenToUse: read TS files' >> .bob/custom_modes.yaml
echo '    roleDefinition: read only' >> .bob/custom_modes.yaml
echo '    groups: [read]' >> .bob/custom_modes.yaml
```
Open in Bob, ask it to scan → expect **0 findings**.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Bob doesn't show `promptshield` under MCP servers | Wrong path in `~/.bob/mcp.json` | Use the absolute path to `dist/cli.js`, not `~/...` |
| `Cannot find module …/dist/cli.js` | You didn't run `npm run build` | `cd promptshield && npm run build` |
| `npx promptshield` fails | Not yet published to npm | Use `node /absolute/path/to/dist/cli.js` instead |
| Scan returns 0 findings unexpectedly | Pointed at a clean directory | Try `--root test-fixtures/bob-vulnerable` |
| Bob asks for approval on every tool call | Not in `alwaysAllow` | Add `scan_project`, `list_detectors`, `explain_finding` to the server's `alwaysAllow` list |
| `--apply` modified real files | You ran in your real project | Always `--apply` against a copy first |

---

## Reference

- **Bob docs:** <https://bob.ibm.com/docs/ide>
- **Bob install:** <https://bob.ibm.com/docs/ide/getting-started/install>
- **Bob MCP config:** <https://bob.ibm.com/docs/ide/configuration/mcp/mcp-in-bob>
- **PromptShield CLI flags:** `node dist/cli.js --help`
- **PromptShield detectors:** `node dist/cli.js list-detectors`
- **PromptShield repo:** <https://github.com/HarshaSatyavardhan/bb>
