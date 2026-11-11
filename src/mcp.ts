import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { identifyLanguage } from './application/languageIdentification.js';
import { parseSource } from './application/parsing.js';
import { analyzeSymbols } from './application/symbolAnalysis.js';
import { checkCompatibility } from './application/compatibility.js';
import { buildReconstruction } from './application/reconstruction.js';
import { luaProfile, luauProfile, robloxProfile } from './application/runtimeProfiles.js';

function profileFromId(id: string) {
  if (id.startsWith('lua-')) return luaProfile(id.slice(4) as '5.1' | '5.2' | '5.3' | '5.4');
  if (id === 'luau') return luauProfile();
  if (id.startsWith('roblox-')) return robloxProfile(id.slice(7) as any);
  return luauProfile();
}

const server = new McpServer({ name: 'rel', version: '0.1.0' });

server.registerTool(
  'rel_identify_language',
  {
    description: 'Identify Lua/Luau language and version from source.',
    inputSchema: { source: z.string() },
  },
  async ({ source }) => {
    const det = identifyLanguage(source);
    return { content: [{ type: 'text', text: JSON.stringify(det, null, 2) }] };
  }
);

server.registerTool(
  'rel_parse_source',
  {
    description: 'Parse Lua/Luau source and report errors.',
    inputSchema: { source: z.string() },
  },
  async ({ source }) => {
    const r = parseSource(source);
    return { content: [{ type: 'text', text: JSON.stringify({ language: r.language, version: r.version, errors: r.errors }, null, 2) }] };
  }
);

server.registerTool(
  'rel_analyze_symbols',
  {
    description: 'Analyze symbols in Lua/Luau source.',
    inputSchema: { source: z.string() },
  },
  async ({ source }) => {
    const r = parseSource(source);
    const s = analyzeSymbols(r.ast);
    return { content: [{ type: 'text', text: JSON.stringify(s, null, 2) }] };
  }
);

server.registerTool(
  'rel_check_compatibility',
  {
    description: 'Check source compatibility against a target runtime profile.',
    inputSchema: { source: z.string(), targetProfile: z.string() },
  },
  async ({ source, targetProfile }) => {
    const target = profileFromId(targetProfile);
    const report = checkCompatibility(source, target);
    return { content: [{ type: 'text', text: JSON.stringify(report, null, 2) }] };
  }
);

server.registerTool(
  'rel_generate_reconstruction',
  {
    description: 'Generate an evidence-backed reconstruction report.',
    inputSchema: { source: z.string() },
  },
  async ({ source }) => {
    const rep = buildReconstruction(source);
    return { content: [{ type: 'text', text: rep.markdown }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
