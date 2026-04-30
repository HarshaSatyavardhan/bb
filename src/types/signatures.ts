import type { Severity } from './finding.js';

export interface RegexSignature {
  id: string;
  detector: string;
  type: 'regex';
  pattern: string;
  patternFlags?: string;
  severity: Severity;
  source: string;
  references?: string[];
  fixTemplateId?: string;
}

export interface UnicodeRangeSignature {
  id: string;
  detector: string;
  type: 'unicode-range';
  rangeStart: string;
  rangeEnd: string;
  severity: Severity;
  source: string;
  references?: string[];
}

export interface HashSignature {
  id: string;
  detector: string;
  type: 'sha256';
  hash: string;
  severity: Severity;
  source: string;
  references?: string[];
}

export type Signature = RegexSignature | UnicodeRangeSignature | HashSignature;

export interface SignatureDB {
  version: string;
  signatures: Signature[];
}
