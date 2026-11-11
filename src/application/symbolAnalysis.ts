import type { RELAst } from '../domain/ast.js';

export interface SymbolSummary {
  functions: string[];
  locals: string[];
  requires: string[];
  globals: string[];
}

function walk(node: any, visit: (n: any) => void) {
  if (!node || typeof node !== 'object') return;
  visit(node);
  for (const key of Object.keys(node)) {
    const v = node[key];
    if (Array.isArray(v)) v.forEach((x) => walk(x, visit));
    else if (v && typeof v === 'object') walk(v, visit);
  }
}

export function analyzeSymbols(ast: RELAst): SymbolSummary {
  const functions = new Set<string>();
  const locals = new Set<string>();
  const requires = new Set<string>();
  const globals = new Set<string>();

  // luaparse style
  if (ast.language === 'lua') {
    walk(ast.root, (n) => {
      if (!n || !n.type) return;
      if (n.type === 'FunctionDeclaration' && n.identifier?.name) functions.add(n.identifier.name);
      if (n.type === 'LocalFunction' && n.identifier?.name) functions.add(n.identifier.name);
      if (n.type === 'LocalStatement' && Array.isArray(n.variables)) {
        for (const v of n.variables) if (v?.name) locals.add(v.name);
      }
      // require calls
      if (n.type === 'CallExpression') {
        const callee = n.base || n.callee;
        if (callee?.type === 'Identifier' && callee.name === 'require') {
          const arg = n.arguments?.[0];
          if (arg?.type === 'StringLiteral') requires.add(String(arg.value ?? arg.raw?.replace(/['"]/g, '')));
        }
      }
    });
  } else {
    // luau-parser style
    walk(ast.root, (n) => {
      if (!n || !n.type) return;
      if (n.type === 'FunctionDeclaration' || n.type === 'LocalFunctionDeclaration' || n.type === 'FunctionDeclarationStatement') {
        const name = n.name?.name || n.target?.base?.name || n.target?.name || (typeof n.name === 'string' ? n.name : null);
        if (name) functions.add(name);
      }
      if (n.type === 'LocalStatement' && Array.isArray(n.names)) {
        for (const v of n.names) {
          const name = typeof v === 'string' ? v : v?.name;
          if (name) locals.add(name);
        }
      }
      if (n.type === 'CallExpression') {
        const callee = n.callee;
        if (callee?.type === 'Identifier' && callee.name === 'require') {
          const arg = n.arguments?.[0];
          if (arg?.type === 'StringLiteral') requires.add(String(arg.value ?? arg.raw?.replace(/['"]/g, '')));
        }
      }
    });
  }

  return {
    functions: [...functions],
    locals: [...locals],
    requires: [...requires],
    globals: [...globals],
  };
}
