# Wheel Tours, nuovo sito

Vite + React + TypeScript, Tailwind v4, struttura shadcn (`components.json`, `src/components/ui`, alias `@/`),
framer-motion, GSAP + Lenis, three / react-three-fiber (solo hero, chunk separato, fallback SVG senza WebGL).

## Comandi
- `npm run dev`: sviluppo su http://localhost:4810
- `npm run build`: `tsc` + build in `dist`
- `npm run import:content`: reimporta testi e foto da www.wheel.tours (`--refresh` per riscaricare)
- `npm run trace:logo`: rigenera gli SVG del logo dai PNG originali (`public/brand`)
- `npm run gen:netlify`: rigenera `netlify.toml` (301 dai vecchi URL), `sitemap.xml`, `robots.txt`
- `node scripts/gen-icons.mjs`: favicon e apple-touch-icon

## Dove stanno i contenuti
- `src/data/content.json`: contenuti importati (non modificare a mano)
- `src/data/site.ts`: Bokun, indirizzo, foto per tour, tappe delle mappe, dati societari (P.IVA da inserire)
- `src/data/i18n/ui.ts` e `tours-it.ts`: testi interfaccia e traduzione italiana (scritta da noi, da confermare)
- `src/data/legal.ts`: privacy e cookie policy del nuovo sito

## Servizi esterni
Bokun e Google Maps si caricano solo dopo un clic del visitatore. Nessun cookie proprio, nessun analytics.
