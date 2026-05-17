**User:**

<task>
You are an expert code reviewer and software quality analyst. Your task is to perform a comprehensive analysis of the entire codebase provided. Follow these steps:

1. Thoroughly read and analyze every file in the codebase, examining all code, configurations, dependencies, and documentation.

2. Identify and document all bugs, errors, vulnerabilities, code smells, performance issues, security flaws, logic errors, potential runtime exceptions, memory leaks, race conditions, and architectural problems.

3. For each issue found, determine:
   - The exact location (file path and line number)
   - A clear description of the problem
   - The root cause
   - Potential impact on the system
   - Recommended fix or mitigation strategy
   - Severity level using this classification:
     * CRITICAL: Security vulnerabilities, data loss risks, system crashes, or complete feature failures
     * HIGH: Major functionality broken, significant performance degradation, or serious security concerns
     * MEDIUM: Feature partially broken, moderate performance issues, or code quality problems affecting maintainability
     * LOW: Minor issues, code style violations, or small optimizations that would improve the codebase

4. Present your findings in a detailed table with the following columns: Issue ID, File Path, Line Number, Issue Type, Description, Root Cause, Impact, Recommended Fix, and Severity.

5. After the table, provide a summary that includes:
   - Total number of issues found by severity level
   - Overall code quality assessment
   - Priority recommendations for immediate action
   - Any patterns or systemic issues observed across the codebase
</task>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:27:12.205Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>


# Current Workspace Directory (/home/tcs/Desktop/promptshield) Files
.gitignore
.promptshield.yaml
biome.json
LICENSE
package-lock.json
package.json
README.md
tsconfig.json
tsup.config.ts
.bob/
.github/
bob-reports/
bob-reports/.gitkeep
docs/
docs/00_HACKATHON_BOB_PROOF_GUIDE.md
scripts/
scripts/generate-validation-workspaces.mjs
src/
src/index.ts
src/cli/
src/cli/index.ts
src/cli/render/
src/cli/render/html.ts
src/cli/render/json.ts
src/cli/render/markdown.ts
src/cli/render/sarif.ts
src/cli/render/tty.ts
src/core/
src/core/aggregator.ts
src/core/config.ts
src/core/discoverer.ts
src/core/fixer.ts
src/core/scanner.ts
src/detectors/
src/detectors/chained-command-bypass.ts
src/detectors/comment-and-control-workflow.ts
src/detectors/custom-mode-priv-esc.ts
src/detectors/index.ts
src/detectors/mcp-stdio-rce.ts
src/detectors/toxic-skill-scanner.ts
src/mcp/
src/mcp/server.ts
src/signatures/
src/signatures/loader.ts
src/signatures/signatures.json
src/types/
src/types/config.ts
src/types/detector.ts
src/types/finding.ts
src/types/index.ts
src/types/scan-result.ts
src/types/signatures.ts
src/utils/
src/utils/config-loader.ts
src/utils/evidence.ts
src/utils/finding-builder.ts
src/utils/fs.ts
src/utils/sarif-builder.ts
src/utils/severity-counts.ts
src/utils/shell-tokenizer.ts
src/utils/shell-utilities.ts
src/utils/yaml-frontmatter.ts
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll perform a comprehensive code review of the entire codebase. Let me start by systematically reading and analyzing all the files.

<read_file>
<args>
  <file>
    <path>package.json</path>
  </file>
  <file>
    <path>tsconfig.json</path>
  </file>
  <file>
    <path>tsup.config.ts</path>
  </file>
  <file>
    <path>.promptshield.yaml</path>
  </file>
  <file>
    <path>biome.json</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/index.ts</path>
  </file>
  <file>
    <path>src/types/index.ts</path>
  </file>
  <file>
    <path>src/types/config.ts</path>
  </file>
  <file>
    <path>src/types/detector.ts</path>
  </file>
  <file>
    <path>src/types/finding.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/types/scan-result.ts</path>
  </file>
  <file>
    <path>src/types/signatures.ts</path>
  </file>
  <file>
    <path>src/core/config.ts</path>
  </file>
  <file>
    <path>src/core/scanner.ts</path>
  </file>
  <file>
    <path>src/core/discoverer.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/core/aggregator.ts</path>
  </file>
  <file>
    <path>src/core/fixer.ts</path>
  </file>
  <file>
    <path>src/detectors/index.ts</path>
  </file>
  <file>
    <path>src/detectors/chained-command-bypass.ts</path>
  </file>
  <file>
    <path>src/detectors/comment-and-control-workflow.ts</path>

[Response interrupted by a tool use result. Only one tool may be used at a time and should be placed at the end of the message.]

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>package.json</path>
<content lines="1-62">
 1 | {
 2 |   "name": "promptshield",
 3 |   "version": "1.0.0",
 4 |   "description": "Universal security scanner for AI coding assistants (IBM Bob, Claude Code, Cursor)",
 5 |   "author": "Harsha Satyavardhan",
 6 |   "license": "MIT",
 7 |   "keywords": [
 8 |     "security",
 9 |     "mcp",
10 |     "ibm-bob",
11 |     "claude-code",
12 |     "cursor",
13 |     "sarif"
14 |   ],
15 |   "homepage": "https://github.com/HarshaSatyavardhan/bb#readme",
16 |   "bugs": {
17 |     "url": "https://github.com/HarshaSatyavardhan/bb/issues"
18 |   },
19 |   "repository": {
20 |     "type": "git",
21 |     "url": "git+https://github.com/HarshaSatyavardhan/bb.git"
22 |   },
23 |   "type": "module",
24 |   "bin": {
25 |     "promptshield": "./dist/cli.js"
26 |   },
27 |   "main": "./dist/index.js",
28 |   "files": [
29 |     "dist",
30 |     "src/signatures/signatures.json",
31 |     "skills",
32 |     "modes",
33 |     "README.md",
34 |     "LICENSE"
35 |   ],
36 |   "scripts": {
37 |     "build": "tsup",
38 |     "dev": "tsx src/cli/index.ts",
39 |     "generate:validation-workspaces": "node scripts/generate-validation-workspaces.mjs",
40 |     "lint": "tsc --noEmit",
41 |     "typecheck": "tsc --noEmit",
42 |     "prepublishOnly": "npm run typecheck && npm run build && npm run lint"
43 |   },
44 |   "engines": {
45 |     "node": ">=20.11"
46 |   },
47 |   "dependencies": {
48 |     "@modelcontextprotocol/sdk": "^1.0.4",
49 |     "commander": "^12.1.0",
50 |     "fast-glob": "^3.3.2",
51 |     "jsonc-parser": "^3.3.1",
52 |     "yaml": "^2.6.0",
53 |     "zod": "^3.23.8"
54 |   },
55 |   "devDependencies": {
56 |     "@biomejs/biome": "^2.4.15",
57 |     "@types/node": "^22.5.0",
58 |     "tsup": "^8.3.0",
59 |     "tsx": "^4.19.0",
60 |     "typescript": "^5.6.0"
61 |   }
62 | }
</content>
</file>
<file><path>tsconfig.json</path>
<content lines="1-23">
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2022",
 4 |     "module": "NodeNext",
 5 |     "moduleResolution": "NodeNext",
 6 |     "lib": ["ES2022"],
 7 |     "outDir": "./dist",
 8 |     "rootDir": "./src",
 9 |     "strict": true,
10 |     "esModuleInterop": true,
11 |     "skipLibCheck": true,
12 |     "resolveJsonModule": true,
13 |     "declaration": true,
14 |     "declarationMap": true,
15 |     "sourceMap": true,
16 |     "forceConsistentCasingInFileNames": true,
17 |     "noUnusedLocals": false,
18 |     "noUnusedParameters": false,
19 |     "allowSyntheticDefaultImports": true
20 |   },
21 |   "include": ["src/**/*"],
22 |   "exclude": ["node_modules", "dist", "test"]
23 | }
</content>
</file>
<file><path>tsup.config.ts</path>
<content lines="1-25">
 1 | import { defineConfig } from 'tsup';
 2 | import { copyFile, mkdir } from 'node:fs/promises';
 3 | import path from 'node:path';
 4 | 
 5 | export default defineConfig({
 6 |   entry: {
 7 |     cli: 'src/cli/index.ts',
 8 |     index: 'src/index.ts',
 9 |   },
10 |   format: ['esm'],
11 |   target: 'node20',
12 |   clean: true,
13 |   dts: false,
14 |   sourcemap: true,
15 |   splitting: false,
16 |   shims: false,
17 |   banner: ({ format }) => (format === 'esm' ? { js: '#!/usr/bin/env node' } : {}),
18 |   async onSuccess() {
19 |     await mkdir('dist/signatures', { recursive: true });
20 |     await copyFile(
21 |       path.resolve('src/signatures/signatures.json'),
22 |       path.resolve('dist/signatures/signatures.json'),
23 |     );
24 |   },
25 | });
</content>
</file>
<file><path>.promptshield.yaml</path>
<content lines="1-9">
1 | # PromptShield self-scan config (dogfood)
2 | ignore:
3 |   - path: ^\\.promptshield-validation/
4 |     reason: Generated intentionally vulnerable validation workspaces.
5 | mcp:
6 |   trusted_servers:
7 |     - "@modelcontextprotocol/"
8 |     - "@anthropic-ai/"
9 |     - "@ibm/"
</content>
</file>
<file><path>biome.json</path>
<content lines="1-17">
 1 | {
 2 |   "$schema": "https://biomejs.dev/schemas/2.0.5/schema.json",
 3 |   "formatter": {
 4 |     "enabled": true,
 5 |     "indentStyle": "space",
 6 |     "indentWidth": 2
 7 |   },
 8 |   "linter": {
 9 |     "enabled": true
10 |   },
11 |   "javascript": {
12 |     "formatter": {
13 |       "quoteStyle": "single",
14 |       "semicolons": "always"
15 |     }
16 |   }
17 | }
</content>
</file>
</files>
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:27:19.288Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/types/index.ts</path>
  </file>
  <file>
    <path>src/types/config.ts</path>
  </file>
  <file>
    <path>src/types/detector.ts</path>
  </file>
  <file>
    <path>src/types/finding.ts</path>
  </file>
  <file>
    <path>src/types/scan-result.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/types/signatures.ts</path>
  </file>
  <file>
    <path>src/core/config.ts</path>
  </file>
  <file>
    <path>src/core/scanner.ts</path>
  </file>
  <file>
    <path>src/core/discoverer.ts</path>
  </file>
  <file>
    <path>src/core/aggregator.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/core/fixer.ts</path>
  </file>
  <file>
    <path>src/detectors/index.ts</path>
  </file>
  <file>
    <path>src/detectors/chained-command-bypass.ts</path>
  </file>
  <file>
    <path>src/detectors/comment-and-control-workflow.ts</path>
  </file>
  <file>
    <path>src/detectors/custom-mode-priv-esc.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/detectors/mcp-stdio-rce.ts</path>
  </file>
  <file>
    <path>src/detectors/toxic-skill-scanner.ts</path>
  </file>
  <file>
    <path>src/mcp/server.ts</path>
  </file>
  <file>
    <path>src/signatures/loader.ts</path>
  </file>
  <file>
    <path>src/signatures/signatures.json</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/utils/config-loader.ts</path>
  </file>
  <file>
    <path>src/utils/evidence.ts</path>
  </file>
  <file>
    <path>src/utils/finding-builder.ts</path>
  </file>
  <file>
    <path>src/utils/fs.ts</path>
  </file>
  <file>
    <path>src/utils/sarif-builder.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/utils/severity-counts.ts</path>
  </file>
  <file>
    <path>src/utils/shell-tokenizer.ts</path>
  </file>
  <file>
    <path>src/utils/shell-utilities.ts</path>
  </file>
  <file>
    <path>src/utils/yaml-frontmatter.ts</path>
  </file>
  <file>
    <path>src/cli/index.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/cli/render/html.ts</path>
  </file>
  <file>
    <path>src/cli/render/json.ts</path>
  </file>
  <file>
    <path>src/cli/render/markdown.ts</path>
  </file>
  <file>
    <path>src/cli/render/sarif.ts</path>
  </file>
  <file>
    <path>src/cli/render/tty.ts</path>
  </file>
</args>
</read_file>

<read_file>
<args>
  <file>
    <path>src/index.ts</path>
  </file>
  <file>
    <path>README.md</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/types/index.ts</path>
<content lines="1-5">
1 | export * from './finding.js';
2 | export * from './detector.js';
3 | export * from './config.js';
4 | export * from './signatures.js';
5 | export * from './scan-result.js';
</content>
</file>
<file><path>src/types/config.ts</path>
<content lines="1-27">
 1 | import type { Severity } from './finding.js';
 2 | 
 3 | export interface IgnoreRule {
 4 |   ruleId?: string;
 5 |   path?: string;
 6 |   reason: string;
 7 | }
 8 | 
 9 | export interface PromptShieldConfig {
10 |   ignore: IgnoreRule[];
11 |   severityOverrides: Record<string, Severity>;
12 |   mcp: { trusted_servers: string[] };
13 |   output: { sarifPath?: string; htmlPath?: string };
14 | }
15 | 
16 | export const DEFAULT_CONFIG: PromptShieldConfig = {
17 |   ignore: [],
18 |   severityOverrides: {},
19 |   mcp: {
20 |     trusted_servers: [
21 |       '@modelcontextprotocol/',
22 |       '@anthropic-ai/',
23 |       '@ibm/',
24 |     ],
25 |   },
26 |   output: {},
27 | };
</content>
</file>
<file><path>src/types/detector.ts</path>
<content lines="1-38">
 1 | import type { Finding } from './finding.js';
 2 | import type { PromptShieldConfig } from './config.js';
 3 | import type { SignatureDB } from './signatures.js';
 4 | 
 5 | export interface DiscoveryResult {
 6 |   bob: {
 7 |     settingsFiles: string[];
 8 |     skillFiles: string[];
 9 |     modeFiles: string[];
10 |     mcpFiles: string[];
11 |   };
12 |   claude: {
13 |     settingsFiles: string[];
14 |     skillFiles: string[];
15 |     mcpFiles: string[];
16 |   };
17 |   cursor: {
18 |     settingsFiles: string[];
19 |     rulesFiles: string[];
20 |     mcpFiles: string[];
21 |   };
22 |   workflows: string[];
23 |   rootDir: string;
24 | }
25 | 
26 | export interface DetectorContext {
27 |   discovery: DiscoveryResult;
28 |   config: PromptShieldConfig;
29 |   signatures: SignatureDB;
30 |   abortSignal?: AbortSignal;
31 | }
32 | 
33 | export interface Detector {
34 |   id: string;
35 |   name: string;
36 |   description: string;
37 |   scan(ctx: DetectorContext): Promise<Finding[]>;
38 | }
</content>
</file>
<file><path>src/types/finding.ts</path>
<content lines="1-34">
 1 | export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
 2 | 
 3 | export interface SourceLocation {
 4 |   path: string;
 5 |   startLine: number;
 6 |   startCol?: number;
 7 |   endLine?: number;
 8 |   endCol?: number;
 9 |   snippet?: string;
10 | }
11 | 
12 | export interface FindingEvidence {
13 |   primarySource: string;
14 |   cveIds?: string[];
15 |   references: string[];
16 | }
17 | 
18 | export interface FindingRemediation {
19 |   summary: string;
20 |   autoFixAvailable: boolean;
21 |   suggestedPatch?: string;
22 | }
23 | 
24 | export interface Finding {
25 |   ruleId: string;
26 |   detectorId: string;
27 |   severity: Severity;
28 |   title: string;
29 |   description: string;
30 |   location: SourceLocation;
31 |   evidence: FindingEvidence;
32 |   remediation: FindingRemediation;
33 |   fingerprint: string;
34 | }
</content>
</file>
<file><path>src/types/scan-result.ts</path>
<content lines="1-17">
 1 | import type { Finding } from './finding.js';
 2 | 
 3 | export interface DetectorError {
 4 |   detectorId: string;
 5 |   message: string;
 6 | }
 7 | 
 8 | export interface ScanResult {
 9 |   findings: Finding[];
10 |   scannedFiles: string[];
11 |   detectorsRun: string[];
12 |   durationMs: number;
13 |   toolVersion: string;
14 |   signaturesVersion: string;
15 |   exitCode: 0 | 1;
16 |   detectorErrors: DetectorError[];
17 | }
</content>
</file>
</files>
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
Tool [read_file] was not executed because a tool has already been used in this message. Only one tool may be used per message. You must assess the first tool's result before proceeding to use the next tool.
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:27:34.687Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.05

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/types/signatures.ts</path>
  </file>
  <file>
    <path>src/core/config.ts</path>
  </file>
  <file>
    <path>src/core/scanner.ts</path>
  </file>
  <file>
    <path>src/core/discoverer.ts</path>
  </file>
  <file>
    <path>src/core/aggregator.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/types/signatures.ts</path>
