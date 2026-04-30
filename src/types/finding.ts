export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface SourceLocation {
  path: string;
  startLine: number;
  startCol?: number;
  endLine?: number;
  endCol?: number;
  snippet?: string;
}

export interface FindingEvidence {
  primarySource: string;
  cveIds?: string[];
  references: string[];
}

export interface FindingRemediation {
  summary: string;
  autoFixAvailable: boolean;
  suggestedPatch?: string;
}

export interface Finding {
  ruleId: string;
  detectorId: string;
  severity: Severity;
  title: string;
  description: string;
  location: SourceLocation;
  evidence: FindingEvidence;
  remediation: FindingRemediation;
  fingerprint: string;
}
