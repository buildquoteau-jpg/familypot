// Drop any .png or .avif files into the project root, then run:
//   node scripts/import-images.mjs
//
// This script:
//   1. Converts every .png in the root to .avif (if not already present)
//   2. Moves both .png and .avif into public/images/
//   3. Reports what it did

import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync, renameSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dir = fileURLToPath(new URL('..', import.meta.url));
const dest  = join(__dir, 'public', 'images');

mkdirSync(dest, { recursive: true });

const rootFiles = readdirSync(__dir).filter(f => /\.(png|avif|jpg|jpeg|webp)$/i.test(f));

if (rootFiles.length === 0) {
  console.log('No image files found in project root. Drop PNGs here then run again.');
  process.exit(0);
}

for (const file of rootFiles) {
  const src  = join(__dir, file);
  const base = basename(file, extname(file));
  const ext  = extname(file).toLowerCase();

  // Convert PNG/JPG → AVIF if we don't have one yet
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
    const avifDest = join(dest, `${base}.avif`);
    if (!existsSync(avifDest)) {
      process.stdout.write(`  Converting  ${file} → ${base}.avif … `);
      await sharp(src)
        .avif({ quality: 72, effort: 6 })
        .toFile(avifDest);
      console.log('done');
    } else {
      console.log(`  Skipped     ${base}.avif already exists`);
    }
    // Move the PNG to public/images/ as fallback
    const pngDest = join(dest, file);
    if (!existsSync(pngDest)) {
      renameSync(src, pngDest);
      console.log(`  Moved       ${file} → public/images/`);
    } else {
      // Already there — just remove the root copy
      renameSync(src, join(dest, file));
      console.log(`  Updated     ${file} → public/images/`);
    }
  } else if (ext === '.avif') {
    // Move AVIF directly
    const avifDest = join(dest, file);
    renameSync(src, avifDest);
    console.log(`  Moved       ${file} → public/images/`);
  }
}

console.log('\nDone. All images are in public/images/');
