import { describe, it, expect } from 'vitest';
import { EvidenceStore } from '../src/application/evidenceStore.js';

describe('EvidenceStore', () => {
  it('adds and lists records', () => {
    const store = new EvidenceStore();
    const rec = store.add('source', 'finding', 'ref', 0.9);
    expect(store.get(rec.id)).toBeTruthy();
    expect(store.list()).toHaveLength(1);
    expect(rec.schemaVersion).toBe(1);
  });
});