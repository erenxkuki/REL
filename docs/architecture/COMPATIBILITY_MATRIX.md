# REL Compatibility Matrix

Status legend: `supported` | `partial` | `unknown` | `not-applicable` | `planned`.

This document tracks what REL can verify today. It must not overstate capabilities.

## Language dimensions

| Dimension | Lua 5.1 | Lua 5.2 | Lua 5.3 | Lua 5.4 | Luau |
|---|---|---|---|---|---|
| Language identification | partial | partial | partial | partial | partial |
| Tokenization | partial (via parsers) | partial (via parsers) | partial (via parsers) | partial (via parsers) | partial (via parsers) |
| Parsing | partial | partial | partial | partial | partial |
| AST construction | partial | partial | partial | partial | partial |
| Symbol analysis | partial | partial | partial | partial | partial |
| Type analysis | n/a | n/a | n/a | n/a | planned |
| Control-flow | planned | planned | planned | planned | planned |
| Data-flow | planned | planned | planned | planned | planned |

## Runtime profiles

| Profile | Status |
|---|---|
| Standard Lua 5.1 | planned |
| Standard Lua 5.2 | planned |
| Standard Lua 5.3 | planned |
| Standard Lua 5.4 | planned |
| Luau (standalone) | planned |
| Roblox Server | planned |
| Roblox Client | planned |
| Roblox Studio | planned |
| Roblox Plugin | planned |
| Roblox Shared Module | planned |
| Custom (user-defined) | planned |

## Compatibility dimensions (per source/target pair)

- Syntax compatibility: planned
- Semantic compatibility: planned
- Runtime compatibility: planned
- API compatibility: planned
- Environment compatibility: planned
- Security compatibility: planned

## Roblox API database

- Status: planned. Authority: official Roblox documentation.
- Contexts tracked: server / client / studio / plugin / shared.

## Controlled testing

- Status: planned. Distinguishes parsed / static-analysis / compatibility / executed / behaviour-validated.

## Notes

No dimension is marked `supported` until implemented and covered by regression tests with expected results. Unknown dimensions remain `unknown` rather than being inferred.
