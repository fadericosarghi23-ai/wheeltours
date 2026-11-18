// Importa i contenuti reali di www.wheel.tours (WordPress + Elementor) nel nuovo sito.
// Testi completi (home + terms), recensioni, prezzi, ID dei prodotti Bokun, foto della libreria media.
// Le foto vengono convertite in WebP (variante grande e piccola) sotto i 300 KB.
// Uscita: src/data/content.json + public/img/photos/*.webp
// Uso: npm run import:content  (aggiungere --refresh per riscaricare le pagine)
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { parse } from 'node-html-parser';

const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, '.import-cache');
const OUT_IMG = path.join(ROOT, 'public/img/photos');
const SITE = 'https://www.wheel.tours';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const REFRESH = process.argv.includes('--refresh');

await fs.mkdir(CACHE, { recursive: true });
await fs.mkdir(path.join(CACHE, 'media'), { recursive: true });
await fs.mkdir(OUT_IMG, { recursive: true });

async function cached(name, url, binary = false) {
  const file = path.join(CACHE, name);
  if (!REFRESH) {
    try {
      return binary ? await fs.readFile(file) : await fs.readFile(file, 'utf8');
    } catch {}
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(file, buf);
  return binary ? buf : buf.toString('utf8');
}

const clean = (s) =>
  s
    .replace(/ /g, ' ')
    .replace(/\s*[–—]\s*/g, ', ') // regola agenzia: niente trattini lunghi o medi
    .replace(/\s+/g, ' ')
    .trim();

/** decodifica le email offuscate da Cloudflare (data-cfemail) */
function cfDecode(hex) {
  const k = parseInt(hex.slice(0, 2), 16);
  let s = '';
  for (let i = 2; i < hex.length; i += 2) s += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ k);
  return s;
}

// ------------------------------------------------------------------ HOME
const homeHtml = await cached('home.html', SITE + '/');
const home = parse(homeHtml);
const widgets = home.querySelectorAll('.elementor-widget');
const byType = (t) => widgets.filter((w) => w.getAttribute('data-widget_type') === t);

const promoEl = widgets.find((w) => /WHEEL10/i.test(w.text));
const promo = { text: clean(promoEl.text), code: clean(promoEl.querySelector('b,strong')?.text ?? 'WHEEL10') };

const heroEl = widgets.find((w) => /coolest way/i.test(w.text) && w.getAttribute('data-widget_type') === 'text-editor.default');
// il sito ha due copie dell'hero (desktop e mobile): titolo in <h1> o in <strong>
const heroH1 = clean((heroEl.querySelector('h1') ?? heroEl.querySelector('strong') ?? heroEl.querySelector('p')).text);
const heroLines = heroEl.querySelectorAll('h4').map((h) => clean(h.text)).filter(Boolean);

const toursHeading = clean(widgets.find((w) => w.getAttribute('data-widget_type') === 'heading.default' && /Join our Tours/i.test(w.text)).text);

// le card dei tour: ogni titolo heading seguito da star-rating, testo, lista, bottone Bokun
const SLUGS = ['rome-highlights-golf-cart-tour', 'catacombs-appian-way-golf-cart-tour', 'rome-in-a-day-pizza-gelato'];
const ratings = byType('star-rating.default');
const tours = ratings.map((rw, i) => {
  const idx = widgets.indexOf(rw);
  const titleW = widgets[idx - 1];
  const imgW = widgets[idx - 2];
  const textW = widgets[idx + 1];
  const listW = widgets[idx + 2];
  const htmlW = widgets[idx + 3];
  const title = clean(titleW.text);
  const reviews = Number((rw.text.match(/(\d[\d,.]*)\s*reviews/i) || [])[1]?.replace(/[,.]/g, ''));
  const rating = Number((rw.text.match(/Rated\s+([\d.]+)/i) || [])[1]);
  const description = textW
    .querySelectorAll('p')
    .map((p) => clean(p.text))
    .filter(Boolean);
  if (!description.length) description.push(clean(textW.text));
  const items = listW
    .querySelectorAll('li')
    .flatMap((li) => li.querySelector('.elementor-icon-list-text').innerHTML.split(/<br\s*\/?>/i).map((h) => clean(parse(h).text)))
    .filter(Boolean);
  const priceText = items.find((x) => /^from\s*€/i.test(x)) ?? '';
  const features = items.filter((x) => x !== priceText);
  const priceAmount = Number((priceText.match(/€\s*(\d+)/) || [])[1]);
  const exp = (htmlW.toString().match(/experience-calendar\/(\d+)/) || [])[1];
  const img = imgW.querySelector('img');
  const imgSrc = img?.getAttribute('data-src') || img?.getAttribute('src') || '';
  return {
    slug: SLUGS[i],
    title,
    titlePlain: title.replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim(),
    reviews,
    rating,
    description,
    features,
    price: { text: priceText, amount: priceAmount },
    bokunExperienceId: exp,
    sourceImage: imgSrc,
  };
});

