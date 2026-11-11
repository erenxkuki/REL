import { parseSource } from './parsing.js';
import { analyzeSymbols } from './symbolAnalysis.js';

export interface ModuleDependencyReport {
  requires: string[];
}

export function analyzeModuleDependencies(source: string): ModuleDependencyReport {
  const parsed = parseSource(source);
  const symbols = analyzeSymbols(parsed.ast);
  return { requires: symbols.requires };
}
