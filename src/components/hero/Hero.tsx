import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { INTRO_DELAY as D } from '@/components/brand/IntroLogo';
import { WhatsAppIcon } from '@/components/layout/Navbar';
import { buttonVariants } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { ROUTES, useI18n } from '@/lib/i18n';
import { prefersReducedMotion } from '@/lib/motion';
import { hasWebGL } from '@/lib/webgl';
import { cn } from '@/lib/utils';
import { content, photo, srcSet, totalReviews } from '@/data/content';
import { HERO_STOPS, HERO_STOPS_IT } from '@/data/site';
import { getTours } from '@/data/tours';

const LogoScene = lazy(() => import('./LogoScene'));
const EASE = [0.16, 1, 0.3, 1] as const;
/** foto vere dei tour dietro l'hero, a rotazione lenta (le più grandi della libreria del cliente) */
const BACKDROP = ['unnamed-1-scaled-e1666344965191', 'gc-city-t', 'img-3693-copy-t', 'gc-catacombs'];

/** media pesata delle valutazioni dei tre tour (dati del sito: 1375 x 5, 1285 x 4.9, 375 x 4.9) */
export const avgRating = Math.floor((content.tours.reduce((a, t) => a + t.rating * t.reviews, 0) / totalReviews) * 10) / 10;

/**
 * Hero: a sinistra il titolo originale, la prova sociale (valutazione e recensioni reali), il prezzo
 * di partenza e le azioni; a destra la ruota della biga del logo in 3D, resa come un oggetto vero
 * (laccato, metallo, riflessi). Sotto la ruota scorrono con discrezione le tappe del tour Highlights.
 * Senza WebGL la stessa ruota è in SVG e gira con lo scroll.
 */
