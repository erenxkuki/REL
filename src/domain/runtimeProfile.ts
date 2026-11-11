export type RuntimeIdentity =
  | 'lua-5.1'
  | 'lua-5.2'
  | 'lua-5.3'
  | 'lua-5.4'
  | 'luau'
  | 'roblox-server'
  | 'roblox-client'
  | 'roblox-studio'
  | 'roblox-plugin'
  | 'roblox-shared-module'
  | 'custom';

export interface RuntimeProfile {
  name: string;
  identity: RuntimeIdentity;
  language: 'lua' | 'luau';
  version: string;
  capabilities: Record<string, boolean>;
  globals: string[];
  libraries: string[];
  modules: string[];
  restrictions: string[];
  knownDifferences: string[];
}
