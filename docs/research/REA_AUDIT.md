# REA Audit (Phase 0)

**Source:** https://github.com/morluto/rea (cloned at `C:\Users\Acer\AppData\Local\Temp\opencode\rea`, v6.8.0)
**Date:** 2026-11-11
**Method:** Direct repository inspection (source tree, package.json, AGENTS.md, docs). No functionality invented.

## 0. Verified facts

- Implementation language: **TypeScript** (ESM, `"type": "module"`), Node `^22.23.4 || ^24.22.1 || >=26.12.1`.
- Package manager: npm 11.16.0, turbo for monorepo tasks.
- Test runner: Vitest with named projects (domain, services, adapters, composition, conformance, evaluation, acceptance, boundary, etc.).
- Lint/format: oxlint + oxfmt; knip for dead code; jscpd for duplication.
- Typecheck: `tsc --noEmit`.
- Entry points: `src/cli.ts`, `src/main.ts`; binary `scripts/rea.mjs` (CLI + MCP server modes).
- Architecture layers (verified by AGENTS.md + src layout): domain → contracts → application → adapters (cli/server) → composition.
- Dependencies flow inward; engine protocols and provider-specific code kept out of domain/application.
- MCP: `@modelcontextprotocol/server` + client; many `register*Tools.ts` under `src/server`.
- Evidence: first-class `EvidenceRecord`/`evidenceBundle` domain concepts; deferred evidence MCP server.
- Reconstruction: `reconstructionCoverage`, `reconstructionVerification`, `reconstructionObligationLedger*` in domain/application.
- Analysis: `analysisSnapshot`, `analysisError*`, `staticRuntimeCorrelation`.
- Security posture: local-only, read-only providers by default, explicit permission boundaries, redaction of sensitive values, no ambient env persistence.
- No Lua/Luau-specific support found in REA (search for "lua" only matched unrelated strings). REA is a generic reverse-engineering platform for binaries, Electron, JS bundles, managed code, firmware, etc.

## 1. Subsystem audit table

| Component | Purpose | Implementation | Dependencies | REL relevance | Adaptation | Decision |
|---|---|---|---|---|---|---|
| Entry points / CLI | Unified CLI + MCP server launcher | `src/cli.ts`, `src/main.ts`, `scripts/rea.mjs` | Node, Commander-like parsing | High — REL needs CLI + MCP | Rename commands, drop binary targets | Reuse pattern |
| MCP server | Structured tool interface for agents | `src/server/createServer.ts`, `register*Tools.ts`, `@modelcontextprotocol/server` | MCP SDK, zod schemas | High — REL agent interface | Replace tool families with REL ops | Reuse infra, replace tools |
| Layered architecture | Domain/contracts/application/adapters/composition | Directory layout + AGENTS rules | TypeScript | High — core structure | Keep layers; new domain modules | Reuse architecture |
| Contracts/schemas | Input/output schemas, tool contracts | `src/contracts/*`, `src/contracts/toolContracts.ts`, zod | zod, ajv | High — agent ops need schemas | New REL contracts | Reuse pattern |
| Evidence engine | Provenance-backed findings | `domain/evidence*.ts`, `evidenceBundle.ts`, deferred evidence server | fs, hashing | High — REL evidence engine | Generalize to Lua findings | Reuse design, adapt entities |
| Analysis engine | Static analysis, snapshots, correlations | `domain/analysisSnapshot.ts`, `staticRuntimeCorrelation.ts`, `application/javascript` | parsers | High — REL analysis engine | Replace JS/binary analyzers with Lua/Luau | Reuse patterns |
| Reconstruction | Obligation ledger, coverage, verification | `reconstructionObligationLedger*`, `reconstructionCoverage*`, `reconstructionVerification*` | evidence, source graph | High — REL code reconstruction | Adapt to Lua/Luau source | Reuse design |
| JavaScript analysis | JS bundle/route analysis | `src/javascript/*`, `src/application/javascript/*`, `@babel/parser` | Babel | Medium — closest analog to language analysis | Replace with Lua/Luau parser | Replace (different language) |
| Source maps | JS source map handling | `src/javascript/sourceMaps/*` | source-map libs | Low for REL v1 | Defer | Defer |
| Provider/model layer | Deep-analysis providers (LLM) | `src/providers`, `application/analysisProvider` | HTTP SDKs | Medium — AI investigation | Keep optional | Reuse pattern |
| Process supervision | Owned process lifecycle | `src/process/*` | child_process | Medium — controlled testing | Reuse for test harnesses | Reuse |
| Configuration | Settings, profiles | `src/config`, `analysisSettings` | yaml/toml/json | Medium — runtime profiles | Adapt to profiles | Reuse pattern |
| Error model | Tagged error algebra + Result | `domain/analysisError*.ts`, `result.ts` | — | High — honest failures | Reuse | Reuse |
| Testing discipline | Vitest projects, boundary/acceptance tests | `vitest.config.ts`, testing docs | Vitest | High — REL testing matrix | Mirror lane structure | Reuse discipline |
| Performance | Caching, hashing, incremental | content hashing, caching patterns | — | High — REL perf | Reuse | Reuse |
| Security | Read-only default, permissions, redaction | AGENTS + contracts | — | High — REL security | Reuse | Reuse |
| UI/website | VitePress docs, product catalog | `docs/`, `website/` | VitePress | Medium — REL docs/UI | Later | Defer |
| Native bridges | Ghidra/IDA/Hopper/Frida | `bridge/*`, native | external tools | Low — not core to Lua | Not needed for v1 | Replace/omit |
| Binary analysis | ELF/PE/Mach-O etc. | `domain/elf*`, `pe*` | — | Low | Omit | Omit |
| Firmware/hardware | Firmware formats | `src/firmware/*` | — | Low | Omit | Omit |

