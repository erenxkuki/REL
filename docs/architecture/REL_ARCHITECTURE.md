# REL Architecture

**Project:** REL — Reverse Engineering Lua
**Status:** Phase 1 (design). Derived from `MASTER SPECIFICATION — EXECUTION-ENVIRONMENT EDITION`.
**Scope:** Lua 5.1/5.2/5.3/5.4 and Luau, with Roblox ecosystem focus.

## 1. Design principles

1. Language, runtime, API, environment and execution authorization are **distinct** problems. Never collapse them.
2. Core is **executor-independent**. No hardcoded third-party executor assumptions.
3. Evidence-backed: every finding traces to source, docs, tests, observations, or labelled assumptions.
4. Never confuse parsing success with execution success.
5. Default permission mode: **read-only**.
6. Honest reporting: unknown dimensions stay unknown; no placeholder scores.

## 2. Subsystems

### 2.1 REL Language Core
- Language identification (confidence-scored).
- Tokenization/lexical analysis.
- Parsing (Lua/Luau dialect-aware).
- AST construction with source spans.
- Symbol resolution (scopes, shadowing, globals, unresolved).
- Type analysis (Luau annotations, aliases, generics, unions/intersections/optionals, refinement).
- Control-flow analysis (CFG, branches, loops, early returns, unreachable).
- Data-flow analysis (assignments, propagation, args, returns, deps).
- Source mapping.

Must not depend on a specific execution environment.

### 2.2 REL Runtime Model
Describes an environment; does not bypass restrictions.
- Language version, standard libraries, globals, module-loading semantics, coroutines, restrictions, behavioural differences.

### 2.3 REL Compatibility Engine
Multidimensional:
- Syntax, semantic, runtime, API, environment, security.
Returns structured `CompatibilityReport` with per-dimension status and confidence.

### 2.4 REL Analysis Engine
Functions, variables, dependencies, references, data/control flow, API usage, relationships, potential errors, assumptions.

### 2.5 REL Evidence Engine
`EvidenceRecord` linking findings to source/docs/tests/observations/assumptions. Stable IDs, schema versioning.

### 2.6 REL Agent Interface
Structured ops with input/output schemas, permissions, validation, errors, limits, evidence refs. Read-only default.

## 3. Data model (core entities)

- Project, SourceFile, LanguageProfile, RuntimeProfile, EnvironmentProfile
- ASTNode, Symbol, Function, Dependency, APIReference
- AnalysisFinding, EvidenceRecord, TestCase, TestResult, CompatibilityReport

Relationships explicit. Stable identifiers. Source locations preserved. Schema versioning.

## 4. Language identification

Inputs: syntax signatures, version-specific constructs, type annotations, extensions, explicit config.
Output: `{ language, version?, confidence, evidence[] }`. Never silently assume Lua 5.1.

## 5. Runtime profiles

Abstract capability interface. Each profile specifies identity, dialect, version, globals, libraries, modules, restrictions, known differences. Custom profiles via config; describe capabilities not unrestricted execution.

Profiles: Standard Lua (per version), Luau, Roblox (server/client/studio/plugin/shared modules).

## 6. Compatibility result schema

```json
{
  "source_language": "...",
  "source_version": "...",
  "target_environment": "...",
  "syntax_compatible": true|false,
  "semantic_compatible": "verified|partially_verified|unknown|incompatible",
  "runtime_compatible": "verified|partially_verified|unknown|incompatible",
  "api_compatible": "verified|partially_verified|unknown|incompatible",
  "environment_compatible": "verified|partially_verified|unknown|incompatible",
  "security_compatible": "verified|partially_verified|unknown|incompatible",
  "unsupported_features": [],
  "warnings": [],
  "confidence": 0.0,
  "evidence": []
}
```

All values from actual analysis. No placeholder scores.

## 7. Roblox intelligence

Instance model (DataModel, Workspace, ReplicatedStorage, ServerStorage, ServerScriptService, StarterPlayer, StarterGui, StarterPack, Lighting, SoundService, Players, ModuleScripts, LocalScripts, Scripts). Execution contexts (server/client/studio/plugin/shared). Module dependency analysis. Version-aware API database with name/class/member/params/returns/availability/context/security/docs.

## 8. Controlled testing

Distinguish statuses: parsed, static-analysis-passed, compatibility-passed, executed, behaviour-validated. Test harnesses via approved interfaces only.

## 9. Code reconstruction

Evidence-backed: parse → components → deps → control/data flow → docs → explanation → independent impl → tests. Original, readable, dialect-correct, documented APIs, assumptions, limitations, tests. No equivalence claims without validation.

## 10. Agent operations

rel_identify_language, rel_parse_source, rel_analyze_source, rel_analyze_symbols, rel_build_control_flow, rel_build_data_flow, rel_check_compatibility, rel_inspect_environment_profile, rel_analyze_roblox_project, rel_map_dependencies, rel_compare_implementations, rel_generate_reconstruction, rel_validate_results, rel_generate_report.

Each: input schema, output schema, permissions, validation, errors, limits, evidence refs.

## 11. Security

Explicit permission boundaries. Read-only default. Authorized modifications. Isolated test envs. Input validation. No exploit injection/bypass.

## 12. Performance

Content hashing, incremental indexing, caching with invalidation, efficient graphs, bounded processing. Benchmarks required for claims.

## 13. Implementation order (phases)

0 REA audit → 1 architecture → 2 lang id+parse → 3 AST+symbols → 4 runtime profiles → 5 compatibility → 6 Roblox → 7 evidence → 8 testing → 9 AI → 10 reconstruction → 11 perf/security/release.

Each phase: impl, tests, docs, review, acceptance.

## 14. Tech stack (tentative, pending REA audit)

Implementation language TBD after REA audit. Candidate: TypeScript/Node (MCP-friendly) or Python. Parsers: official Lua/Luau tooling where available; otherwise tree-sitter or hand-written. Decision recorded in REA_AUDIT.md.
