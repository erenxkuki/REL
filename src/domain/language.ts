export type Language = 'lua' | 'luau' | 'unknown';

export type LuaVersion = '5.1' | '5.2' | '5.3' | '5.4';

export interface LanguageDetection {
  language: Language;
  version?: LuaVersion; // only for lua
  confidence: number; // 0..1
  evidence: string[];
}

export interface LanguageProfile {
  language: Language;
  version?: LuaVersion;
}
