/**
 * Generates social share images at the 1.91:1 ratio (1200x630) that
 * Facebook, X, LinkedIn and Slack expect.
 *
 * Previously og:image pointed at whatever product/hero JPEG the page used —
 * mostly 1200x800 or 1200x1800 portrait. Those get centre-cropped by every
 * platform, usually cutting the product out of frame or clipping the logo.
 *
 * Output: client/public/images/og/<name>.jpg (1200x630, quality 82)
 *
 * Run: node tools/generate-og-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'client', 'public', 'images');
const ogDir = path.join(imagesDir, 'og');

const OG_W = 1200;
const OG_H = 630;
const NAVY = { r: 15, g: 45, b: 94 };

fs.mkdirSync(ogDir, { recursive: true });

/** Sources that need a share card. */
const sources = [
  { src: 'hero-solar.jpg', out: 'home.jpg' },
  { src: 'hero-factory.jpg', out: 'factory.jpg' },
  { src: 'about-team.jpg', out: 'about.jpg' },
  { src: 'africa-market.jpg', out: 'services.jpg' },
  { src: 'hero-3c.jpg', out: 'news.jpg' },
  { src: 'products/solar-panel.jpg', out: 'products.jpg' },
  { src: 'products/solar-inverter.jpg', out: 'product-solar-inverter.jpg' },
  { src: 'products/lithium-battery.jpg', out: 'product-lithium-battery.jpg' },
  { src: 'products/air-fryer.jpg', out: 'product-air-fryer.jpg' },
  { src: 'products/smart-watch.jpg', out: 'product-smart-watch.jpg' },
  { src: 'products/power-bank.jpg', out: 'product-power-bank.jpg' },
  { src: 'products/blender.jpg', out: 'product-blender.jpg' },
  { src: 'products/solar-street-light.jpg', out: 'product-solar-street-light.jpg' },
  { src: 'products/tws-earbuds.jpg', out: 'product-tws-earbuds.jpg' },
  { src: 'products/sd-card.jpg', out: 'product-sd-card.jpg' },
  { src: 'products/charge-controller.jpg', out: 'product-charge-controller.jpg' },
  { src: 'products/rice-cooker.jpg', out: 'product-rice-cooker.jpg' },
];

let made = 0;
for (const { src, out } of sources) {
  const abs = path.join(imagesDir, src);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠ missing ${src}`);
    continue;
  }

  // Cover-crop to the exact ratio, then place on a navy canvas so nothing is
  // stretched. `attention` keeps the most detailed region in frame.
  const artwork = await sharp(abs)
    .resize(OG_W, OG_H, { fit: 'cover', position: 'attention' })
    .toBuffer();

  await sharp({
    create: { width: OG_W, height: OG_H, channels: 3, background: NAVY },
  })
    .composite([{ input: artwork }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ogDir, out));

  made++;
}

console.log(`✓ generated ${made} OG images at ${OG_W}x${OG_H} in client/public/images/og/`);