## 2. Architectural observations (verified)

- **Evidence provenance is central**: findings link to source evidence; deferred evidence delivery avoids large inline payloads. REL must preserve this for Lua findings.
- **Contracts bind handlers to named contracts with exact types**: `src/contracts/*ToolContracts.ts` + `toolContractTypes.ts`. REL agent ops should follow same pattern.
- **Result/Tagged errors**: malformed inputs modeled as expected failures, not exceptions. REL should reuse.
- **Read-only default + permission boundaries**: explicit; no mutation without authorization. REL aligns.
- **Dependencies flow inward**: domain has no engine/provider code. REL must keep Language Core independent of runtime profiles.
- **Testing lanes**: domain/services/adapters/composition/conformance/evaluation/acceptance/boundary. REL should mirror for regression matrix.
- **Generated artifacts**: product catalog, skill metadata, MCP catalog generated from source contracts. REL can adopt later.

## 3. Decisions for REL

- **Reuse:** layered architecture, contracts/schemas, evidence engine design, error algebra, process supervision, testing discipline, performance patterns, security posture, MCP server infra.
- **Redesign:** Language Core (Lua/Luau-specific), Runtime/Environment profiles, Compatibility Engine (multidimensional), Roblox intelligence, API database.
- **Replace:** JavaScript/binary/firmware analyzers with Lua/Luau parser + analyzers; native bridges not needed.
- **Defer:** UI/website, source maps, generated catalogs, advanced provider integrations until core phases complete.

## 4. Stack decision

REA uses TypeScript + Node + Vitest + zod + MCP SDK. REL will follow the same stack for consistency and to reuse patterns/infra, unless a Lua/Luau parser requirement forces otherwise. Parser choice (tree-sitter-lua, luaparse, official Luau) to be decided in Phase 2 with benchmarks.

## 5. What REL must NOT take from REA

- Binary/native reverse-engineering assumptions.
- Unauthorized execution/injection capabilities.
- Any executor-specific bypass logic.
- REA's product scope (binaries, firmware) — REL is language/runtime/API focused.
