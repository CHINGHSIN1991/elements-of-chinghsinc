/**
 * Generates the placeholder images the site references but does not ship:
 *
 *   public/images/image-default.jpg        default og:image / twitter:image
 *   public/assets/images/fallback-image.png  card image when an entry has no cover
 *
 * These are functional placeholders so social previews and cards stop 404ing.
 * Replace them with real artwork when you have it — then this script and its
 * npm alias can be deleted.
 *
 * Run with: npm run images:placeholders
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteData = JSON.parse(
  await import('node:fs/promises').then((fs) =>
    fs.readFile(resolve(root, 'src/data/siteData.json'), 'utf8')
  )
);

const BG = '#0f172a'; // siteData.themeColor
const FG = '#ffffff';
const MUTED = '#94a3b8';

// The logo mark from public/favicon.svg (viewBox 0 0 128 128).
const MARK_PATH =
  'M50.4 78.5a75.1 75.1 0 0 0-28.5 6.9l24.2-65.7c.7-2 1.9-3.2 3.4-3.2h29c1.5 0 2.7 1.2 3.4 3.2l24.2 65.7s-11.6-7-28.5-7L67 45.5c-.4-1.7-1.6-2.8-2.9-2.8-1.3 0-2.5 1.1-2.9 2.7L50.4 78.5Zm-1.1 28.2Zm-4.2-20.2c-2 6.6-.6 15.8 4.2 20.2a17.5 17.5 0 0 1 .2-.7 5.5 5.5 0 0 1 5.7-4.5c2.8.1 4.3 1.5 4.7 4.7.2 1.1.2 2.3.2 3.5v.4c0 2.7.7 5.2 2.2 7.4a13 13 0 0 0 5.7 4.9v-.3l-.2-.3c-1.8-5.6-.5-9.5 4.4-12.8l1.5-1a73 73 0 0 0 3.2-2.2 16 16 0 0 0 6.8-11.4c.3-2 .1-4-.6-6l-.8.6-1.6 1a37 37 0 0 1-22.4 2.7c-5-.7-9.7-2-13.2-6.2Z';

const mark = (x, y, size, opacity = 1) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 128 128">
     <path d="${MARK_PATH}" fill="${FG}" fill-opacity="${opacity}" />
   </svg>`;

// Matches the radial accents used on the site's hero sections.
const accents = (w, h) => `
  <defs>
    <radialGradient id="a" cx="25%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="b" cx="80%" cy="85%" r="55%">
      <stop offset="0%" stop-color="#7877c6" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#7877c6" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${BG}" />
  <rect width="${w}" height="${h}" fill="url(#a)" />
  <rect width="${w}" height="${h}" fill="url(#b)" />`;

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** og:image — 1200x630 is what components/layout/Seo.astro declares. */
function ogImageSvg() {
  const w = 1200;
  const h = 630;
  const host = new URL(siteData.site).host;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    ${accents(w, h)}
    ${mark(w / 2 - 56, 148, 112)}
    <text x="${w / 2}" y="384" text-anchor="middle" font-family="sans-serif"
          font-size="62" font-weight="700" fill="${FG}">${escape(siteData.title)}</text>
    <text x="${w / 2}" y="446" text-anchor="middle" font-family="sans-serif"
          font-size="28" fill="${MUTED}">${escape(host)}</text>
    <rect x="${w / 2 - 40}" y="502" width="80" height="3" rx="1.5" fill="${FG}" fill-opacity="0.35" />
  </svg>`;
}

/** Card fallback — cards render inside an aspect-video (16:9) box. */
function fallbackImageSvg() {
  const w = 800;
  const h = 450;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    ${accents(w, h)}
    ${mark(w / 2 - 44, h / 2 - 60, 88, 0.32)}
    <text x="${w / 2}" y="${h / 2 + 74}" text-anchor="middle" font-family="sans-serif"
          font-size="20" fill="${MUTED}" fill-opacity="0.8">No image</text>
  </svg>`;
}

async function emit(relPath, svg, encode) {
  const outPath = resolve(root, relPath);
  await mkdir(dirname(outPath), { recursive: true });
  const buf = await encode(sharp(Buffer.from(svg))).toBuffer();
  await writeFile(outPath, buf);
  const { width, height } = await sharp(buf).metadata();
  console.log(`  ${relPath}  ${width}x${height}  ${(buf.length / 1024).toFixed(1)} kB`);
}

console.log('Generating placeholder images:');
await emit('public/images/image-default.jpg', ogImageSvg(), (s) =>
  s.jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
);
await emit('public/assets/images/fallback-image.png', fallbackImageSvg(), (s) =>
  s.png({ compressionLevel: 9 })
);
