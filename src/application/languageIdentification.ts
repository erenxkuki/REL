import type { LanguageDetection, LuaVersion } from '../domain/language.js';

export function identifyLanguage(source: string): LanguageDetection {
  const evidence: string[] = [];
  let luauScore = 0;
  let luaScore = 0;
  const versionMarkers: Record<LuaVersion, number> = { '5.1': 0, '5.2': 0, '5.3': 0, '5.4': 0 };

  // Luau markers
  if (/\bcontinue\b/.test(source)) { luauScore += 2; evidence.push('keyword: continue (Luau)'); }
  if (/\btype\s+\w+\s*=/.test(source)) { luauScore += 2; evidence.push('type alias declaration (Luau)'); }
  if (/\bexport\s+type\b/.test(source)) { luauScore += 2; evidence.push('export type (Luau)'); }
  if (/\w+\s*:\s*(number|string|boolean|any|unknown|never|nil|vector)\b/.test(source)) { luauScore += 1; evidence.push('type annotation (Luau)'); }
  if (/[<>]\s*\w+\s*[=,)]/.test(source) && /function\s+\w+\s*</.test(source)) { luauScore += 2; evidence.push('generic type parameters (Luau)'); }
  if (/::\s*[A-Za-z_]/.test(source)) { luauScore += 2; evidence.push('type cast :: (Luau)'); }
  if (/\+=|-=|\*=|\/=|%=/ .test(source)) { luauScore += 1; evidence.push('compound assignment (Luau)'); }
  if (/\?\s*:/.test(source)) { luauScore += 1; evidence.push('optional/ternary type syntax (Luau)'); }

  // Lua version markers
  if (/\blocal\s+\w+\s*<\s*const\s*>/.test(source) || /\blocal\s+\w+\s*<\s*close\s*>/.test(source)) {
    versionMarkers['5.4'] += 3; evidence.push('local attribute <const>/<close> (Lua 5.4)');
  }
  if (/\/\/[^/]/.test(source) || /\b\/\/\s*\d/.test(source)) {
    // floor division operator // (Lua 5.3+); heuristic: // not followed by comment? crude
    versionMarkers['5.3'] += 1; versionMarkers['5.4'] += 1; evidence.push('possible floor division // (Lua 5.3+)');
  }
  if (/\bgoto\b/.test(source) || /::\s*\w+\s*::/.test(source)) {
    versionMarkers['5.2'] += 2; versionMarkers['5.3'] += 2; versionMarkers['5.4'] += 2; evidence.push('goto/label (Lua 5.2+)');
  }
  if (/\b_ENV\b/.test(source)) {
    versionMarkers['5.2'] += 2; versionMarkers['5.3'] += 2; versionMarkers['5.4'] += 2; evidence.push('_ENV (Lua 5.2+)');
  }
  if (/[&|~]|<<|>>/.test(source) && !/Luau/.test(source)) {
    // bitwise operators (Lua 5.3+); very crude, skip scoring to avoid false positives
  }
  if (/\bmodule\s*\(/.test(source) || /\bsetfenv\s*\(/.test(source) || /\bgetfenv\s*\(/.test(source)) {
    versionMarkers['5.1'] += 3; evidence.push('module/setfenv/getfenv (Lua 5.1)');
  }

  // Decide language
  if (luauScore >= 1 && luauScore > luaScore) {
    const confidence = Math.min(0.95, 0.5 + luauScore * 0.1);
    return { language: 'luau', confidence, evidence };
  }

  // Lua: pick highest version marker
  let bestVersion: LuaVersion | undefined;
  let bestScore = 0;
  for (const v of ['5.4', '5.3', '5.2', '5.1'] as LuaVersion[]) {
    if (versionMarkers[v] > bestScore) {
      bestScore = versionMarkers[v];
      bestVersion = v;
    }
  }
  // If a higher version scored, it implies lower versions? Lua versions are cumulative features mostly; assume detected marker's version.
  if (bestScore === 0) {
    // ambiguous: do not assume 5.1
    return { language: 'lua', confidence: 0.4, evidence: evidence.length ? evidence : ['no version-specific markers; dialect/version ambiguous'] };
  }
  const confidence = Math.min(0.9, 0.5 + bestScore * 0.1);
  return { language: 'lua', version: bestVersion, confidence, evidence };
}
