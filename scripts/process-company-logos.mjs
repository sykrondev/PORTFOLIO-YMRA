/**
 * Process company/institution logos for light + dark themes.
 *
 * Light output: public/logos/{slug}.png (white/near-white → transparent)
 * Dark output:  public/logos/dark/{slug}.png
 *
 * For illegible logos in dark mode, add a dedicated file under:
 *   {source}/oscuro/   (same filename conventions as the main folder)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DEFAULT_SRC = 'C:\\Users\\Yamir\\Downloads\\ICONOS EMPRESAS';
const OUT_DIR = path.resolve('public/logos');
const OUT_DIR_DARK = path.join(OUT_DIR, 'dark');
const OUT_DIR_BAND_DARK = path.join(OUT_DIR, 'band-dark');
const MAX_WIDTH = 320;
const WHITE_THRESHOLD = 240;
const VINARA_BG = [72, 110, 74];
const BAND_DARK_SOURCE_OVERRIDES = {
  vinara: 'C:\\Users\\Yamir\\Downloads\\ICONOS EMPRESAS\\vinara trans darkmode.png',
};

function cleanLogoPixels(data, aggressive = false) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let a = data[i + 3];

    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
      continue;
    }

    if (a === 0) continue;

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const sat = mx ? (mx - mn) / mx : 0;

    const lumCutoff = aggressive ? 200 : 226;
    const satCutoff = aggressive ? 0.3 : 0.24;

    if (lum >= lumCutoff && sat < satCutoff) {
      data[i + 3] = 0;
      continue;
    }

    const softLum = aggressive ? 140 : 165;
    const softSat = aggressive ? 0.22 : 0.17;
    if (lum >= softLum && sat < softSat) {
      const t = Math.min(1, (lum - softLum) / (aggressive ? 60 : 75));
      a = Math.round(a * Math.max(0, 1 - t * (aggressive ? 1.8 : 1.4)));
      data[i + 3] = a;
    }
  }
}

async function removeNearWhiteBackground(buffer, aggressive = false) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  cleanLogoPixels(data, aggressive);

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function removeVinaraBackground(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a === 0) continue;

    const dr = r - VINARA_BG[0];
    const dg = g - VINARA_BG[1];
    const db = b - VINARA_BG[2];
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);

    if (distance <= 44) {
      data[i + 3] = 0;
      continue;
    }

    if (distance <= 72) {
      const fade = (distance - 44) / (72 - 44);
      data[i + 3] = Math.round(a * fade);
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

const SLUG_RULES = [
  { slug: 'albemarle', match: (n) => /^albemarle/i.test(n) },
  { slug: 'antofagasta-minerals', match: (n) => /antofagasta/i.test(n) && !/^epa/i.test(n) },
  { slug: 'ati', match: (n) => /^ati/i.test(n) },
  { slug: 'bechtel', match: (n) => /^bechtel/i.test(n) },
  { slug: 'bhp', match: (n) => /^bhp/i.test(n) },
  { slug: 'bureau-veritas', match: (n) => /^bureau/i.test(n) },
  { slug: 'cademartori', match: (n) => /^cademartori/i.test(n) },
  { slug: 'cesmec', match: (n) => /^cesmec/i.test(n) },
  { slug: 'codelco', match: (n) => /^codelco/i.test(n) },
  { slug: 'copec', match: (n) => /^copec/i.test(n) },
  { slug: 'enaex', match: (n) => /^enaex/i.test(n) },
  { slug: 'enex', match: (n) => /^enex/i.test(n) },
  { slug: 'engie', match: (n) => /^engie/i.test(n) },
  { slug: 'epa', match: (n) => /^epa/i.test(n) },
  { slug: 'fcab', match: (n) => /^fcab/i.test(n) },
  { slug: 'finning', match: (n) => /^finning/i.test(n) },
  { slug: 'hualpen', match: (n) => /^hualp/i.test(n) },
  { slug: 'komatsu', match: (n) => /^komatsu\.svg$/i.test(n) },
  { slug: 'maxam', match: (n) => /^maxam/i.test(n) },
  { slug: 'michelin', match: (n) => /^michelin/i.test(n) },
  { slug: 'orica', match: (n) => /^orica/i.test(n) },
  { slug: 'puerto-angamos', match: (n) => /puerto.*angamos|angamos/i.test(n) },
  { slug: 'rcl', match: (n) => /^rcl/i.test(n) },
  { slug: 'sqm', match: (n) => /^sqm/i.test(n) },
  { slug: 'teck', match: (n) => /^teck/i.test(n) },
  { slug: 'transportes-cinco', match: (n) => /transportes.*cinco|cinco/i.test(n) && /transportes/i.test(n) },
  { slug: 'tur-bus', match: (n) => /turbus/i.test(n) },
  { slug: 'tuv-rheinland', match: (n) => /rhein/i.test(n) || (/t.v/i.test(n) && /rhein/i.test(n)) || /^t.v/i.test(n) },
  { slug: 'unab', match: (n) => /andr.s bello/i.test(n) },
  { slug: 'unap', match: (n) => /arturo prat/i.test(n) },
  { slug: 'ejercito-chile', match: (n) => /ej.rcito/i.test(n) },
  { slug: 'viggo', match: (n) => /^viggo/i.test(n) },
  { slug: 'vinara', match: (n) => /vinara/i.test(n) },
];

function resolveSlug(filename) {
  for (const rule of SLUG_RULES) {
    if (rule.match(filename)) return rule.slug;
  }
  return null;
}

function listSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !fs.statSync(path.join(dir, f)).isDirectory());
}

async function processFile(inputPath, slug, outDir, aggressive = false) {
  const outPath = path.join(outDir, `${slug}.png`);
  let pipeline = sharp(inputPath).rotate();

  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const midBuffer = await pipeline.png().toBuffer();
  if (slug === 'vinara') {
    const greenCleaned = await removeVinaraBackground(midBuffer);
    pipeline = await removeNearWhiteBackground(await greenCleaned.png().toBuffer(), aggressive);
  } else {
    pipeline = await removeNearWhiteBackground(midBuffer, aggressive);
  }
  pipeline = pipeline.trim({ threshold: 10 });

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
}

async function buildSlugMap(srcDir) {
  const files = listSourceFiles(srcDir);
  const map = new Map();

  for (const file of files) {
    const slug = resolveSlug(file);
    if (!slug) {
      console.warn(`⚠ Skipped (no slug): ${file}`);
      continue;
    }
    if (map.has(slug)) {
      console.warn(`⚠ Duplicate slug ${slug}, skipping ${file}`);
      continue;
    }
    map.set(slug, path.join(srcDir, file));
  }

  return map;
}

async function main() {
  const srcDir = process.argv[2] ?? DEFAULT_SRC;
  if (!fs.existsSync(srcDir)) {
    console.error(`Source folder not found: ${srcDir}`);
    process.exit(1);
  }

  const darkSrcDir = path.join(srcDir, 'oscuro');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR_DARK, { recursive: true });
  fs.mkdirSync(OUT_DIR_BAND_DARK, { recursive: true });

  const lightMap = await buildSlugMap(srcDir);
  const darkMap = await buildSlugMap(darkSrcDir);

  const allSlugs = new Set([...lightMap.keys(), ...darkMap.keys()]);

  for (const slug of allSlugs) {
    const lightInput = lightMap.get(slug);
    const darkInput = darkMap.get(slug);

    if (lightInput) {
      await processFile(lightInput, slug, OUT_DIR, false);
      console.log(`✓ light  ${slug}.png`);
    }

    if (darkInput) {
      await processFile(darkInput, slug, OUT_DIR_DARK, false);
      console.log(`✓ dark   ${slug}.png (oscuro/)`);
    } else if (lightInput) {
      await processFile(lightInput, slug, OUT_DIR_DARK, true);
      console.log(`↳ dark   ${slug}.png (fallback from light)`);
    } else {
      await processFile(darkInput, slug, OUT_DIR_DARK, false);
      console.log(`✓ dark   ${slug}.png (oscuro/ only)`);
    }
  }

  for (const [slug, overridePath] of Object.entries(BAND_DARK_SOURCE_OVERRIDES)) {
    if (!fs.existsSync(overridePath)) continue;
    await processFile(overridePath, slug, OUT_DIR_BAND_DARK, false);
    console.log(`✓ band-dark ${slug}.png`);
  }

  console.log(`\nProcessed ${allSlugs.size} slugs → ${OUT_DIR} + ${OUT_DIR_DARK} + ${OUT_DIR_BAND_DARK}`);
  if (!fs.existsSync(darkSrcDir)) {
    console.log(`\nTip: add light-on-dark wordmarks in ${darkSrcDir} for better dark-mode legibility.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
