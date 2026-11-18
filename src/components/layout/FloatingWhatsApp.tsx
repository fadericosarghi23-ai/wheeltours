import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WhatsAppIcon } from './Navbar';
import { basePath, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { content } from '@/data/content';

/**
 * Pulsante WhatsApp fisso in basso a destra, nei colori del sito (cyan del logo, giallo della promo).
 * Compare dopo l'hero della home (sulle altre pagine dopo il primo scroll).
 * Sulle pagine tour, su mobile, sale sopra la barra di prenotazione.
 */
export function FloatingWhatsApp() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const path = basePath(useLocation().pathname);
  const onTour = /^\/tours\/[^/]+/.test(path);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const threshold = path === '/' ? window.innerHeight * 0.9 : 300;
    setShow(v > threshold);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={content.contacts.whatsapp}
          target="_blank"
          rel="noopener"
          aria-label={t.nav.whatsapp}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className={cn(
            'group fixed right-4 z-40 flex items-center gap-3 sm:right-6',
            onTour ? 'bottom-24 lg:bottom-6' : 'bottom-4 sm:bottom-6',
          )}
        >
          <span className="pointer-events-none hidden translate-x-2 rounded-full bg-night/90 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
            {t.nav.whatsapp}
          </span>
          <span className="relative grid size-14 place-items-center rounded-full bg-cyan text-white shadow-[0_14px_30px_-10px_rgb(0_0_0/0.55)] ring-4 ring-white/90 transition-colors duration-300 group-hover:bg-yellow group-hover:text-night">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-cyan/40 [animation-duration:2.4s] group-hover:hidden" />
            <WhatsAppIcon className="relative size-7" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
