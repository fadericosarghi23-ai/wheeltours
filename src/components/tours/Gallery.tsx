import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { lenisStore } from '@/lib/motion';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { srcSet, type Photo } from '@/data/content';

/** Galleria a mosaico con lightbox (tastiera, swipe). */
export function Gallery({ photos, alt, className }: { photos: Photo[]; alt: string; className?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const n = photos.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? null : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    lenisStore.current?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lenisStore.current?.start();
    };
  }, [open, go]);

  return (
    <>
      <div className={cn('grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4', className)}>
        {photos.map((p, i) => (
          <motion.button
            key={p.slug}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={cn('group relative overflow-hidden rounded-2xl', i === 0 && 'col-span-2 row-span-2', p.h > p.w && i !== 0 && 'row-span-2')}
            aria-label={`${t.tour.photoOf} ${i + 1}: ${alt}`}
          >
            <img src={p.sizes.sm.src} srcSet={srcSet(p)} sizes={i === 0 ? '(min-width:768px) 50vw, 100vw' : '(min-width:768px) 25vw, 50vw'} alt="" width={p.sizes.sm.w} height={p.sizes.sm.h} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
            <span className="absolute inset-0 bg-night/0 transition-colors duration-500 group-hover:bg-night/30" />
            <Expand className="absolute bottom-3 right-3 size-9 rounded-full bg-yellow p-2 text-night opacity-0 transition-all duration-500 group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>
      {createPortal(
        <AnimatePresence>
          {open !== null && (
            <motion.div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[95] flex items-center justify-center bg-night-deep/95 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={open}
                  src={photos[open].sizes.lg.src}
                  alt={`${alt}, ${t.tour.photoOf.toLowerCase()} ${open + 1}`}
                  className="max-h-[84svh] max-w-full rounded-2xl object-contain shadow-2xl"
                  initial={{ opacity: 0, x: 60, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => Math.abs(info.offset.x) > 60 && go(info.offset.x < 0 ? 1 : -1)}
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-lg text-white/80">
                {open + 1} / {n}
              </p>
              {[
                { d: -1, Icon: ChevronLeft, cls: 'left-3 sm:left-6' },
                { d: 1, Icon: ChevronRight, cls: 'right-3 sm:right-6' },
              ].map(({ d, Icon, cls }) => (
                <button key={d} type="button" aria-label={d < 0 ? 'Previous' : 'Next'} onClick={(e) => (e.stopPropagation(), go(d))} className={cn('absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-yellow hover:text-night', cls)}>
                  <Icon className="size-6" />
                </button>
              ))}
              <button type="button" aria-label={t.nav.close} onClick={() => setOpen(null)} className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-yellow hover:text-night">
                <X className="size-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
