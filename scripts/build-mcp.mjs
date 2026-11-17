/**
 * Bundles the local Claude connector (mcp/src) together with the app's practice code and
 * content into one dependency-free file: mcp/dist/index.js.
 * Run: npm run build:mcp
 */
import { build } from 'esbuild';

await build({
  entryPoints: ['mcp/src/index.js'],
  outfile: 'mcp/dist/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  banner: { js: '#!/usr/bin/env node' },
  legalComments: 'none',
  logLevel: 'info',
});
