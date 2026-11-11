import { describe, it, expect } from 'vitest';
import { luaProfile, luauProfile, robloxProfile } from '../src/application/runtimeProfiles.js';

describe('runtimeProfiles', () => {
  it('creates lua 5.4 profile with const attrs', () => {
    const p = luaProfile('5.4');
    expect(p.capabilities.constAttrs).toBe(true);
    expect(p.language).toBe('lua');
  });
  it('creates luau profile', () => {
    const p = luauProfile();
    expect(p.capabilities.typeAnnotations).toBe(true);
  });
  it('creates roblox server profile with restrictions', () => {
    const p = robloxProfile('server');
    expect(p.restrictions.length).toBeGreaterThan(0);
  });
});