export type EvidenceSource = 'source' | 'documentation' | 'test' | 'observation' | 'assumption';

export interface EvidenceRecord {
  id: string;
  source: EvidenceSource;
  description: string;
  reference?: string;
  confidence: number;
  schemaVersion: number;
}

export const EVIDENCE_SCHEMA_VERSION = 1;