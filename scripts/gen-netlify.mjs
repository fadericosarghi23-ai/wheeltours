// Genera netlify.toml (build, Node, header, 301 dai vecchi indirizzi WordPress, fallback SPA),
// public/sitemap.xml (EN + IT con hreflang) e public/robots.txt.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const SITE = 'https://www.wheel.tours';

const r = [];
const add = (from, to, extra = '') => r.push(`[[redirects]]\n  from = "${from}"\n  to = "${to}"\n  status = 301\n  force = true${extra}\n`);

// pagine del vecchio sito (sitemap Yoast: / e /terms/)
add('/terms/', '/terms');
add('/home', '/');
add('/home/', '/');
add('/index.php', '/');
// ID WordPress della pagina terms (la home ?page_id=47 è già la home: nessun redirect, eviterebbe un loop)
add('/', '/terms', '\n  query = {page_id = "3"}');
// sitemap e feed di WordPress/Yoast
add('/sitemap_index.xml', '/sitemap.xml');
add('/page-sitemap.xml', '/sitemap.xml');
add('/post-sitemap.xml', '/sitemap.xml');
add('/feed', '/');
add('/feed/', '/');
add('/comments/feed/', '/');
// foto della libreria media: i vecchi indirizzi (anche indicizzati da Google Immagini) puntano ai WebP nuovi
for (const p of c.photos) {
  const old = new URL(p.original).pathname;
  add(old, p.sizes.lg.src);
  add(old + '.webp', p.sizes.lg.src); // versione WebP generata da LiteSpeed
}
// loghi originali
add('/wp-content/uploads/2021/05/Wheel.Tours-logo-site-700px-t.png', '/brand/wordmark-dark.svg');
add('/wp-content/uploads/2021/05/Wheel.tours-logo-text-1080px-t.png', '/brand/emblem.svg');

const toml = `# Generato da scripts/gen-netlify.mjs (npm run gen:netlify)
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/img/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/brand/*"
  [headers.values]
    Cache-Control = "public, max-age=2592000"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-Frame-Options = "SAMEORIGIN"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# ---- 301 dai vecchi indirizzi del sito WordPress ----
${r.join('\n')}
# ---- pagine del sito (single page app, EN e /it) ----
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
fs.writeFileSync(path.join(ROOT, 'netlify.toml'), toml);
console.log('redirect 301:', r.length);

// ---- sitemap.xml e robots.txt ----
const pages = ['/', '/tours', ...c.tours.map((t) => `/tours/${t.slug}`), '/visit-us', '/terms', '/privacy', '/cookies'];
const it = (p) => (p === '/' ? '/it' : `/it${p}`);
const today = new Date().toISOString().slice(0, 10);
const entry = (loc, p) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/>\n    <xhtml:link rel="alternate" hreflang="it" href="${SITE}${it(p)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/>\n  </url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages.flatMap((p) => [entry(p, p), entry(it(p), p)]).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(ROOT, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('sitemap:', pages.length * 2, 'indirizzi');
