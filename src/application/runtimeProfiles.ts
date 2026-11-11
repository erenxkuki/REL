import type { RuntimeProfile } from '../domain/runtimeProfile.js';

const baseCaps = { coroutines: true, modules: true, metatables: true };

export function luaProfile(version: '5.1' | '5.2' | '5.3' | '5.4'): RuntimeProfile {
  return {
    name: `Standard Lua ${version}`,
    identity: `lua-${version}` as any,
    language: 'lua',
    version,
    capabilities: { ...baseCaps, bitwise: version >= '5.3', goto: version >= '5.2', floorDivision: version >= '5.3', constAttrs: version === '5.4', closeAttrs: version === '5.4' },
    globals: ['_G', '_VERSION', 'print', 'type', 'pairs', 'ipairs', 'next', 'tostring', 'tonumber', 'error', 'assert', 'pcall', 'xpcall', 'select', 'unpack', 'rawget', 'rawset', 'rawequal', 'setmetatable', 'getmetatable', 'require', 'load', 'loadstring', 'dofile', 'loadfile'],
    libraries: ['string', 'table', 'math', 'io', 'os', 'debug', 'package', 'coroutine'],
    modules: [],
    restrictions: [],
    knownDifferences: [],
  };
}

export function luauProfile(): RuntimeProfile {
  return {
    name: 'Luau',
    identity: 'luau',
    language: 'luau',
    version: 'latest',
    capabilities: { ...baseCaps, typeAnnotations: true, generics: true, continue: true, compoundAssignment: true, typeCast: true },
    globals: ['print', 'type', 'pairs', 'ipairs', 'next', 'tostring', 'tonumber', 'error', 'assert', 'pcall', 'xpcall', 'select', 'rawget', 'rawset', 'rawequal', 'setmetatable', 'getmetatable', 'require', 'task', 'table', 'string', 'math', 'os', 'debug', 'coroutine', 'utf8', 'buffer', 'vector'],
    libraries: ['string', 'table', 'math', 'os', 'debug', 'coroutine', 'utf8', 'buffer', 'vector', 'task'],
    modules: [],
    restrictions: [],
    knownDifferences: ['no goto', 'no setfenv/getfenv', 'stricter typing optional'],
  };
}

export function robloxProfile(context: 'server' | 'client' | 'studio' | 'plugin' | 'shared-module'): RuntimeProfile {
  const p = luauProfile();
  p.name = `Roblox ${context}`;
  p.identity = context === 'server' ? 'roblox-server' : context === 'client' ? 'roblox-client' : context === 'studio' ? 'roblox-studio' : context === 'plugin' ? 'roblox-plugin' : 'roblox-shared-module';
  p.restrictions = ['sandboxed', 'no os.execute', 'no io', 'no debug.getupvalue in production'];
  p.knownDifferences.push(`context: ${context}`);
  if (context === 'client') p.knownDifferences.push('client-only APIs; no ServerStorage');
  if (context === 'server') p.knownDifferences.push('server-only APIs; no player input');
  return p;
}