export function Hero() {
  const { t, to, lang } = useI18n();
  const tours = getTours(lang);
  const stops = lang === 'it' ? HERO_STOPS_IT : HERO_STOPS;
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const stageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const [use3D, setUse3D] = useState(false);
  const [ready3D, setReady3D] = useState(false);
  // il logo si gira di tre quarti quando l'intro ha consegnato la biga all'hero
  const [entered, setEntered] = useState(false);
  // durante il volo dell'intro il logo dell'hero resta nascosto: compare all'atterraggio, nello stesso punto
  const [landed, setLanded] = useState(D === 0);
  useEffect(() => {
    const a = window.setTimeout(() => setLanded(true), D * 1000 + 480);
    const b = window.setTimeout(() => setEntered(true), D * 1000 + 650);
    return () => (window.clearTimeout(a), window.clearTimeout(b));
  }, []);
  const [stop, setStop] = useState(0);
  const [slide, setSlide] = useState(0);
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setSlide((x) => (x + 1) % BACKDROP.length), 7000);
    return () => window.clearInterval(id);
  }, []);
  const locale = lang === 'it' ? 'it-IT' : 'en-US';
  const minPrice = Math.min(...tours.map((x) => x.priceAmount));
  const cancel = tours[0].features.find((f) => f.kind === 'cancel')?.text;

  useEffect(() => {
    if (!prefersReducedMotion() && hasWebGL()) setUse3D(true);
  }, []);
  // tappe del tour Highlights: cambiano solo a tempo, ferme col mouse sopra
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => setStop((s) => (s + 1) % stops.length), 2600);
    return () => window.clearInterval(id);
  }, [paused, stops.length]);

  const bullets = [t.hero.lines[0], t.hero.lines[1], cancel].filter(Boolean) as string[];

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-night text-white" aria-label={t.hero.title}>
      {/* foto vere dei tour, scurite con il blu notte del sito */}
      <motion.div aria-hidden className="absolute inset-0 -z-20" style={{ y: photoY }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={slide}
            src={photo(BACKDROP[slide]).sizes.lg.src}
            srcSet={srcSet(photo(BACKDROP[slide]))}
            sizes="100vw"
            alt=""
            fetchPriority={slide === 0 ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6 }, scale: { duration: 8, ease: 'linear' } }}
          />
        </AnimatePresence>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-night/60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-night/60 via-transparent to-night" />

      <div className="container-full grid min-h-[100svh] grid-cols-[minmax(0,1fr)] items-center gap-6 pb-16 pt-28 lg:min-h-[max(680px,calc(100svh-100px))] lg:pb-20 lg:pt-32">
        {/* sfumatura che tiene leggibile il testo sopra il logo */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-[62%] bg-gradient-to-r from-night via-night/85 to-transparent lg:block" />
        <motion.div style={{ y: textY }} className="relative z-10 max-lg:order-2 lg:max-w-[50%]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.15, duration: 0.7, ease: EASE }}
            className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm"
          >
            <Stars rating={avgRating} label={t.tours.rated(avgRating)} className="text-base" />
            <b>{avgRating.toLocaleString(locale)}/5</b>
            <span className="text-white/70">
              {totalReviews.toLocaleString(locale)} {t.tours.reviews}
            </span>
          </motion.p>

          <h1 aria-label={t.hero.title} className="mt-6 max-w-[15ch] font-display text-[2.5rem] uppercase leading-[1.02] sm:text-6xl xl:text-[4.6rem] 2xl:text-[5.4rem]">
            {t.hero.title.split(' ').map((w, i) => (
              <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <motion.span className={cn('inline-block', /^(rome|roma)!?$/i.test(w) && 'text-cyan')} initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ delay: D + 0.25 + i * 0.05, duration: 0.9, ease: EASE }}>
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.ul className="mt-7 space-y-3 text-[1.05rem] text-white/85 xl:text-lg" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 0.6, duration: 0.8, ease: EASE }}>
            {bullets.map((l) => (
              <li key={l} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-cyan/20">
                  <Check className="size-3 text-cyan" strokeWidth={3.5} />
                </span>
                {l.charAt(0) + l.slice(1).toLowerCase()}
              </li>
            ))}
          </motion.ul>

          <motion.div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 0.75, duration: 0.8, ease: EASE }}>
            <Link to={to(ROUTES.tours)} className={buttonVariants({ size: 'lg' })}>
              {t.nav.book}
              <ArrowRight />
            </Link>
            <p className="leading-tight">
              <span className="block text-xs uppercase tracking-[0.16em] text-white/60">
                {t.tour.from} · {t.tour.perPerson}
              </span>
              <span className="font-display text-3xl">€{minPrice}</span>
            </p>
            <a href={content.contacts.whatsapp} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white">
              <WhatsAppIcon className="size-5 text-whatsapp" />
              {t.nav.whatsapp}
            </a>
          </motion.div>
          <Link
            to={to(ROUTES.tour('rome-highlights-golf-cart-tour'))}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="group mt-10 hidden items-center gap-3 text-sm lg:inline-flex"
          >
            <span className="h-px w-10 bg-white/25 transition-all duration-300 group-hover:w-14 group-hover:bg-cyan" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">{t.hero.stopLabel}</span>
            <span className="relative h-6 w-52 overflow-hidden" aria-hidden>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={stop} className="absolute inset-0 font-semibold text-white/90" initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  {stops[stop]}
                </motion.span>
              </AnimatePresence>
            </span>
            <ArrowRight className="size-4 text-cyan transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* il logo 3D, grande: su desktop occupa tutta l'altezza dell'hero a destra (proporzioni 1080 x 860) */}
        <motion.div style={{ y: stageY }} className="relative -ml-[9vw] w-[118vw] max-w-none max-lg:order-1 sm:mx-auto sm:w-[82vw] lg:absolute lg:bottom-6 lg:right-[1vw] lg:top-[64px] lg:ml-0 lg:w-auto">
          <div id="hero-logo" className={cn('relative aspect-[1080/860] w-full lg:h-full lg:w-auto', !landed && 'opacity-0')}>
            {/* logo 2D: base visibile finché il 3D non è pronto (o sempre, senza WebGL) */}
            <img src="/brand/emblem.svg" alt="" aria-hidden className={cn('absolute inset-[5%] size-[90%] transition-opacity duration-500', ready3D && entered && 'opacity-0')} />
            {use3D && (
              <Suspense fallback={null}>
                <div className={cn('absolute inset-0 transition-opacity duration-300', ready3D ? 'opacity-100' : 'opacity-0')}>
                  <LogoScene scroll={scrollY} entered={entered} onReady={() => setReady3D(true)} />
                </div>
              </Suspense>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
