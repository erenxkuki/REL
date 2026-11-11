import { readFileSync } from 'node:fs';
import { identifyLanguage } from './application/languageIdentification.js';
import { parseSource } from './application/parsing.js';
import { analyzeSymbols } from './application/symbolAnalysis.js';
import { buildReconstruction } from './application/reconstruction.js';

const args = process.argv.slice(2);
const cmd = args[0];
const file = args[1];

function usage() {
  console.log('REL CLI');
  console.log('  identify <file>');
  console.log('  parse <file>');
  console.log('  symbols <file>');
  console.log('  reconstruct <file>');
}

if (!cmd || !file) { usage(); process.exit(1); }
const source = readFileSync(file, 'utf8');

switch (cmd) {
  case 'identify': {
    const det = identifyLanguage(source);
    console.log(JSON.stringify(det, null, 2));
    break;
  }
  case 'parse': {
    const r = parseSource(source);
    console.log(JSON.stringify({ language: r.language, errors: r.errors }, null, 2));
    break;
  }
  case 'symbols': {
    const r = parseSource(source);
    const s = analyzeSymbols(r.ast);
    console.log(JSON.stringify(s, null, 2));
    break;
  }
  case 'reconstruct': {
    const rep = buildReconstruction(source);
    console.log(rep.markdown);
    break;
  }
  default:
    usage();
    process.exit(1);
}
