import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Phone, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { LangSwitch } from './LangSwitch';
import { WhatsAppIcon } from './Navbar';
import { ROUTES, useI18n } from '@/lib/i18n';
import { lenisStore } from '@/lib/motion';
import { getTours } from '@/data/tours';
import { content } from '@/data/content';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Menu mobile dedicato: pannello a tutto schermo, voci grandi, la ruota che gira sullo sfondo. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, to, lang } = useI18n();
  const tours = getTours(lang);

  useEffect(() => {
    if (!open) return;
    lenisStore.current?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lenisStore.current?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const items = [
    { to: to(ROUTES.home), label: t.nav.home },
    { to: to(ROUTES.tours), label: t.nav.tours },
    { to: to(ROUTES.visit), label: t.nav.visit },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-night lg:hidden"
          data-lenis-prevent
          initial={{ clipPath: 'circle(0% at calc(100% - 36px) 52px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 36px) 52px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 36px) 52px)' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="container-wt flex h-[68px] shrink-0 items-center justify-between">
            <Link to={to(ROUTES.home)} onClick={onClose} className="block h-11" aria-label="Wheel Tours, home">
              <Logo className="h-full" />
            </Link>
            <button type="button" onClick={onClose} aria-label={t.nav.close} className="grid size-10 place-items-center rounded-full bg-yellow text-night">
              <X className="size-5" />
            </button>
          </div>
          <nav className="container-wt relative flex-1 pb-8 pt-6" aria-label="Mobile">
            <ul className="space-y-1">
              {items.map((it, i) => (
                <motion.li key={it.to} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + i * 0.07, duration: 0.7, ease: EASE }}>
                  <Link to={it.to} onClick={onClose} className="block font-display text-[2.6rem] uppercase leading-[1.1] text-white transition-colors active:text-yellow">
                    {it.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.ul className="mt-6 space-y-2 border-l-2 border-cyan pl-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              {tours.map((tour) => (
                <li key={tour.slug}>
                  <Link to={to(ROUTES.tour(tour.slug))} onClick={onClose} className="flex items-center gap-3 py-1.5 text-base font-medium text-mist">
                    <img src={tour.cover.sizes.sm.src} alt="" className="size-10 rounded-lg object-cover" />
                    {tour.short}
                  </Link>
                </li>
              ))}
            </motion.ul>
            <motion.div className="mt-10 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <a href={content.contacts.whatsapp} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 rounded-full bg-whatsapp px-5 font-semibold text-white">
                <WhatsAppIcon className="size-5" /> WhatsApp
              </a>
              <a href={content.contacts.phoneHref} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 font-semibold">
                <Phone className="size-4" /> {content.contacts.phone}
              </a>
              <a href={`mailto:${content.contacts.email}`} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 font-semibold">
                <Mail className="size-4" /> {content.contacts.email}
              </a>
            </motion.div>
            <div className="mt-8">
              <LangSwitch className="inline-flex" />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
