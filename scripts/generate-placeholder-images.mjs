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

// The "CH" monogram from public/favicon.svg (viewBox 0 0 128 128).
// Keep the geometry here in sync with that file — they are the same mark.
const mark = (x, y, size, opacity = 1) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 128 128">
     <g fill="none" stroke="${FG}" stroke-opacity="${opacity}"
        stroke-linecap="round" stroke-linejoin="round">
       <rect x="10" y="10" width="108" height="108" rx="28" stroke-width="8" />
       <path d="M54.3 51.7A16 16 0 1 0 54.3 76.3" stroke-width="9" />
       <path d="M74 48v32M98 48v32M74 64h24" stroke-width="9" />
     </g>
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
