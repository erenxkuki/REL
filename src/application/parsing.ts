import { parse as parseLua } from 'luaparse';
import { parse as parseLuau } from 'luau-parser';
import type { RELAst } from '../domain/ast.js';
import type { LanguageDetection } from '../domain/language.js';
import { identifyLanguage } from './languageIdentification.js';

export interface ParseResult {
  language: 'lua' | 'luau';
  version?: string;
  ast: RELAst;
  errors: string[];
}

export function parseSource(source: string, detection?: LanguageDetection, languageOverride?: 'lua' | 'luau'): ParseResult {
  const det = detection ?? identifyLanguage(source);
  const errors: string[] = [];
  let root: unknown;
  let language: 'lua' | 'luau' = languageOverride ?? (det.language === 'luau' ? 'luau' : 'lua');

  if (language === 'luau') {
    try {
      root = parseLuau(source);
    } catch (e) {
      errors.push(String(e));
      // fallback to lua parser
      language = 'lua';
    }
  }
  if (language === 'lua' && root === undefined) {
    try {
      root = parseLua(source, { locations: true, comments: true, scope: true });
    } catch (e) {
      errors.push(String(e));
    }
  }

  const ast: RELAst = {
    language,
    version: det.version,
    root,
    spans: [],
  };
  return { language, version: det.version, ast, errors };
}
