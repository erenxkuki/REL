import type { EvidenceRecord, EvidenceSource } from '../domain/evidence.js';
import { EVIDENCE_SCHEMA_VERSION } from '../domain/evidence.js';
import { randomUUID } from 'node:crypto';

export class EvidenceStore {
  private records = new Map<string, EvidenceRecord>();

  add(source: EvidenceSource, description: string, reference?: string, confidence = 1): EvidenceRecord {
    const rec: EvidenceRecord = {
      id: randomUUID(),
      source,
      description,
      reference,
      confidence,
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
    };
    this.records.set(rec.id, rec);
    return rec;
  }

  get(id: string): EvidenceRecord | undefined {
    return this.records.get(id);
  }

  list(): EvidenceRecord[] {
    return [...this.records.values()];
  }

  clear(): void {
    this.records.clear();
  }
}
