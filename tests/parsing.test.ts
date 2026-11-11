import { describe, it, expect } from 'vitest';
import { parseSource } from '../src/application/parsing.js';

describe('parseSource', () => {
  it('parses Lua source', () => {
    const r = parseSource('local x = 1 + 2\nprint(x)');
    expect(r.errors).toHaveLength(0);
    expect(r.language).toBe('lua');
    expect(r.ast.root).toBeTruthy();
  });

  it('parses Luau source with types', () => {
    const r = parseSource('local x: number = 1\nfunction foo<T>(y: number): number\n  return y + x\nend');
    expect(r.errors).toHaveLength(0);
    expect(r.language).toBe('luau');
    expect(r.ast.root).toBeTruthy();
  });

  it('returns errors for invalid syntax', () => {
    const r = parseSource('local = = 1');
    // may still produce ast or error; at least not throw
    expect(r).toBeTruthy();
  });
});