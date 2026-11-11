import { describe, it, expect } from 'vitest';
import { lookupApi, apisForContext } from '../src/application/robloxApi.js';
import { analyzeModuleDependencies } from '../src/application/moduleDependencies.js';

describe('roblox', () => {
  it('looks up API', () => {
    const r = lookupApi('Instance.new');
    expect(r).toBeTruthy();
    expect(r?.availability).toContain('client');
  });
  it('ServerStorage not available on client', () => {
    const clientApis = apisForContext('client').map((a) => a.name);
    expect(clientApis).not.toContain('ServerStorage');
  });
  it('extracts module dependencies', () => {
    const src = "local m = require('SharedModule')\nlocal s = require('Util')";
    const r = analyzeModuleDependencies(src);
    expect(r.requires.length).toBeGreaterThan(0);
  });
});