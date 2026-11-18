// Mappa della zona di Via Cavour 138 nei colori del sito, generata dai dati OpenStreetMap
// (© OpenStreetMap contributors, licenza ODbL). Servita dal nostro dominio: nessun servizio esterno,
// nessun cookie. Uscita: public/img/map-cavour.svg + src/data/map.json (posizione del pin e dei luoghi).
// Uso: node scripts/gen-map.mjs   (scarica una volta, poi usa la cache in .import-cache/osm)
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, '.import-cache/osm');
await fs.mkdir(CACHE, { recursive: true });

// area: centro su Via Cavour 138, abbastanza larga da comprendere Colosseo, Fori e Santa Maria Maggiore
const B = { w: 12.4815, s: 41.8875, e: 12.5035, n: 41.9025 };
const NX = 4, NY = 3;

const nodes = new Map();
const ways = new Map();
for (let ix = 0; ix < NX; ix++) {
  for (let iy = 0; iy < NY; iy++) {
    const w = B.w + ((B.e - B.w) * ix) / NX, e = B.w + ((B.e - B.w) * (ix + 1)) / NX;
    const s = B.s + ((B.n - B.s) * iy) / NY, n = B.s + ((B.n - B.s) * (iy + 1)) / NY;
    const file = path.join(CACHE, `tile-${ix}-${iy}.osm`);
    let xml;
    try {
      xml = await fs.readFile(file, 'utf8');
    } catch {
      const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${w.toFixed(5)},${s.toFixed(5)},${e.toFixed(5)},${n.toFixed(5)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'wheel-tours-site-build/1.0' } });
      xml = await res.text();
      if (!res.ok || !xml.startsWith('<?xml')) throw new Error(`OSM ${res.status}: ${xml.slice(0, 120)}`);
      await fs.writeFile(file, xml);
      await new Promise((r) => setTimeout(r, 1200)); // rispetto dei limiti dell'API
    }
    const doc = parse(xml, { lowerCaseTagName: false });
    for (const nd of doc.querySelectorAll('node')) nodes.set(nd.getAttribute('id'), [Number(nd.getAttribute('lon')), Number(nd.getAttribute('lat'))]);
    for (const wy of doc.querySelectorAll('way')) {
      const tags = Object.fromEntries(wy.querySelectorAll('tag').map((t) => [t.getAttribute('k'), t.getAttribute('v')]));
      ways.set(wy.getAttribute('id'), { refs: wy.querySelectorAll('nd').map((n) => n.getAttribute('ref')), tags });
    }
  }
}
console.log('nodi', nodes.size, 'vie', ways.size);

// proiezione: equirettangolare corretta per la latitudine, viewBox 1200 x 820
const W = 1200;
const kx = Math.cos(((B.s + B.n) / 2) * (Math.PI / 180));
const H = Math.round((W * (B.n - B.s)) / ((B.e - B.w) * kx));
const P = ([lon, lat]) => [((lon - B.w) / (B.e - B.w)) * W, ((B.n - lat) / (B.n - B.s)) * H];
// semplificazione Douglas-Peucker (tolleranza in px del viewBox) per tenere il file leggero
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  let max = 0, idx = 0;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const dist = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (dist > max) (max = dist), (idx = i);
  }
  return max > tol ? [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)] : [a, b];
}
const d = (refs, close, tol = 0.9) => {
  const pts = simplify(refs.map((r) => nodes.get(r)).filter(Boolean).map(P), tol);
  if (pts.length < 2) return '';
  // area minima: gli edifici più piccoli di qualche pixel non si vedono, si scartano
  if (close) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    if (Math.max(...xs) - Math.min(...xs) < 4 && Math.max(...ys) - Math.min(...ys) < 4) return '';
  }
  return 'M' + pts.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join('L') + (close ? 'Z' : '');
};

