// Vettorializza il logo originale di wheel.tours (sul sito esiste solo in PNG).
// Emblema (biga) dal PNG 1080px, scritta WHEEL.TOURS bianca dal PNG 683px dell'header.
// I colori di riempimento sono quelli misurati nei PNG, non scelti a occhio.
// Uscita: public/brand/emblem.svg, wordmark-dark.svg, wordmark-light.svg
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import potrace from 'potrace';

const ROOT = path.resolve(import.meta.dirname, '..');
const REF = path.join(ROOT, 'scripts/reference');

async function layerPaths(file, crop, test, { scale = 4, blur = 1.2, turdSize = 12, exclude = null } = {}) {
  const img = sharp(path.join(REF, file)).extract(crop).ensureAlpha();
  const { data, info } = await img
    .resize({ width: crop.width * scale, kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const out = Buffer.alloc(W * H * 3, 255);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    const x = (i % W) / scale, y = Math.floor(i / W) / scale; // coordinate del ritaglio
    if (a > 120 && test(r, g, b) && !(exclude && exclude(x, y))) out.fill(0, i * 3, i * 3 + 3);
  }
  const png = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).blur(blur).png().toBuffer();
  const svg = await new Promise((res, rej) =>
    potrace.trace(png, { turdSize, optTolerance: 1.0, alphaMax: 1.0, threshold: 128 }, (e, s) => (e ? rej(e) : res(s))),
  );
  const rescale = (d) => d.replace(/-?\d+(\.\d+)?/g, (n) => String(Math.round(Number(n) / scale)));
  return [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => rescale(m[1])).join(' ');
}

const isCyan = (r, g, b) => b > 150 && r < 120 && g > 110;
const isDark = (r, g, b) => r < 70 && g < 90 && b < 130;
const isWhite = (r, g, b) => r > 215 && g > 215 && b > 215;
const isBlueEdge = (r, g, b) => b > 150 && r < 140 && g < 120; // contorno viola/blu della scritta

// emblema: la biga occupa la parte alta del PNG 1080 (la scritta inizia a y ~ 925)
const EM = { left: 0, top: 60, width: 1080, height: 860 };
const emblem = {
  viewBox: `0 0 ${EM.width} ${EM.height}`,
  dark: await layerPaths('Wheel.tours-logo-text-1080px-t.png', EM, isDark, { scale: 1, blur: 0.8 }),
  cyan: await layerPaths('Wheel.tours-logo-text-1080px-t.png', EM, isCyan, { scale: 1, blur: 0.8 }),
  white: await layerPaths('Wheel.tours-logo-text-1080px-t.png', EM, isWhite, { scale: 1, blur: 0.8, turdSize: 20 }),
};

// corpo della biga SENZA la ruota, per il logo 3D: al posto della ruota disegnata si monta
// la ruota 3D che gira. Ruota misurata sul PNG 1080: mozzo (883, 777), cerchione entro r 166 da (875, 780).
export const WHEEL = { hubX: 883, hubY: 777 - EM.top, radius: 150 };
const inWheel = (x, y) => Math.hypot(x - 875, y - (780 - EM.top)) < 166;
const body = {
  dark: await layerPaths('Wheel.tours-logo-text-1080px-t.png', EM, isDark, { scale: 1, blur: 0.8, exclude: inWheel }),
  cyan: await layerPaths('Wheel.tours-logo-text-1080px-t.png', EM, isCyan, { scale: 1, blur: 0.8, exclude: inWheel }),
  white: await layerPaths('Wheel.tours-logo-text-1080px-t.png', EM, isWhite, { scale: 1, blur: 0.8, turdSize: 20, exclude: inWheel }),
};

// scritta per fondo chiaro (navy con bordo cyan) dal PNG 1080
const WM_LIGHT = { left: 190, top: 925, width: 700, height: 100 };
const wordmarkLight = {
  viewBox: `0 0 ${WM_LIGHT.width} ${WM_LIGHT.height}`,
  edge: await layerPaths('Wheel.tours-logo-text-1080px-t.png', WM_LIGHT, isCyan, { scale: 3 }),
  fill: await layerPaths('Wheel.tours-logo-text-1080px-t.png', WM_LIGHT, isDark, { scale: 3 }),
};

// scritta per fondo scuro (bianca con ombra blu) dal PNG dell'header
const WM_DARK = { left: 168, top: 28, width: 515, height: 82 };
const wordmarkDark = {
  viewBox: `0 0 ${WM_DARK.width} ${WM_DARK.height}`,
  fill: await layerPaths('Wheel.Tours-logo-site-700px-t.png', WM_DARK, (r, g, b) => r > 200 && g > 200 && b > 200, { scale: 6, blur: 1.6 }),
};

const P = (d, fill, extra = '') => `<path fill-rule="evenodd" fill="${fill}" ${extra} d="${d}"/>`;
const svg = (vb, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>
`;
const files = {
  // biga completa (contorni navy, corpo cyan, aquila bianca)
  'emblem.svg': svg(emblem.viewBox, P(emblem.dark, '#003355') + P(emblem.cyan, '#00AEEF') + P(emblem.white, '#FFFFFF'), 'Wheel Tours'),
  // scritta bianca con contorno blu, per fondo scuro (header del sito attuale)
  'wordmark-dark.svg': svg(wordmarkDark.viewBox, P(wordmarkDark.fill, '#FFFFFF', 'stroke="#1A22DD" stroke-width="2" paint-order="stroke"'), 'WHEEL.TOURS'),
  // scritta navy con bordo cyan, per fondo chiaro
  // corpo senza ruota per il 3D; data-wheel = mozzo e raggio della ruota nel sistema del viewBox
  'emblem-body.svg': svg(emblem.viewBox, P(body.dark, '#003355') + P(body.cyan, '#00AEEF') + P(body.white, '#FFFFFF'), 'Wheel Tours').replace('<svg ', `<svg data-wheel="${WHEEL.hubX},${WHEEL.hubY},${WHEEL.radius}" `),
  'wordmark-light.svg': svg(wordmarkLight.viewBox, P(wordmarkLight.edge, '#00AEEF') + P(wordmarkLight.fill, '#003355'), 'WHEEL.TOURS'),
};
const dir = path.join(ROOT, 'public/brand');
await fs.mkdir(dir, { recursive: true });
for (const [name, body] of Object.entries(files)) {
  await fs.writeFile(path.join(dir, name), body);
  console.log(name, Math.round(body.length / 1024) + ' KB');
}
