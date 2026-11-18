import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { Stars } from '@/components/ui/stars';
import { buttonVariants } from '@/components/ui/button';
import { LangSwitch } from './LangSwitch';
import { MobileMenu } from './MobileMenu';
import { PromoBar } from './PromoBar';
import { ROUTES, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { getTours } from '@/data/tours';
import { content } from '@/data/content';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3a8.2 8.2 0 1 1 6.9 3.9Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
export { WhatsAppIcon };

export function Navbar() {
  const { t, to, lang, base } = useI18n();
  const tours = getTours(lang);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drop, setDrop] = useState(false);
  const [mobile, setMobile] = useState(false);
  const last = useRef(0);
  const { pathname } = useLocation();
  const dropTimer = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last.current + 4);
      if (y < last.current - 4) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrop(false);
    setMobile(false);
  }, [pathname]);

  const openDrop = () => {
    window.clearTimeout(dropTimer.current);
    setDrop(true);
  };
  const closeDrop = () => {
    dropTimer.current = window.setTimeout(() => setDrop(false), 140);
  };
  const toursActive = base.startsWith('/tours');

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn('relative px-1 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-yellow', isActive ? 'text-yellow' : 'text-white');

  return (
    <>
      <header
        className={cn('fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]', hidden && !drop && !mobile && '-translate-y-full')}
      >
        <PromoBar className={cn('transition-[margin] duration-500', scrolled && '-mt-8')} />
        <div className={cn('transition-[background-color,box-shadow,backdrop-filter] duration-500', scrolled ? 'bg-night/90 shadow-[0_10px_40px_-20px_black] backdrop-blur-md' : 'bg-transparent')}>
          <nav className="container-full flex h-[68px] items-center justify-between gap-4 lg:h-[78px]" aria-label="Main">
            <Link to={to(ROUTES.home)} className="block h-11 shrink-0 lg:h-[52px]" aria-label="Wheel Tours, home">
              <Logo className="h-full" />
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <NavLink to={to(ROUTES.home)} end className={linkCls}>
                {t.nav.home}
              </NavLink>
              <div className="relative" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
                <button
                  type="button"
                  aria-expanded={drop}
                  aria-controls="tours-menu"
                  onClick={() => setDrop((v) => !v)}
                  onFocus={openDrop}
                  className={cn(linkCls({ isActive: toursActive }), 'flex items-center gap-1.5')}
                >
                  {t.nav.tours}
                  <ChevronDown className={cn('size-4 transition-transform duration-300', drop && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {drop && (
                    <motion.div
                      id="tours-menu"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && closeDrop()}
                    >
                      <div className="overflow-hidden rounded-3xl border border-white/10 bg-night-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                        {tours.map((tour, i) => (
                          <motion.div key={tour.slug} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                            <Link to={to(ROUTES.tour(tour.slug))} className="group flex items-center gap-4 rounded-2xl p-2.5 transition-colors hover:bg-white/5">
                              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                                <img src={tour.cover.sizes.sm.src} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-display text-lg uppercase leading-tight text-white transition-colors group-hover:text-cyan">{tour.short}</span>
                                <span className="mt-1 flex items-center gap-2 text-xs text-mist">
                                  <Stars rating={tour.rating} label={t.tours.rated(tour.rating)} className="text-[0.8rem]" />
                                  {tour.reviews} {t.tours.reviews}
                                  <span className="text-white/40">·</span>
                                  {tour.priceText}
                                </span>
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                        <Link to={to(ROUTES.tours)} className="mt-1 flex items-center justify-between rounded-2xl bg-cyan/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-cyan transition-colors hover:bg-cyan hover:text-white">
                          {t.nav.allTours}
                          <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <NavLink to={to(ROUTES.visit)} className={linkCls}>
                {t.nav.visit}
              </NavLink>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LangSwitch className="hidden sm:flex" />
              <a href={content.contacts.phoneHref} className="hidden size-10 place-items-center rounded-full border border-white/20 transition hover:border-yellow hover:text-yellow xl:grid" aria-label={content.contacts.phone}>
                <Phone className="size-4" />
              </a>
              <a href={content.contacts.whatsapp} target="_blank" rel="noopener" className="grid size-10 place-items-center rounded-full bg-whatsapp text-white transition hover:scale-110" aria-label={t.nav.whatsapp}>
                <WhatsAppIcon className="size-5" />
              </a>
              <Link to={to(ROUTES.tours)} className={cn(buttonVariants({ size: 'sm' }), 'hidden md:inline-flex')}>
                {t.nav.book}
              </Link>
              <button type="button" className="grid size-10 place-items-center rounded-full bg-white/10 lg:hidden" aria-label={t.nav.menu} aria-expanded={mobile} onClick={() => setMobile(true)}>
                <Menu className="size-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
