import { identifyLanguage } from './languageIdentification.js';
import { parseSource } from './parsing.js';
import type { RuntimeProfile } from '../domain/runtimeProfile.js';
import type { CompatibilityReport, CompatStatus } from '../domain/compatibility.js';

function versionRank(v?: string): number {
  if (!v) return 0;
  const m = v.match(/(\d+)\.(\d+)/);
  if (!m) return 0;
  return Number(m[1]) * 10 + Number(m[2]);
}

export function checkCompatibility(source: string, target: RuntimeProfile): CompatibilityReport {
  const det = identifyLanguage(source);
  const parsed = parseSource(source, det, target.language);
  const syntaxCompatible = parsed.errors.length === 0;

  const sourceLang = det.language;
  const targetLang = target.language;
  const languageMatch = sourceLang === targetLang || (targetLang === 'luau' && sourceLang === 'lua');

  const unsupported: string[] = [];
  const warnings: string[] = [];

  if (!languageMatch) {
    unsupported.push(`Source language ${sourceLang} does not match target language ${targetLang}`);
  }
  if (sourceLang === 'lua' && det.version && target.language === 'lua') {
    if (versionRank(det.version) > versionRank(target.version)) {
      unsupported.push(`Source requires Lua ${det.version} but target is Lua ${target.version}`);
    }
  }
  if (sourceLang === 'luau' && target.language === 'lua') {
    unsupported.push('Luau-specific syntax and type system not available in Lua runtime');
  }

  if (!syntaxCompatible) {
    warnings.push(...parsed.errors.map((e) => `Parse error: ${e}`));
  }
  warnings.push('API database not yet implemented; API compatibility not verified');
  warnings.push('No execution performed; runtime/environment/security compatibility not verified');

  const semantic: CompatStatus = !syntaxCompatible
    ? 'incompatible'
    : languageMatch
    ? 'partially_verified'
    : 'incompatible';
  const runtime: CompatStatus = languageMatch ? 'unknown' : 'incompatible';
  const api: CompatStatus = 'unknown';
  const env: CompatStatus = 'unknown';
  const security: CompatStatus = 'unknown';

  const confidence = syntaxCompatible && languageMatch ? 0.5 : syntaxCompatible ? 0.25 : 0.1;

  return {
    sourceLanguage: sourceLang,
    sourceVersion: det.version,
    targetEnvironment: target.name,
    syntaxCompatible,
    semanticCompatible: semantic,
    runtimeCompatible: runtime,
    apiCompatible: api,
    environmentCompatible: env,
    securityCompatible: security,
    unsupportedFeatures: unsupported,
    warnings,
    confidence,
    evidence: det.evidence,
  };
}
