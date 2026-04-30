import { readFile } from 'node:fs/promises';
import type {
  Detector,
  DetectorContext,
  Finding,
  RegexSignature,
  Severity,
  Signature,
  UnicodeRangeSignature,
} from '../types/index.js';
import { parseFrontmatter } from '../utils/yaml-frontmatter.js';
import { snippetAround } from '../utils/fs.js';
import { buildFinding } from '../utils/finding-builder.js';
import { EVIDENCE } from '../utils/evidence.js';

const DETECTOR_ID = 'toxic-skill-scanner';

interface SignatureMatch {
  sig: Signature;
  line: number;
  matchedText: string;
}

function matchSignatures(content: string, signatures: Signature[]): SignatureMatch[] {
  const results: SignatureMatch[] = [];
  const lines = content.split(/\r?\n/);

  for (const sig of signatures) {
    if (sig.detector !== 'PS-002') continue;
    if (sig.type === 'regex') {
      const reSig = sig as RegexSignature;
      let re: RegExp;
      try {
        re = new RegExp(reSig.pattern, reSig.patternFlags ?? '');
      } catch {
        continue;
      }
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(re);
        if (m) {
          results.push({ sig, line: i + 1, matchedText: m[0] });
          break;
        }
      }
    } else if (sig.type === 'unicode-range') {
      const u = sig as UnicodeRangeSignature;
      const startCp = u.rangeStart.codePointAt(0) ?? 0;
      const endCp = u.rangeEnd.codePointAt(0) ?? 0;
      for (let i = 0; i < lines.length; i++) {
        for (const ch of lines[i]) {
          const cp = ch.codePointAt(0) ?? 0;
          if (cp >= startCp && cp <= endCp) {
            results.push({ sig, line: i + 1, matchedText: `U+${cp.toString(16).toUpperCase()}` });
            break;
          }
        }
      }
    }
  }
  return results;
}

function checkBase64Frontmatter(content: string, fmEnd: number): { line: number; len: number } | null {
  if (fmEnd === 0) return null;
  const lines = content.split(/\r?\n/).slice(0, fmEnd);
  const reB64 = /(?:^|\s)([A-Za-z0-9+/]{200,}={0,2})(?:\s|$)/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(reB64);
    if (m) return { line: i + 1, len: m[1].length };
  }
  return null;
}

function checkOverbroadTools(fm: any): boolean {
  const toolList = fm?.['allowed-tools'] ?? fm?.allowedTools ?? fm?.tools;
  if (!Array.isArray(toolList)) return false;
  const tools = toolList.map((t: any) => String(t).toLowerCase());
  const hasBash = tools.includes('bash') || tools.includes('shell') || tools.includes('execute');
  const hasWrite = tools.includes('write') || tools.includes('edit');
  const hasRead = tools.includes('read');
  if (hasBash && hasWrite && hasRead) {
    const fileRegex = fm?.fileRegex ?? fm?.file_regex;
    return !fileRegex || fileRegex === '.*' || fileRegex === '';
  }
  return false;
}

const detector: Detector = {
  id: 'PS-002',
  name: 'Toxic skill / supply-chain scanner',
  description:
    'Hashes and pattern-matches AI skill, rule, and customInstructions content against the Snyk ToxicSkills disclosure (Feb 2026).',

  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];

    // Bob skills + Bob rule files (rules-<slug>/*.md), Claude skills, Cursor rules
    const proseFiles = [
      ...ctx.discovery.bob.skillFiles,
      ...ctx.discovery.claude.skillFiles,
      ...ctx.discovery.cursor.rulesFiles,
    ];

    for (const file of proseFiles) {
      let content: string;
      try {
        content = await readFile(file, 'utf8');
      } catch { continue; }
      const fm = parseFrontmatter(content);

      // Pattern matches
      for (const m of matchSignatures(content, ctx.signatures.signatures)) {
        const severity: Severity = m.sig.severity ?? 'high';
        findings.push(buildFinding({
          ruleId: 'PS-002',
          detectorId: DETECTOR_ID,
          severity,
          title: `Skill matches malicious-pattern signature ${m.sig.id}`,
          description: `Skill or rule file matches signature "${m.sig.id}" (${m.sig.type}) sourced from ${m.sig.source}. Match excerpt: ${JSON.stringify(m.matchedText.slice(0, 80))}.`,
          filePath: file,
          line: m.line,
          snippet: snippetAround(content, m.line),
          evidence: EVIDENCE.snyk(m.sig.references?.[0]),
          remediation: {
            summary: 'Manually review the flagged content. If untrusted, remove the skill or rename SKILL.md to SKILL.md.quarantined.',
            autoFixAvailable: false,
          },
          fingerprintParts: [m.sig.id],
        }));
      }

      // Base64 in frontmatter
      const b64 = checkBase64Frontmatter(content, fm.endLine);
      if (b64) {
        findings.push(buildFinding({
          ruleId: 'PS-002',
          detectorId: DETECTOR_ID,
          severity: 'high',
          title: `Suspicious base64 payload (${b64.len} chars) in skill frontmatter`,
          description: 'Long base64-encoded strings in skill YAML frontmatter are a known obfuscation channel for embedded payloads (Snyk ToxicSkills).',
          filePath: file,
          line: b64.line,
          evidence: EVIDENCE.snyk(),
          remediation: { summary: 'Decode and inspect the base64 string. If obfuscated content, quarantine the skill.', autoFixAvailable: false },
          fingerprintParts: ['base64'],
        }));
      }

      // Claude skills sometimes declare overbroad allowed-tools without fileRegex
      if (fm.data && checkOverbroadTools(fm.data)) {
        findings.push(buildFinding({
          ruleId: 'PS-002',
          detectorId: DETECTOR_ID,
          severity: 'high',
          title: 'Skill declares Bash+Write+Read with no fileRegex restriction',
          description: 'Per Snyk ToxicSkills, agent skills inherit the full permissions of the agent. Declaring shell, write, and read tools without a narrow fileRegex creates a privileged exfil/RCE surface.',
          filePath: file,
          line: 1,
          evidence: EVIDENCE.snyk(),
          remediation: { summary: 'Add a narrow fileRegex (e.g. \\.ts$) and remove unused tools from allowed-tools.', autoFixAvailable: false },
          fingerprintParts: ['overbroad-tools'],
        }));
      }
    }

    // Also scan customInstructions blobs in Bob custom_modes.yaml — these are
    // free-text agent prompts and a known prompt-injection target.
    for (const modeFile of ctx.discovery.bob.modeFiles) {
      let content: string;
      try {
        content = await readFile(modeFile, 'utf8');
      } catch { continue; }
      // Scan the entire YAML file for malicious patterns; customInstructions
      // and roleDefinition are inside the doc, but textual scanning works.
      for (const m of matchSignatures(content, ctx.signatures.signatures)) {
        findings.push(buildFinding({
          ruleId: 'PS-002',
          detectorId: DETECTOR_ID,
          severity: m.sig.severity,
          title: `Custom mode file matches malicious-pattern signature ${m.sig.id}`,
          description: `Pattern "${m.sig.id}" (${m.sig.type}) found in a Bob custom_modes.yaml — likely embedded in customInstructions or roleDefinition.`,
          filePath: modeFile,
          line: m.line,
          snippet: snippetAround(content, m.line),
          evidence: EVIDENCE.snyk(),
          remediation: { summary: 'Review the customInstructions/roleDefinition block for prompt-injection content. Remove untrusted text.', autoFixAvailable: false },
          fingerprintParts: ['custom-mode', m.sig.id],
        }));
      }
    }

    return findings;
  },
};

export default detector;
