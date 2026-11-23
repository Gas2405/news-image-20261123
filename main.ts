// The World in One Day — entry program for make.fun's news-image-20261123.
//
// The entry is a single front-page image, entry.png, summing up the world
// news of Monday 23 November 2026. The page was drawn and typeset as
// HTML/CSS/SVG (see design/page.html) and rendered to a 1024x1024 PNG
// with headless Chromium (see design/render.mjs).
//
// The grader runs this program in a container with no network and reads
// only the file it writes, so the program's whole job is to deliver the
// image, byte for byte, to the output directory: MAKEFUN_OUTPUT_DIR when
// that variable is set, /output otherwise.
//
// Run it locally the same way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const imageUrl = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Refuse to run silently with no image: the entry is the image, and a
// missing file here would mean the grader scores an empty submission.
if (!existsSync(imageUrl)) {
  throw new Error(`entry.png is missing next to main.ts (${imageUrl.pathname})`);
}
const { size } = statSync(imageUrl);
if (size === 0) throw new Error('entry.png is empty');
if (size > 1024 * 1024) {
  throw new Error(`entry.png is ${size} bytes, over the 1 MiB limit`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(imageUrl, target);
const written = statSync(target).size;
console.log(`entry.png: wrote ${written} bytes to ${target}`);
