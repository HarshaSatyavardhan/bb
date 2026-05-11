import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { runScan } from '../core/scanner.js';
import { ALL_DETECTORS } from '../detectors/index.js';
import { planFixes, applyFixes } from '../core/fixer.js';

interface McpOptions {
  toolVersion: string;
}

export async function startMcpServer(opts: McpOptions): Promise<void> {
  const server = new McpServer(
    { name: 'promptshield', version: opts.toolVersion },
    { capabilities: { tools: {} } },
  );

  server.registerTool(
    'scan_project',
    {
      description: 'Scan a project directory for AI coding assistant vulnerabilities. Returns structured findings.',
      inputSchema: {
        rootDir: z.string().describe('Absolute path to the project root.'),
        detectors: z.array(z.string()).optional().describe('Filter to specific detector IDs (e.g. PS-001).'),
        includeHome: z.boolean().optional().describe('Also scan ~/.bob, ~/.claude, ~/.cursor.'),
      },
    },
    async ({ rootDir, detectors, includeHome }) => {
      const result = await runScan({
        rootDir,
        detectorFilter: detectors,
        includeHome,
        toolVersion: opts.toolVersion,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                findings: result.findings.map((f) => ({
                  ruleId: f.ruleId,
                  severity: f.severity,
                  title: f.title,
                  path: f.location.path,
                  line: f.location.startLine,
                  fingerprint: f.fingerprint,
                  source: f.evidence.primarySource,
                })),
                scannedFiles: result.scannedFiles.length,
                detectorsRun: result.detectorsRun,
                durationMs: result.durationMs,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    'list_detectors',
    {
      description: 'List all available PromptShield detectors with IDs, names, and source disclosures.',
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            ALL_DETECTORS.map((d) => ({ id: d.id, name: d.name, description: d.description })),
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerTool(
    'explain_finding',
    {
      description: 'Return a human-readable explanation and remediation for a finding by fingerprint.',
      inputSchema: {
        fingerprint: z.string().describe('Finding fingerprint from a previous scan_project call.'),
        rootDir: z.string().describe('Project root used in the original scan.'),
      },
    },
    async ({ fingerprint, rootDir }) => {
      const result = await runScan({ rootDir, toolVersion: opts.toolVersion });
      const finding = result.findings.find((f) => f.fingerprint === fingerprint);
      if (!finding) {
        return { content: [{ type: 'text', text: `No finding with fingerprint ${fingerprint}` }], isError: true };
      }
      return {
        content: [
          {
            type: 'text',
            text: [
              `# ${finding.ruleId}: ${finding.title}`,
              '',
              `**Severity:** ${finding.severity}`,
              `**File:** ${finding.location.path}:${finding.location.startLine}`,
              `**Source:** ${finding.evidence.primarySource}`,
              finding.evidence.cveIds?.length ? `**CVEs:** ${finding.evidence.cveIds.join(', ')}` : '',
              '',
              '## Description',
              finding.description,
              '',
              '## Remediation',
              finding.remediation.summary,
              '',
              '## References',
              ...finding.evidence.references.map((r) => `- ${r}`),
            ]
              .filter(Boolean)
              .join('\n'),
          },
        ],
      };
    },
  );

  server.registerTool(
    'apply_fix',
    {
      description: 'Plan and optionally apply auto-fixes for findings. Defaults to dry-run.',
      inputSchema: {
        rootDir: z.string(),
        apply: z.boolean().optional().describe('If true, write changes to disk. Default false (dry-run).'),
        includePatchPreview: z
          .boolean()
          .optional()
          .describe('If true, include remediation preview text in response. Default false.'),
      },
    },
    async ({ rootDir, apply, includePatchPreview }) => {
      const result = await runScan({ rootDir, toolVersion: opts.toolVersion });
      const plan = await planFixes(result.findings, rootDir);
      if (apply) await applyFixes(plan.operations);
      const response: {
        applied: boolean;
        operations: Array<{
          ruleId: string;
          file: string;
          line: number;
          description: string;
        }>;
        unfixableCount: number;
        patchFormat: 'preview';
        patchPreview?: string;
      } = {
        applied: !!apply,
        operations: plan.operations.map((op) => ({
          ruleId: op.ruleId,
          file: op.file,
          line: op.line,
          description: op.description,
        })),
        unfixableCount: plan.unfixable.length,
        patchFormat: plan.patchFormat,
      };
      if (includePatchPreview) {
        response.patchPreview = plan.patchPreview;
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
