// Converts all PNGs in public/images/ to AVIF — run with: node scripts/regenerate-avif.mjs
import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const imgDir = join(fileURLToPath(new URL('..', import.meta.url)), 'public', 'images');
const pngs = readdirSync(imgDir).filter(f => f.endsWith('.png'));

let totalIn = 0, totalOut = 0;

for (const file of pngs) {
  const src = join(imgDir, file);
  const dest = join(imgDir, file.replace('.png', '.avif'));
  const srcKB = Math.round(statSync(src).size / 1024);
  totalIn += statSync(src).size;

  process.stdout.write(`  ${file.padEnd(30)} ${String(srcKB + 'KB').padStart(7)} → `);

  const meta = await sharp(src).metadata();
  await sharp(src)
    .avif({ quality: meta.hasAlpha ? 82 : 72, effort: 6, chromaSubsampling: '4:4:4' })
    .toFile(dest);

  const outKB = Math.round(statSync(dest).size / 1024);
  totalOut += statSync(dest).size;
  const saving = Math.round((1 - statSync(dest).size / statSync(src).size) * 100);
  console.log(`${String(outKB + 'KB').padStart(7)}  (${saving}% smaller)`);
}

console.log(`\nTotal: ${Math.round(totalIn/1024)}KB → ${Math.round(totalOut/1024)}KB  (${Math.round((1-totalOut/totalIn)*100)}% smaller overall)`);
