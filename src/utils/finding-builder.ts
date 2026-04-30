import type { Finding, FindingEvidence, FindingRemediation, Severity } from '../types/index.js';
import { hashFingerprint } from './fs.js';

export interface BuildFindingArgs {
  ruleId: string;
  detectorId: string;
  severity: Severity;
  title: string;
  description: string;
  filePath: string;
  line: number;
  endLine?: number;
  snippet?: string;
  evidence: FindingEvidence;
  remediation: FindingRemediation;
  /** Extra components mixed into the SHA-256 fingerprint to disambiguate
   *  multiple findings against the same file/line. */
  fingerprintParts?: (string | number)[];
}

export function buildFinding(args: BuildFindingArgs): Finding {
  return {
    ruleId: args.ruleId,
    detectorId: args.detectorId,
    severity: args.severity,
    title: args.title,
    description: args.description,
    location: {
      path: args.filePath,
      startLine: args.line,
      endLine: args.endLine,
      snippet: args.snippet,
    },
    evidence: args.evidence,
    remediation: args.remediation,
    fingerprint: hashFingerprint(
      args.ruleId,
      args.filePath,
      args.line,
      ...(args.fingerprintParts ?? []),
    ),
  };
}
