/**
 * Draws the product illustration for the portable power station.
 *
 * The photo shoot for this SKU does not exist yet, and an AI-generated "photo"
 * of a product is a misleading asset for a B2B catalogue. This renders a clean
 * vector illustration instead — recognisably the product, obviously an
 * illustration — so the flagship card and the product page are not broken while
 * the real photograph is pending. Replace
 * client/public/images/products/power-station.jpg with the real shot and this
 * script becomes obsolete.
 *
 * Run: node tools/make-power-station-image.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'client', 'public', 'images', 'products');
const outFile = path.join(outDir, 'power-station.jpg');

const W = 1200;
const H = 900;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7f9fc"/>
      <stop offset="1" stop-color="#e6ebf2"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b4046"/>
      <stop offset="1" stop-color="#23262a"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1e21"/>
      <stop offset="1" stop-color="#111315"/>
    </linearGradient>
    <linearGradient id="handle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a5057"/>
      <stop offset="1" stop-color="#2b2f33"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#38bdf8" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- contact shadow -->
  <ellipse cx="600" cy="742" rx="300" ry="34" fill="#0f172a" opacity="0.16" filter="url(#soft)"/>

  <!-- handle -->
  <path d="M470 318 V250 a26 26 0 0 1 26 -26 h208 a26 26 0 0 1 26 26 v68"
        fill="none" stroke="url(#handle)" stroke-width="26" stroke-linecap="round"/>

  <!-- body -->
  <rect x="330" y="300" width="540" height="410" rx="34" fill="url(#body)"/>
  <rect x="330" y="300" width="540" height="410" rx="34" fill="none" stroke="#52585f" stroke-width="2"/>

  <!-- side vents -->
  <g fill="#161a1d" opacity="0.9">
    <rect x="336" y="380" width="10" height="120" rx="5"/>
    <rect x="352" y="380" width="10" height="120" rx="5"/>
    <rect x="368" y="380" width="10" height="120" rx="5"/>
  </g>

  <!-- front panel -->
  <rect x="382" y="360" width="436" height="300" rx="22" fill="url(#panel)"/>
  <rect x="382" y="360" width="436" height="300" rx="22" fill="none" stroke="#3a4046" stroke-width="2"/>

  <!-- display -->
  <rect x="432" y="392" width="336" height="92" rx="14" fill="#0a0d10" stroke="#31567a" stroke-width="2"/>
  <ellipse cx="600" cy="438" rx="150" ry="46" fill="url(#glow)"/>
  <text x="456" y="428" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#7dd3fc">512Wh</text>
  <text x="456" y="462" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#9fb6c9">LiFePO4 · 500W · 1000W surge</text>
  <g fill="#34d399">
    <rect x="700" y="400" width="52" height="10" rx="5"/>
    <rect x="700" y="416" width="34" height="10" rx="5" opacity="0.7"/>
  </g>

  <!-- AC sockets -->
  <g>
    <circle cx="470" cy="566" r="42" fill="#2a2e33" stroke="#454b52" stroke-width="3"/>
    <circle cx="470" cy="566" r="27" fill="#15181b"/>
    <rect x="454" y="558" width="10" height="16" rx="3" fill="#5b636b"/>
    <rect x="476" y="558" width="10" height="16" rx="3" fill="#5b636b"/>
  </g>
  <g>
    <circle cx="592" cy="566" r="42" fill="#2a2e33" stroke="#454b52" stroke-width="3"/>
    <circle cx="592" cy="566" r="27" fill="#15181b"/>
    <rect x="576" y="558" width="10" height="16" rx="3" fill="#5b636b"/>
    <rect x="598" y="558" width="10" height="16" rx="3" fill="#5b636b"/>
  </g>

  <!-- USB / car outputs -->
  <g>
    <rect x="676" y="534" width="34" height="14" rx="4" fill="#15181b" stroke="#454b52" stroke-width="2"/>
    <rect x="722" y="534" width="34" height="14" rx="7" fill="#15181b" stroke="#454b52" stroke-width="2"/>
    <rect x="768" y="532" width="22" height="18" rx="4" fill="#15181b" stroke="#454b52" stroke-width="2"/>
    <circle cx="700" cy="592" r="22" fill="#15181b" stroke="#454b52" stroke-width="3"/>
    <circle cx="700" cy="592" r="8" fill="#5b636b"/>
  </g>

  <!-- labels -->
  <text x="432" y="640" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#7c848c">AC 220V · USB-A · USB-C PD · 12V</text>

  <!-- caption -->
  <text x="600" y="800" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#0f2d5e">500W Portable Power Station</text>
  <text x="600" y="836" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="19" fill="#64748b">Product illustration — photograph available on request</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(outFile);
console.log(`✓ wrote ${path.relative(root, outFile)} (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
