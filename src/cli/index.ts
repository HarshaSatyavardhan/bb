import { Command } from 'commander';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { runScan } from '../core/scanner.js';
import { renderTty } from './render/tty.js';
import { renderJson } from './render/json.js';
import { renderSarif } from './render/sarif.js';
import { renderHtml } from './render/html.js';
import { renderMarkdown } from './render/markdown.js';
import { planFixes, applyFixes } from '../core/fixer.js';
import { ALL_DETECTORS } from '../detectors/index.js';

const TOOL_VERSION = '1.0.0';

interface ScanCliOptions {
  root: string;
  json?: boolean;
  sarif?: string | boolean;
  html?: string | boolean;
  markdown?: string | boolean;
  filter?: string[];
  includeHome?: boolean;
  exitZero?: boolean;
  quiet?: boolean;
}

async function writeOptionalReport(args: {
  flag: string | boolean | undefined;
  defaultPath: string;
  root: string;
  content: string;
  quiet?: boolean;
  label: string;
}): Promise<void> {
  if (!args.flag) return;
  const out = typeof args.flag === 'string' ? args.flag : args.defaultPath;
  await writeFile(path.resolve(args.root, out), args.content, 'utf8');
  if (!args.quiet) process.stdout.write(`${args.label} written to ${out}\n`);
}

async function runScanCmd(opts: ScanCliOptions): Promise<void> {
  const root = path.resolve(opts.root ?? process.cwd());
  const result = await runScan({
    rootDir: root,
    detectorFilter: opts.filter,
    includeHome: opts.includeHome,
    toolVersion: TOOL_VERSION,
  });

  // JSON-only mode
  if (opts.json && !opts.sarif && !opts.html && !opts.markdown) {
    process.stdout.write(`${renderJson(result)}\n`);
  } else {
    if (!opts.quiet) process.stdout.write(renderTty(result, root));
  }

  await writeOptionalReport({
    flag: opts.sarif,
    defaultPath: 'promptshield.sarif',
    root,
    content: renderSarif(result, root),
    quiet: opts.quiet,
    label: '\nSARIF',
  });
  await writeOptionalReport({
    flag: opts.html,
    defaultPath: 'promptshield-report.html',
    root,
    content: renderHtml(result, root),
    quiet: opts.quiet,
    label: 'HTML report',
  });
  await writeOptionalReport({
    flag: opts.markdown,
    defaultPath: 'promptshield-report.md',
    root,
    content: renderMarkdown(result, root),
    quiet: opts.quiet,
    label: 'Markdown report',
  });
  process.exit(opts.exitZero ? 0 : result.exitCode);
}

interface FixCliOptions {
  root: string;
  apply?: boolean;
  dryRun?: boolean;
}

async function runFixCmd(opts: FixCliOptions): Promise<void> {
  const root = path.resolve(opts.root ?? process.cwd());
  const result = await runScan({ rootDir: root, toolVersion: TOOL_VERSION });
  const plan = await planFixes(result.findings, root);

  if (plan.operations.length === 0) {
    process.stdout.write('No auto-fixable findings.\n');
    if (plan.unfixable.length > 0) {
      process.stdout.write(`${plan.unfixable.length} finding(s) require manual remediation.\n`);
    }
    process.exit(0);
  }

  const patchPath = path.join(root, '.promptshield-fixes.patch');
  await writeFile(patchPath, plan.patchPreview, 'utf8');
  process.stdout.write(`Wrote ${plan.operations.length} fix operation(s) to ${patchPath}\n`);
  for (const op of plan.operations) {
    process.stdout.write(`  ${op.ruleId}  ${path.relative(root, op.file)}:${op.line}  ${op.description}\n`);
  }

  const shouldApply = !!opts.apply && !opts.dryRun;
  if (opts.apply && opts.dryRun) {
    process.stdout.write('Both --apply and --dry-run passed; honoring --dry-run.\n');
  }

  if (shouldApply) {
    await applyFixes(plan.operations);
    process.stdout.write(`Applied ${plan.operations.length} fix(es). Re-run \`promptshield\` to verify.\n`);
  } else {
    process.stdout.write('Dry-run only. Re-run with --apply to write changes.\n');
  }
  if (plan.unfixable.length > 0) {
    process.stdout.write(`${plan.unfixable.length} finding(s) require manual remediation (see scan output).\n`);
  }
}

function listDetectors(): void {
  process.stdout.write('PromptShield detectors:\n\n');
  for (const d of ALL_DETECTORS) {
    process.stdout.write(`  ${d.id}  ${d.name}\n        ${d.description}\n\n`);
  }
}

async function startMcp(): Promise<void> {
  const { startMcpServer } = await import('../mcp/server.js');
  await startMcpServer({ toolVersion: TOOL_VERSION });
}

const program = new Command();

program
  .name('promptshield')
  .description('Security scanner for AI coding assistant configurations (Bob, Claude Code, Cursor)')
  .version(TOOL_VERSION);

program
  .command('scan', { isDefault: true })
  .description('Scan the project for AI coding assistant vulnerabilities')
  .option('-r, --root <dir>', 'project root', process.cwd())
  .option('--json', 'output JSON')
  .option('--sarif [path]', 'write SARIF output')
  .option('--html [path]', 'write HTML report')
  .option('--markdown [path]', 'write Markdown report')
  .option('--filter <ids...>', 'only run these detector IDs (e.g. PS-001)')
  .option('--include-home', 'also scan ~/.bob, ~/.claude, ~/.cursor')
  .option('--exit-zero', 'always exit 0, even on findings')
  .option('-q, --quiet', 'suppress TTY output')
  .action(async (opts) => {
    await runScanCmd(opts as ScanCliOptions);
  });

program
  .command('fix')
  .description('Generate (and optionally apply) auto-fixes for findings')
  .option('-r, --root <dir>', 'project root', process.cwd())
  .option('--apply', 'apply changes to disk (default: dry-run)')
  .option('--dry-run', 'preview changes only (default behavior)')
  .action(async (opts) => {
    await runFixCmd(opts as FixCliOptions);
  });

program
  .command('list-detectors')
  .description('List all available detectors')
  .action(() => listDetectors());

const cliArgs = process.argv.slice(2);
const runAsMcp = cliArgs.length === 1 && cliArgs[0] === '--mcp';

if (runAsMcp) {
  startMcp().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('MCP server error:', err);
    process.exit(1);
  });
} else {
  program.parseAsync(process.argv).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