const visitTitle = clean(widgets.find((w) => /welcome to Rome/i.test(w.text) && w.getAttribute('data-widget_type') === 'heading.default').text);
const visitSub = clean(widgets.find((w) => /COME VISIT US/i.test(w.text) && w.getAttribute('data-widget_type') === 'heading.default').text);
const mapW = byType('google_maps.default')[0];
const ifr = mapW.querySelector('iframe');
const mapSrc = (ifr?.getAttribute('data-litespeed-src') || ifr?.getAttribute('data-src') || ifr?.getAttribute('src') || '').replace(/&#038;/g, '&');
const mapQuery = decodeURIComponent((mapSrc.match(/[?&]q=([^&]+)/) || [])[1] || '').replace(/\s*[–—]\s*/g, ', ');

const footerCta = clean(widgets.find((w) => /Need more info/i.test(w.text)).text);
const links = home.querySelectorAll('a[href]').map((a) => ({ text: clean(a.text), href: a.getAttribute('href') }));
const cf = home.querySelector('[data-cfemail]');
const email = cf ? cfDecode(cf.getAttribute('data-cfemail')) : 'info@wheel.tours';
const find = (re) => links.find((l) => re.test(l.href))?.href;
const contacts = {
  phone: '+39 342 9812803',
  phoneHref: find(/^tel:/),
  whatsapp: find(/whatsapp/),
  email,
  hours: (visitSub.match(/OPEN\s+(.+)$/i) || [])[1] ?? '',
  locationLabel: links.find((l) => /Location/i.test(l.text))?.text ?? '',
  oldLocationLink: find(/g\.page|maps\.app|goo\.gl/),
  address: mapQuery,
  tripadvisor: find(/tripadvisor/),
  instagram: find(/instagram/),
};
const copyright = clean(widgets.find((w) => /©/.test(w.text)).text);
const cookieNotice = clean(widgets.find((w) => /uses cookies/i.test(w.text)).text);

// popup offerta (programmata 2023, scaduta): la teniamo solo come inventario
const sale = widgets.filter((w) => /Summer Sale|SUMMER10|EURO OFF/i.test(w.text)).map((w) => clean(w.text));

// meta
const metaTitle = clean(home.querySelector('title').text.replace(/&#8226;/g, '•'));
const metaDesc = home.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

// ------------------------------------------------------------------ TERMS (testo completo)
const termsHtml = await cached('terms.html', SITE + '/terms/');
const terms = parse(termsHtml);
const termsRoot = terms.querySelectorAll('.elementor-widget-theme-post-content, .elementor-widget-text-editor, .entry-content').find((e) => /Lion and lion/i.test(e.text));
const termsBlocks = [];
for (const el of termsRoot.querySelectorAll('h1,h2,h3,h4,h5,p,li')) {
  const t = clean(el.text);
  if (!t) continue;
  const tag = el.tagName.toLowerCase();
  const boldOnly = tag === 'p' && el.childNodes.length === 1 && /^(b|strong)$/i.test(el.firstChild?.rawTagName ?? '');
  termsBlocks.push({ type: tag === 'li' ? 'li' : /^h/.test(tag) || boldOnly ? 'h' : 'p', text: t });
}
const company = (termsBlocks.map((b) => b.text).join(' ').match(/Welcome to ([^!]+)!/) || [])[1] ?? '';

// ------------------------------------------------------------------ MEDIA
// libreria media completa; si escludono loghi di altri marchi/partner e icone
const mediaJson = JSON.parse(await cached('media.json', SITE + '/wp-json/wp/v2/media?per_page=100&_fields=id,source_url,mime_type,alt_text,date'));
// esclusi anche i tour non più in vendita (e-bike e Fiat 500): 07, b7, 68736132..., Wheel.Tour_.Colosseum
const SKIP = /logo|instagram\.svg|GYG|TE\.jpeg|download\.png|Context-Travel|civitatis|walks|Fiat500|ebike|\/07\.jpg|\/b7\.jpg|68736132_|Wheel\.Tour_\.Colosseum/i;
for (const f of await fs.readdir(OUT_IMG)) await fs.unlink(path.join(OUT_IMG, f));
const photos = [];
for (const m of mediaJson) {
  if (!/^image\/(jpe?g|png|webp)$/.test(m.mime_type) || SKIP.test(m.source_url)) continue;
  const base = path.basename(m.source_url).replace(/\.[a-z]+$/i, '');
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  const buf = await cached('media/' + path.basename(m.source_url), m.source_url, true);
  const meta = await sharp(buf).metadata();
  const out = { id: m.id, slug, original: m.source_url, alt: m.alt_text || '', date: m.date, w: 0, h: 0, sizes: {} };
  for (const [key, width, q] of [
    ['lg', 1600, 78],
    ['sm', 720, 74],
  ]) {
    let quality = q;
    let data;
    const w = Math.min(width, meta.width);
    do {
      data = await sharp(buf).rotate().resize({ width: w, height: w, fit: 'inside', withoutEnlargement: true }).webp({ quality, effort: 5 }).toBuffer();
      quality -= 6;
    } while (data.length > 270 * 1024 && quality > 40);
    const file = `${slug}-${key}.webp`;
    await fs.writeFile(path.join(OUT_IMG, file), data);
    const m2 = await sharp(data).metadata();
    out.sizes[key] = { src: `/img/photos/${file}`, w: m2.width, h: m2.height, kb: Math.round(data.length / 1024) };
    if (key === 'lg') {
      out.w = m2.width;
      out.h = m2.height;
    }
  }
  photos.push(out);
}

// collega l'immagine di ogni card alla foto importata
for (const t of tours) {
  const name = path.basename(t.sourceImage).replace(/-[a-z0-9]{30,}(?=\.)/, '').replace(/\.[a-z]+$/i, '').toLowerCase();
  const hit = photos.find((p) => p.original.toLowerCase().includes(name));
  t.image = hit?.slug ?? null;
}

// sfondi delle sezioni (hero e "welcome to Rome")
// gli sfondi stanno sia nell'HTML sia nel CSS di LiteSpeed (UCSS) collegato alla pagina
const cssHref = (homeHtml.match(/href="([^"]+litespeed\/ucss[^"]+)"/) || [])[1];
const ucss = cssHref ? await cached('ucss.css', cssHref) : '';
const bgs = [...(homeHtml + ucss).matchAll(/background-image:url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]).filter((u) => /uploads/.test(u));
const bgSlug = (u) => {
  const n = path.basename(u).replace(/\.(jpe?g|png)(\.webp)?$/i, '').toLowerCase();
  return photos.find((p) => p.original.toLowerCase().includes(n))?.slug ?? null;
};
const sectionBackgrounds = [...new Set(bgs.map(bgSlug).filter(Boolean))];

const content = {
  source: SITE,
  importedAt: new Date().toISOString(),
  meta: { title: metaTitle, description: metaDesc },
  promo,
  hero: { title: heroH1, lines: heroLines, background: sectionBackgrounds[0] ?? null },
  toursHeading,
  tours,
  visit: { title: visitTitle, subtitle: visitSub, background: sectionBackgrounds[1] ?? null },
  contacts,
  footer: { cta: footerCta, copyright },
  cookieNotice,
  expiredOffers: sale,
  legal: { company, termsTitle: clean(terms.querySelector('h1')?.text ?? 'Terms & conditions'), terms: termsBlocks },
  photos,
};

await fs.mkdir(path.join(ROOT, 'src/data'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'src/data/content.json'), JSON.stringify(content, null, 2));
console.log('tour:', tours.map((t) => `${t.slug} (${t.reviews} rec., ${t.price.text}, bokun ${t.bokunExperienceId}, img ${t.image})`).join('\n  '));
console.log('foto:', photos.length, '| max KB:', Math.max(...photos.flatMap((p) => Object.values(p.sizes).map((s) => s.kb))));
console.log('terms blocchi:', termsBlocks.length, '| società:', company, '| email:', email);
console.log('sfondi:', sectionBackgrounds);
