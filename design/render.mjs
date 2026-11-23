// Renders design/page.html to a 1024x1024 PNG.
//
// Uses the Playwright Chromium headless shell already present under
// ~/.cache/ms-playwright — no network, no browser UI, just a screenshot
// of the local page at exactly 1024 by 1024 pixels.
//
// Run from anywhere:
//   node design/render.mjs [output.png]
// With no argument the PNG lands next to this script as render.png.

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? join(here, 'render.png'));

// Find the headless-shell build that is actually installed, newest first,
// instead of pinning one build number that may have been replaced.
const cache = join(process.env.HOME, '.cache', 'ms-playwright');
const shellDir = readdirSync(cache)
  .filter((name) => name.startsWith('chromium_headless_shell-'))
  .sort()
  .at(-1);
if (!shellDir) throw new Error(`no chromium_headless_shell found under ${cache}`);
const shell = join(cache, shellDir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');

execFileSync(shell, [
  '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1024,1024',
  '--virtual-time-budget=8000',
  `--screenshot=${out}`,
  'file://' + join(here, 'page.html'),
], { stdio: 'inherit' });
console.log('wrote', out);
