// Presentazione cliente Altalogik per Wheel Tours (5 pagine A4).
// Struttura del toolkit Altalogik (_altalogik-pdf), identità del sito Wheel Tours:
// Montserrat (titoli) e Roboto (testi), blu notte e cyan del logo, pulsanti a pillola, foto reali.
// Uso: node scripts/gen-presentazione.mjs <out.html> <altalogik-logo.svg> <cartella screenshot>
// poi Chrome headless --print-to-pdf (vedi README del toolkit).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const [OUT, AL_LOGO, SHOTS] = process.argv.slice(2);
const b64 = (p) => fs.readFileSync(p).toString('base64');
const font = (pkg, file) => b64(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const svgData = (p) => 'data:image/svg+xml;base64,' + b64(path.join(ROOT, p));
async function img(p, w, q = 80) {
  const b = await sharp(path.join(ROOT, p)).resize({ width: w, withoutEnlargement: true }).jpeg({ quality: q }).toBuffer();
  return 'data:image/jpeg;base64,' + b.toString('base64');
}
async function shot(n) {
  const b = await sharp(path.join(SHOTS, n + '.png')).resize({ width: 1100 }).jpeg({ quality: 82 }).toBuffer();
  return 'data:image/jpeg;base64,' + b.toString('base64');
}

const alLogo = fs.readFileSync(AL_LOGO, 'utf8');
const emblem = svgData('public/brand/emblem.svg');
const wordDark = svgData('public/brand/wordmark-dark.svg');
const wordLight = svgData('public/brand/wordmark-light.svg');
const cover = await img('public/img/photos/unnamed-1-scaled-e1666344965191-lg.webp', 1600, 80);
const fotoRow = [
  await img('public/img/photos/gc-city-t-lg.webp', 700, 76),
  await img('public/img/photos/gc-catacombs-lg.webp', 700, 76),
  await img('public/img/photos/669a4e24accd4b93b96e4e4986e88358-5823553535856459615-121-lg--lg.webp', 700, 76),
];
const closing = await img('public/img/photos/whatsapp-image-2022-06-26-at-9-35-02-pm-lg.webp', 1400, 80);

const elementi = [
  { s: await shot('hero'), t: 'Il logo in 3D', d: 'La biga del logo in rilievo, con la ruota che gira davvero, sopra le foto reali dei tour. Un’animazione d’apertura la porta in pagina.' },
  { s: await shot('tours'), t: 'I tour in vetrina', d: 'Ogni scheda mostra prezzo, valutazione e cancellazione gratuita, con la prenotazione a un clic.' },
  { s: await shot('tour'), t: 'La pagina del tour', d: 'Il box di prenotazione resta sempre visibile, con le garanzie, il codice sconto e WhatsApp.' },
  { s: await shot('route'), t: 'Il percorso a tappe', d: 'La mappa del tour Highlights con le tappe reali e un golf cart che percorre il giro.' },
  { s: await shot('daynight'), t: 'Mattina o sera', d: 'Le due partenze di Rome in a Day a confronto, trascinando tra il Colosseo di giorno e di sera.' },
  { s: await shot('visit'), t: 'Dove siamo', d: 'La mappa di Via Cavour 138 nei colori del sito, servita dal nostro server e senza cookie.' },
];

const criticita = [
  { n: '01', t: 'Prenotazione da verificare', d: 'Sul sito attuale il pulsante “Book now” di Rome in a Day apre il calendario del tour Highlights, e il prezzo indicato è di 500 euro a persona contro i 99 degli altri tour.', r: 'Ogni tour ha la sua pagina e il suo pulsante di prenotazione. Il collegamento a Bokun è in un solo punto: con la Sua conferma si corregge una volta per tutte.' },
  { n: '02', t: 'Il link “Location” non porta alla sede', d: 'Il collegamento alla posizione apre una ricerca Google con il nome di un altro marchio, non il punto d’incontro in Via Cavour 138.', r: 'Una pagina “Dove siamo” con la mappa della zona e le indicazioni stradali dirette alla sede.' },
  { n: '03', t: 'Parte legale assente o non corretta', d: 'Mancano privacy e cookie policy, i Termini sono un modello generico che cita la legge olandese e la partita IVA non compare.', r: 'Privacy e cookie policy nuove, in inglese e in italiano, scritte su ciò che il sito usa davvero, e uno spazio pronto per i dati societari.' },
  { n: '04', t: 'Servizi esterni senza consenso', d: 'All’apertura della pagina si caricano la mappa di Google e il sistema di prenotazione, che salva un cookie prima di qualsiasi scelta del visitatore.', r: 'All’apertura non parte nessun servizio esterno: Bokun si carica solo al clic su “Book now” e la mappa è sul nostro server.' },
  { n: '05', t: 'Una sola pagina, poco visibile', d: 'Tutto il sito sta in una pagina senza menu, solo in inglese, con due indirizzi nella mappa del sito e immagini senza descrizione.', r: 'Un sito a più pagine, una per tour, in inglese e in italiano, con mappa del sito, redirect dai vecchi indirizzi e descrizioni delle immagini.' },
];

const perche = [
  { t: 'Cura su misura', d: 'Ogni pagina è progettata sui Suoi tour, sulle Sue foto e sul Suo logo: non un modello preconfezionato, ma un sito che La rappresenta.' },
  { t: 'Pensato per vendere', d: 'Prezzi, recensioni e prenotazione sempre a portata di mano, su computer e su telefono, con WhatsApp in ogni pagina.' },
  { t: 'Veloce e rispettoso', d: 'Caratteri e immagini dal nostro server, foto ottimizzate e nessun cookie all’apertura: un sito rapido e in regola.' },
  { t: 'Un solo interlocutore', d: 'Seguiamo l’intero progetto, dai contenuti alle traduzioni fino alla messa online, con un unico riferimento.' },
];
const passi = [
  { t: 'Le Sue conferme', d: 'Prezzo e prenotazione di Rome in a Day, partita IVA e dati societari, provenienza delle recensioni, testi in italiano.' },
  { t: 'I Termini e condizioni', d: 'Revisione del testo attuale, oggi generico, sulle regole reali delle Sue prenotazioni.' },
  { t: 'La messa online', d: 'Pubblicazione su Netlify e collegamento del dominio wheel.tours, con i redirect dai vecchi indirizzi.' },
];

const swatches = [
  { c: '#1B252F', l: 'Blu notte', h: '1B252F', dark: true },
  { c: '#003355', l: 'Navy logo', h: '003355', dark: true },
  { c: '#00B8F2', l: 'Cyan', h: '00B8F2', dark: true },
  { c: '#00AEEF', l: 'Cyan biga', h: '00AEEF', dark: true },
  { c: '#FFDF00', l: 'Giallo promo', h: 'FFDF00' },
  { c: '#CCD6DF', l: 'Nebbia', h: 'CCD6DF' },
  { c: '#FFFFFF', l: 'Bianco', h: 'FFFFFF' },
];

const check = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#00B8F2" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

const CSS = `
@font-face{font-family:'Montserrat';font-weight:600;src:url(data:font/woff2;base64,${font('montserrat', 'montserrat-latin-600-normal.woff2')}) format('woff2')}
@font-face{font-family:'Montserrat';font-weight:700;src:url(data:font/woff2;base64,${font('montserrat', 'montserrat-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Montserrat';font-weight:800;src:url(data:font/woff2;base64,${font('montserrat', 'montserrat-latin-800-normal.woff2')}) format('woff2')}
@font-face{font-family:'Roboto';font-weight:400;src:url(data:font/woff2;base64,${font('roboto', 'roboto-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'Roboto';font-weight:500;src:url(data:font/woff2;base64,${font('roboto', 'roboto-latin-500-normal.woff2')}) format('woff2')}
@font-face{font-family:'Roboto';font-weight:700;src:url(data:font/woff2;base64,${font('roboto', 'roboto-latin-700-normal.woff2')}) format('woff2')}
:root{--night:#1B252F;--deep:#141c24;--soft:#26313c;--cyan:#00B8F2;--yellow:#FFDF00;--mist:#CCD6DF;--grey:#54595F;--line-l:#dbe2e8;--line-d:rgba(204,214,223,.16)}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Roboto',Arial,sans-serif}
@page{size:A4;margin:0}
.page{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;display:flex;flex-direction:column}
.page:last-child{page-break-after:auto}
.light{background:#fff;color:var(--night)}
.dark{background:var(--night);color:#fff}
.pad{padding:18mm 17mm 16mm}
.eyebrow{font-family:'Montserrat';font-weight:700;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--cyan)}
.h{font-family:'Montserrat';font-weight:800;text-transform:uppercase;letter-spacing:-.015em;line-height:1.02}
.h .c{color:var(--cyan)}
.body{font-size:13px;line-height:1.6}
.light .muted{color:var(--grey)} .dark .muted{color:var(--mist)}
.rule{height:1px;width:100%}
.light .rule{background:var(--line-l)} .dark .rule{background:var(--line-d)}
.foot{position:absolute;left:17mm;right:17mm;bottom:10mm;display:flex;justify-content:space-between;font-family:'Montserrat';font-weight:600;font-size:8px;letter-spacing:.18em;text-transform:uppercase}
.light .foot{color:#8a949d} .dark .foot{color:rgba(204,214,223,.6)}
.pill{display:inline-flex;align-items:center;gap:7px;border-radius:999px;font-family:'Montserrat';font-weight:700;text-transform:uppercase;letter-spacing:.08em}

/* copertina */
.cv-hero{position:absolute;inset:0}
.cv-hero img{width:100%;height:100%;object-fit:cover}
.cv-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(27,37,47,.55) 0%,rgba(27,37,47,.35) 30%,rgba(27,37,47,.85) 62%,#1B252F 80%)}
.cv-top{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:15mm 17mm 0}
.cv-top .al svg{height:38px;width:auto;display:block}
.cv-top .tag{font-family:'Montserrat';font-weight:700;font-size:9px;letter-spacing:.26em;color:#fff}
.cv-body{position:relative;z-index:2;margin-top:auto;padding:0 17mm 16mm}
.cv-logo{display:flex;align-items:center;gap:14px}
.cv-logo img.e{height:78px} .cv-logo img.w{height:30px}
.cv-name{font-size:70px;margin-top:22px}
.cv-sub{font-family:'Montserrat';font-weight:600;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--mist);margin-top:14px}
.cv-chips{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap}
.cv-chips span{font-family:'Roboto';font-size:11px;color:#fff;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);border-radius:999px;padding:6px 12px;display:inline-flex;gap:7px;align-items:center}
.cv-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:22px}
.cv-foot .l{font-size:12px;line-height:1.55}
.cv-foot .r{font-family:'Montserrat';font-weight:600;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--mist)}

/* identità */
.logos{display:grid;grid-template-columns:1.25fr 1fr;gap:10px;margin-top:12px}
.tile{border-radius:14px;display:flex;align-items:center;justify-content:center;gap:12px;height:44mm}
.tile.d{background:var(--night)} .tile.l{background:#fff;border:1px solid var(--line-l)}
.tile img.e{height:28mm} .tile img.w{height:6.5mm}
.cap{font-size:10.5px;color:var(--grey);margin-top:7px}
.type{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}
.tcard{border:1px solid var(--line-l);border-radius:14px;padding:14px 15px}
.tcard .nm{font-family:'Montserrat';font-weight:700;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--cyan)}
.hier{margin-top:12px;border:1px solid var(--line-l);border-radius:14px;padding:14px 16px;display:grid;grid-template-columns:auto 1fr;gap:9px 18px;align-items:center}
.hier .k{font-family:'Montserrat';font-weight:700;font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:#8a949d}
.sw{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px}
.sw .s{height:22mm;border-radius:10px;display:flex;flex-direction:column;justify-content:flex-end;padding:7px 8px;border:1px solid var(--line-l)}
.sw .s b{font-family:'Montserrat';font-weight:700;font-size:8px;letter-spacing:.04em}
.sw .s span{font-size:8px;opacity:.8;margin-top:1px}
.photos{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.photos figure{aspect-ratio:4/3;overflow:hidden;border-radius:12px}
.photos img{width:100%;height:100%;object-fit:cover;display:block}

/* esperienza */
.egrid{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;margin-top:14px}
.ecard{background:var(--soft);border:1px solid var(--line-d);border-radius:14px;overflow:hidden}
.ecard figure{aspect-ratio:16/10;overflow:hidden}
.ecard img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.ecard .tx{padding:10px 12px 12px}
.ecard .et{font-family:'Montserrat';font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:-.005em}
.ecard .ed{font-size:10.5px;line-height:1.45;margin-top:4px;color:var(--mist)}

/* criticità */
.crit .item{padding:16px 0}
.crit .top{display:flex;gap:14px;align-items:baseline}
.crit .num{font-family:'Montserrat';font-weight:800;font-size:13px;color:var(--cyan);min-width:26px}
  .crit .ct{font-family:'Montserrat';font-weight:800;font-size:15px;text-transform:uppercase;letter-spacing:-.005em}
.crit .cd{font-size:12.5px;line-height:1.55;margin:6px 0 0 40px;color:var(--grey)}
.crit .resp{margin:10px 0 0 40px;padding:10px 14px;border-left:3px solid var(--cyan);background:#f1f6f9;border-radius:0 10px 10px 0;font-size:12.5px;line-height:1.55}
.crit .resp b{font-family:'Montserrat';font-weight:800;font-size:8.5px;letter-spacing:.16em;color:var(--cyan);margin-right:6px}

/* perché */
.prow{display:grid;grid-template-columns:52mm 1fr;gap:16px;padding:13px 0;align-items:start}
.prow .pl{font-family:'Montserrat';font-weight:800;font-size:12.5px;text-transform:uppercase;color:#fff}
.prow .pr{font-size:12.5px;line-height:1.55;color:var(--mist)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
.step{background:var(--soft);border:1px solid var(--line-d);border-radius:14px;padding:12px}
.step .n{width:22px;height:22px;border-radius:999px;background:var(--cyan);color:#fff;font-family:'Montserrat';font-weight:800;font-size:10px;display:flex;align-items:center;justify-content:center}
.step .st{font-family:'Montserrat';font-weight:800;font-size:10.5px;text-transform:uppercase;margin-top:8px}
.step .sd{font-size:10.5px;line-height:1.45;color:var(--mist);margin-top:4px}
.close{position:relative;height:112mm;margin-top:auto;overflow:hidden}
.close img{width:100%;height:100%;object-fit:cover}
.close:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#1B252F 0%,rgba(27,37,47,.55) 35%,rgba(27,37,47,.85) 100%)}
.close .cap2{position:absolute;left:17mm;right:17mm;bottom:20mm;z-index:2;display:flex;justify-content:space-between;align-items:flex-end}
.close .ch{font-size:30px;color:#fff}
.close .btn{background:var(--cyan);color:#fff;font-size:9px;padding:10px 16px;white-space:nowrap}
`;

const foot = (n, label) => `<div class="foot"><span>Wheel Tours · ${label}</span><span>Altalogik · 0${n}</span></div>`;

const p1 = `<div class="page dark">
  <div class="cv-hero"><img src="${cover}" alt=""></div>
  <div class="cv-top"><span class="al">${alLogo}</span><span class="tag">PRESENTAZIONE CLIENTE</span></div>
  <div class="cv-body">
    <div class="cv-logo"><img class="e" src="${emblem}" alt=""><img class="w" src="${wordDark}" alt="Wheel Tours"></div>
    <div class="h cv-name">Wheel <span class="c">Tours</span></div>
    <div class="cv-sub">Tour guidati in golf cart · Roma</div>
    <div class="cv-chips">
      <span>${check} Sito in inglese e italiano</span><span>${check} Prenotazione Bokun</span><span>${check} Logo in 3D</span><span>${check} Nessun cookie all’apertura</span>
    </div>
    <div class="rule" style="margin-top:22px;background:rgba(204,214,223,.22)"></div>
    <div class="cv-foot">
      <div class="l">Proposta di nuovo sito web<br>a cura di Altalogik</div>
      <div class="r">18 novembre 2026</div>
    </div>
  </div>
</div>`;

const p2 = `<div class="page light pad">
  <div class="eyebrow">L’identità</div>
  <h2 class="h" style="font-size:34px;margin-top:9px">Lo stesso marchio, <span class="c">più deciso</span></h2>
  <p class="body muted" style="margin-top:10px;max-width:168mm">Abbiamo tenuto il Suo logo, i Suoi colori e il tono scuro del sito attuale. Cambia il modo di usarli: titoli forti, molto spazio, foto vere dei tour e un solo colore di richiamo, il cyan della biga, per tutto ciò che porta alla prenotazione.</p>
  <div class="logos">
    <div><div class="tile d"><img class="e" src="${emblem}" alt=""><img class="w" src="${wordDark}" alt=""></div><div class="cap">Il logo originale, ridisegnato in vettoriale dal file del sito per restare nitido a ogni dimensione.</div></div>
    <div><div class="tile l"><img class="w" style="height:8.5mm" src="${wordLight}" alt=""></div><div class="cap">La scritta nella versione per fondi chiari.</div></div>
  </div>
  <div class="type">
    <div class="tcard"><div class="nm">Titoli · Montserrat</div><div class="h" style="font-size:24px;margin-top:8px">The coolest way to see <span class="c">Rome!</span></div><div class="cap" style="margin-top:6px">Già presente nel sito attuale. Maiuscolo, deciso, professionale.</div></div>
    <div class="tcard"><div class="nm">Testi · Roboto</div><div style="font-size:13px;line-height:1.55;margin-top:8px">Explore Rome by golf cart. We have seven departures daily, showcasing some of the city’s biggest highlights.</div><div class="cap" style="margin-top:6px">Il carattere dei testi del sito attuale, chiaro e leggibile.</div></div>
  </div>
  <div class="hier">
    <span class="k">Etichetta</span><span class="eyebrow" style="font-size:9px">Join our tours</span>
    <span class="k">Titolo</span><span class="h" style="font-size:18px">Rome in a Day by golf cart</span>
    <span class="k">Testo</span><span style="font-size:12px;color:var(--grey)">3 hours with an expert driver/guide · Free cancellation up to 24 hours</span>
    <span class="k">Azione</span><span><span class="pill" style="background:var(--cyan);color:#fff;font-size:8.5px;padding:7px 14px">Book now</span> <span class="pill" style="background:var(--yellow);color:var(--night);font-size:8.5px;padding:7px 14px;margin-left:6px">WHEEL10</span></span>
  </div>
  <div class="eyebrow" style="margin-top:14px">La palette, misurata sul sito e sul logo</div>
  <div class="sw">
    ${swatches.map((s) => `<div class="s" style="background:${s.c};color:${s.dark ? '#fff' : '#1B252F'}"><b>${s.l}</b><span>#${s.h}</span></div>`).join('')}
  </div>
  <div class="eyebrow" style="margin-top:14px">La fotografia: i Suoi tour, le Sue foto</div>
  <div class="photos">${fotoRow.map((x) => `<figure><img src="${x}" alt=""></figure>`).join('')}</div>
  <div class="cap">Solo foto reali della Sua libreria, ottimizzate per il web: nessuna immagine di repertorio.</div>
  ${foot(2, 'L’identità')}
</div>`;

const p3 = `<div class="page dark pad">
  <div class="eyebrow">L’esperienza</div>
  <h2 class="h" style="font-size:34px;margin-top:9px">Il sito che <span class="c">vende i tour</span></h2>
  <p class="body muted" style="margin-top:9px;max-width:170mm">Ogni voce del menu apre una pagina sua, ogni tour ha la sua sezione interattiva e la prenotazione è sempre a un clic. Le immagini sono schermate reali del nuovo sito.</p>
  <div class="egrid">
    ${elementi.map((e) => `<div class="ecard"><figure><img src="${e.s}" alt=""></figure><div class="tx"><div class="et">${e.t}</div><div class="ed">${e.d}</div></div></div>`).join('')}
  </div>
  ${foot(3, 'L’esperienza')}
</div>`;

const p4 = `<div class="page light pad">
  <div class="eyebrow">Criticità rilevate sul sito attuale</div>
  <h2 class="h" style="font-size:34px;margin-top:9px">Cinque criticità, <span class="c">cinque risposte</span></h2>
  <div class="crit" style="margin-top:8px">
    ${criticita.map((c, i) => `<div class="item"><div class="top"><span class="num">${c.n}</span><span class="ct">${c.t}</span></div><div class="cd">${c.d}</div><div class="resp"><b>RISPOSTA</b>${c.r}</div></div>${i < criticita.length - 1 ? '<div class="rule"></div>' : ''}`).join('')}
  </div>
  ${foot(4, 'Criticità e risposte')}
</div>`;

const p5 = `<div class="page dark">
  <div class="pad" style="padding-bottom:0">
    <div class="eyebrow">Perché Altalogik</div>
    <h2 class="h" style="font-size:32px;margin-top:9px">Il mestiere, non solo <span class="c">il risultato</span></h2>
    <div style="margin-top:8px">
      ${perche.map((p, i) => `<div class="prow"><div class="pl">${p.t}</div><div class="pr">${p.d}</div></div>${i < perche.length - 1 ? '<div class="rule"></div>' : ''}`).join('')}
    </div>
    <div class="eyebrow" style="margin-top:14px">I prossimi passi</div>
    <div class="steps">
      ${passi.map((s, i) => `<div class="step"><div class="n">${i + 1}</div><div class="st">${s.t}</div><div class="sd">${s.d}</div></div>`).join('')}
    </div>
  </div>
  <div class="close">
    <img src="${closing}" alt="">
    <div class="cap2">
      <div class="h ch">Restiamo a Sua <span class="c">disposizione</span></div>
      <span class="pill btn">Altalogik · sito e messa online</span>
    </div>
  </div>
  ${foot(5, 'Perché Altalogik')}
</div>`;

const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Wheel Tours · Presentazione Altalogik</title><style>${CSS}</style></head><body>${p1}${p2}${p3}${p4}${p5}</body></html>`;
if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('Trattino lungo o medio nel testo del PDF');
fs.writeFileSync(OUT, html);
console.log('html KB', Math.round(html.length / 1024));
