// Genera el set completo de iconos/favicon de TuChat a partir del logo actual
// (squircle índigo #4f46e5 con "TC" en blanco). Reconstruye el logo como SVG
// vectorial y deriva favicon.ico (16/32/48/256), icon.svg, icon-192/512.png y
// apple-touch-icon.png (180) para que el logo sea coherente en toda la web.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const BRAND = "#4f46e5";

// SVG del logo (512×512). "TC" reconstruido con geometría para no depender de
// fuentes: T = barra + tronco; C = arco grueso abierto a la derecha.
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${BRAND}"/>
  <g fill="#ffffff">
    <!-- T -->
    <rect x="86" y="180" width="170" height="46" rx="10"/>
    <rect x="148" y="180" width="46" height="172" rx="10"/>
    <!-- C: arco grueso abierto a la derecha -->
    <path d="M404 214
             a92 92 0 1 0 0 124
             l-34 -30
             a48 48 0 1 1 0 -64
             z" />
  </g>
</svg>`;

const svgBuffer = Buffer.from(LOGO_SVG);

async function png(size) {
  return sharp(svgBuffer, { density: 384 }).resize(size, size).png().toBuffer();
}

// Construye un .ico que embebe PNGs (formato soportado desde Vista).
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  const dataChunks = [];
  images.forEach((img, i) => {
    const o = i * 16;
    dir[o] = img.size >= 256 ? 0 : img.size; // 0 = 256
    dir[o + 1] = img.size >= 256 ? 0 : img.size;
    dir[o + 2] = 0; // palette
    dir[o + 3] = 0; // reserved
    dir.writeUInt16LE(1, o + 4); // planes
    dir.writeUInt16LE(32, o + 6); // bpp
    dir.writeUInt32LE(img.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.buf.length;
    dataChunks.push(img.buf);
  });
  return Buffer.concat([header, dir, ...dataChunks]);
}

const sizes = [16, 32, 48, 256];
const icoImages = [];
for (const s of sizes) icoImages.push({ size: s, buf: await png(s) });

writeFileSync("src/app/favicon.ico", buildIco(icoImages));
writeFileSync("public/icon.svg", LOGO_SVG);
writeFileSync("public/icon-192.png", await png(192));
writeFileSync("public/icon-512.png", await png(512));
writeFileSync("public/apple-touch-icon.png", await png(180));

// Vista previa para inspección visual
writeFileSync("/tmp/logo_preview.png", await png(256));

console.log("OK: favicon.ico (16/32/48/256), icon.svg, icon-192, icon-512, apple-touch-icon (180)");
