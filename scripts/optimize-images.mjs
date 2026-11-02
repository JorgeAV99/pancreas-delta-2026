import sharp from 'sharp';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'fotos');
const out = path.join(root, 'public', 'images');
const config = JSON.parse(await readFile(path.join(import.meta.dirname, 'crops.json'), 'utf8'));

const exists = (p) => access(p).then(() => true, () => false);

function cropBox(meta, crop, ratio) {
  const H = meta.height;
  const W = meta.width;
  let h = Math.round(crop.h * H);
  let w = Math.round(h * ratio);
  if (w > W) {
    w = W;
    h = Math.round(w / ratio);
  }
  const left = Math.min(Math.max(0, Math.round(crop.cx * W - w / 2)), W - w);
  const top = Math.min(Math.max(0, Math.round(crop.cy * H - h / 2)), H - h);
  return { left, top, width: w, height: h };
}

const manifest = { generatedAt: new Date().toISOString(), files: [] };

for (const item of config.items) {
  const file = path.join(source, item.source);
  if (!(await exists(file))) {
    console.warn(`· falta ${item.source}, se usará fallback`);
    continue;
  }
  const meta = await sharp(file).rotate().metadata();
  const box = cropBox(meta, item.crop, item.ratio);
  await mkdir(path.join(out, item.folder), { recursive: true });
  for (const width of item.widths) {
    const target = path.join(out, item.folder, `${item.id}-${width}.webp`);
    await sharp(file)
      .rotate()
      .extract(box)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: item.quality ?? 76, effort: 6 })
      .toFile(target);
    manifest.files.push(path.relative(root, target).replaceAll('\\', '/'));
  }
  if (item.og) {
    const target = path.join(root, 'public', 'og.jpg');
    const ogBox = cropBox(meta, item.og, 1200 / 630);
    await sharp(file)
      .rotate()
      .extract(ogBox)
      .resize(1200, 630)
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(target);
    manifest.files.push('public/og.jpg');
  }
  console.log(`✓ ${item.source} → ${item.folder}/${item.id} [${box.width}×${box.height}]`);
}

await writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
