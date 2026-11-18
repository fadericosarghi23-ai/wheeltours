// Favicon (ruota della biga, leggibile anche a 16px) e apple-touch-icon (emblema del logo su blu notte).
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PROFILE = [[3, -17], [5.5, -27], [9.5, -47], [8.5, -60], [4.5, -72], [3.6, -80], [6.5, -88], [3.5, -93]];
const right = PROFILE.map(([w, y]) => `${w},${y}`);
const left = [...PROFILE].reverse().map(([w, y]) => `${-w},${y}`);
const spoke = `M0,-14 L${right.join(' L')} L0,-95 L${left.join(' L')} Z`;
const spokes = Array.from({ length: 8 }, (_, i) => `<path d="${spoke}" transform="rotate(${i * 45}) scale(1.15 1)" fill="#00AEEF" stroke="#003355" stroke-width="3"/>`).join('');
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220"><circle r="108" fill="#1B252F"/><circle r="92" fill="none" stroke="#003355" stroke-width="20"/><circle r="92" fill="none" stroke="#00AEEF" stroke-width="13"/>${spokes}<circle r="22" fill="#FFDF00" stroke="#003355" stroke-width="5"/></svg>\n`;
await fs.writeFile(path.join(ROOT, 'public/favicon.svg'), favicon);

const emblem = await sharp(path.join(ROOT, 'public/brand/emblem.svg'), { density: 200 }).resize(150, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#1B252F' } })
  .composite([{ input: emblem, top: 30, left: 15 }])
  .png()
  .toFile(path.join(ROOT, 'public/apple-touch-icon.png'));
console.log('favicon.svg + apple-touch-icon.png');