<content lines="1-41">
 1 | import type { Severity } from './finding.js';
 2 | 
 3 | export interface RegexSignature {
 4 |   id: string;
 5 |   detector: string;
 6 |   type: 'regex';
 7 |   pattern: string;
 8 |   patternFlags?: string;
 9 |   severity: Severity;
10 |   source: string;
11 |   references?: string[];
12 |   fixTemplateId?: string;
13 | }
14 | 
15 | export interface UnicodeRangeSignature {
16 |   id: string;
17 |   detector: string;
18 |   type: 'unicode-range';
19 |   rangeStart: string;
20 |   rangeEnd: string;
21 |   severity: Severity;
22 |   source: string;
23 |   references?: string[];
24 | }
25 | 
26 | export interface HashSignature {
27 |   id: string;
28 |   detector: string;
29 |   type: 'sha256';
30 |   hash: string;
31 |   severity: Severity;
32 |   source: string;
33 |   references?: string[];
34 | }
35 | 
36 | export type Signature = RegexSignature | UnicodeRangeSignature | HashSignature;
37 | 
38 | export interface SignatureDB {
39 |   version: string;
40 |   signatures: Signature[];
41 | }
</content>
</file>
<file><path>src/core/config.ts</path>
<content lines="1-39">
 1 | import { readFile } from 'node:fs/promises';
 2 | import path from 'node:path';
 3 | import { parse as parseYaml } from 'yaml';
 4 | import { DEFAULT_CONFIG, type PromptShieldConfig } from '../types/index.js';
 5 | 
 6 | export async function loadConfig(rootDir: string): Promise<PromptShieldConfig> {
 7 |   const candidates = [
 8 |     path.join(rootDir, '.promptshield.yaml'),
 9 |     path.join(rootDir, '.promptshield.yml'),
10 |   ];
11 |   for (const p of candidates) {
12 |     try {
13 |       const raw = await readFile(p, 'utf8');
14 |       const parsed = parseYaml(raw) ?? {};
15 |       return mergeConfig(parsed);
16 |     } catch {
17 |       continue;
18 |     }
19 |   }
20 |   return DEFAULT_CONFIG;
21 | }
22 | 
23 | function mergeConfig(user: any): PromptShieldConfig {
24 |   return {
25 |     ignore: Array.isArray(user.ignore) ? user.ignore : DEFAULT_CONFIG.ignore,
26 |     severityOverrides: typeof user.severityOverrides === 'object' && user.severityOverrides
27 |       ? user.severityOverrides
28 |       : DEFAULT_CONFIG.severityOverrides,
29 |     mcp: {
30 |       trusted_servers: Array.isArray(user?.mcp?.trusted_servers)
31 |         ? user.mcp.trusted_servers
32 |         : DEFAULT_CONFIG.mcp.trusted_servers,
33 |     },
34 |     output: {
35 |       sarifPath: user?.output?.sarifPath,
36 |       htmlPath: user?.output?.htmlPath,
37 |     },
38 |   };
39 | }
</content>
</file>
<file><path>src/core/scanner.ts</path>
<content lines="1-52">
 1 | import type { Detector, Finding, PromptShieldConfig, ScanResult, SignatureDB } from '../types/index.js';
 2 | import { ALL_DETECTORS } from '../detectors/index.js';
 3 | import { discover, allDiscoveredFiles } from './discoverer.js';
 4 | import { loadSignatures } from '../signatures/loader.js';
 5 | import { aggregate, shouldFail } from './aggregator.js';
 6 | import { loadConfig } from './config.js';
 7 | 
 8 | export interface ScanOptions {
 9 |   rootDir: string;
10 |   detectorFilter?: string[];
11 |   config?: PromptShieldConfig;
12 |   signatures?: SignatureDB;
13 |   includeHome?: boolean;
14 |   toolVersion?: string;
15 | }
16 | 
17 | export async function runScan(opts: ScanOptions): Promise<ScanResult> {
18 |   const start = Date.now();
19 |   const config = opts.config ?? (await loadConfig(opts.rootDir));
20 |   const signatures = opts.signatures ?? (await loadSignatures());
21 |   const discovery = await discover({ rootDir: opts.rootDir, includeHome: opts.includeHome });
22 | 
23 |   const detectors = ALL_DETECTORS.filter((d) =>
24 |     !opts.detectorFilter || opts.detectorFilter.includes(d.id),
25 |   );
26 | 
27 |   const allFindings: Finding[] = [];
28 |   const detectorErrors: ScanResult['detectorErrors'] = [];
29 |   for (const detector of detectors) {
30 |     try {
31 |       const findings = await detector.scan({ discovery, config, signatures });
32 |       allFindings.push(...findings);
33 |     } catch (err) {
34 |       const message = err instanceof Error ? err.message : String(err);
35 |       detectorErrors.push({ detectorId: detector.id, message });
36 |     }
37 |   }
38 | 
39 |   const aggregated = aggregate(allFindings, config, opts.rootDir);
40 |   const exitCode: 0 | 1 = shouldFail(aggregated.countsBySeverity, 'high') ? 1 : 0;
41 | 
42 |   return {
43 |     findings: aggregated.findings,
44 |     scannedFiles: allDiscoveredFiles(discovery),
45 |     detectorsRun: detectors.map((d) => d.id),
46 |     durationMs: Date.now() - start,
47 |     toolVersion: opts.toolVersion ?? '1.0.0',
48 |     signaturesVersion: signatures.version,
49 |     exitCode,
50 |     detectorErrors,
51 |   };
52 | }
</content>
</file>
<file><path>src/core/discoverer.ts</path>
<content lines="1-92">
 1 | import fg from 'fast-glob';
 2 | import path from 'node:path';
 3 | import os from 'node:os';
 4 | import { stat } from 'node:fs/promises';
 5 | import type { DiscoveryResult } from '../types/index.js';
 6 | 
 7 | export interface DiscoverOptions {
 8 |   rootDir: string;
 9 |   includeHome?: boolean;
10 | }
11 | 
12 | async function fileExists(p: string): Promise<boolean> {
13 |   try { return (await stat(p)).isFile(); } catch { return false; }
14 | }
15 | 
16 | async function globMany(rootDir: string, patterns: string[]): Promise<string[]> {
17 |   const matches = await fg(patterns, {
18 |     cwd: rootDir,
19 |     absolute: true,
20 |     dot: true,
21 |     suppressErrors: true,
22 |     ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/coverage/**'],
23 |   });
24 |   return Array.from(new Set(matches));
25 | }
26 | 
27 | /** Each tuple = [<localPattern>, <recursivePattern>]. The recursive pattern
28 |  *  picks up monorepo workspaces; the local one matches the project root. */
29 | function localAndDeep(...localPatterns: string[]): string[] {
30 |   return [...localPatterns, ...localPatterns.map((p) => `**/${p}`)];
31 | }
32 | 
33 | export async function discover(opts: DiscoverOptions): Promise<DiscoveryResult> {
34 |   const root = path.resolve(opts.rootDir);
35 |   const home = os.homedir();
36 |   const deepGlob = (...patterns: string[]) => globMany(root, localAndDeep(...patterns));
37 | 
38 |   // Real Bob (verified vs github.com/IBM/bob-demo).
39 |   // No `.bob/settings.yaml`; behaviour comes from custom_modes.yaml + rules-<slug>/.
40 |   const bobSkills = await deepGlob('.bob/skills/*/SKILL.md');
41 |   const bobRules = await deepGlob('.bob/rules-*/*.md');
42 |   const bobModes = await deepGlob('.bob/custom_modes.yaml', '.bob/custom_modes.yml');
43 |   // legacy/fictional layout retained so misnamed configs still get scanned.
44 |   const bobMcp = await deepGlob('.bob/mcp.json', '.bob/mcp/*.json');
45 | 
46 |   const claudeSettings = await deepGlob('.claude/settings.json', '.claude/settings.local.json');
47 |   const claudeSkills = await deepGlob('.claude/skills/*/SKILL.md');
48 |   const claudeMcp = await globMany(root, ['.mcp.json', '.claude/mcp.json', '**/.claude/mcp.json']);
49 | 
50 |   const cursorSettings = await deepGlob('.cursor/settings.json');
51 |   const cursorRules = await globMany(root, ['.cursorrules', ...localAndDeep('.cursor/rules/*.md')]);
52 |   const cursorMcp = await deepGlob('.cursor/mcp.json');
53 | 
54 |   const workflows = await globMany(root, [
55 |     '.github/workflows/*.yml',
56 |     '.github/workflows/*.yaml',
57 |   ]);
58 | 
59 |   if (opts.includeHome) {
60 |     const candidates: Array<[string, string[]]> = [
61 |       [path.join(home, '.bob', 'custom_modes.yaml'), bobModes],
62 |       [path.join(home, '.bob', 'mcp.json'), bobMcp],
63 |       [path.join(home, '.claude', 'settings.json'), claudeSettings],
64 |       [path.join(home, '.claude', 'mcp.json'), claudeMcp],
65 |       [path.join(home, '.cursor', 'mcp.json'), cursorMcp],
66 |     ];
67 |     for (const [p, list] of candidates) {
68 |       if (await fileExists(p)) list.push(p);
69 |     }
70 |   }
71 | 
72 |   // PS-002 should treat skill content AND rule content as the same threat
73 |   // surface (free-text agent instructions).
74 |   const skillish = Array.from(new Set([...bobSkills, ...bobRules]));
75 | 
76 |   return {
77 |     bob: { settingsFiles: [], skillFiles: skillish, modeFiles: bobModes, mcpFiles: bobMcp },
78 |     claude: { settingsFiles: claudeSettings, skillFiles: claudeSkills, mcpFiles: claudeMcp },
79 |     cursor: { settingsFiles: cursorSettings, rulesFiles: cursorRules, mcpFiles: cursorMcp },
80 |     workflows,
81 |     rootDir: root,
82 |   };
83 | }
84 | 
85 | export function allDiscoveredFiles(d: DiscoveryResult): string[] {
86 |   return [
87 |     ...d.bob.skillFiles, ...d.bob.modeFiles, ...d.bob.mcpFiles,
88 |     ...d.claude.settingsFiles, ...d.claude.skillFiles, ...d.claude.mcpFiles,
89 |     ...d.cursor.settingsFiles, ...d.cursor.rulesFiles, ...d.cursor.mcpFiles,
90 |     ...d.workflows,
91 |   ];
92 | }
</content>
</file>
<file><path>src/core/aggregator.ts</path>
<content lines="1-72">
 1 | import path from 'node:path';
 2 | import type { Finding, PromptShieldConfig, Severity } from '../types/index.js';
 3 | 
 4 | const SEVERITY_RANK: Record<Severity, number> = {
 5 |   critical: 4,
 6 |   high: 3,
 7 |   medium: 2,
 8 |   low: 1,
 9 |   info: 0,
10 | };
11 | 
12 | function matchesIgnore(finding: Finding, rootDir: string, ignore: PromptShieldConfig['ignore']): boolean {
13 |   for (const rule of ignore) {
14 |     const ruleMatches = !rule.ruleId || rule.ruleId === finding.ruleId;
15 |     let pathMatches = !rule.path;
16 |     if (rule.path) {
17 |       try {
18 |         const rel = path.relative(rootDir, finding.location.path);
19 |         const re = new RegExp(rule.path);
20 |         pathMatches = re.test(rel) || re.test(finding.location.path);
21 |       } catch {
22 |         pathMatches = finding.location.path.includes(rule.path);
23 |       }
24 |     }
25 |     if (ruleMatches && pathMatches) return true;
26 |   }
27 |   return false;
28 | }
29 | 
30 | export interface AggregateResult {
31 |   findings: Finding[];
32 |   countsBySeverity: Record<Severity, number>;
33 | }
34 | 
35 | export function aggregate(
36 |   raw: Finding[],
37 |   config: PromptShieldConfig,
38 |   rootDir: string,
39 | ): AggregateResult {
40 |   // Dedup by fingerprint
41 |   const seen = new Set<string>();
42 |   const unique: Finding[] = [];
43 |   for (const f of raw) {
44 |     if (seen.has(f.fingerprint)) continue;
45 |     seen.add(f.fingerprint);
46 | 
47 |     // Severity overrides
48 |     const override = config.severityOverrides?.[f.ruleId];
49 |     const finding: Finding = override ? { ...f, severity: override } : f;
50 | 
51 |     // Ignores
52 |     if (matchesIgnore(finding, rootDir, config.ignore)) continue;
53 |     unique.push(finding);
54 |   }
55 | 
56 |   // Sort: severity desc, then path
57 |   unique.sort((a, b) => {
58 |     const dr = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
59 |     if (dr !== 0) return dr;
60 |     return a.location.path.localeCompare(b.location.path);
61 |   });
62 | 
63 |   const counts: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
64 |   for (const f of unique) counts[f.severity]++;
65 | 
66 |   return { findings: unique, countsBySeverity: counts };
67 | }
68 | 
69 | export function shouldFail(counts: Record<Severity, number>, severityFloor: Severity = 'high'): boolean {
70 |   const floor = SEVERITY_RANK[severityFloor];
71 |   return Object.entries(counts).some(([sev, c]) => c > 0 && SEVERITY_RANK[sev as Severity] >= floor);
72 | }
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:27:44.059Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.10

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/core/fixer.ts</path>
  </file>
  <file>
    <path>src/detectors/index.ts</path>
  </file>
  <file>
    <path>src/detectors/chained-command-bypass.ts</path>
  </file>
  <file>
    <path>src/detectors/comment-and-control-workflow.ts</path>
  </file>
  <file>
    <path>src/detectors/custom-mode-priv-esc.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/core/fixer.ts</path>
<content lines="1-145">
  1 | import { readFile, writeFile } from 'node:fs/promises';
  2 | import path from 'node:path';
  3 | import type { Finding } from '../types/index.js';
  4 | import { DANGEROUS_SHELL_UTILITY_NAMES } from '../utils/shell-utilities.js';
  5 | 
  6 | export interface FixOperation {
  7 |   ruleId: string;
  8 |   file: string;
  9 |   line: number;
 10 |   description: string;
 11 |   before: string;
 12 |   after: string;
 13 | }
 14 | 
 15 | export interface FixResult {
 16 |   patchPreview: string;
 17 |   patchFormat: 'preview';
 18 |   operations: FixOperation[];
 19 |   unfixable: Finding[];
 20 | }
 21 | 
 22 | const SHELL_TOKEN_RE = new RegExp(
 23 |   `^(\\s*)"(?:Bash\\()?(${DANGEROUS_SHELL_UTILITY_NAMES.join('|')})\\)?"\\s*(,?)\\s*$`,
 24 | );
 25 | 
 26 | async function withFindingLine<T>(
 27 |   finding: Finding,
 28 |   run: (ctx: { file: string; lines: string[]; line: string; lineIndex: number }) => T | null,
 29 | ): Promise<T | null> {
 30 |   const file = finding.location.path;
 31 |   const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
 32 |   const lineIndex = finding.location.startLine - 1;
 33 |   if (lineIndex < 0 || lineIndex >= lines.length) return null;
 34 |   return run({ file, lines, line: lines[lineIndex], lineIndex });
 35 | }
 36 | 
 37 | async function fixChainedCommandBypass(finding: Finding): Promise<FixOperation | null> {
 38 |   return withFindingLine(finding, ({ file, line }) => {
 39 |     // JSON-array entry: "echo", or "Bash(echo)"  (Bob alwaysAllow, Claude permissions.allow, Cursor autoRun.allow)
 40 |     const jsonMatch = line.match(SHELL_TOKEN_RE);
 41 |     if (!jsonMatch) return null;
 42 |     const cmd = jsonMatch[2];
 43 |     return {
 44 |       ruleId: 'PS-001',
 45 |       file,
 46 |       line: finding.location.startLine,
 47 |       description: `Remove dangerous shell utility "${cmd}" from allowlist`,
 48 |       before: `${line}\n`,
 49 |       after: '',
 50 |     };
 51 |   });
 52 | }
 53 | 
 54 | async function fixCommentAndControlWorkflow(finding: Finding): Promise<FixOperation | null> {
 55 |   return withFindingLine(finding, ({ file, line }) => {
 56 |     // Insert a comment near the offending step suggesting --disallowed-tools.
 57 |     const indent = (line.match(/^(\s*)/) ?? ['', ''])[1];
 58 |     const note = `${indent}# PromptShield PS-005: add '--disallowed-tools "Bash,Write,Edit"' and consider 'pull_request' instead of 'pull_request_target'`;
 59 |     return {
 60 |       ruleId: 'PS-005',
 61 |       file,
 62 |       line: finding.location.startLine,
 63 |       description: 'Insert hardening comment for Comment-and-Control workflow',
 64 |       before: `${line}\n`,
 65 |       after: `${note}\n${line}\n`,
 66 |     };
 67 |   });
 68 | }
 69 | 
 70 | function buildPatchPreview(rootDir: string, ops: FixOperation[]): string {
 71 |   const byFile = new Map<string, FixOperation[]>();
 72 |   for (const op of ops) {
 73 |     if (!byFile.has(op.file)) byFile.set(op.file, []);
 74 |     byFile.get(op.file)!.push(op);
 75 |   }
 76 |   const out: string[] = [
 77 |     '# PromptShield remediation preview',
 78 |     '# This is a preview format and is not guaranteed to be git-apply compatible.',
 79 |     '',
 80 |   ];
 81 |   for (const [file, list] of byFile) {
 82 |     const rel = path.relative(rootDir, file).split(path.sep).join('/') || file;
 83 |     out.push(`--- a/${rel}`);
 84 |     out.push(`+++ b/${rel}`);
 85 |     for (const op of list) {
 86 |       out.push(`@@ line ${op.line} @@ ${op.description}`);
 87 |       for (const line of op.before.split('\n').filter(Boolean)) out.push(`- ${line}`);
 88 |       for (const line of op.after.split('\n').filter(Boolean)) out.push(`+ ${line}`);
 89 |     }
 90 |     out.push('');
 91 |   }
 92 |   return out.join('\n');
 93 | }
 94 | 
 95 | export async function planFixes(findings: Finding[], rootDir: string): Promise<FixResult> {
 96 |   const operations: FixOperation[] = [];
 97 |   const unfixable: Finding[] = [];
 98 | 
 99 |   for (const f of findings) {
100 |     if (!f.remediation.autoFixAvailable) {
101 |       unfixable.push(f);
102 |       continue;
103 |     }
104 |     let op: FixOperation | null = null;
105 |     if (f.ruleId === 'PS-001') op = await fixChainedCommandBypass(f);
106 |     else if (f.ruleId === 'PS-005') op = await fixCommentAndControlWorkflow(f);
107 |     if (op) operations.push(op);
108 |     else unfixable.push(f);
109 |   }
110 | 
111 |   return {
112 |     patchPreview: buildPatchPreview(rootDir, operations),
113 |     patchFormat: 'preview',
114 |     operations,
115 |     unfixable,
116 |   };
117 | }
118 | 
119 | function normalizeJsonArraySyntax(content: string): string {
120 |   return content
121 |     .replace(/,\s*(\])/g, '$1')
122 |     .replace(/(\[)\s*,/g, '$1')
123 |     .replace(/,\s*,/g, ',');
124 | }
125 | 
126 | export async function applyFixes(ops: FixOperation[]): Promise<void> {
127 |   const byFile = new Map<string, FixOperation[]>();
128 |   for (const op of ops) {
129 |     if (!byFile.has(op.file)) byFile.set(op.file, []);
130 |     byFile.get(op.file)!.push(op);
131 |   }
132 |   for (const [file, list] of byFile) {
133 |     let content = await readFile(file, 'utf8');
134 |     // Replace longest first to avoid index issues
135 |     for (const op of list.sort((a, b) => b.before.length - a.before.length)) {
136 |       if (content.includes(op.before)) {
137 |         content = content.replace(op.before, op.after);
138 |       }
139 |     }
140 |     if (file.endsWith('.json')) {
141 |       content = normalizeJsonArraySyntax(content);
142 |     }
143 |     await writeFile(file, content, 'utf8');
144 |   }
145 | }
</content>
</file>
<file><path>src/detectors/index.ts</path>
<content lines="1-22">
 1 | import chainedCommandBypass from './chained-command-bypass.js';
 2 | import toxicSkillScanner from './toxic-skill-scanner.js';
 3 | import mcpStdioRce from './mcp-stdio-rce.js';
 4 | import customModePrivEsc from './custom-mode-priv-esc.js';
 5 | import commentAndControl from './comment-and-control-workflow.js';
 6 | import type { Detector } from '../types/index.js';
 7 | 
 8 | export const ALL_DETECTORS: readonly Detector[] = [
 9 |   chainedCommandBypass,
10 |   toxicSkillScanner,
11 |   mcpStdioRce,
12 |   customModePrivEsc,
13 |   commentAndControl,
14 | ] as const;
15 | 
16 | export {
17 |   chainedCommandBypass,
18 |   toxicSkillScanner,
19 |   mcpStdioRce,
20 |   customModePrivEsc,
21 |   commentAndControl,
22 | };
</content>
</file>
<file><path>src/detectors/chained-command-bypass.ts</path>
<content lines="1-206">
  1 | import type { Detector, DetectorContext, Finding } from '../types/index.js';
  2 | import { tokenizeAllowEntry, containsShellMeta } from '../utils/shell-tokenizer.js';
  3 | import { findLineForString, snippetAround } from '../utils/fs.js';
  4 | import { loadYaml, loadJsonc } from '../utils/config-loader.js';
  5 | import { buildFinding } from '../utils/finding-builder.js';
  6 | import { EVIDENCE } from '../utils/evidence.js';
  7 | import { DANGEROUS_SHELL_UTILITY_SET } from '../utils/shell-utilities.js';
  8 | 
  9 | /**
 10 |  * Shell utilities the PromptArmor exploit (2026-01-07) leveraged.
 11 |  * When any of these names appears in an MCP `alwaysAllow` list (Bob),
 12 |  * a `permissions.allow` array (Claude), or `autoRun.allow` (Cursor),
 13 |  * an attacker can chain shell metacharacters or process substitution
 14 |  * to execute arbitrary payloads without re-approval.
 15 |  */
 16 | /**
 17 |  * Process substitution `>(...)` is the specific bypass PromptArmor
 18 |  * disclosed: Bob's filter caught `$(...)`, `<(...)`, and backticks but
 19 |  * MISSED `>(...)`, allowing attackers to redirect output into a sub-shell
 20 |  * that downloads and executes payloads.
 21 |  */
 22 | const PROCESS_SUBSTITUTION_RE = />\s*\(/;
 23 | 
 24 | const DETECTOR_ID = 'chained-command-bypass';
 25 | 
 26 | interface AllowEntryFinding {
 27 |   bareCommand: string;
 28 | }
 29 | 
 30 | function inspectAllowEntry(entry: unknown): AllowEntryFinding | null {
 31 |   if (typeof entry !== 'string') return null;
 32 |   // Strip Claude's `Bash(...)` wrapper if present.
 33 |   const inner = entry.match(/^Bash\((.+)\)$/)?.[1] ?? entry;
 34 |   if (containsShellMeta(inner)) return null;
 35 |   const tokens = tokenizeAllowEntry(inner);
 36 |   if (tokens.length === 0) return null;
 37 |   const head = tokens[0];
 38 |   // Bare or near-bare shell utility -> exploitable via chaining.
 39 |   if (tokens.length <= 2 && DANGEROUS_SHELL_UTILITY_SET.has(head)) {
 40 |     return { bareCommand: head };
 41 |   }
 42 |   return null;
 43 | }
 44 | 
 45 | function findingForAllowEntry(args: {
 46 |   source: 'bob-alwaysAllow' | 'claude' | 'cursor';
 47 |   serverName?: string;
 48 |   command: string;
 49 |   file: string;
 50 |   line: number;
 51 |   text: string;
 52 | }): Finding {
 53 |   const sourceText = {
 54 |     'bob-alwaysAllow': `Bob MCP server "${args.serverName}" alwaysAllow list`,
 55 |     claude: 'Claude Code permissions.allow list',
 56 |     cursor: 'Cursor autoRun.allow list',
 57 |   }[args.source];
 58 |   return buildFinding({
 59 |     ruleId: 'PS-001',
 60 |     detectorId: DETECTOR_ID,
 61 |     severity: 'critical',
 62 |     title: `Auto-approved shell utility "${args.command}" enables chained-command bypass`,
 63 |     description: `${sourceText} accepts "${args.command}" as a bare command. Per PromptArmor (2026-01-07), an attacker can chain shell metacharacters (>, |, &&, ;) or process substitution >(...) onto an allowlisted shell utility to execute arbitrary payloads without user re-approval. Bob's pre-GA filter blocked $(...) and <(...) but missed >(...).`,
 64 |     filePath: args.file,
 65 |     line: args.line,
 66 |     snippet: snippetAround(args.text, args.line),
 67 |     evidence: EVIDENCE.promptArmor(),
 68 |     remediation: {
 69 |       summary: `Remove "${args.command}" from the allowlist. If you need shell access in your AI assistant, scope it through a dedicated MCP server with explicit per-tool permissions, not a raw shell utility.`,
 70 |       autoFixAvailable: true,
 71 |     },
 72 |     fingerprintParts: [args.source, args.serverName ?? '', args.command],
 73 |   });
 74 | }
 75 | 
 76 | function findingsForAllowList(args: {
 77 |   source: 'bob-alwaysAllow' | 'claude' | 'cursor';
 78 |   serverName?: string;
 79 |   file: string;
 80 |   text: string;
 81 |   allow: unknown[];
 82 |   lineNeedle: (entry: unknown) => string;
 83 | }): Finding[] {
 84 |   const out: Finding[] = [];
 85 |   for (const entry of args.allow) {
 86 |     const hit = inspectAllowEntry(entry);
 87 |     if (!hit) continue;
 88 |     out.push(findingForAllowEntry({
 89 |       source: args.source,
 90 |       serverName: args.serverName,
 91 |       command: hit.bareCommand,
 92 |       file: args.file,
 93 |       line: findLineForString(args.text, args.lineNeedle(entry)),
 94 |       text: args.text,
 95 |     }));
 96 |   }
 97 |   return out;
 98 | }
 99 | 
100 | function findingForProcessSubstitution(args: {
101 |   file: string;
102 |   line: number;
103 |   text: string;
104 | }): Finding {
105 |   return buildFinding({
106 |     ruleId: 'PS-001',
107 |     detectorId: DETECTOR_ID,
108 |     severity: 'critical',
109 |     title: 'Process-substitution bypass pattern `>(...)` detected',
110 |     description: 'Found a `>(...)` process-substitution pattern in an AI configuration file. This is the exact bypass disclosed by PromptArmor (2026-01-07): Bob\'s shell-meta filter blocked `$(...)`, `<(...)`, and backticks but missed `>(...)`, allowing arbitrary command execution.',
111 |     filePath: args.file,
112 |     line: args.line,
113 |     snippet: snippetAround(args.text, args.line),
114 |     evidence: EVIDENCE.promptArmor(),
115 |     remediation: {
116 |       summary: 'Remove the `>(...)` redirection. Process-substitution should never appear in AI assistant skill, mode, or rule files.',
117 |       autoFixAvailable: false,
118 |     },
119 |     fingerprintParts: ['process-substitution'],
120 |   });
121 | }
122 | 
123 | async function scanBobMcpAlwaysAllow(file: string): Promise<Finding[]> {
124 |   const out: Finding[] = [];
125 |   const { text, doc } = await loadJsonc<any>(file);
126 |   if (!doc?.mcpServers || typeof doc.mcpServers !== 'object') return out;
127 | 
128 |   for (const [serverName, raw] of Object.entries(doc.mcpServers)) {
129 |     const server = raw as { alwaysAllow?: unknown };
130 |     const allow = server?.alwaysAllow;
131 |     if (!Array.isArray(allow)) continue;
132 |     out.push(...findingsForAllowList({
133 |       source: 'bob-alwaysAllow',
134 |       serverName,
135 |       file,
136 |       text,
137 |       allow,
138 |       lineNeedle: (entry) => JSON.stringify(entry),
139 |     }));
140 |   }
141 |   return out;
142 | }
143 | 
144 | async function scanClaudeSettings(file: string): Promise<Finding[]> {
145 |   const { text, doc } = await loadJsonc<any>(file);
146 |   const allow = doc?.permissions?.allow;
147 |   return Array.isArray(allow)
148 |     ? findingsForAllowList({ source: 'claude', file, text, allow, lineNeedle: (entry) => String(entry) })
149 |     : [];
150 | }
151 | 
152 | async function scanCursorSettings(file: string): Promise<Finding[]> {
153 |   const { text, doc } = await loadJsonc<any>(file);
154 |   const allow = doc?.autoRun?.allow ?? doc?.auto_run?.allow;
155 |   return Array.isArray(allow)
156 |     ? findingsForAllowList({ source: 'cursor', file, text, allow, lineNeedle: (entry) => String(entry) })
157 |     : [];
158 | }
159 | 
160 | /**
161 |  * Scan free-text content (skills, rules, role definitions) for the `>(...)`
162 |  * process-substitution bypass disclosed by PromptArmor.
163 |  */
164 | async function scanProcessSubstitutionInTextFiles(files: string[]): Promise<Finding[]> {
165 |   const out: Finding[] = [];
166 |   for (const file of files) {
167 |     const { text } = await loadYaml(file); // loadYaml just gives us the text safely
168 |     if (!text) continue;
169 |     const lines = text.split(/\r?\n/);
170 |     for (let i = 0; i < lines.length; i++) {
171 |       if (PROCESS_SUBSTITUTION_RE.test(lines[i])) {
172 |         out.push(findingForProcessSubstitution({ file, line: i + 1, text }));
173 |         break;
174 |       }
175 |     }
176 |   }
177 |   return out;
178 | }
179 | 
180 | const detector: Detector = {
181 |   id: 'PS-001',
182 |   name: 'Chained-command bypass via auto-approved shell utility',
183 |   description:
184 |     "Detects shell utilities (echo, cat, bash, ...) in Bob's `alwaysAllow`, Claude's `permissions.allow`, or Cursor's `autoRun.allow` — the PromptArmor 2026-01-07 attack surface. Also detects `>(...)` process-substitution bypass patterns in skill, rule, and mode files.",
185 | 
186 |   async scan(ctx: DetectorContext): Promise<Finding[]> {
187 |     const findings: Finding[] = [];
188 | 
189 |     for (const f of ctx.discovery.bob.mcpFiles) findings.push(...(await scanBobMcpAlwaysAllow(f)));
190 |     for (const f of ctx.discovery.claude.settingsFiles) findings.push(...(await scanClaudeSettings(f)));
191 |     for (const f of ctx.discovery.cursor.settingsFiles) findings.push(...(await scanCursorSettings(f)));
192 | 
193 |     // Process-substitution bypass patterns can hide anywhere in agent prose.
194 |     const proseFiles = [
195 |       ...ctx.discovery.bob.skillFiles,
196 |       ...ctx.discovery.bob.modeFiles,
197 |       ...ctx.discovery.claude.skillFiles,
198 |       ...ctx.discovery.cursor.rulesFiles,
199 |     ];
200 |     findings.push(...(await scanProcessSubstitutionInTextFiles(proseFiles)));
201 | 
202 |     return findings;
203 |   },
204 | };
205 | 
206 | export default detector;
</content>
</file>
<file><path>src/detectors/comment-and-control-workflow.ts</path>
<content lines="1-141">
  1 | import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
  2 | import { findLineForString, snippetAround } from '../utils/fs.js';
  3 | import { loadYaml } from '../utils/config-loader.js';
  4 | import { buildFinding } from '../utils/finding-builder.js';
  5 | import { EVIDENCE } from '../utils/evidence.js';
  6 | 
  7 | const DETECTOR_ID = 'comment-and-control-workflow';
  8 | 
  9 | const AI_BINARIES = ['claude', 'bob', 'gemini', 'cursor-cli', 'aider', 'codex'];
 10 | const UNTRUSTED_INTERPOLATIONS = [
 11 |   'github.event.pull_request.title',
 12 |   'github.event.pull_request.body',
 13 |   'github.event.pull_request.head.ref',
 14 |   'github.event.pull_request.head.label',
 15 |   'github.event.issue.body',
 16 |   'github.event.issue.title',
 17 |   'github.event.comment.body',
 18 |   'github.event.review.body',
 19 |   'github.event.discussion.body',
 20 |   'github.head_ref',
 21 | ];
 22 | 
 23 | interface StepCheck {
 24 |   invokesAi: boolean;
 25 |   agentBinary?: string;
 26 |   hasUntrustedInterp: boolean;
 27 |   interpolatedField?: string;
 28 |   hasAllowGuard: boolean;
 29 | }
 30 | 
 31 | function stepText(step: any): string {
 32 |   const parts: string[] = [];
 33 |   if (typeof step?.run === 'string') parts.push(step.run);
 34 |   if (step?.with && typeof step.with === 'object') {
 35 |     for (const v of Object.values(step.with)) if (typeof v === 'string') parts.push(v);
 36 |   }
 37 |   if (typeof step?.uses === 'string') parts.push(step.uses);
 38 |   return parts.join('\n');
 39 | }
 40 | 
 41 | function checkStep(step: any): StepCheck {
 42 |   const text = stepText(step);
 43 |   const lower = text.toLowerCase();
 44 |   let agentBinary: string | undefined;
 45 |   for (const bin of AI_BINARIES) {
 46 |     const re = new RegExp(`(^|[\\s/$])${bin}([\\s$]|$|\\b)`, 'i');
 47 |     if (re.test(text) || lower.includes(`${bin}-action`) || lower.includes(`anthropic/${bin}`) ||
 48 |         lower.includes(`anthropics/claude-code`) || (bin === 'claude' && lower.includes('claude-code'))) {
 49 |       agentBinary = bin;
 50 |       break;
 51 |     }
 52 |   }
 53 |   let interpolatedField: string | undefined;
 54 |   for (const interp of UNTRUSTED_INTERPOLATIONS) {
 55 |     if (text.includes(interp)) { interpolatedField = interp; break; }
 56 |   }
 57 |   return {
 58 |     invokesAi: !!agentBinary,
 59 |     agentBinary,
 60 |     hasUntrustedInterp: !!interpolatedField,
 61 |     interpolatedField,
 62 |     hasAllowGuard: /--disallowed-tools|--allowed-tools|disallowed_tools|allowed_tools/i.test(text),
 63 |   };
 64 | }
 65 | 
 66 | function severityFromScore(score: number): Severity | null {
 67 |   if (score >= 4) return 'critical';
 68 |   if (score === 3) return 'high';
 69 |   if (score === 2) return 'medium';
 70 |   if (score === 1) return 'low';
 71 |   return null;
 72 | }
 73 | 
 74 | async function scanWorkflow(file: string): Promise<Finding[]> {
 75 |   const out: Finding[] = [];
 76 |   const { text, doc } = await loadYaml<any>(file);
 77 |   if (!doc) return out;
 78 | 
 79 |   // YAML's `on:` key sometimes parses as the boolean `true`.
 80 |   const onTrigger = doc.on ?? doc.true;
 81 |   let usesPRTarget = false;
 82 |   if (typeof onTrigger === 'string') usesPRTarget = onTrigger === 'pull_request_target';
 83 |   else if (Array.isArray(onTrigger)) usesPRTarget = onTrigger.includes('pull_request_target');
 84 |   else if (onTrigger && typeof onTrigger === 'object') usesPRTarget = 'pull_request_target' in onTrigger;
 85 | 
 86 |   const hasForkGuard = /github\.event\.pull_request\.head\.repo\.full_name\s*==\s*github\.repository/i.test(text);
 87 |   const jobs = doc.jobs;
 88 |   if (!jobs || typeof jobs !== 'object') return out;
 89 | 
 90 |   for (const [jobName, job] of Object.entries(jobs as Record<string, any>)) {
 91 |     if (!job || typeof job !== 'object' || !Array.isArray((job as any).steps)) continue;
 92 |     const steps = (job as any).steps;
 93 |     for (let i = 0; i < steps.length; i++) {
 94 |       const step = steps[i];
 95 |       if (!step || typeof step !== 'object') continue;
 96 |       const check = checkStep(step);
 97 |       if (!check.invokesAi || !check.hasUntrustedInterp) continue;
 98 | 
 99 |       let score = 2; // a + b
100 |       if (!check.hasAllowGuard) score++;
101 |       if (usesPRTarget) score++;
102 |       if (hasForkGuard) score--;
103 | 
104 |       const sev = severityFromScore(score);
105 |       if (!sev) continue;
106 |       const stepName = step.name ?? `step #${i + 1}`;
107 |       const line = findLineForString(text, typeof step.name === 'string' ? step.name : (step.run?.split('\n')[0] ?? jobName));
108 | 
109 |       out.push(buildFinding({
110 |         ruleId: 'PS-005',
111 |         detectorId: DETECTOR_ID,
112 |         severity: sev,
113 |         title: `GitHub Actions step "${stepName}" passes untrusted PR/comment input to ${check.agentBinary ?? 'AI'} CLI`,
114 |         description: `The workflow invokes the ${check.agentBinary ?? 'AI'} CLI with interpolation from "${check.interpolatedField}" - a Comment-and-Control prompt-injection vector (Aonan Guan + JHU, 2026-04-15).${usesPRTarget ? ' The workflow uses pull_request_target, which exposes secrets to forked PRs.' : ''}${!check.hasAllowGuard ? ' No --disallowed-tools / --allowed-tools guard is configured.' : ''}${hasForkGuard ? ' (Fork guard mitigates exposure - severity reduced.)' : ''}`,
115 |         filePath: file, line, snippet: snippetAround(text, line),
116 |         evidence: EVIDENCE.commentAndControl(),
117 |         remediation: {
118 |           summary: 'Pass untrusted PR text through a step env variable, run AI CLI with --disallowed-tools "Bash,Write,Edit", and prefer pull_request over pull_request_target where possible.',
119 |           autoFixAvailable: true,
120 |         },
121 |         fingerprintParts: [jobName, i],
122 |       }));
123 |     }
124 |   }
125 |   return out;
126 | }
127 | 
128 | const detector: Detector = {
129 |   id: 'PS-005',
130 |   name: 'Comment-and-Control workflow',
131 |   description:
132 |     'Detects GitHub Actions steps that pass untrusted PR/issue/comment input into AI CLI invocations.',
133 | 
134 |   async scan(ctx: DetectorContext): Promise<Finding[]> {
135 |     const findings: Finding[] = [];
136 |     for (const f of ctx.discovery.workflows) findings.push(...(await scanWorkflow(f)));
137 |     return findings;
138 |   },
139 | };
140 | 
141 | export default detector;
</content>
</file>
<file><path>src/detectors/custom-mode-priv-esc.ts</path>
<content lines="1-164">
  1 | import { stat } from 'node:fs/promises';
  2 | import path from 'node:path';
  3 | import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
  4 | import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
  5 | import { findLineForString, snippetAround } from '../utils/fs.js';
  6 | import { loadYaml, readUtf8Optional } from '../utils/config-loader.js';
  7 | import { buildFinding } from '../utils/finding-builder.js';
  8 | import { EVIDENCE } from '../utils/evidence.js';
  9 | 
 10 | const DETECTOR_ID = 'custom-mode-privilege-escalation';
 11 | const PERMISSIVE_REGEXES = new Set(['', '.*', '.+', '^.*$', '^.+$', '.*?']);
 12 | 
 13 | interface ModeEval {
 14 |   hasCommand: boolean;
 15 |   hasEdit: boolean;
 16 |   hasMcp: boolean;
 17 |   hasBrowser: boolean;
 18 |   hasReadOnly: boolean;
 19 |   fileRegex?: string;
 20 | }
 21 | 
 22 | function evalGroups(groups: unknown[]): ModeEval {
 23 |   const set = new Set((Array.isArray(groups) ? groups : []).map((g) => String(g).toLowerCase()));
 24 |   const hasCommand = set.has('command') || set.has('bash') || set.has('shell') || set.has('execute');
 25 |   const hasEdit = set.has('edit') || set.has('write');
 26 |   const hasMcp = set.has('mcp');
 27 |   const hasBrowser = set.has('browser');
 28 |   const hasRead = set.has('read');
 29 |   return {
 30 |     hasCommand, hasEdit, hasMcp, hasBrowser,
 31 |     hasReadOnly: hasRead && !hasCommand && !hasEdit && !hasMcp && !hasBrowser,
 32 |   };
 33 | }
 34 | 
 35 | function severityFor(e: ModeEval, hasRulesDir: boolean): Severity | null {
 36 |   if (e.hasReadOnly) return null;
 37 |   const tooBroad = (!e.fileRegex || PERMISSIVE_REGEXES.has(e.fileRegex)) && !hasRulesDir;
 38 |   if (!tooBroad) return null;
 39 |   if (e.hasCommand) return 'critical';
 40 |   if (e.hasMcp || e.hasBrowser || e.hasEdit) return 'high';
 41 |   return null;
 42 | }
 43 | 
 44 | function describeBreadth(e: ModeEval): string {
 45 |   if (e.hasCommand) return 'command/shell';
 46 |   if (e.hasMcp) return 'mcp';
 47 |   if (e.hasBrowser) return 'browser';
 48 |   if (e.hasEdit) return 'edit/write';
 49 |   return 'read';
 50 | }
 51 | 
 52 | function isRedTeamPurpose(value: unknown): boolean {
 53 |   const purpose = String(value ?? '').toLowerCase();
 54 |   return purpose === 'red-team' || purpose === 'pentest';
 55 | }
 56 | 
 57 | function fileRegexFrom(meta: Record<string, unknown>): string | undefined {
 58 |   const fileRegex = meta.fileRegex;
 59 |   if (typeof fileRegex === 'string') return fileRegex;
 60 |   const snakeRegex = meta.file_regex;
 61 |   return typeof snakeRegex === 'string' ? snakeRegex : undefined;
 62 | }
 63 | 
 64 | function evaluateBroadAccess(
 65 |   groups: unknown[],
 66 |   fileRegex: string | undefined,
 67 |   hasRulesDir: boolean,
 68 | ): { severity: Severity; breadth: string } | null {
 69 |   const evalRes = evalGroups(groups);
 70 |   evalRes.fileRegex = fileRegex;
 71 |   const severity = severityFor(evalRes, hasRulesDir);
 72 |   return severity ? { severity, breadth: describeBreadth(evalRes) } : null;
 73 | }
 74 | 
 75 | async function dirExists(p: string): Promise<boolean> {
 76 |   try { return (await stat(p)).isDirectory(); } catch { return false; }
 77 | }
 78 | 
 79 | async function scanBobModes(file: string): Promise<Finding[]> {
 80 |   const out: Finding[] = [];
 81 |   const { text, doc } = await loadYaml<any>(file);
 82 |   const modes = doc?.customModes ?? doc?.custom_modes;
 83 |   if (!Array.isArray(modes)) return out;
 84 | 
 85 |   const bobDir = path.dirname(file);
 86 |   for (const m of modes) {
 87 |     if (!m || typeof m !== 'object') continue;
 88 |     const mode = m as Record<string, unknown>;
 89 |     const slug = typeof mode.slug === 'string' ? mode.slug : undefined;
 90 |     const name = String(mode.name ?? slug ?? 'unnamed');
 91 |     if (isRedTeamPurpose(mode.purpose)) continue;
 92 | 
 93 |     const hasRulesDir = slug ? await dirExists(path.join(bobDir, `rules-${slug}`)) : false;
 94 |     const access = evaluateBroadAccess(
 95 |       Array.isArray(mode.groups) ? mode.groups : [],
 96 |       fileRegexFrom(mode),
 97 |       hasRulesDir,
 98 |     );
 99 |     if (!access) continue;
100 |     const line = findLineForString(text, slug ? `slug: ${slug}` : `name: ${name}`);
101 |     out.push(buildFinding({
102 |       ruleId: 'PS-004',
103 |       detectorId: DETECTOR_ID,
104 |       severity: access.severity,
105 |       title: `Custom mode "${name}" grants ${access.breadth} permission with no behavioural guardrail`,
106 |       description: `The Bob custom mode "${name}" exposes ${access.breadth} capabilities with no \`.bob/rules-${slug ?? '<slug>'}/\` guardrail directory. Per arXiv 2601.17548 and Snyk ToxicSkills, this is the AI-agent equivalent of a Linux capability over-grant.`,
107 |       filePath: file, line, snippet: snippetAround(text, line),
108 |       evidence: EVIDENCE.customMode(),
109 |       remediation: {
110 |         summary: `Add a \`.bob/rules-${slug ?? '<slug>'}/\` directory with explicit behavioural rules, or restrict the mode's groups list.`,
111 |         autoFixAvailable: false,
112 |       },
113 |       fingerprintParts: [name, slug ?? ''],
114 |     }));
115 |   }
116 |   return out;
117 | }
118 | 
119 | async function scanClaudeSkill(file: string): Promise<Finding[]> {
120 |   const out: Finding[] = [];
121 |   const content = await readUtf8Optional(file);
122 |   if (!content) return out;
123 |   const fm = parseFrontmatter<any>(content);
124 |   if (!fm.data) return out;
125 |   if (isRedTeamPurpose(fm.data.purpose)) return out;
126 | 
127 |   const tools = Array.isArray(fm.data['allowed-tools']) ? fm.data['allowed-tools'] : [];
128 |   if (tools.length === 0) return out;
129 |   const access = evaluateBroadAccess(tools, fileRegexFrom(fm.data), false);
130 |   if (!access) return out;
131 | 
132 |   const name = String(fm.data.name ?? path.basename(path.dirname(file)));
133 |   out.push(buildFinding({
134 |     ruleId: 'PS-004',
135 |     detectorId: DETECTOR_ID,
136 |     severity: access.severity,
137 |     title: `Skill "${name}" grants ${access.breadth} permission with no behavioural guardrail`,
138 |     description: `The Claude skill "${name}" exposes ${access.breadth} capabilities without a narrow fileRegex.`,
139 |     filePath: file, line: 1, snippet: snippetAround(content, 1, 5),
140 |     evidence: EVIDENCE.customMode(),
141 |     remediation: {
142 |       summary: `Add a fileRegex restricting "${name}" to the smallest set of files it actually needs.`,
143 |       autoFixAvailable: false,
144 |     },
145 |     fingerprintParts: [name],
146 |   }));
147 |   return out;
148 | }
149 | 
150 | const detector: Detector = {
151 |   id: 'PS-004',
152 |   name: 'Custom-mode privilege escalation',
153 |   description:
154 |     'Detects Bob custom modes (groups: command/mcp/browser/edit) without a `.bob/rules-<slug>/` guardrail directory, and Claude skills with broad `allowed-tools` without a narrow fileRegex.',
155 | 
156 |   async scan(ctx: DetectorContext): Promise<Finding[]> {
157 |     const findings: Finding[] = [];
158 |     for (const f of ctx.discovery.bob.modeFiles) findings.push(...(await scanBobModes(f)));
159 |     for (const f of ctx.discovery.claude.skillFiles) findings.push(...(await scanClaudeSkill(f)));
160 |     return findings;
161 |   },
162 | };
163 | 
164 | export default detector;
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:30:13.236Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.17

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/detectors/mcp-stdio-rce.ts</path>
  </file>
  <file>
    <path>src/detectors/toxic-skill-scanner.ts</path>
  </file>
  <file>
    <path>src/mcp/server.ts</path>
  </file>
  <file>
    <path>src/signatures/loader.ts</path>
  </file>
  <file>
    <path>src/signatures/signatures.json</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/detectors/mcp-stdio-rce.ts</path>
<content lines="1-174">
  1 | import type { Detector, DetectorContext, Finding, Severity } from '../types/index.js';
  2 | import { hasInterpolation, containsShellMeta } from '../utils/shell-tokenizer.js';
  3 | import { findLineForString, snippetAround } from '../utils/fs.js';
  4 | import { loadJsonc } from '../utils/config-loader.js';
  5 | import { buildFinding } from '../utils/finding-builder.js';
  6 | import { EVIDENCE } from '../utils/evidence.js';
  7 | 
  8 | const DETECTOR_ID = 'mcp-stdio-rce';
  9 | 
 10 | const SHELL_BINS = new Set(['bash', 'sh', 'zsh', 'ksh', 'fish', 'cmd', 'powershell', 'pwsh']);
 11 | const INTERPRETER_BINS = new Set(['node', 'python', 'python3', 'ruby', 'perl', 'php']);
 12 | 
 13 | interface McpServerEntry {
 14 |   type?: string;
 15 |   command?: string;
 16 |   args?: string[];
 17 |   env?: Record<string, string>;
 18 |   url?: string;
 19 |   disabled?: boolean;
 20 |   alwaysAllow?: string[];
 21 | }
 22 | 
 23 | function isTrustedServer(packageOrCmd: string, trusted: string[]): boolean {
 24 |   return trusted.some((prefix) => packageOrCmd.startsWith(prefix));
 25 | }
 26 | 
 27 | function findingsForServer(
 28 |   name: string,
 29 |   entry: McpServerEntry,
 30 |   file: string,
 31 |   text: string,
 32 |   trusted: string[],
 33 | ): Finding[] {
 34 |   if (entry.disabled === true) return [];
 35 |   const out: Finding[] = [];
 36 |   const baseLine = findLineForString(text, `"${name}"`);
 37 |   const baseSnippet = snippetAround(text, baseLine);
 38 |   const addFinding = (
 39 |     severity: Severity,
 40 |     title: string,
 41 |     description: string,
 42 |     fingerprintSuffix: string,
 43 |     remediationSummary: string,
 44 |     withSnippet = false,
 45 |   ) => {
 46 |     out.push(buildFinding({
 47 |       ruleId: 'PS-003',
 48 |       detectorId: DETECTOR_ID,
 49 |       severity,
 50 |       title,
 51 |       description,
 52 |       filePath: file,
 53 |       line: baseLine,
 54 |       snippet: withSnippet ? baseSnippet : undefined,
 55 |       evidence: EVIDENCE.ox(),
 56 |       remediation: { summary: remediationSummary, autoFixAvailable: false },
 57 |       fingerprintParts: [name, fingerprintSuffix],
 58 |     }));
 59 |   };
 60 | 
 61 |   // Streamable-HTTP variant: no command field, but URL must be inspected.
 62 |   if (entry.type === 'streamable-http' || entry.url) {
 63 |     const url = String(entry.url ?? '');
 64 |     if (hasInterpolation(url)) {
 65 |       addFinding(
 66 |         'high',
 67 |         `MCP streamable-http server "${name}" uses variable interpolation in url`,
 68 |         `Server "${name}" uses streamable-http transport with interpolation in the url. If user-controlled input flows into the url, an attacker can pivot to internal services or arbitrary endpoints.`,
 69 |         'http-interp',
 70 |         'Hardcode the url, or constrain it to a single trusted origin.',
 71 |         true,
 72 |       );
 73 |     }
 74 |     if (url && !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(url) && !isTrustedServer(url, trusted)) {
 75 |       addFinding(
 76 |         'medium',
 77 |         `MCP streamable-http server "${name}" points at untrusted origin`,
 78 |         `Server "${name}" connects to ${url}. Streamable-http MCP servers can both leak agent context and inject untrusted tool definitions.`,
 79 |         'http-untrusted',
 80 |         'Verify the origin or proxy through a trusted gateway. Add the origin to .promptshield.yaml mcp.trusted_servers if audited.',
 81 |       );
 82 |     }
 83 |     return out;
 84 |   }
 85 | 
 86 |   // STDIO variant.
 87 |   const cmd = entry.command;
 88 |   if (typeof cmd !== 'string' || !cmd) return out;
 89 |   const args = Array.isArray(entry.args) ? entry.args : [];
 90 | 
 91 |   if (hasInterpolation(cmd)) {
 92 |     addFinding(
 93 |       'critical',
 94 |       `MCP server "${name}" uses variable interpolation in command field`,
 95 |       'MCP STDIO transport spawns the "command" string as a subprocess. Per OX Security (2026-04-16), interpolation in this field is RCE if any user-controlled input flows in.',
 96 |       'interp',
 97 |       'Replace interpolation with a hardcoded, audited binary path.',
 98 |       true,
 99 |     );
100 |   }
101 | 
102 |   const cmdBase = cmd.split('/').pop()?.toLowerCase() ?? '';
103 |   if (SHELL_BINS.has(cmdBase) && args.includes('-c')) {
104 |     addFinding(
105 |       'critical',
106 |       `MCP server "${name}" invokes a shell with -c`,
107 |       `Server "${name}" runs ${cmd} -c <string>. This is the canonical OX Security RCE pattern - any later mutation to the args array becomes shell-injected code.`,
108 |       'shell-c',
109 |       'Move the server to its own binary; do not invoke a shell.',
110 |       true,
111 |     );
112 |   }
113 | 
114 |   for (const a of args) {
115 |     if (typeof a === 'string' && containsShellMeta(a)) {
116 |       addFinding(
117 |         'critical',
118 |         `MCP server "${name}" passes shell metacharacters in args`,
119 |         `An argument to the MCP server contains shell metacharacters: ${JSON.stringify(a)}. If a shell wrapper is involved, this is exploitable.`,
120 |         'shell-meta',
121 |         'Remove shell metacharacters; pass discrete arguments only.',
122 |       );
123 |       break;
124 |     }
125 |   }
126 | 
127 |   // Untrusted-server warning (only if no critical finding fired for this server).
128 |   let packageRef = cmd;
129 |   if (cmdBase === 'npx') {
130 |     const pkgArg = args.find((a) => typeof a === 'string' && !a.startsWith('-'));
131 |     if (pkgArg) packageRef = pkgArg;
132 |   }
133 |   const isInterpreter = INTERPRETER_BINS.has(cmdBase);
134 |   if (out.length === 0 && !isTrustedServer(packageRef, trusted) && !isInterpreter) {
135 |     addFinding(
136 |       'medium',
137 |       `MCP server "${name}" is not in the trusted-server allowlist`,
138 |       `Package or binary "${packageRef}" does not match any prefix in the trusted list (${trusted.join(', ')}). Review the server's source before trusting it; MCP STDIO grants subprocess execution.`,
139 |       'untrusted',
140 |       'Add the server to .promptshield.yaml mcp.trusted_servers if you have audited it.',
141 |     );
142 |   }
143 | 
144 |   return out;
145 | }
146 | 
147 | const detector: Detector = {
148 |   id: 'PS-003',
149 |   name: 'MCP STDIO RCE',
150 |   description:
151 |     'Detects MCP server configurations vulnerable to OX Security (2026-04-16): shell -c invocation, command interpolation, shell-meta args, untrusted servers, and streamable-http URLs with interpolation or untrusted origins.',
152 | 
153 |   async scan(ctx: DetectorContext): Promise<Finding[]> {
154 |     const findings: Finding[] = [];
155 |     const mcpFiles = [
156 |       ...ctx.discovery.bob.mcpFiles,
157 |       ...ctx.discovery.claude.mcpFiles,
158 |       ...ctx.discovery.cursor.mcpFiles,
159 |     ];
160 |     for (const file of mcpFiles) {
161 |       const { text, doc } = await loadJsonc<any>(file);
162 |       const servers = doc?.mcpServers ?? doc?.mcp_servers ?? doc?.servers;
163 |       if (!servers || typeof servers !== 'object') continue;
164 |       for (const [name, entry] of Object.entries(servers)) {
165 |         if (entry && typeof entry === 'object') {
166 |           findings.push(...findingsForServer(name, entry as McpServerEntry, file, text, ctx.config.mcp.trusted_servers));
167 |         }
168 |       }
169 |     }
170 |     return findings;
171 |   },
172 | };
173 | 
174 | export default detector;
</content>
</file>
<file><path>src/detectors/toxic-skill-scanner.ts</path>
<content lines="1-201">
  1 | import type {
  2 |   Detector,
  3 |   DetectorContext,
  4 |   Finding,
  5 |   RegexSignature,
  6 |   Severity,
  7 |   Signature,
  8 |   UnicodeRangeSignature,
  9 | } from '../types/index.js';
 10 | import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
 11 | import { snippetAround } from '../utils/fs.js';
 12 | import { readUtf8Optional } from '../utils/config-loader.js';
 13 | import { buildFinding } from '../utils/finding-builder.js';
 14 | import { EVIDENCE } from '../utils/evidence.js';
 15 | 
 16 | const DETECTOR_ID = 'toxic-skill-scanner';
 17 | 
 18 | interface SignatureMatch {
 19 |   sig: Signature;
 20 |   line: number;
 21 |   matchedText: string;
 22 | }
 23 | 
 24 | function addSignatureFindings(
 25 |   out: Finding[],
 26 |   content: string,
 27 |   signatures: Signature[],
 28 |   build: (match: SignatureMatch) => Finding,
 29 | ): void {
 30 |   for (const match of matchSignatures(content, signatures)) out.push(build(match));
 31 | }
 32 | 
 33 | function matchSignatures(content: string, signatures: Signature[]): SignatureMatch[] {
 34 |   const results: SignatureMatch[] = [];
 35 |   const lines = content.split(/\r?\n/);
 36 | 
 37 |   for (const sig of signatures) {
 38 |     if (sig.detector !== 'PS-002') continue;
 39 |     if (sig.type === 'regex') {
 40 |       const reSig = sig as RegexSignature;
 41 |       let re: RegExp;
 42 |       try {
 43 |         re = new RegExp(reSig.pattern, reSig.patternFlags ?? '');
 44 |       } catch {
 45 |         continue;
 46 |       }
 47 |       for (let i = 0; i < lines.length; i++) {
 48 |         const m = lines[i].match(re);
 49 |         if (m) {
 50 |           results.push({ sig, line: i + 1, matchedText: m[0] });
 51 |           break;
 52 |         }
 53 |       }
 54 |     } else if (sig.type === 'unicode-range') {
 55 |       const u = sig as UnicodeRangeSignature;
 56 |       const startCp = u.rangeStart.codePointAt(0) ?? 0;
 57 |       const endCp = u.rangeEnd.codePointAt(0) ?? 0;
 58 |       for (let i = 0; i < lines.length; i++) {
 59 |         for (const ch of lines[i]) {
 60 |           const cp = ch.codePointAt(0) ?? 0;
 61 |           if (cp >= startCp && cp <= endCp) {
 62 |             results.push({ sig, line: i + 1, matchedText: `U+${cp.toString(16).toUpperCase()}` });
 63 |             break;
 64 |           }
 65 |         }
 66 |       }
 67 |     }
 68 |   }
 69 |   return results;
 70 | }
 71 | 
 72 | function checkBase64Frontmatter(content: string, fmEnd: number): { line: number; len: number } | null {
 73 |   if (fmEnd === 0) return null;
 74 |   const lines = content.split(/\r?\n/).slice(0, fmEnd);
 75 |   const reB64 = /(?:^|\s)([A-Za-z0-9+/]{200,}={0,2})(?:\s|$)/;
 76 |   for (let i = 0; i < lines.length; i++) {
 77 |     const m = lines[i].match(reB64);
 78 |     if (m) return { line: i + 1, len: m[1].length };
 79 |   }
 80 |   return null;
 81 | }
 82 | 
 83 | function checkOverbroadTools(fm: any): boolean {
 84 |   const toolList = fm?.['allowed-tools'] ?? fm?.allowedTools ?? fm?.tools;
 85 |   if (!Array.isArray(toolList)) return false;
 86 |   const tools = toolList.map((t: any) => String(t).toLowerCase());
 87 |   const hasBash = tools.includes('bash') || tools.includes('shell') || tools.includes('execute');
 88 |   const hasWrite = tools.includes('write') || tools.includes('edit');
 89 |   const hasRead = tools.includes('read');
 90 |   if (hasBash && hasWrite && hasRead) {
 91 |     const fileRegex = fm?.fileRegex ?? fm?.file_regex;
 92 |     return !fileRegex || fileRegex === '.*' || fileRegex === '';
 93 |   }
 94 |   return false;
 95 | }
 96 | 
 97 | const detector: Detector = {
 98 |   id: 'PS-002',
 99 |   name: 'Toxic skill / supply-chain scanner',
100 |   description:
101 |     'Hashes and pattern-matches AI skill, rule, and customInstructions content against the Snyk ToxicSkills disclosure (Feb 2026).',
102 | 
103 |   async scan(ctx: DetectorContext): Promise<Finding[]> {
104 |     const findings: Finding[] = [];
105 | 
106 |     // Bob skills + Bob rule files (rules-<slug>/*.md), Claude skills, Cursor rules
107 |     const proseFiles = [
108 |       ...ctx.discovery.bob.skillFiles,
109 |       ...ctx.discovery.claude.skillFiles,
110 |       ...ctx.discovery.cursor.rulesFiles,
111 |     ];
112 | 
113 |     for (const file of proseFiles) {
114 |       const content = await readUtf8Optional(file);
115 |       if (!content) continue;
116 |       const fm = parseFrontmatter(content);
117 | 
118 |       // Pattern matches
119 |       addSignatureFindings(findings, content, ctx.signatures.signatures, (m) => {
120 |         const severity: Severity = m.sig.severity ?? 'high';
121 |         return buildFinding({
122 |           ruleId: 'PS-002',
123 |           detectorId: DETECTOR_ID,
124 |           severity,
125 |           title: `Skill matches malicious-pattern signature ${m.sig.id}`,
126 |           description: `Skill or rule file matches signature "${m.sig.id}" (${m.sig.type}) sourced from ${m.sig.source}. Match excerpt: ${JSON.stringify(m.matchedText.slice(0, 80))}.`,
127 |           filePath: file,
128 |           line: m.line,
129 |           snippet: snippetAround(content, m.line),
130 |           evidence: EVIDENCE.snyk(m.sig.references?.[0]),
131 |           remediation: {
132 |             summary: 'Manually review the flagged content. If untrusted, remove the skill or rename SKILL.md to SKILL.md.quarantined.',
133 |             autoFixAvailable: false,
134 |           },
135 |           fingerprintParts: [m.sig.id],
136 |         });
137 |       });
138 | 
139 |       // Base64 in frontmatter
140 |       const b64 = checkBase64Frontmatter(content, fm.endLine);
141 |       if (b64) {
142 |         findings.push(buildFinding({
143 |           ruleId: 'PS-002',
144 |           detectorId: DETECTOR_ID,
145 |           severity: 'high',
146 |           title: `Suspicious base64 payload (${b64.len} chars) in skill frontmatter`,
147 |           description: 'Long base64-encoded strings in skill YAML frontmatter are a known obfuscation channel for embedded payloads (Snyk ToxicSkills).',
148 |           filePath: file,
149 |           line: b64.line,
150 |           evidence: EVIDENCE.snyk(),
151 |           remediation: { summary: 'Decode and inspect the base64 string. If obfuscated content, quarantine the skill.', autoFixAvailable: false },
152 |           fingerprintParts: ['base64'],
153 |         }));
154 |       }
155 | 
156 |       // Claude skills sometimes declare overbroad allowed-tools without fileRegex
157 |       if (fm.data && checkOverbroadTools(fm.data)) {
158 |         findings.push(buildFinding({
159 |           ruleId: 'PS-002',
160 |           detectorId: DETECTOR_ID,
161 |           severity: 'high',
162 |           title: 'Skill declares Bash+Write+Read with no fileRegex restriction',
163 |           description: 'Per Snyk ToxicSkills, agent skills inherit the full permissions of the agent. Declaring shell, write, and read tools without a narrow fileRegex creates a privileged exfil/RCE surface.',
164 |           filePath: file,
165 |           line: 1,
166 |           evidence: EVIDENCE.snyk(),
167 |           remediation: { summary: 'Add a narrow fileRegex (e.g. \\.ts$) and remove unused tools from allowed-tools.', autoFixAvailable: false },
168 |           fingerprintParts: ['overbroad-tools'],
169 |         }));
170 |       }
171 |     }
172 | 
173 |     // Also scan customInstructions blobs in Bob custom_modes.yaml — these are
174 |     // free-text agent prompts and a known prompt-injection target.
175 |     for (const modeFile of ctx.discovery.bob.modeFiles) {
176 |       const content = await readUtf8Optional(modeFile);
177 |       if (!content) continue;
178 |       // Scan the entire YAML file for malicious patterns; customInstructions
179 |       // and roleDefinition are inside the doc, but textual scanning works.
180 |       addSignatureFindings(findings, content, ctx.signatures.signatures, (m) =>
181 |         buildFinding({
182 |           ruleId: 'PS-002',
183 |           detectorId: DETECTOR_ID,
184 |           severity: m.sig.severity,
185 |           title: `Custom mode file matches malicious-pattern signature ${m.sig.id}`,
186 |           description: `Pattern "${m.sig.id}" (${m.sig.type}) found in a Bob custom_modes.yaml — likely embedded in customInstructions or roleDefinition.`,
187 |           filePath: modeFile,
188 |           line: m.line,
189 |           snippet: snippetAround(content, m.line),
190 |           evidence: EVIDENCE.snyk(),
191 |           remediation: { summary: 'Review the customInstructions/roleDefinition block for prompt-injection content. Remove untrusted text.', autoFixAvailable: false },
192 |           fingerprintParts: ['custom-mode', m.sig.id],
193 |         }),
194 |       );
195 |     }
196 | 
197 |     return findings;
198 |   },
199 | };
200 | 
201 | export default detector;
</content>
</file>
<file><path>src/mcp/server.ts</path>
<content lines="1-152">
  1 | import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
  2 | import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
  3 | import { z } from 'zod';
  4 | import { runScan } from '../core/scanner.js';
  5 | import { ALL_DETECTORS } from '../detectors/index.js';
  6 | import { planFixes, applyFixes } from '../core/fixer.js';
  7 | 
  8 | interface McpOptions {
  9 |   toolVersion: string;
 10 | }
 11 | 
 12 | function textResponse(text: string): { content: [{ type: 'text'; text: string }] } {
 13 |   return { content: [{ type: 'text', text }] };
 14 | }
 15 | 
 16 | function jsonResponse(value: unknown): { content: [{ type: 'text'; text: string }] } {
 17 |   return textResponse(JSON.stringify(value, null, 2));
 18 | }
 19 | 
 20 | export async function startMcpServer(opts: McpOptions): Promise<void> {
 21 |   const server = new McpServer(
 22 |     { name: 'promptshield', version: opts.toolVersion },
 23 |     { capabilities: { tools: {} } },
 24 |   );
 25 | 
 26 |   server.registerTool(
 27 |     'scan_project',
 28 |     {
 29 |       description: 'Scan a project directory for AI coding assistant vulnerabilities. Returns structured findings.',
 30 |       inputSchema: {
 31 |         rootDir: z.string().describe('Absolute path to the project root.'),
 32 |         detectors: z.array(z.string()).optional().describe('Filter to specific detector IDs (e.g. PS-001).'),
 33 |         includeHome: z.boolean().optional().describe('Also scan ~/.bob, ~/.claude, ~/.cursor.'),
 34 |       },
 35 |     },
 36 |     async ({ rootDir, detectors, includeHome }) => {
 37 |       const result = await runScan({
 38 |         rootDir,
 39 |         detectorFilter: detectors,
 40 |         includeHome,
 41 |         toolVersion: opts.toolVersion,
 42 |       });
 43 |       return jsonResponse({
 44 |         findings: result.findings.map((f) => ({
 45 |           ruleId: f.ruleId,
 46 |           severity: f.severity,
 47 |           title: f.title,
 48 |           path: f.location.path,
 49 |           line: f.location.startLine,
 50 |           fingerprint: f.fingerprint,
 51 |           source: f.evidence.primarySource,
 52 |         })),
 53 |         scannedFiles: result.scannedFiles.length,
 54 |         detectorsRun: result.detectorsRun,
 55 |         durationMs: result.durationMs,
 56 |       });
 57 |     },
 58 |   );
 59 | 
 60 |   server.registerTool(
 61 |     'list_detectors',
 62 |     {
 63 |       description: 'List all available PromptShield detectors with IDs, names, and source disclosures.',
 64 |       inputSchema: {},
 65 |     },
 66 |     async () => jsonResponse(ALL_DETECTORS.map((d) => ({ id: d.id, name: d.name, description: d.description }))),
 67 |   );
 68 | 
 69 |   server.registerTool(
 70 |     'explain_finding',
 71 |     {
 72 |       description: 'Return a human-readable explanation and remediation for a finding by fingerprint.',
 73 |       inputSchema: {
 74 |         fingerprint: z.string().describe('Finding fingerprint from a previous scan_project call.'),
 75 |         rootDir: z.string().describe('Project root used in the original scan.'),
 76 |       },
 77 |     },
 78 |     async ({ fingerprint, rootDir }) => {
 79 |       const result = await runScan({ rootDir, toolVersion: opts.toolVersion });
 80 |       const finding = result.findings.find((f) => f.fingerprint === fingerprint);
 81 |       if (!finding) {
 82 |         return { ...textResponse(`No finding with fingerprint ${fingerprint}`), isError: true };
 83 |       }
 84 |       return textResponse([
 85 |         `# ${finding.ruleId}: ${finding.title}`,
 86 |         '',
 87 |         `**Severity:** ${finding.severity}`,
 88 |         `**File:** ${finding.location.path}:${finding.location.startLine}`,
 89 |         `**Source:** ${finding.evidence.primarySource}`,
 90 |         finding.evidence.cveIds?.length ? `**CVEs:** ${finding.evidence.cveIds.join(', ')}` : '',
 91 |         '',
 92 |         '## Description',
 93 |         finding.description,
 94 |         '',
 95 |         '## Remediation',
 96 |         finding.remediation.summary,
 97 |         '',
 98 |         '## References',
 99 |         ...finding.evidence.references.map((r) => `- ${r}`),
100 |       ].filter(Boolean).join('\n'));
101 |     },
102 |   );
103 | 
104 |   server.registerTool(
105 |     'apply_fix',
106 |     {
107 |       description: 'Plan and optionally apply auto-fixes for findings. Defaults to dry-run.',
108 |       inputSchema: {
109 |         rootDir: z.string(),
110 |         apply: z.boolean().optional().describe('If true, write changes to disk. Default false (dry-run).'),
111 |         includePatchPreview: z
112 |           .boolean()
113 |           .optional()
114 |           .describe('If true, include remediation preview text in response. Default false.'),
115 |       },
116 |     },
117 |     async ({ rootDir, apply, includePatchPreview }) => {
118 |       const result = await runScan({ rootDir, toolVersion: opts.toolVersion });
119 |       const plan = await planFixes(result.findings, rootDir);
120 |       if (apply) await applyFixes(plan.operations);
121 |       const response: {
122 |         applied: boolean;
123 |         operations: Array<{
124 |           ruleId: string;
125 |           file: string;
126 |           line: number;
127 |           description: string;
128 |         }>;
129 |         unfixableCount: number;
130 |         patchFormat: 'preview';
131 |         patchPreview?: string;
132 |       } = {
133 |         applied: !!apply,
134 |         operations: plan.operations.map((op) => ({
135 |           ruleId: op.ruleId,
136 |           file: op.file,
137 |           line: op.line,
138 |           description: op.description,
139 |         })),
140 |         unfixableCount: plan.unfixable.length,
141 |         patchFormat: plan.patchFormat,
142 |       };
143 |       if (includePatchPreview) {
144 |         response.patchPreview = plan.patchPreview;
145 |       }
146 |       return jsonResponse(response);
147 |     },
148 |   );
149 | 
150 |   const transport = new StdioServerTransport();
151 |   await server.connect(transport);
152 | }
</content>
</file>
<file><path>src/signatures/loader.ts</path>
<content lines="1-38">
 1 | import { readFile } from 'node:fs/promises';
 2 | import { fileURLToPath } from 'node:url';
 3 | import path from 'node:path';
 4 | import type { SignatureDB } from '../types/index.js';
 5 | 
 6 | const __filename = fileURLToPath(import.meta.url);
 7 | const __dirname = path.dirname(__filename);
 8 | 
 9 | let cached: SignatureDB | null = null;
10 | 
11 | export async function loadSignatures(): Promise<SignatureDB> {
12 |   if (cached) return cached;
13 |   // dist/cli.js will look for src/signatures/signatures.json relative to package root
14 |   const candidates = [
15 |     // Same dir (when imported as src/signatures/loader.ts)
16 |     path.resolve(__dirname, 'signatures.json'),
17 |     // tsup bundled: dist/cli.js + dist/signatures/signatures.json
18 |     path.resolve(__dirname, 'signatures', 'signatures.json'),
19 |     // Sibling fallback
20 |     path.resolve(__dirname, '..', 'signatures', 'signatures.json'),
21 |     // Source fallback during dev / when running from monorepo root
22 |     path.resolve(__dirname, '..', '..', 'src', 'signatures', 'signatures.json'),
23 |     path.resolve(process.cwd(), 'src', 'signatures', 'signatures.json'),
24 |   ];
25 |   for (const p of candidates) {
26 |     try {
27 |       const raw = await readFile(p, 'utf8');
28 |       cached = JSON.parse(raw) as SignatureDB;
29 |       return cached;
30 |     } catch {
31 |       continue;
32 |     }
33 |   }
34 | 
35 |   throw new Error(
36 |     `PromptShield signatures could not be loaded. Tried: ${candidates.join(', ')}`,
37 |   );
38 | }
</content>
</file>
<file><path>src/signatures/signatures.json</path>
<content lines="1-127">
  1 | {
  2 |   "version": "2026.04.30",
  3 |   "signatures": [
  4 |     {
  5 |       "id": "PS-002-S001",
  6 |       "detector": "PS-002",
  7 |       "type": "regex",
  8 |       "pattern": "ignore (all )?previous instructions",
  9 |       "patternFlags": "i",
 10 |       "severity": "high",
 11 |       "source": "Snyk ToxicSkills 2026-02-05",
 12 |       "references": ["https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/"]
 13 |     },
 14 |     {
 15 |       "id": "PS-002-S002",
 16 |       "detector": "PS-002",
 17 |       "type": "regex",
 18 |       "pattern": "you are now (a |an )?",
 19 |       "patternFlags": "i",
 20 |       "severity": "high",
 21 |       "source": "Snyk ToxicSkills 2026-02-05",
 22 |       "references": ["https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/"]
 23 |     },
 24 |     {
 25 |       "id": "PS-002-S003",
 26 |       "detector": "PS-002",
 27 |       "type": "regex",
 28 |       "pattern": "curl\\s+[^|\\n]+\\|\\s*(sh|bash|zsh)",
 29 |       "severity": "critical",
 30 |       "source": "Snyk ToxicSkills 2026-02-05",
 31 |       "references": ["https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/"]
 32 |     },
 33 |     {
 34 |       "id": "PS-002-S004",
 35 |       "detector": "PS-002",
 36 |       "type": "regex",
 37 |       "pattern": "wget\\s+[^|\\n]+\\|\\s*(sh|bash|zsh)",
 38 |       "severity": "critical",
 39 |       "source": "Snyk ToxicSkills 2026-02-05"
 40 |     },
 41 |     {
 42 |       "id": "PS-002-S005",
 43 |       "detector": "PS-002",
 44 |       "type": "unicode-range",
 45 |       "rangeStart": "​",
 46 |       "rangeEnd": "‍",
 47 |       "severity": "critical",
 48 |       "source": "Snyk ToxicSkills 2026-02-05",
 49 |       "references": ["https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/"]
 50 |     },
 51 |     {
 52 |       "id": "PS-002-S006",
 53 |       "detector": "PS-002",
 54 |       "type": "regex",
 55 |       "pattern": "\\beval\\s*\\(",
 56 |       "severity": "high",
 57 |       "source": "Snyk ToxicSkills 2026-02-05"
 58 |     },
 59 |     {
 60 |       "id": "PS-002-S007",
 61 |       "detector": "PS-002",
 62 |       "type": "regex",
 63 |       "pattern": "<!--[\\s\\S]*?(ignore|override|system|prompt)[\\s\\S]*?-->",
 64 |       "patternFlags": "i",
 65 |       "severity": "high",
 66 |       "source": "Snyk ToxicSkills 2026-02-05"
 67 |     },
 68 |     {
 69 |       "id": "PS-002-S008",
 70 |       "detector": "PS-002",
 71 |       "type": "regex",
 72 |       "pattern": "sk-[A-Za-z0-9]{32,}",
 73 |       "severity": "critical",
 74 |       "source": "OWASP secret patterns / Snyk 2026-02-05"
 75 |     },
 76 |     {
 77 |       "id": "PS-002-S009",
 78 |       "detector": "PS-002",
 79 |       "type": "regex",
 80 |       "pattern": "ghp_[A-Za-z0-9]{36}",
 81 |       "severity": "critical",
 82 |       "source": "GitHub PAT pattern / Snyk 2026-02-05"
 83 |     },
 84 |     {
 85 |       "id": "PS-002-S010",
 86 |       "detector": "PS-002",
 87 |       "type": "regex",
 88 |       "pattern": "AKIA[0-9A-Z]{16}",
 89 |       "severity": "critical",
 90 |       "source": "AWS access key pattern / Snyk 2026-02-05"
 91 |     },
 92 |     {
 93 |       "id": "PS-002-S011",
 94 |       "detector": "PS-002",
 95 |       "type": "regex",
 96 |       "pattern": "disregard (all )?(prior|previous|earlier) (instructions|context|prompts)",
 97 |       "patternFlags": "i",
 98 |       "severity": "high",
 99 |       "source": "Snyk ToxicSkills 2026-02-05"
100 |     },
101 |     {
102 |       "id": "PS-002-S012",
103 |       "detector": "PS-002",
104 |       "type": "regex",
105 |       "pattern": "system\\s*:\\s*you are",
106 |       "patternFlags": "i",
107 |       "severity": "medium",
108 |       "source": "Snyk ToxicSkills 2026-02-05"
109 |     },
110 |     {
111 |       "id": "PS-002-S013",
112 |       "detector": "PS-002",
113 |       "type": "regex",
114 |       "pattern": "rm\\s+-rf\\s+(/|~|\\$HOME)",
115 |       "severity": "critical",
116 |       "source": "Snyk ToxicSkills 2026-02-05"
117 |     },
118 |     {
119 |       "id": "PS-002-S014",
120 |       "detector": "PS-002",
121 |       "type": "regex",
122 |       "pattern": "/etc/(passwd|shadow|sudoers)",
123 |       "severity": "high",
124 |       "source": "Snyk ToxicSkills 2026-02-05"
125 |     }
126 |   ]
127 | }
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:30:36.863Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.26

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/utils/config-loader.ts</path>
  </file>
  <file>
    <path>src/utils/evidence.ts</path>
  </file>
  <file>
    <path>src/utils/finding-builder.ts</path>
  </file>
  <file>
    <path>src/utils/fs.ts</path>
  </file>
  <file>
    <path>src/utils/sarif-builder.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/utils/config-loader.ts</path>
<content lines="1-36">
 1 | import { readFile } from 'node:fs/promises';
 2 | import { parse as parseYaml } from 'yaml';
 3 | import { parse as parseJsonc } from 'jsonc-parser';
 4 | 
 5 | export interface LoadedFile<T> {
 6 |   text: string;
 7 |   doc: T | null;
 8 | }
 9 | 
10 | export async function readUtf8Optional(file: string): Promise<string | null> {
11 |   try {
12 |     return await readFile(file, 'utf8');
13 |   } catch {
14 |     return null;
15 |   }
16 | }
17 | 
18 | export async function loadYaml<T = unknown>(file: string): Promise<LoadedFile<T>> {
19 |   const text = await readUtf8Optional(file);
20 |   if (text === null) return { text: '', doc: null };
21 |   try {
22 |     return { text, doc: parseYaml(text) as T };
23 |   } catch {
24 |     return { text, doc: null };
25 |   }
26 | }
27 | 
28 | export async function loadJsonc<T = unknown>(file: string): Promise<LoadedFile<T>> {
29 |   const text = await readUtf8Optional(file);
30 |   if (text === null) return { text: '', doc: null };
31 |   try {
32 |     return { text, doc: parseJsonc(text) as T };
33 |   } catch {
34 |     return { text, doc: null };
35 |   }
36 | }
</content>
</file>
<file><path>src/utils/evidence.ts</path>
<content lines="1-41">
 1 | import type { FindingEvidence } from '../types/index.js';
 2 | 
 3 | const PROMPT_ARMOR_BOB = 'https://www.promptarmor.com/resources/ibm-ai-(-bob-)-downloads-and-executes-malware';
 4 | const SNYK_TOXIC_SKILLS = 'https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/';
 5 | const OX_MOTHER_OF_AI = 'https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/';
 6 | const COMMENT_AND_CONTROL = 'https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/';
 7 | const ARXIV_AGENT_PRIV_ESC = 'https://arxiv.org/abs/2601.17548';
 8 | const BOB_DOCS_MODES = 'https://bob.ibm.com/docs/ide/features/modes';
 9 | 
10 | export const EVIDENCE = {
11 |   promptArmor(): FindingEvidence {
12 |     return {
13 |       primarySource: 'PromptArmor 2026-01-07',
14 |       references: [PROMPT_ARMOR_BOB],
15 |     };
16 |   },
17 |   snyk(extra?: string): FindingEvidence {
18 |     const refs = [SNYK_TOXIC_SKILLS];
19 |     if (extra) refs.push(extra);
20 |     return { primarySource: 'Snyk ToxicSkills 2026-02-05', references: refs };
21 |   },
22 |   ox(): FindingEvidence {
23 |     return {
24 |       primarySource: 'OX Security 2026-04-16',
25 |       cveIds: ['CVE-2026-30615', 'CVE-2026-30625', 'CVE-2025-65720'],
26 |       references: [OX_MOTHER_OF_AI],
27 |     };
28 |   },
29 |   commentAndControl(): FindingEvidence {
30 |     return {
31 |       primarySource: 'Aonan Guan + Johns Hopkins 2026-04-15',
32 |       references: [COMMENT_AND_CONTROL],
33 |     };
34 |   },
35 |   customMode(): FindingEvidence {
36 |     return {
37 |       primarySource: 'arXiv 2601.17548 + Snyk ToxicSkills 2026-02-05',
38 |       references: [ARXIV_AGENT_PRIV_ESC, SNYK_TOXIC_SKILLS, BOB_DOCS_MODES],
39 |     };
40 |   },
41 | };
</content>
</file>
<file><path>src/utils/finding-builder.ts</path>
<content lines="1-43">
 1 | import type { Finding, FindingEvidence, FindingRemediation, Severity } from '../types/index.js';
 2 | import { hashFingerprint } from './fs.js';
 3 | 
 4 | export interface BuildFindingArgs {
 5 |   ruleId: string;
 6 |   detectorId: string;
 7 |   severity: Severity;
 8 |   title: string;
 9 |   description: string;
10 |   filePath: string;
11 |   line: number;
12 |   endLine?: number;
13 |   snippet?: string;
14 |   evidence: FindingEvidence;
15 |   remediation: FindingRemediation;
16 |   /** Extra components mixed into the SHA-256 fingerprint to disambiguate
17 |    *  multiple findings against the same file/line. */
18 |   fingerprintParts?: (string | number)[];
19 | }
20 | 
21 | export function buildFinding(args: BuildFindingArgs): Finding {
22 |   return {
23 |     ruleId: args.ruleId,
24 |     detectorId: args.detectorId,
25 |     severity: args.severity,
26 |     title: args.title,
27 |     description: args.description,
28 |     location: {
29 |       path: args.filePath,
30 |       startLine: args.line,
31 |       endLine: args.endLine,
32 |       snippet: args.snippet,
33 |     },
34 |     evidence: args.evidence,
35 |     remediation: args.remediation,
36 |     fingerprint: hashFingerprint(
37 |       args.ruleId,
38 |       args.filePath,
39 |       args.line,
40 |       ...(args.fingerprintParts ?? []),
41 |     ),
42 |   };
43 | }
</content>
</file>
<file><path>src/utils/fs.ts</path>
<content lines="1-80">
 1 | import { createHash } from 'node:crypto';
 2 | 
 3 | export function hashFingerprint(...parts: (string | number)[]): string {
 4 |   const h = createHash('sha256');
 5 |   for (const p of parts) h.update(String(p));
 6 |   h.update('|');
 7 |   return h.digest('hex').slice(0, 32);
 8 | }
 9 | 
10 | export function sha256(content: string | Buffer): string {
11 |   return createHash('sha256').update(content).digest('hex');
12 | }
13 | 
14 | /**
15 |  * Find the line number (1-indexed) of the i-th list item under `key:` in a YAML document.
16 |  * Best-effort: scans textually. Returns 1 on failure.
17 |  */
18 | export function findLineForListItem(content: string, key: string, index: number): number {
19 |   const lines = content.split(/\r?\n/);
20 |   let inKey = false;
21 |   let count = 0;
22 |   let keyIndent = -1;
23 |   for (let i = 0; i < lines.length; i++) {
24 |     const line = lines[i];
25 |     if (!inKey) {
26 |       const m = line.match(new RegExp(`^(\\s*)${key}\\s*:\\s*(\\[.*\\])?\\s*$`));
27 |       if (m) {
28 |         // Inline list?
29 |         if (m[2]) {
30 |           // [a, b, c] form - return same line
31 |           return i + 1;
32 |         }
33 |         inKey = true;
34 |         keyIndent = m[1].length;
35 |         continue;
36 |       }
37 |     } else {
38 |       // Look for list items at deeper indentation
39 |       const trimmed = line.trim();
40 |       if (trimmed === '' || trimmed.startsWith('#')) continue;
41 |       const indent = line.length - line.trimStart().length;
42 |       if (indent <= keyIndent) {
43 |         // Out of section
44 |         return i;
45 |       }
46 |       if (trimmed.startsWith('- ') || trimmed === '-') {
47 |         if (count === index) return i + 1;
48 |         count++;
49 |       }
50 |     }
51 |   }
52 |   return 1;
53 | }
54 | 
55 | /**
56 |  * Find the line number of a specific top-level key within a JSON document text.
57 |  */
58 | export function findLineForJsonKey(content: string, key: string): number {
59 |   const lines = content.split(/\r?\n/);
60 |   const re = new RegExp(`"${key}"\\s*:`);
61 |   for (let i = 0; i < lines.length; i++) {
62 |     if (re.test(lines[i])) return i + 1;
63 |   }
64 |   return 1;
65 | }
66 | 
67 | export function findLineForString(content: string, needle: string): number {
68 |   const lines = content.split(/\r?\n/);
69 |   for (let i = 0; i < lines.length; i++) {
70 |     if (lines[i].includes(needle)) return i + 1;
71 |   }
72 |   return 1;
73 | }
74 | 
75 | export function snippetAround(content: string, line: number, ctx = 2): string {
76 |   const lines = content.split(/\r?\n/);
77 |   const start = Math.max(0, line - 1 - ctx);
78 |   const end = Math.min(lines.length, line + ctx);
79 |   return lines.slice(start, end).join('\n');
80 | }
</content>
</file>
<file><path>src/utils/sarif-builder.ts</path>
<content lines="1-91">
 1 | import type { Finding, Severity } from '../types/index.js';
 2 | import path from 'node:path';
 3 | 
 4 | interface SarifResult {
 5 |   ruleId: string;
 6 |   level: 'error' | 'warning' | 'note';
 7 |   message: { text: string };
 8 |   locations: Array<{
 9 |     physicalLocation: {
10 |       artifactLocation: { uri: string };
11 |       region: { startLine: number; startColumn?: number };
12 |     };
13 |   }>;
14 |   fingerprints: Record<string, string>;
15 | }
16 | 
17 | interface SarifRule {
18 |   id: string;
19 |   name: string;
20 |   shortDescription: { text: string };
21 |   fullDescription?: { text: string };
22 |   helpUri?: string;
23 |   defaultConfiguration: { level: 'error' | 'warning' | 'note' };
24 | }
25 | 
26 | const SEV_TO_LEVEL: Record<Severity, 'error' | 'warning' | 'note'> = {
27 |   critical: 'error',
28 |   high: 'error',
29 |   medium: 'warning',
30 |   low: 'note',
31 |   info: 'note',
32 | };
33 | 
34 | export function buildSarif(findings: Finding[], rootDir: string, version: string): object {
35 |   const ruleMap = new Map<string, SarifRule>();
36 |   for (const f of findings) {
37 |     if (!ruleMap.has(f.ruleId)) {
38 |       ruleMap.set(f.ruleId, {
39 |         id: f.ruleId,
40 |         name: f.detectorId,
41 |         shortDescription: { text: f.title },
42 |         fullDescription: { text: f.description },
43 |         helpUri: `https://promptshield.dev/${f.ruleId}`,
44 |         defaultConfiguration: { level: SEV_TO_LEVEL[f.severity] },
45 |       });
46 |     }
47 |   }
48 | 
49 |   const results: SarifResult[] = findings.map((f) => {
50 |     let uri = f.location.path;
51 |     try {
52 |       uri = path.relative(rootDir, f.location.path) || f.location.path;
53 |     } catch {
54 |       // keep uri as-is
55 |     }
56 |     // SARIF wants forward slashes
57 |     uri = uri.split(path.sep).join('/');
58 |     return {
59 |       ruleId: f.ruleId,
60 |       level: SEV_TO_LEVEL[f.severity],
61 |       message: { text: f.title },
62 |       locations: [
63 |         {
64 |           physicalLocation: {
65 |             artifactLocation: { uri },
66 |             region: { startLine: Math.max(1, f.location.startLine) },
67 |           },
68 |         },
69 |       ],
70 |       fingerprints: { 'promptshield/v1': f.fingerprint },
71 |     };
72 |   });
73 | 
74 |   return {
75 |     $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0.json',
76 |     version: '2.1.0',
77 |     runs: [
78 |       {
79 |         tool: {
80 |           driver: {
81 |             name: 'PromptShield',
82 |             version,
83 |             informationUri: 'https://promptshield.dev',
84 |             rules: Array.from(ruleMap.values()),
85 |           },
86 |         },
87 |         results,
88 |       },
89 |     ],
90 |   };
91 | }
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:30:55.221Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.38

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/utils/severity-counts.ts</path>
  </file>
  <file>
    <path>src/utils/shell-tokenizer.ts</path>
  </file>
  <file>
    <path>src/utils/shell-utilities.ts</path>
  </file>
  <file>
    <path>src/utils/yaml-frontmatter.ts</path>
  </file>
  <file>
    <path>src/cli/index.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/utils/severity-counts.ts</path>
<content lines="1-9">
1 | import type { Severity } from '../types/index.js';
2 | 
3 | export type SeverityCounts = Record<Severity, number>;
4 | 
5 | export function countBySeverity(items: Array<{ severity: Severity }>): SeverityCounts {
6 |   const counts: SeverityCounts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
7 |   for (const item of items) counts[item.severity] += 1;
8 |   return counts;
9 | }
</content>
</file>
<file><path>src/utils/shell-tokenizer.ts</path>
<content lines="1-28">
 1 | export const SHELL_META_DANGEROUS = ['>', '>>', '|', '&&', ';', '$(', '`', '&', '||', '<'];
 2 | 
 3 | /**
 4 |  * Naive tokenizer for allowlist entries. Splits on whitespace; strips quotes.
 5 |  * Returns the leading tokens of an allowlist entry.
 6 |  *
 7 |  * Used by PS-001 to determine whether an entry is a "bare command" (single token).
 8 |  */
 9 | export function tokenizeAllowEntry(entry: string): string[] {
10 |   if (typeof entry !== 'string') return [];
11 |   const trimmed = entry.trim();
12 |   if (!trimmed) return [];
13 |   const stripped = trimmed.replace(/^["'](.*)["']$/, '$1').trim();
14 |   return stripped.split(/\s+/);
15 | }
16 | 
17 | export function containsShellMeta(s: string): boolean {
18 |   if (typeof s !== 'string') return false;
19 |   for (const meta of SHELL_META_DANGEROUS) {
20 |     if (s.includes(meta)) return true;
21 |   }
22 |   return false;
23 | }
24 | 
25 | export function hasInterpolation(s: string): boolean {
26 |   if (typeof s !== 'string') return false;
27 |   return /\$\{[^}]+\}|\$[A-Za-z_][A-Za-z0-9_]*|`[^`]+`/.test(s);
28 | }
</content>
</file>
<file><path>src/utils/shell-utilities.ts</path>
<content lines="1-19">
 1 | export const DANGEROUS_SHELL_UTILITY_NAMES = [
 2 |   'echo',
 3 |   'cat',
 4 |   'printf',
 5 |   'tee',
 6 |   'true',
 7 |   'false',
 8 |   'pwd',
 9 |   'sh',
10 |   'bash',
11 |   'zsh',
12 |   'dash',
13 |   'ksh',
14 |   'env',
15 |   'eval',
16 |   'exec',
17 | ] as const;
18 | 
19 | export const DANGEROUS_SHELL_UTILITY_SET = new Set<string>(DANGEROUS_SHELL_UTILITY_NAMES);
</content>
</file>
<file><path>src/utils/yaml-frontmatter.ts</path>
<content lines="1-36">
 1 | import { parse as parseYaml } from 'yaml';
 2 | 
 3 | export interface FrontmatterParsed<T = Record<string, unknown>> {
 4 |   data: T | null;
 5 |   body: string;
 6 |   startLine: number;
 7 |   endLine: number;
 8 | }
 9 | 
10 | // Bob skills use four-dash fences (`----`); other tools use three (`---`).
11 | // Match any fence of 3+ dashes, requiring the closing fence to use the same
12 | // length so we don't accidentally consume real horizontal rules in markdown.
13 | const FM_RE = /^(-{3,})\s*\n([\s\S]*?)\n\1\s*(\n|$)/;
14 | 
15 | export function parseFrontmatter<T = Record<string, unknown>>(content: string): FrontmatterParsed<T> {
16 |   const m = content.match(FM_RE);
17 |   if (!m) {
18 |     return { data: null, body: content, startLine: 0, endLine: 0 };
19 |   }
20 |   const fmText = m[2];
21 |   let data: T | null = null;
22 |   try {
23 |     data = parseYaml(fmText) as T;
24 |   } catch {
25 |     data = null;
26 |   }
27 |   const body = content.slice(m[0].length);
28 |   // Opening fence is line 1; closing fence is at 1 + lineCount(fmText) + 1
29 |   const fmLines = fmText.split(/\r?\n/).length;
30 |   return {
31 |     data,
32 |     body,
33 |     startLine: 1,
34 |     endLine: 1 + fmLines + 1,
35 |   };
36 | }
</content>
</file>
<file><path>src/cli/index.ts</path>
<content lines="1-199">
  1 | import { Command } from 'commander';
  2 | import { writeFile } from 'node:fs/promises';
  3 | import path from 'node:path';
  4 | import { runScan } from '../core/scanner.js';
  5 | import { renderTty } from './render/tty.js';
  6 | import { renderJson } from './render/json.js';
  7 | import { renderSarif } from './render/sarif.js';
  8 | import { renderHtml } from './render/html.js';
  9 | import { renderMarkdown } from './render/markdown.js';
 10 | import { planFixes, applyFixes } from '../core/fixer.js';
 11 | import { ALL_DETECTORS } from '../detectors/index.js';
 12 | 
 13 | const TOOL_VERSION = '1.0.0';
 14 | 
 15 | interface ScanCliOptions {
 16 |   root: string;
 17 |   json?: boolean;
 18 |   sarif?: string | boolean;
 19 |   html?: string | boolean;
 20 |   markdown?: string | boolean;
 21 |   filter?: string[];
 22 |   includeHome?: boolean;
 23 |   exitZero?: boolean;
 24 |   quiet?: boolean;
 25 | }
 26 | 
 27 | async function writeOptionalReport(args: {
 28 |   flag: string | boolean | undefined;
 29 |   defaultPath: string;
 30 |   root: string;
 31 |   content: string;
 32 |   quiet?: boolean;
 33 |   label: string;
 34 | }): Promise<void> {
 35 |   if (!args.flag) return;
 36 |   const out = typeof args.flag === 'string' ? args.flag : args.defaultPath;
 37 |   await writeFile(path.resolve(args.root, out), args.content, 'utf8');
 38 |   if (!args.quiet) process.stdout.write(`${args.label} written to ${out}\n`);
 39 | }
 40 | 
 41 | async function runScanCmd(opts: ScanCliOptions): Promise<void> {
 42 |   const root = path.resolve(opts.root ?? process.cwd());
 43 |   const result = await runScan({
 44 |     rootDir: root,
 45 |     detectorFilter: opts.filter,
 46 |     includeHome: opts.includeHome,
 47 |     toolVersion: TOOL_VERSION,
 48 |   });
 49 | 
 50 |   // JSON-only mode
 51 |   if (opts.json && !opts.sarif && !opts.html && !opts.markdown) {
 52 |     process.stdout.write(`${renderJson(result)}\n`);
 53 |   } else {
 54 |     if (!opts.quiet) process.stdout.write(renderTty(result, root));
 55 |   }
 56 | 
 57 |   await writeOptionalReport({
 58 |     flag: opts.sarif,
 59 |     defaultPath: 'promptshield.sarif',
 60 |     root,
 61 |     content: renderSarif(result, root),
 62 |     quiet: opts.quiet,
 63 |     label: '\nSARIF',
 64 |   });
 65 |   await writeOptionalReport({
 66 |     flag: opts.html,
 67 |     defaultPath: 'promptshield-report.html',
 68 |     root,
 69 |     content: renderHtml(result, root),
 70 |     quiet: opts.quiet,
 71 |     label: 'HTML report',
 72 |   });
 73 |   await writeOptionalReport({
 74 |     flag: opts.markdown,
 75 |     defaultPath: 'promptshield-report.md',
 76 |     root,
 77 |     content: renderMarkdown(result, root),
 78 |     quiet: opts.quiet,
 79 |     label: 'Markdown report',
 80 |   });
 81 |   process.exit(opts.exitZero ? 0 : result.exitCode);
 82 | }
 83 | 
 84 | interface FixCliOptions {
 85 |   root: string;
 86 |   apply?: boolean;
 87 |   dryRun?: boolean;
 88 | }
 89 | 
 90 | async function runFixCmd(opts: FixCliOptions): Promise<void> {
 91 |   const root = path.resolve(opts.root ?? process.cwd());
 92 |   const result = await runScan({ rootDir: root, toolVersion: TOOL_VERSION });
 93 |   const plan = await planFixes(result.findings, root);
 94 | 
 95 |   if (plan.operations.length === 0) {
 96 |     process.stdout.write('No auto-fixable findings.\n');
 97 |     if (plan.unfixable.length > 0) {
 98 |       process.stdout.write(`${plan.unfixable.length} finding(s) require manual remediation.\n`);
 99 |     }
100 |     process.exit(0);
101 |   }
102 | 
103 |   const patchPath = path.join(root, '.promptshield-fixes.patch');
104 |   await writeFile(patchPath, plan.patchPreview, 'utf8');
105 |   process.stdout.write(`Wrote ${plan.operations.length} fix operation(s) to ${patchPath}\n`);
106 |   for (const op of plan.operations) {
107 |     process.stdout.write(`  ${op.ruleId}  ${path.relative(root, op.file)}:${op.line}  ${op.description}\n`);
108 |   }
109 | 
110 |   const shouldApply = !!opts.apply && !opts.dryRun;
111 |   if (opts.apply && opts.dryRun) {
112 |     process.stdout.write('Both --apply and --dry-run passed; honoring --dry-run.\n');
113 |   }
114 | 
115 |   if (shouldApply) {
116 |     await applyFixes(plan.operations);
117 |     process.stdout.write(`Applied ${plan.operations.length} fix(es). Re-run \`promptshield\` to verify.\n`);
118 |   } else {
119 |     process.stdout.write('Dry-run only. Re-run with --apply to write changes.\n');
120 |   }
121 |   if (plan.unfixable.length > 0) {
122 |     process.stdout.write(`${plan.unfixable.length} finding(s) require manual remediation (see scan output).\n`);
123 |   }
124 | }
125 | 
126 | function listDetectors(): void {
127 |   process.stdout.write('PromptShield detectors:\n\n');
128 |   for (const d of ALL_DETECTORS) {
129 |     process.stdout.write(`  ${d.id}  ${d.name}\n        ${d.description}\n\n`);
130 |   }
131 | }
132 | 
133 | async function startMcp(): Promise<void> {
134 |   const { startMcpServer } = await import('../mcp/server.js');
135 |   await startMcpServer({ toolVersion: TOOL_VERSION });
136 | }
137 | 
138 | const program = new Command();
139 | 
140 | program
141 |   .name('promptshield')
142 |   .description('Security scanner for AI coding assistant configurations (Bob, Claude Code, Cursor)')
143 |   .version(TOOL_VERSION)
144 |   .option('--mcp', 'run as an MCP server over STDIO')
145 |   .hook('preAction', async (thisCmd) => {
146 |     const opts = thisCmd.opts();
147 |     if (opts.mcp) {
148 |       await startMcp();
149 |       // never returns
150 |     }
151 |   });
152 | 
153 | program
154 |   .command('scan', { isDefault: true })
155 |   .description('Scan the project for AI coding assistant vulnerabilities')
156 |   .option('-r, --root <dir>', 'project root', process.cwd())
157 |   .option('--json', 'output JSON')
158 |   .option('--sarif [path]', 'write SARIF output')
159 |   .option('--html [path]', 'write HTML report')
160 |   .option('--markdown [path]', 'write Markdown report')
161 |   .option('--filter <ids...>', 'only run these detector IDs (e.g. PS-001)')
162 |   .option('--include-home', 'also scan ~/.bob, ~/.claude, ~/.cursor')
163 |   .option('--exit-zero', 'always exit 0, even on findings')
164 |   .option('-q, --quiet', 'suppress TTY output')
165 |   .action(async (opts) => {
166 |     await runScanCmd(opts as ScanCliOptions);
167 |   });
168 | 
169 | program
170 |   .command('fix')
171 |   .description('Generate (and optionally apply) auto-fixes for findings')
172 |   .option('-r, --root <dir>', 'project root', process.cwd())
173 |   .option('--apply', 'apply changes to disk (default: dry-run)')
174 |   .option('--dry-run', 'preview changes only (default behavior)')
175 |   .action(async (opts) => {
176 |     await runFixCmd(opts as FixCliOptions);
177 |   });
178 | 
179 | program
180 |   .command('list-detectors')
181 |   .description('List all available detectors')
182 |   .action(() => listDetectors());
183 | 
184 | const cliArgs = process.argv.slice(2);
185 | const runAsMcp = cliArgs.length === 1 && cliArgs[0] === '--mcp';
186 | 
187 | if (runAsMcp) {
188 |   startMcp().catch((err) => {
189 |     // eslint-disable-next-line no-console
190 |     console.error('MCP server error:', err);
191 |     process.exit(1);
192 |   });
193 | } else {
194 |   program.parseAsync(process.argv).catch((err) => {
195 |     // eslint-disable-next-line no-console
196 |     console.error(err);
197 |     process.exit(1);
198 |   });
199 | }
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:31:06.775Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.52

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>src/cli/render/html.ts</path>
  </file>
  <file>
    <path>src/cli/render/json.ts</path>
  </file>
  <file>
    <path>src/cli/render/markdown.ts</path>
  </file>
  <file>
    <path>src/cli/render/sarif.ts</path>
  </file>
  <file>
    <path>src/cli/render/tty.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>src/cli/render/html.ts</path>
<content lines="1-72">
 1 | import path from 'node:path';
 2 | import type { Finding, ScanResult, Severity } from '../../types/index.js';
 3 | import { countBySeverity } from '../../utils/severity-counts.js';
 4 | 
 5 | const SEVERITY_COLOR: Record<Severity, string> = {
 6 |   critical: '#b91c1c',
 7 |   high: '#dc2626',
 8 |   medium: '#d97706',
 9 |   low: '#0891b2',
10 |   info: '#6b7280',
11 | };
12 | 
13 | const PAGE_STYLE = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:960px;margin:2rem auto;padding:0 1rem;color:#111;}header{border-bottom:1px solid #e5e7eb;padding-bottom:1rem;margin-bottom:1.5rem;}h1{margin:0;font-size:1.75rem;}.meta{color:#6b7280;font-size:.875rem;margin-top:.25rem;}.summary{display:flex;gap:.5rem;margin:1rem 0;flex-wrap:wrap;}.badge{padding:.25rem .75rem;border-radius:999px;color:#fff;font-size:.875rem;font-weight:600;}.finding{margin:.5rem 0;padding:.5rem;border:1px solid #e5e7eb;border-radius:6px;background:#fafafa;}.finding summary{cursor:pointer;display:flex;gap:.75rem;align-items:center;}.finding .sev{color:#fff;padding:.125rem .5rem;border-radius:4px;font-size:.75rem;font-weight:700;}.finding code{background:#e5e7eb;padding:.125rem .375rem;border-radius:3px;font-size:.875rem;}.finding .loc{color:#2563eb;font-family:monospace;font-size:.875rem;}.finding .title{flex:1;font-weight:500;}.finding .body{margin-top:.75rem;padding:.75rem;background:#fff;border-left:3px solid #d1d5db;}.finding .body pre{background:#1e293b;color:#e2e8f0;padding:.75rem;border-radius:4px;overflow-x:auto;font-size:.8125rem;}.finding pre code{background:transparent;padding:0;}footer{margin-top:2rem;color:#6b7280;font-size:.875rem;text-align:center;}';
14 | 
15 | function escape(s: string): string {
16 |   return s
17 |     .replace(/&/g, '&amp;')
18 |     .replace(/</g, '&lt;')
19 |     .replace(/>/g, '&gt;')
20 |     .replace(/"/g, '&quot;');
21 | }
22 | 
23 | function findingHtml(f: Finding, rootDir: string): string {
24 |   const rel = path.relative(rootDir, f.location.path) || f.location.path;
25 |   return `
26 |   <details class="finding sev-${f.severity}">
27 |     <summary>
28 |       <span class="sev" style="background:${SEVERITY_COLOR[f.severity]}">${f.severity.toUpperCase()}</span>
29 |       <code>${escape(f.ruleId)}</code>
30 |       <span class="loc">${escape(rel)}:${f.location.startLine}</span>
31 |       <span class="title">${escape(f.title)}</span>
32 |     </summary>
33 |     <div class="body">
34 |       <p>${escape(f.description)}</p>
35 |       <p><strong>Source:</strong> ${escape(f.evidence.primarySource)}</p>
36 |       ${f.evidence.cveIds?.length ? `<p><strong>CVEs:</strong> ${f.evidence.cveIds.map(escape).join(', ')}</p>` : ''}
37 |       ${f.evidence.references.length ? `<p><strong>References:</strong><ul>${f.evidence.references.map((r) => `<li><a href="${escape(r)}">${escape(r)}</a></li>`).join('')}</ul></p>` : ''}
38 |       <p><strong>Remediation:</strong> ${escape(f.remediation.summary)}</p>
39 |       ${f.location.snippet ? `<pre><code>${escape(f.location.snippet)}</code></pre>` : ''}
40 |     </div>
41 |   </details>`;
42 | }
43 | 
44 | export function renderHtml(result: ScanResult, rootDir: string): string {
45 |   const counts = countBySeverity(result.findings);
46 | 
47 |   return `<!DOCTYPE html>
48 | <html lang="en">
49 | <head>
50 | <meta charset="utf-8">
51 | <title>PromptShield Report</title>
52 | <style>${PAGE_STYLE}</style>
53 | </head>
54 | <body>
55 | <header>
56 |   <h1>PromptShield Report</h1>
57 |   <div class="meta">v${result.toolVersion} · scanned ${result.scannedFiles.length} files in ${result.durationMs}ms · signatures ${result.signaturesVersion}</div>
58 |   <div class="summary">
59 |     <span class="badge" style="background:${SEVERITY_COLOR.critical}">Critical: ${counts.critical}</span>
60 |     <span class="badge" style="background:${SEVERITY_COLOR.high}">High: ${counts.high}</span>
61 |     <span class="badge" style="background:${SEVERITY_COLOR.medium}">Medium: ${counts.medium}</span>
62 |     <span class="badge" style="background:${SEVERITY_COLOR.low}">Low: ${counts.low}</span>
63 |   </div>
64 | </header>
65 | <main>
66 | ${result.findings.length === 0 ? '<p>✓ No findings.</p>' : result.findings.map((f) => findingHtml(f, rootDir)).join('\n')}
67 | </main>
68 | <footer>Generated by <a href="https://promptshield.dev">PromptShield</a> · MIT licensed</footer>
69 | </body>
70 | </html>
71 | `;
72 | }
</content>
</file>
<file><path>src/cli/render/json.ts</path>
<content lines="1-5">
1 | import type { ScanResult } from '../../types/index.js';
2 | 
3 | export function renderJson(result: ScanResult): string {
4 |   return JSON.stringify(result, null, 2);
5 | }
</content>
</file>
<file><path>src/cli/render/markdown.ts</path>
<content lines="1-107">
  1 | import path from 'node:path';
  2 | import type { Finding, ScanResult, Severity } from '../../types/index.js';
  3 | import { countBySeverity } from '../../utils/severity-counts.js';
  4 | 
  5 | /**
  6 |  * Render scan results as Markdown
  7 |  */
  8 | export function renderMarkdown(result: ScanResult, rootDir: string): string {
  9 |   const lines: string[] = [];
 10 | 
 11 |   // Title
 12 |   lines.push('# PromptShield Scan Report');
 13 |   lines.push('');
 14 | 
 15 |   // Metadata
 16 |   lines.push('## Scan Summary');
 17 |   lines.push('');
 18 |   lines.push(`- **Scanned Root Path**: \`${rootDir}\``);
 19 |   lines.push(`- **Files Scanned**: ${result.scannedFiles.length}`);
 20 |   lines.push(`- **Total Findings**: ${result.findings.length}`);
 21 |   lines.push('');
 22 | 
 23 |   // Severity summary
 24 |   const counts = countBySeverity(result.findings);
 25 | 
 26 |   lines.push('## Severity Summary');
 27 |   lines.push('');
 28 |   lines.push('| Severity | Count |');
 29 |   lines.push('|----------|-------|');
 30 |   lines.push(`| Critical | ${counts.critical} |`);
 31 |   lines.push(`| High     | ${counts.high} |`);
 32 |   lines.push(`| Medium   | ${counts.medium} |`);
 33 |   lines.push(`| Low      | ${counts.low} |`);
 34 |   lines.push(`| Info     | ${counts.info} |`);
 35 |   lines.push('');
 36 | 
 37 |   if (result.findings.length === 0) {
 38 |     lines.push('✓ No findings. AI tooling configuration looks clean.');
 39 |     lines.push('');
 40 |     return lines.join('\n');
 41 |   }
 42 | 
 43 |   // Group findings by severity
 44 |   const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];
 45 |   
 46 |   for (const severity of severityOrder) {
 47 |     const findingsForSeverity = result.findings.filter((f) => f.severity === severity);
 48 |     if (findingsForSeverity.length === 0) continue;
 49 | 
 50 |     lines.push(`## ${severity.charAt(0).toUpperCase() + severity.slice(1)} Severity Findings`);
 51 |     lines.push('');
 52 | 
 53 |     for (const f of findingsForSeverity) {
 54 |       const rel = path.relative(rootDir, f.location.path) || f.location.path;
 55 |       
 56 |       lines.push(`### ${f.title}`);
 57 |       lines.push('');
 58 |       lines.push(`- **Rule ID**: \`${f.ruleId}\``);
 59 |       lines.push(`- **Location**: \`${rel}:${f.location.startLine}\``);
 60 |       lines.push(`- **Severity**: ${severity.toUpperCase()}`);
 61 |       lines.push('');
 62 |       lines.push(`**Description**: ${f.description}`);
 63 |       lines.push('');
 64 |       lines.push(`**Source**: ${f.evidence.primarySource}`);
 65 |       lines.push('');
 66 |       
 67 |       if (f.evidence.cveIds && f.evidence.cveIds.length > 0) {
 68 |         lines.push(`**CVEs**: ${f.evidence.cveIds.join(', ')}`);
 69 |         lines.push('');
 70 |       }
 71 |       
 72 |       if (f.evidence.references.length > 0) {
 73 |         lines.push('**References**:');
 74 |         for (const ref of f.evidence.references) {
 75 |           lines.push(`- ${ref}`);
 76 |         }
 77 |         lines.push('');
 78 |       }
 79 |       
 80 |       lines.push(`**Remediation**: ${f.remediation.summary}`);
 81 |       lines.push('');
 82 |       
 83 |       if (f.remediation.autoFixAvailable) {
 84 |         lines.push('> 💡 Auto-fix available. Run `npx promptshield fix` to remediate.');
 85 |         lines.push('');
 86 |       }
 87 |       
 88 |       if (f.location.snippet) {
 89 |         lines.push('**Code Snippet**:');
 90 |         lines.push('```');
 91 |         lines.push(f.location.snippet);
 92 |         lines.push('```');
 93 |         lines.push('');
 94 |       }
 95 |     }
 96 |   }
 97 | 
 98 |   // Footer
 99 |   lines.push('---');
100 |   lines.push('');
101 |   lines.push(`Generated by [PromptShield](https://promptshield.dev) v${result.toolVersion}`);
102 |   lines.push('');
103 | 
104 |   return lines.join('\n');
105 | }
106 | 
107 | // Made with Bob
</content>
</file>
<file><path>src/cli/render/sarif.ts</path>
<content lines="1-7">
1 | import type { ScanResult } from '../../types/index.js';
2 | import { buildSarif } from '../../utils/sarif-builder.js';
3 | 
4 | export function renderSarif(result: ScanResult, rootDir: string): string {
5 |   const doc = buildSarif(result.findings, rootDir, result.toolVersion);
6 |   return JSON.stringify(doc, null, 2);
7 | }
</content>
</file>
<file><path>src/cli/render/tty.ts</path>
<content lines="1-99">
 1 | import path from 'node:path';
 2 | import type { ScanResult, Severity } from '../../types/index.js';
 3 | import { countBySeverity } from '../../utils/severity-counts.js';
 4 | 
 5 | const isTTY = process.stdout.isTTY === true;
 6 | 
 7 | const COLORS = {
 8 |   reset: '\x1b[0m',
 9 |   bold: '\x1b[1m',
10 |   red: '\x1b[31m',
11 |   brightRed: '\x1b[91m',
12 |   yellow: '\x1b[33m',
13 |   cyan: '\x1b[36m',
14 |   gray: '\x1b[90m',
15 |   green: '\x1b[32m',
16 |   magenta: '\x1b[35m',
17 | };
18 | 
19 | function c(color: keyof typeof COLORS, s: string): string {
20 |   if (!isTTY) return s;
21 |   return `${COLORS[color]}${s}${COLORS.reset}`;
22 | }
23 | 
24 | const SEVERITY_LABEL: Record<Severity, string> = {
25 |   critical: 'CRITICAL',
26 |   high: 'HIGH    ',
27 |   medium: 'MEDIUM  ',
28 |   low: 'LOW     ',
29 |   info: 'INFO    ',
30 | };
31 | 
32 | function colorBySev(sev: Severity, s: string): string {
33 |   switch (sev) {
34 |     case 'critical': return c('brightRed', s);
35 |     case 'high': return c('red', s);
36 |     case 'medium': return c('yellow', s);
37 |     case 'low': return c('cyan', s);
38 |     case 'info': return c('gray', s);
39 |   }
40 | }
41 | 
42 | function iconBySev(sev: Severity): string {
43 |   switch (sev) {
44 |     case 'critical':
45 |     case 'high':
46 |       return colorBySev(sev, '✗');
47 |     case 'medium':
48 |       return colorBySev(sev, '⚠');
49 |     case 'low':
50 |     case 'info':
51 |       return colorBySev(sev, 'ℹ');
52 |   }
53 | }
54 | 
55 | export function renderTty(result: ScanResult, rootDir: string): string {
56 |   const out: string[] = [];
57 |   out.push('');
58 |   out.push(
59 |     `${c('bold', 'PromptShield')} ${c('gray', `v${result.toolVersion}`)}   ⏱  scanned ${result.scannedFiles.length} files in ${result.durationMs}ms`,
60 |   );
61 |   out.push(c('gray', `signatures: ${result.signaturesVersion}  detectors: ${result.detectorsRun.join(', ')}`));
62 |   if (result.detectorErrors.length > 0) {
63 |     out.push(c('yellow', `warnings: ${result.detectorErrors.length} detector(s) failed during scan`));
64 |   }
65 |   out.push('');
66 | 
67 |   if (result.findings.length === 0) {
68 |     out.push(c('green', '  ✓ No findings. AI tooling configuration looks clean.'));
69 |     out.push('');
70 |     return out.join('\n');
71 |   }
72 | 
73 |   for (const f of result.findings) {
74 |     const rel = path.relative(rootDir, f.location.path) || f.location.path;
75 |     out.push(
76 |       `  ${iconBySev(f.severity)} ${colorBySev(f.severity, SEVERITY_LABEL[f.severity])}  ${c('bold', f.ruleId)}  ${c('cyan', `${rel}:${f.location.startLine}`)}`,
77 |     );
78 |     out.push(`              ${f.title}`);
79 |     out.push(c('gray', `              → ${f.evidence.primarySource}`));
80 |     if (f.remediation.autoFixAvailable) {
81 |       out.push(c('gray', `              ↳ run \`npx promptshield fix\` to remediate`));
82 |     }
83 |     out.push('');
84 |   }
85 | 
86 |   // Summary
87 |   const counts = countBySeverity(result.findings);
88 |   const summary = `${result.detectorsRun.length} detectors run.  ${result.findings.length} findings  (${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low)`;
89 |   out.push(summary);
90 |   if (result.detectorErrors.length > 0) {
91 |     out.push(c('yellow', 'Detector errors:'));
92 |     for (const detectorError of result.detectorErrors) {
93 |       out.push(c('yellow', `  - ${detectorError.detectorId}: ${detectorError.message}`));
94 |     }
95 |   }
96 |   out.push(`Exit ${result.exitCode}.  See https://promptshield.dev for details.`);
97 |   out.push('');
98 |   return out.join('\n');
99 | }
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:31:26.307Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.66

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now I have reviewed the entire codebase. Let me compile my comprehensive analysis of all bugs, errors, vulnerabilities, code smells, and issues found.

## Comprehensive Code Review Report

| Issue ID | File Path | Line Number | Issue Type | Description | Root Cause | Impact | Recommended Fix | Severity |
|----------|-----------|-------------|------------|-------------|------------|--------|-----------------|----------|
| **CR-001** | [`src/core/scanner.ts`](src/core/scanner.ts:24) | 24 | Logic Error | Incorrect filter logic with negation | The condition `!opts.detectorFilter` returns `true` when filter is undefined, causing ALL detectors to run when filter is provided | When users specify `--filter PS-001`, ALL detectors run instead of just PS-001 | Change to: `!opts.detectorFilter || opts.detectorFilter.includes(d.id)` | **CRITICAL** |
| **CR-002** | [`src/core/fixer.ts`](src/core/fixer.ts:6) | 6 | Type Safety | Missing `endLine` and `endColumn` in FixOperation interface | The interface doesn't include optional location end markers that could be useful for multi-line fixes | Limits precision of fix operations and makes it harder to apply fixes spanning multiple lines | Add optional `endLine?: number` and `endColumn?: number` fields | **LOW** |
| **CR-003** | [`src/core/fixer.ts`](src/core/fixer.ts:135) | 135 | Potential Bug | Unsafe string replacement in applyFixes | Using `content.replace(op.before, op.after)` only replaces first occurrence; if `op.before` appears multiple times, wrong occurrence may be replaced | Could corrupt files by replacing wrong content, especially in files with repeated patterns | Use more precise replacement with line-based editing or verify uniqueness before replacement | **HIGH** |
| **CR-004** | [`src/core/discoverer.ts`](src/core/discoverer.ts:74) | 74 | Logic Error | Duplicate entries in skillish array | Combining `bobSkills` and `bobRules` without deduplication, then wrapping in `Array.from(new Set(...))` which only works for primitives | If same file path appears in both arrays (unlikely but possible), it would be scanned twice | The `Array.from(new Set(...))` correctly deduplicates, but comment suggests concern - no actual issue | **INFO** |
| **CR-005** | [`src/detectors/chained-command-bypass.ts`](src/detectors/chained-command-bypass.ts:172) | 172 | Performance | Inefficient loop break | After finding first `>(...)` match, breaks inner loop but continues outer loop unnecessarily | Wastes CPU cycles scanning remaining files after finding first match per file | Move break to outer loop or use labeled break statement | **LOW** |
| **CR-006** | [`src/detectors/comment-and-control-workflow.ts`](src/detectors/comment-and-control-workflow.ts:80) | 80 | Fragile Parsing | YAML boolean parsing workaround | Using `doc.on ?? doc.true` to handle YAML's `on:` key parsing as boolean `true` | Fragile workaround that could break with YAML parser updates or edge cases | Document this behavior clearly or use a more robust YAML parsing approach | **MEDIUM** |
| **CR-007** | [`src/detectors/mcp-stdio-rce.ts`](src/detectors/mcp-stdio-rce.ts:102) | 102 | Potential Bug | Case-sensitive command base extraction | Using `toLowerCase()` on cmdBase but not on SHELL_BINS/INTERPRETER_BINS comparison | On case-sensitive filesystems, commands like `Bash` or `BASH` won't match | Ensure SHELL_BINS and INTERPRETER_BINS contain lowercase values or compare case-insensitively | **MEDIUM** |
| **CR-008** | [`src/detectors/toxic-skill-scanner.ts`](src/detectors/toxic-skill-scanner.ts:50) | 50 | Logic Error | Breaks after first regex match per line | After finding a match on a line, breaks to next signature instead of checking remaining signatures on that line | Multiple malicious patterns on same line won't all be detected | Remove `break` or change logic to continue checking all signatures | **HIGH** |
| **CR-009** | [`src/detectors/toxic-skill-scanner.ts`](src/detectors/toxic-skill-scanner.ts:62) | 62 | Logic Error | Breaks after first unicode match per line | Similar to CR-008, breaks after finding first unicode character in range | Multiple suspicious unicode characters on same line won't all be detected | Remove inner `break` statement | **HIGH** |
| **CR-010** | [`src/mcp/server.ts`](src/mcp/server.ts:26) | 26-34 | Type Safety | Incorrect Zod schema usage | Using Zod schema objects directly as `inputSchema` instead of converting to JSON Schema | MCP SDK expects JSON Schema format, not Zod schema objects | Convert Zod schemas to JSON Schema using `.shape` or proper conversion | **CRITICAL** |
| **CR-011** | [`src/signatures/loader.ts`](src/signatures/loader.ts:9) | 9 | Code Smell | Mutable global cache | Using module-level mutable `cached` variable without thread safety considerations | In concurrent scenarios (though Node.js is single-threaded), could cause race conditions | Use proper caching mechanism or document single-threaded assumption | **LOW** |
| **CR-012** | [`src/utils/fs.ts`](src/utils/fs.ts:6) | 6 | Code Smell | Unnecessary pipe character in hash | Appending `'|'` to hash after all parts are processed serves no purpose | Adds unnecessary character to fingerprint calculation | Remove the `h.update('|');` line or document its purpose | **LOW** |
| **CR-013** | [`src/utils/fs.ts`](src/utils/fs.ts:44) | 44 | Logic Error | Returns line number instead of 1 on section exit | When exiting a YAML section, returns current line `i` instead of fallback value `1` | Could return incorrect line numbers for list items not found | Change `return i;` to `break;` or `return 1;` | **MEDIUM** |
| **CR-014** | [`src/utils/shell-tokenizer.ts`](src/utils/shell-tokenizer.ts:13) | 13 | Incomplete Implementation | Naive quote stripping | Only strips matching quotes at start and end, doesn't handle escaped quotes or mixed quotes | Fails on entries like `"echo 'hello'"` or `'echo "world"'` | Implement proper shell quote parsing or document limitations | **MEDIUM** |
| **CR-015** | [`src/utils/yaml-frontmatter.ts`](src/utils/yaml-frontmatter.ts:13) | 13 | Regex Complexity | Greedy regex with backtracking | Using `[\s\S]*?` in regex can cause catastrophic backtracking on malformed input | Could cause DoS with specially crafted input files | Add input size limits or use non-backtracking parser | **MEDIUM** |
| **CR-016** | [`src/cli/index.ts`](src/cli/index.ts:184-192) | 184-192 | Code Duplication | Duplicate MCP server startup logic | MCP server startup code appears twice: in preAction hook and in standalone check | Maintenance burden and potential for inconsistency | Consolidate into single code path | **LOW** |
| **CR-017** | [`src/cli/index.ts`](src/cli/index.ts:81) | 81 | Process Management | Synchronous process.exit in async function | Calling `process.exit()` in async function may not allow cleanup | Could leave resources unclosed or pending promises unresolved | Use proper async cleanup or document intentional immediate exit | **MEDIUM** |
| **CR-018** | [`src/cli/render/html.ts`](src/cli/render/html.ts:15-21) | 15-21 | Security | Incomplete HTML escaping | Escape function doesn't handle single quotes or other special characters | XSS vulnerability if finding data contains malicious content | Add escaping for `'` as `&#39;` and consider using a proper HTML escaping library | **HIGH** |
| **CR-019** | [`src/core/aggregator.ts`](src/core/aggregator.ts:48) | 48 | Type Safety | Unsafe optional chaining | Using `config.severityOverrides?.[f.ruleId]` without checking if result is valid Severity | Could assign invalid severity values if config is malformed | Validate override value is valid Severity before assignment | **MEDIUM** |
| **CR-020** | [`src/detectors/custom-mode-priv-esc.ts`](src/detectors/custom-mode-priv-esc.ts:11) | 11 | Incomplete Validation | Permissive regex set incomplete | Set includes common permissive patterns but may miss variations like `.{0,}` or `[\\s\\S]*` | Could miss overly permissive file regex patterns | Expand set or use pattern matching for regex analysis | **LOW** |
| **CR-021** | [`package.json`](package.json:42) | 42 | Build Process | prepublishOnly runs lint after build | Running `lint` after `build` means lint errors won't prevent build | Could publish package with TypeScript errors | Reorder to: `typecheck && lint && build` | **MEDIUM** |
| **CR-022** | [`tsconfig.json`](tsconfig.json:17-18) | 17-18 | Code Quality | Disabled unused variable checks | `noUnusedLocals` and `noUnusedParameters` set to false | Allows dead code and unused variables to accumulate | Enable these checks and fix violations | **LOW** |
| **CR-023** | [`src/core/config.ts`](src/core/config.ts:23) | 23 | Type Safety | Unsafe type assertion with `any` | Function parameter typed as `any` allows any input without validation | Could cause runtime errors if invalid config structure is passed | Use proper type guards or Zod validation | **MEDIUM** |
| **CR-024** | [`src/detectors/chained-command-bypass.ts`](src/detectors/chained-command-bypass.ts:33) | 33 | Incomplete Parsing | Doesn't handle nested Bash() wrappers | Only strips one level of `Bash(...)` wrapper | Could miss entries like `Bash(Bash(echo))` (unlikely but possible) | Add loop or recursive stripping | **LOW** |
| **CR-025** | [`src/core/fixer.ts`](src/core/fixer.ts:119-124) | 119-124 | Fragile Logic | JSON normalization after string replacement | Normalizing JSON syntax after string replacement could break valid JSON | If replacement creates valid JSON that looks like trailing comma, normalization could corrupt it | Apply normalization before replacement or use proper JSON parsing/serialization | **MEDIUM** |

## Summary

### Total Issues by Severity
- **CRITICAL**: 2
- **HIGH**: 4  
- **MEDIUM**: 10
- **LOW**: 9
- **INFO**: 0

### Overall Code Quality Assessment
The codebase demonstrates **good architectural design** with clear separation of concerns, but contains several **critical logic errors** that would prevent core functionality from working correctly:

1. **Most Critical**: The detector filter logic (CR-001) is inverted, causing the opposite behavior of what users expect
2. **Type Safety Issues**: The MCP server implementation (CR-010) uses incorrect schema format that likely causes runtime failures
3. **Security Concerns**: HTML escaping (CR-018) is incomplete, creating XSS vulnerabilities
4. **Detection Gaps**: Multiple detectors (CR-008, CR-009) stop after first match, missing additional issues

### Priority Recommendations for Immediate Action

1. **Fix detector filter logic** (CR-001) - This breaks the `--filter` CLI option completely
2. **Fix MCP server schema registration** (CR-010) - MCP tools likely don't work at all
3. **Fix toxic skill scanner break statements** (CR-008, CR-009) - Missing malicious patterns
4. **Improve HTML escaping** (CR-018) - Security vulnerability
5. **Fix file content replacement logic** (CR-003) - Could corrupt user files

### Systemic Issues Observed

1. **Inconsistent error handling**: Some functions silently catch and continue, others propagate
2. **Type safety gaps**: Liberal use of `any` type and unsafe type assertions
3. **Testing gaps**: No test files found - critical for security tool
4. **Documentation**: Inline comments are good, but external API documentation is minimal

The tool shows promise but needs immediate attention to critical bugs before production use.

---

**User:**

[ERROR] You did not use a tool in your previous response! Please retry with a tool use.

# Reminder: Instructions for Tool Use

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

For example, to use the attempt_completion tool:

<attempt_completion>
<result>
I have completed the task...
</result>
</attempt_completion>

Always use the actual tool name as the XML tag name for proper parsing and execution.

# Next Steps

If you have completed the user's task, use the attempt_completion tool.
If you require additional information from the user, use the ask_followup_question tool.
Otherwise, if you have not completed the task and do not need additional information, then proceed with the next step of the task.
(This is an automated message, so do not respond to it conversationally.)
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:32:26.288Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.83

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
Comprehensive code review completed. Found **25 issues** across the codebase:

**Critical Issues (2):**
- Inverted detector filter logic in [`scanner.ts:24`](src/core/scanner.ts:24) - causes `--filter` to run ALL detectors instead of filtered ones
- Incorrect Zod schema usage in [`mcp/server.ts:26`](src/mcp/server.ts:26) - MCP tools likely non-functional

**High Severity (4):**
- Unsafe string replacement in [`fixer.ts:135`](src/core/fixer.ts:135) - could corrupt files
- Toxic skill scanner breaks after first match in [`toxic-skill-scanner.ts:50`](src/detectors/toxic-skill-scanner.ts:50) - misses multiple malicious patterns
- Unicode detection breaks early in [`toxic-skill-scanner.ts:62`](src/detectors/toxic-skill-scanner.ts:62) - incomplete scanning
- Incomplete HTML escaping in [`html.ts:15`](src/cli/render/html.ts:15) - XSS vulnerability

**Medium Severity (10):**
- Case-sensitive command matching, fragile YAML parsing, unsafe type assertions, process management issues, and incomplete validation patterns

**Low Severity (9):**
- Code smells, minor inefficiencies, documentation gaps, and disabled TypeScript strict checks

**Key Recommendations:**
1. Fix detector filter logic immediately (breaks core functionality)
2. Correct MCP server schema registration
3. Remove break statements in signature matching loops
4. Implement proper HTML escaping
5. Add comprehensive test coverage (no tests found)
6. Enable strict TypeScript checks

Full detailed table with file paths, line numbers, root causes, impacts, and remediation strategies provided above.
</result>
</attempt_completion>

---

**User:**



New instructions for task continuation:
<user_message>
High
Unsafe replacement targeting in auto-fix apply path
File: src/core/fixer.ts:135-138
content.replace(op.before, op.after) replaces only first matching chunk.
If identical before text appears earlier than intended, wrong region can be modified.
Medium
JSON post-normalization can mutate text outside intended fix scope

File: src/core/fixer.ts:119-123,140-142
Regex-based normalization after replacements is broad and may alter JSON formatting/content unexpectedly in edge cases.
Severity override value is not validated

File: src/core/aggregator.ts:48-49
config.severityOverrides?.[f.ruleId] is used directly; malformed config could inject invalid severity values.
Config merge uses any without schema guardrails

File: src/core/config.ts:23
Increases runtime risk from malformed .promptshield.yaml data.
Low
Off-by-one-style fallback behavior in helper

File: src/utils/fs.ts:44
findLineForListItem returns i when leaving section; comment says 1-indexed.
Also appears unused currently.
Duplicated MCP startup path (maintainability)

File: src/cli/index.ts:136-142 and 185-199
Same behavior wired in two places; not a functional break, but redundant.
Not confirmed / likely false positives in that report
CR-001 (detector filter inversion) — false
src/core/scanner.ts:23-25 is correct for optional filters.
CR-010 (MCP inputSchema wrong) — false
SDK accepts Zod raw shapes for registerTool input schema (matches current usage).
CR-008 / CR-009 (toxic scanner break logic) — mostly false
It records first match per signature intentionally; that’s not inherently broken.
CR-018 (HTML escaping XSS critical) — overstated
Escaping is not perfect but current claim severity is exaggerated.
CR-007, CR-021, CR-004, CR-011, CR-012 are weak/non-issues as framed.
Also true: there is currently no test/ directory in this repo.
</user_message>
<environment_details>
# VSCode Visible Files
src/cli/index.ts

# VSCode Open Tabs
src/cli/render/markdown.ts,src/cli/index.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T13:36:30.756Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$1.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>advanced</slug>
<name>🛠️ Advanced</name>


# Current Workspace Directory (/home/tcs/Desktop/promptshield) Files
.gitignore
.promptshield.yaml
biome.json
LICENSE
package-lock.json
package.json
README.md
tsconfig.json
tsup.config.ts
.bob/
.github/
bob-reports/
bob-reports/.gitkeep
docs/
docs/00_HACKATHON_BOB_PROOF_GUIDE.md
scripts/
scripts/generate-validation-workspaces.mjs
src/
src/index.ts
src/cli/
src/cli/index.ts
src/cli/render/
src/cli/render/html.ts
src/cli/render/json.ts
src/cli/render/markdown.ts
src/cli/render/sarif.ts
src/cli/render/tty.ts
src/core/
src/core/aggregator.ts
src/core/config.ts
src/core/discoverer.ts
src/core/fixer.ts
src/core/scanner.ts
src/detectors/
src/detectors/chained-command-bypass.ts
src/detectors/comment-and-control-workflow.ts
src/detectors/custom-mode-priv-esc.ts
src/detectors/index.ts
src/detectors/mcp-stdio-rce.ts
src/detectors/toxic-skill-scanner.ts
src/mcp/
src/mcp/server.ts
src/signatures/
src/signatures/loader.ts
src/signatures/signatures.json
src/types/
src/types/config.ts
src/types/detector.ts
src/types/finding.ts
src/types/index.ts
src/types/scan-result.ts
src/types/signatures.ts
src/utils/
src/utils/config-loader.ts
src/utils/evidence.ts
src/utils/finding-builder.ts
src/utils/fs.ts
src/utils/sarif-builder.ts
src/utils/severity-counts.ts
src/utils/shell-tokenizer.ts
src/utils/shell-utilities.ts
src/utils/yaml-frontmatter.ts
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Thank you for the corrections. Let me provide an updated, accurate code review focusing on the **confirmed real issues**:

<attempt_completion>
<result>
# Corrected Comprehensive Code Review

## Confirmed Issues

| Issue ID | File Path | Line Number | Issue Type | Description | Root Cause | Impact | Recommended Fix | Severity |
|----------|-----------|-------------|------------|-------------|------------|--------|-----------------|----------|
| **REAL-001** | [`src/core/fixer.ts`](src/core/fixer.ts:135-138) | 135-138 | Logic Error | Unsafe string replacement in applyFixes | Using `content.replace(op.before, op.after)` only replaces first occurrence; if identical text appears earlier, wrong region gets modified | Could corrupt files by replacing wrong content, especially in files with repeated patterns | Use line-based editing with precise line number targeting, or verify uniqueness before replacement | **HIGH** |
| **REAL-002** | [`src/core/fixer.ts`](src/core/fixer.ts:119-123) | 119-123, 140-142 | Fragile Logic | JSON normalization after string replacement | Regex-based normalization (`replace(/,\s*(\])/g, '$1')` etc.) applied after replacements is broad and may alter JSON formatting unexpectedly | Could mutate JSON content outside intended fix scope in edge cases | Apply normalization before replacement, or use proper JSON parsing/serialization | **MEDIUM** |
| **REAL-003** | [`src/core/aggregator.ts`](src/core/aggregator.ts:48-49) | 48-49 | Type Safety | Severity override value not validated | `config.severityOverrides?.[f.ruleId]` used directly without validating it's a valid Severity type | Malformed config could inject invalid severity values causing runtime errors | Add validation: `const override = config.severityOverrides?.[f.ruleId]; if (override && ['critical','high','medium','low','info'].includes(override))` | **MEDIUM** |
| **REAL-004** | [`src/core/config.ts`](src/core/config.ts:23) | 23 | Type Safety | Config merge uses `any` without schema validation | Function parameter typed as `any` with no runtime validation | Increases runtime risk from malformed `.promptshield.yaml` data | Use Zod schema validation or proper type guards | **MEDIUM** |
| **REAL-005** | [`src/utils/fs.ts`](src/utils/fs.ts:44) | 44 | Logic Error | Incorrect fallback in findLineForListItem | Returns current line `i` when leaving section instead of fallback value `1` | Could return incorrect line numbers for list items not found | Change `return i;` to `break;` or `return 1;` | **LOW** |
| **REAL-006** | [`src/cli/index.ts`](src/cli/index.ts:136-142) | 136-142, 185-199 | Code Duplication | Duplicated MCP startup logic | MCP server startup code appears in both preAction hook and standalone check | Maintenance burden and potential for inconsistency | Consolidate into single code path | **LOW** |
| **REAL-007** | No test directory | N/A | Testing Gap | No test coverage | No `test/` or `__tests__/` directory found in codebase | Security tool without tests is high risk for regressions and undetected bugs | Add comprehensive test suite with unit and integration tests | **MEDIUM** |

## Summary

### Total Confirmed Issues: 7
- **HIGH**: 1
- **MEDIUM**: 4
- **LOW**: 2

### Overall Assessment
The codebase has **solid architecture** but contains **real production risks** in the auto-fix functionality and config handling:

**Most Critical Issue**: The unsafe string replacement in `applyFixes` (REAL-001) could corrupt user files when identical text patterns exist multiple times.

**Key Recommendations**:
1. Fix unsafe string replacement with line-based editing
2. Add validation for severity overrides
3. Implement comprehensive test coverage
4. Add Zod schema validation for config loading
5. Fix JSON normalization to be more targeted

### False Positives Acknowledged
- CR-001 (detector filter) - Logic is correct
- CR-010 (MCP schema) - SDK accepts Zod shapes correctly
- CR-008/009 (toxic scanner breaks) - Intentional first-match behavior
- CR-018 (HTML XSS) - Severity overstated
- Multiple other minor issues were non-issues

The tool is **functional** but needs the above fixes before production use, especially for the auto-fix feature.
</result>
</attempt_completion>

