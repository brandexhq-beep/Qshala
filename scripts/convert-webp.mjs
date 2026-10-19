import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const TARGET_DIR = path.resolve('public/assets');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function scanAndConvert(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await scanAndConvert(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        const stat = fs.statSync(fullPath);
        if (stat.size === 0) {
          console.log(`[WebP Converter] Skipping 0-byte placeholder: ${entry.name}`);
          continue;
        }

        const parsed = path.parse(fullPath);
        const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

        console.log(`[WebP Converter] Converting: ${path.relative('public', fullPath)} -> ${path.relative('public', webpPath)}`);
        
        try {
          await sharp(fullPath)
            .webp({ quality: 88, effort: 5 })
            .toFile(webpPath);

          // Safely remove the original uncompressed image to prevent repository bloat
          fs.unlinkSync(fullPath);
          console.log(`[WebP Converter] ✓ Converted and cleaned original: ${entry.name}`);
        } catch (err) {
          console.error(`[WebP Converter] ✗ Failed to convert ${entry.name}:`, err.message);
        }
      }
    }
  }
}

console.log('[WebP Converter] Checking for unconverted images in public/assets...');
await scanAndConvert(TARGET_DIR);
console.log('[WebP Converter] Static asset check complete.');
