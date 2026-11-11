import { describe, it, expect } from 'vitest';
import { buildReconstruction } from '../src/application/reconstruction.js';

describe('buildReconstruction', () => {
  it('produces markdown report', () => {
    const rep = buildReconstruction('local x = 1\nfunction foo() return x end');
    expect(rep.markdown).toContain('Reconstruction Report');
    expect(rep.components).toContain('foo');
    expect(rep.limitations.length).toBeGreaterThan(0);
  });
});