import { describe, it, expect } from 'vitest';
import { identifyLanguage } from '../src/application/languageIdentification.js';

describe('identifyLanguage', () => {
  it('detects Luau via type annotations', () => {
    const src = 'local x: number = 1\nprint(x)';
    const r = identifyLanguage(src);
    expect(r.language).toBe('luau');
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  it('detects Luau via continue', () => {
    const src = 'for i=1,10 do\n  if i==5 then continue end\nend';
    const r = identifyLanguage(src);
    expect(r.language).toBe('luau');
  });

  it('detects Lua 5.4 via <const>', () => {
    const src = 'local x <const> = 5\nprint(x)';
    const r = identifyLanguage(src);
    expect(r.language).toBe('lua');
    expect(r.version).toBe('5.4');
  });

  it('detects Lua 5.1 via setfenv', () => {
    const src = 'setfenv(1, {})\nprint("hi")';
    const r = identifyLanguage(src);
    expect(r.language).toBe('lua');
    expect(r.version).toBe('5.1');
  });

  it('does not assume 5.1 when ambiguous', () => {
    const src = 'print("hello")';
    const r = identifyLanguage(src);
    expect(r.language).toBe('lua');
    expect(r.version).toBeUndefined();
    expect(r.confidence).toBeLessThanOrEqual(0.5);
  });
});