const ROADS = {
  primary: 10, secondary: 8, tertiary: 6.5, unclassified: 5, residential: 5, living_street: 4.5, pedestrian: 5.5, service: 2.5,
};
const layers = { park: [], building: [], landmark: [], roads: {}, cavour: [] };
let pin = null;
const landmarks = [];
for (const { refs, tags } of ways.values()) {
  const closed = refs[0] === refs[refs.length - 1];
  if (tags['addr:street'] === 'Via Cavour' && tags['addr:housenumber'] === '138') {
    const pts = refs.map((r) => nodes.get(r)).filter(Boolean);
    pin = [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
  }
  if (closed && (tags.leisure === 'park' || tags.landuse === 'grass' || tags.leisure === 'garden' || tags.landuse === 'recreation_ground')) layers.park.push(d(refs, true));
  else if (closed && (tags.historic || tags.tourism === 'attraction') && tags.building) layers.landmark.push(d(refs, true));
  else if (closed && tags.building) layers.building.push(d(refs, true, 1.4));
  else if (tags.highway && ROADS[tags.highway] && tags.area !== 'yes') {
    (layers.roads[tags.highway] ??= []).push(d(refs, false));
    if (tags.name === 'Via Cavour') layers.cavour.push(d(refs, false)); // la via della sede, in cyan
  }
  // luoghi con nome da mostrare
  const name = tags['name:it'] || tags.name;
  if (closed && name && /^(Colosseo|Anfiteatro Flavio|Basilica (Papale )?di Santa Maria Maggiore|Basilica di San Pietro in Vincoli|Foro di Traiano|Mercati di Traiano)/.test(name)) {
    const pts = refs.map((r) => nodes.get(r)).filter(Boolean);
    const c = [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
    if (!landmarks.some((l) => l.name === name)) landmarks.push({ name, lonlat: c });
  }
}
// numero civico come nodo, se non è un edificio
if (!pin) {
  const docs = await fs.readdir(CACHE);
  for (const f of docs) {
    const xml = await fs.readFile(path.join(CACHE, f), 'utf8');
    const m = xml.match(/<node[^>]*lat="([\d.]+)"[^>]*lon="([\d.]+)"[^>]*>(?:(?!<\/node>)[\s\S])*k="addr:housenumber" v="138"(?:(?!<\/node>)[\s\S])*k="addr:street" v="Via Cavour"/);
    if (m) pin = [Number(m[2]), Number(m[1])];
  }
}
if (!pin) pin = [12.4937, 41.8957];
const KNOWN = [
  { name: 'Colosseo', lonlat: [12.4922, 41.8902] },
  { name: 'Fori Imperiali', lonlat: [12.4868, 41.8935] },
  { name: 'Metro Cavour', lonlat: [12.4934, 41.8945] },
];
for (const k of KNOWN) if (!landmarks.some((l) => l.name === k.name)) landmarks.push(k);
console.log('pin', pin, 'luoghi', landmarks.map((l) => l.name));

// colori della palette del sito
const C = { bg: '#1b252f', block: '#202c38', building: '#26333f', park: '#1f3a3a', landmark: '#2c4a5c', road: '#33424f', main: '#3d5060', casing: '#141c24' };
const roadOrder = ['service', 'living_street', 'pedestrian', 'unclassified', 'residential', 'tertiary', 'secondary', 'primary'];
const join = (arr) => arr.filter(Boolean).join('');
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of the area around Via Cavour 138, Rome">`;
svg += `<rect width="${W}" height="${H}" fill="${C.bg}"/>`;
svg += `<path d="${join(layers.park)}" fill="${C.park}"/>`;
svg += `<path d="${join(layers.building)}" fill="${C.building}"/>`;
svg += `<path d="${join(layers.landmark)}" fill="${C.landmark}"/>`;
svg += `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`;
for (const k of roadOrder) if (layers.roads[k]) svg += `<path d="${join(layers.roads[k])}" stroke="${C.casing}" stroke-width="${ROADS[k] + 2}"/>`;
for (const k of roadOrder)
  if (layers.roads[k]) svg += `<path d="${join(layers.roads[k])}" stroke="${['primary', 'secondary', 'tertiary'].includes(k) ? C.main : C.road}" stroke-width="${ROADS[k]}"${['footway', 'path', 'steps'].includes(k) ? ' stroke-dasharray="3 4"' : ''}/>`;
svg += `<path d="${join(layers.cavour)}" stroke="#00b8f2" stroke-width="5" stroke-opacity="0.85"/>`; // Via Cavour, la via della sede
svg += `</g></svg>\n`;

await fs.mkdir(path.join(ROOT, 'public/img'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'public/img/map-cavour.svg'), svg);
const pct = ([lon, lat]) => {
  const [x, y] = P([lon, lat]);
  return { x: +((x / W) * 100).toFixed(2), y: +((y / H) * 100).toFixed(2) };
};
await fs.writeFile(
  path.join(ROOT, 'src/data/map.json'),
  JSON.stringify({ width: W, height: H, pin: pct(pin), landmarks: landmarks.map((l) => ({ name: l.name, ...pct(l.lonlat) })), attribution: '© OpenStreetMap contributors' }, null, 2),
);
console.log('svg KB', Math.round(svg.length / 1024), 'viewBox', W, H);
