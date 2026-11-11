export interface SourceSpan {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface RELAst {
  language: 'lua' | 'luau';
  version?: string;
  root: unknown; // underlying parser AST
  spans: SourceSpan[];
}
