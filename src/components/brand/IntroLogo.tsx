import { animate, AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { WheelGlyph } from './WheelGlyph';
import { lenisStore, prefersReducedMotion } from '@/lib/motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const ROLL = [0.33, 0, 0.2, 1] as const;
const FLY = [0.65, 0, 0.35, 1] as const;
const KEY = 'wt-intro-seen';
const FLY_AT = 2.15; // s: la biga parte verso l'hero
const FLY_FOR = 0.85; // s: durata del volo

/** l'intro verrà mostrata in questo caricamento? (letto una volta, prima che venga segnata come vista) */
const WILL_SHOW = (() => {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(KEY) !== '1';
  } catch {
    return true;
  }
})();
/** ritardo da aggiungere alle animazioni d'ingresso della prima pagina (il testo dell'hero entra durante il volo) */
export const INTRO_DELAY = WILL_SHOW ? FLY_AT + 0.35 : 0;

/**
 * Animazione d'apertura dal logo:
 * 1. la ruota della biga entra rotolando e si ferma dove sta nel disegno del logo;
 * 2. da lì "tira fuori" la biga (rivelata da destra a sinistra), sale la scritta;
 * 3. la biga vola nell'hero, alla posizione e grandezza esatte del logo 3D, mentre lo sfondo si dissolve:
 *    il logo 2D diventa il logo 3D, che poi si gira di tre quarti e fa partire la ruota.
 * Fuori dalla home (nessun logo 3D da raggiungere) il sipario sale come nelle transizioni.
 * Una volta per visita, si salta con un clic o un tasto, assente con "riduci movimento".
 */
export function IntroLogo() {
  const [show, setShow] = useState(WILL_SHOW);
  const [flying, setFlying] = useState(false);
  const emblem = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {}
    lenisStore.current?.stop();
    document.documentElement.style.overflow = 'hidden';
    const done = () => setShow(false);
    const fly = window.setTimeout(() => {
      const target = document.getElementById('hero-logo')?.getBoundingClientRect();
      const src = emblem.current?.getBoundingClientRect();
      if (!target || !src || target.width === 0 || target.bottom < 0) return done();
      // nel palco dell'hero il logo occupa il 90% (inset 5%)
      const s = (target.width * 0.9) / src.width;
      setFlying(true);
      const opts = { duration: FLY_FOR, ease: FLY };
      animate(x, target.left + target.width / 2 - (src.left + src.width / 2), opts);
      animate(y, target.top + target.height / 2 - (src.top + src.height / 2), opts);
      animate(scale, s, opts);
    }, FLY_AT * 1000);
    const end = window.setTimeout(done, (FLY_AT + FLY_FOR) * 1000 + 60);
    window.addEventListener('keydown', done);
    return () => {
      window.clearTimeout(fly);
      window.clearTimeout(end);
      window.removeEventListener('keydown', done);
      document.documentElement.style.overflow = '';
      lenisStore.current?.start();
    };
  }, [show, x, y, scale]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden"
          onClick={() => setShow(false)}
          exit={flying ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: flying ? 0.25 : 0.8, ease: [0.65, 0, 0.35, 1] }}
          aria-hidden
        >
          {/* sfondo: si dissolve durante il volo e lascia vedere l'hero */}
          <motion.div className="absolute inset-0 bg-night" animate={{ opacity: flying ? 0 : 1 }} transition={{ duration: FLY_FOR * 0.9, ease: 'easeInOut' }}>
            <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_50%,rgb(0_184_242/0.14),transparent_70%)]" />
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-cyan" />
          </motion.div>

          {/* emblema: proporzioni del logo originale (1080 x 860) */}
          <motion.div ref={emblem} className="relative aspect-[1080/860] w-[min(72vw,360px)]" style={{ x, y, scale }}>
            <motion.img
              src="/brand/emblem.svg"
              alt=""
              className="absolute inset-0 size-full"
              initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ delay: 1.0, duration: 0.9, ease: EASE }}
            />
            {/* la ruota rotola fino alla posizione della ruota del logo (centro 82% / 83%, diametro 29%) */}
            <motion.div
              className="absolute left-[82%] top-[83%] aspect-square w-[29%] -translate-x-1/2 -translate-y-1/2"
              initial={{ x: '-260%', rotate: -900, opacity: 1 }}
              animate={{ x: '0%', rotate: 0, opacity: 0 }}
              transition={{ x: { duration: 1.05, ease: ROLL }, rotate: { duration: 1.05, ease: ROLL }, opacity: { delay: 1.85, duration: 0.3 } }}
            >
              <WheelGlyph className="size-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
            </motion.div>
            {/* la strada */}
            <motion.span
              className="absolute -bottom-3 left-1/2 h-[2px] w-[140%] -translate-x-1/2 origin-left bg-gradient-to-r from-transparent via-cyan to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, opacity: flying ? 0 : 1 }}
              transition={{ scaleX: { duration: 1.05, ease: ROLL }, opacity: { duration: 0.3 } }}
            />
          </motion.div>

          {/* scritta: sparisce quando la biga parte */}
          <motion.div className="relative" animate={{ opacity: flying ? 0 : 1, y: flying ? 20 : 0 }} transition={{ duration: 0.35 }}>
            <div className="mt-9 overflow-hidden">
              <motion.img src="/brand/wordmark-dark.svg" alt="Wheel Tours" className="mx-auto h-9 w-auto sm:h-11" initial={{ y: '120%' }} animate={{ y: '0%' }} transition={{ delay: 1.45, duration: 0.8, ease: EASE }} />
            </div>
            <motion.p
              className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.35em] text-mist"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ delay: 1.7, duration: 0.8, ease: EASE }}
            >
              Golf cart tours · Rome
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
