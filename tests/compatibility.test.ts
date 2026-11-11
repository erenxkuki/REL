import { describe, it, expect } from 'vitest';
import { checkCompatibility } from '../src/application/compatibility.js';
import { luaProfile, luauProfile } from '../src/application/runtimeProfiles.js';

describe('checkCompatibility', () => {
  it('syntax compatible for valid lua on lua 5.4', () => {
    const r = checkCompatibility('local x = 1\nprint(x)', luaProfile('5.4'));
    expect(r.syntaxCompatible).toBe(true);
    expect(r.sourceLanguage).toBe('lua');
  });
  it('reports unsupported for Luau on Lua target', () => {
    const r = checkCompatibility('local x: number = 1', luaProfile('5.4'));
    expect(r.unsupportedFeatures.some((f) => /Luau/.test(f))).toBe(true);
    expect(r.syntaxCompatible).toBe(false);
  });
  it('keeps unverified dimensions unknown not green', () => {
    const r = checkCompatibility('local x = 1', luauProfile());
    expect(r.apiCompatible).toBe('unknown');
    expect(r.runtimeCompatible).toBe('unknown');
  });
  it('does not claim full compatibility', () => {
    const r = checkCompatibility('local x = 1', luaProfile('5.4'));
    expect(r.confidence).toBeLessThan(1);
  });
});