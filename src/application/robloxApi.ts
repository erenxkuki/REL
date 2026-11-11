import type { RobloxApiRecord } from '../domain/roblox.js';

export const ROBLOX_API_DB: RobloxApiRecord[] = [
  { name: 'game', className: 'DataModel', memberType: 'property', availability: ['server', 'client', 'studio', 'plugin'], docs: 'DataModel' },
  { name: 'workspace', className: 'Workspace', memberType: 'property', availability: ['server', 'client', 'studio', 'plugin'] },
  { name: 'script', className: 'LuaSourceContainer', memberType: 'property', availability: ['server', 'client', 'studio', 'plugin'] },
  { name: 'Instance.new', className: 'Instance', memberType: 'function', parameters: ['className'], returnType: 'Instance', availability: ['server', 'client', 'studio', 'plugin'] },
  { name: 'task.wait', className: 'task', memberType: 'function', parameters: ['seconds?'], returnType: 'number', availability: ['server', 'client', 'studio', 'plugin'] },
  { name: 'task.spawn', className: 'task', memberType: 'function', parameters: ['fn', '...'], availability: ['server', 'client', 'studio', 'plugin'] },
  { name: 'Players', className: 'Players', memberType: 'property', availability: ['server', 'client', 'studio'] },
  { name: 'ReplicatedStorage', className: 'ReplicatedStorage', memberType: 'property', availability: ['server', 'client', 'studio'] },
  { name: 'ServerStorage', className: 'ServerStorage', memberType: 'property', availability: ['server', 'studio'] },
  { name: 'ServerScriptService', className: 'ServerScriptService', memberType: 'property', availability: ['server', 'studio'] },
  { name: 'TweenService', className: 'TweenService', memberType: 'property', availability: ['server', 'client', 'studio'] },
  { name: 'RunService', className: 'RunService', memberType: 'property', availability: ['server', 'client', 'studio'] },
];

export function lookupApi(name: string): RobloxApiRecord | undefined {
  return ROBLOX_API_DB.find((r) => r.name === name);
}

export function apisForContext(context: 'server' | 'client' | 'studio' | 'plugin'): RobloxApiRecord[] {
  return ROBLOX_API_DB.filter((r) => r.availability.includes(context));
}
