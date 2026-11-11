# REL — Reverse Engineering Lua

A specialized reverse-engineering and program-analysis platform for Lua and Luau, with Roblox ecosystem focus. Inspired by [REA](https://github.com/morluto/rea), but rebuilt for Lua/Luau language and runtime concerns.

## Status

Phase 1–3 partial: language identification, parsing (Lua via `luaparse`, Luau via `luau-parser`), AST construction, symbol analysis, runtime profiles, and multidimensional compatibility reports. See `docs/architecture/COMPATIBILITY_MATRIX.md`.

## Install

```bash
npm install
```

## Test

```bash
npm test
npm run typecheck
```

## MCP server

```bash
npm run build && node dist/src/mcp.js
```

Exposes `rel_identify_language`, `rel_parse_source`, `rel_analyze_symbols`, `rel_check_compatibility`, `rel_generate_reconstruction`.

## Usage (library)

```ts
import { identifyLanguage } from './src/application/languageIdentification.js';
import { parseSource } from './src/application/parsing.js';
import { analyzeSymbols } from './src/application/symbolAnalysis.js';
import { checkCompatibility } from './src/application/compatibility.js';
import { luaProfile, luauProfile } from './src/application/runtimeProfiles.js';

const src = 'local x: number = 1\nprint(x)';
const det = identifyLanguage(src);
const parsed = parseSource(src);
const symbols = analyzeSymbols(parsed.ast);
const report = checkCompatibility(src, luaProfile('5.4'));
```

## Architecture

See `docs/architecture/REL_ARCHITECTURE.md`, `docs/research/REA_AUDIT.md`.

## Security

Read-only by default. No unauthorized execution, injection, or bypass functionality. See `SECURITY.md`.
```

Let me also create SECURITY.md and ROADMAP.md minimal.<|end|><|start|>startup to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="path">
C:\Users\Acer\Desktop\REL\SECURITY.md