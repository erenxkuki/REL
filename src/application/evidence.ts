import type { EvidenceRecord } from '../domain/evidence.js';
import { EVIDENCE_SCHEMA_VERSION } from '../domain/evidence.js';
import { randomUUID } from 'node:crypto';

export function makeEvidence(source: EvidenceRecord['source'], description: string, reference?: string, confidence = 1): EvidenceRecord {
  return { id: randomUUID(), source, description, reference, confidence, schemaVersion: EVIDENCE_SCHEMA_VERSION };
}
