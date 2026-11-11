import { identifyLanguage } from './languageIdentification.js';
import { parseSource } from './parsing.js';
import { analyzeSymbols } from './symbolAnalysis.js';
import { checkCompatibility } from './compatibility.js';
import { luaProfile, luauProfile } from './runtimeProfiles.js';
import { makeEvidence } from './evidence.js';

export interface ReconstructionReport {
  title: string;
  language: string;
  version?: string;
  components: string[];
  dependencies: string[];
  controlFlowNotes: string[];
  assumptions: string[];
  limitations: string[];
  markdown: string;
}

export function buildReconstruction(source: string): ReconstructionReport {
  const det = identifyLanguage(source);
  const parsed = parseSource(source, det);
  const symbols = analyzeSymbols(parsed.ast);
  const target = det.language === 'luau' ? luauProfile() : luaProfile('5.4');
  const compat = checkCompatibility(source, target);

  const assumptions: string[] = [
    'Language detection is heuristic; verify against project configuration.',
    'Generated implementation requires independent validation against tests.',
  ];
  const limitations: string[] = [
    'No execution performed; runtime behaviour not verified.',
    'API compatibility not verified (API database incomplete).',
  ];
  if (compat.unsupportedFeatures.length) limitations.push(...compat.unsupportedFeatures);

  const components = symbols.functions.length ? symbols.functions : ['<anonymous chunk>'];
  const dependencies = symbols.requires;
  const controlFlowNotes = parsed.errors.length
    ? [`Parse errors: ${parsed.errors.join('; ')}`]
    : ['Parsed successfully; control-flow graph not yet built.'];

  const ev = makeEvidence('source', 'Reconstruction based on source analysis', undefined, det.confidence);

  const markdown = [
    `# Reconstruction Report`,
    ``,
    `Language: ${det.language}${det.version ? ' ' + det.version : ''} (confidence ${det.confidence})`,
    ``,
    `## Components`,
    ...components.map((c) => `- ${c}`),
    ``,
    `## Dependencies`,
    ...(dependencies.length ? dependencies.map((d) => `- ${d}`) : ['- none detected']),
    ``,
    `## Control flow`,
    ...controlFlowNotes.map((n) => `- ${n}`),
    ``,
    `## Assumptions`,
    ...assumptions.map((a) => `- ${a}`),
    ``,
    `## Limitations`,
    ...limitations.map((l) => `- ${l}`),
    ``,
    `Evidence: ${ev.id}`,
  ].join('\n');

  return {
    title: 'Reconstruction Report',
    language: det.language,
    version: det.version,
    components,
    dependencies,
    controlFlowNotes,
    assumptions,
    limitations,
    markdown,
  };
}
