import { describe, it, expect } from 'vitest';
import { parseSource } from '../src/application/parsing.js';
import { analyzeSymbols } from '../src/application/symbolAnalysis.js';

describe('analyzeSymbols', () => {
  it('extracts Lua functions, locals, requires', () => {
    const src = "local m = require('foo')\nlocal function bar(x)\n  return x\nend\nlocal y = 2";
    const r = parseSource(src);
    const s = analyzeSymbols(r.ast);
    expect(s.functions).toContain('bar');
    expect(s.locals).toContain('m');
    expect(s.locals).toContain('y');
    expect(s.requires).toContain('foo');
  });

  it('extracts Luau functions and locals', () => {
    const src = "local x: number = 1\nfunction foo<T>(y: number): number\n  return y + x\nend";
    const r = parseSource(src);
    const s = analyzeSymbols(r.ast);
    expect(s.functions).toContain('foo');
    expect(s.locals).toContain('x');
  });
});