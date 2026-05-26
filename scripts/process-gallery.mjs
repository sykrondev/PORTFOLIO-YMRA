import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DEFAULT_SRC = 'C:\\Users\\Yamir\\Downloads\\FOTOS';
const OUT_DIR = path.resolve('public/images/gallery');
const THUMB_DIR = path.resolve('public/images/gallery/thumbs');
const MANIFEST_PATH = path.resolve('src/content/gallery.manifest.json');
const MAX_WIDTH = 1400;
const THUMB_WIDTH = 400;
const JPEG_QUALITY = 82;

const CATEGORY_RULES = [
  { id: 'liderazgo', re: /liderazgo|l[ií]der|jefe|gerente|operador l[ií]der/i },
  { id: 'seguridad', re: /seguridad|raev|simulac|inspecci[oó]n|bomberos|higiene|emergencia|desv[ií]o|reconocimiento seguro/i },
  { id: 'auditoria', re: /auditor[ií]a/i },
  { id: 'capacitacion', re: /charlas|clases|entrenamiento|capacitaci[oó]n|instructor/i },
  { id: 'operaciones', re: /operaciones|planta|turno|ruta|distribuci[oó]n|abastecimiento|almacenamiento|sala de control|embarque|transporte|flota|combustible|log[ií]stic/i },
  { id: 'proyectos', re: /proyecto|inicio proyecto|alianza|importaciones|despachos|centro de distribuci[oó]n/i },
  { id: 'academia', re: /universidad|tesis|ingenieros log[ií]sticos|facultad/i },
  { id: 'militar', re: /ej[eé]rcito|entrenamiento militar|oficiales/i },
  { id: 'reconocimiento', re: /reconocimiento/i },
  { id: 'reuniones', re: /reuni[oó]n|cuatrimestral|administraci[oó]n y especialistas/i },
];

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function cleanCaption(filename) {
  let base = path.basename(filename, path.extname(filename));
  base = base.replace(/\s+/g, ' ').trim();
  return base;
}

function inferCategories(caption) {
  const cats = CATEGORY_RULES.filter((r) => r.re.test(caption)).map((r) => r.id);
  return cats.length > 0 ? cats : ['operaciones'];
}

async function processImage(inputPath, id) {
  const outPath = path.join(OUT_DIR, `${id}.jpg`);
  const thumbPath = path.join(THUMB_DIR, `${id}.jpg`);

  let pipeline = sharp(inputPath).rotate();
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outPath);

  await sharp(outPath)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(thumbPath);

  return {
    src: `/images/gallery/${id}.jpg`,
    thumbSrc: `/images/gallery/thumbs/${id}.jpg`,
  };
}

async function main() {
  const srcDir = process.argv[2] ?? DEFAULT_SRC;
  if (!fs.existsSync(srcDir)) {
    console.error(`Source folder not found: ${srcDir}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(THUMB_DIR, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, 'es'));

  const used = new Set();
  const manifest = [];

  for (const file of files) {
    const captionEs = cleanCaption(file);
    let id = slugify(captionEs);
    if (!id) id = `foto-${manifest.length + 1}`;
    if (used.has(id)) {
      let n = 2;
      while (used.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }
    used.add(id);

    const paths = await processImage(path.join(srcDir, file), id);
    const categories = inferCategories(captionEs);

    manifest.push({
      id,
      ...paths,
      captionEs,
      alt: captionEs,
      categories,
    });
    console.log(`✓ ${id}.jpg`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nProcessed ${manifest.length} photos → ${OUT_DIR}`);
  console.log(`Manifest → ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
