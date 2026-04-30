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
import { hashFingerprint, snippetAround } from '../utils/fs.js';

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
          break; // one hit per signature is enough for v1
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
    'Hashes and pattern-matches AI skill files against the Snyk ToxicSkills disclosure (Feb 2026).',
  async scan(ctx: DetectorContext): Promise<Finding[]> {
    const findings: Finding[] = [];
    const skillFiles = [
      ...ctx.discovery.bob.skillFiles,
      ...ctx.discovery.claude.skillFiles,
      ...ctx.discovery.cursor.rulesFiles,
    ];

    for (const file of skillFiles) {
      let content: string;
      try {
        content = await readFile(file, 'utf8');
      } catch {
        continue;
      }
      const fm = parseFrontmatter(content);

      // Pattern matches
      const matches = matchSignatures(content, ctx.signatures.signatures);
      for (const m of matches) {
        const severity: Severity = m.sig.severity ?? 'high';
        findings.push({
          ruleId: 'PS-002',
          detectorId: 'toxic-skill-scanner',
          severity,
          title: `Skill matches malicious-pattern signature ${m.sig.id}`,
          description: `Skill file matches signature "${m.sig.id}" (${m.sig.type}) sourced from ${m.sig.source}. Match excerpt: ${JSON.stringify(m.matchedText.slice(0, 80))}.`,
          location: {
            path: file,
            startLine: m.line,
            snippet: snippetAround(content, m.line),
          },
          evidence: {
            primarySource: m.sig.source,
            references: m.sig.references ?? [],
          },
          remediation: {
            summary: 'Manually review the flagged content. If untrusted, remove the skill or rename SKILL.md to SKILL.md.quarantined.',
            autoFixAvailable: false,
          },
          fingerprint: hashFingerprint('PS-002', file, m.line, m.sig.id),
        });
      }

      // Base64 in frontmatter
      const b64 = checkBase64Frontmatter(content, fm.endLine);
      if (b64) {
        findings.push({
          ruleId: 'PS-002',
          detectorId: 'toxic-skill-scanner',
          severity: 'high',
          title: `Suspicious base64 payload (${b64.len} chars) in skill frontmatter`,
          description: 'Long base64-encoded strings in skill YAML frontmatter are a known obfuscation channel for embedded payloads (Snyk ToxicSkills).',
          location: { path: file, startLine: b64.line },
          evidence: {
            primarySource: 'Snyk ToxicSkills 2026-02-05',
            references: ['https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/'],
          },
          remediation: { summary: 'Decode and inspect the base64 string. If obfuscated content, quarantine the skill.', autoFixAvailable: false },
          fingerprint: hashFingerprint('PS-002', file, b64.line, 'base64'),
        });
      }

      // Overbroad tools without fileRegex
      if (fm.data && checkOverbroadTools(fm.data)) {
        findings.push({
          ruleId: 'PS-002',
          detectorId: 'toxic-skill-scanner',
          severity: 'high',
          title: 'Skill declares Bash+Write+Read with no fileRegex restriction',
          description: 'Per Snyk ToxicSkills, agent skills inherit the full permissions of the agent. Declaring shell, write, and read tools without a narrow fileRegex creates a privileged exfil/RCE surface.',
          location: { path: file, startLine: 1 },
          evidence: {
            primarySource: 'Snyk ToxicSkills 2026-02-05',
            references: ['https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/'],
          },
          remediation: { summary: 'Add a narrow fileRegex (e.g. \\.ts$) and remove unused tools from allowed-tools.', autoFixAvailable: false },
          fingerprint: hashFingerprint('PS-002', file, 1, 'overbroad-tools'),
        });
      }
    }

    return findings;
  },
};

export default detector;
