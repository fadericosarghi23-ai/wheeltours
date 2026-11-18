import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookButton } from '@/components/booking/Booking';
import { Stars } from '@/components/ui/stars';
import { FeatureIcon } from './FeatureIcon';
import { ROUTES, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { srcSet } from '@/data/content';
import type { Tour } from '@/data/tours';

/** Card tour in stile catalogo: foto, valutazione, punti chiave, prezzo "da" e prenotazione. */
export function TourCard({ tour, index, tone = 'light' }: { tour: Tour; index: number; tone?: 'light' | 'dark' }) {
  const { t, to } = useI18n();
  const href = to(ROUTES.tour(tour.slug));
  const keyFeatures = tour.features.filter((f) => ['time', 'group', 'food', 'ticket'].includes(f.kind)).slice(0, 3);
  const cancel = tour.features.find((f) => f.kind === 'cancel');
  const price = tour.priceText.match(/€\s?\d+/)?.[0];
  const dark = tone === 'dark';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-[box-shadow,transform] duration-500 hover:-translate-y-1',
        dark ? 'border-white/10 bg-night-soft text-white hover:shadow-[0_30px_60px_-30px_black]' : 'border-line bg-white text-ink hover:shadow-[0_30px_60px_-28px_rgb(27_37_47/0.35)]',
      )}
    >
      <Link to={href} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden>
        <img src={tour.cover.sizes.sm.src} srcSet={srcSet(tour.cover)} sizes="(min-width: 1024px) 400px, 100vw" alt="" width={tour.cover.sizes.sm.w} height={tour.cover.sizes.sm.h} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
        {cancel && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
            <RotateCcw className="size-3.5 text-cyan" />
            {cancel.text}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm', dark ? 'text-mist' : 'text-body')}>
          <Stars rating={tour.rating} label={t.tours.rated(tour.rating)} className="text-[0.95rem]" />
          <span className={cn('font-semibold', dark ? 'text-white' : 'text-ink')}>{tour.rating.toFixed(1)}</span>
          <span>
            ({tour.reviews} {t.tours.reviews})
          </span>
        </div>
        <h3 className="mt-2.5 text-[1.2rem] font-semibold leading-snug">
          <Link to={href} className="transition-colors after:absolute after:inset-0 group-hover:text-cyan">
            {tour.title}
          </Link>
        </h3>
        <ul className={cn('mb-6 mt-4 space-y-2 text-[0.92rem]', dark ? 'text-mist' : 'text-body')}>
          {keyFeatures.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5">
              <FeatureIcon kind={f.kind} className="mt-0.5 size-4 shrink-0 text-cyan" />
              {f.text}
            </li>
          ))}
        </ul>
        <div className={cn('mt-auto flex items-end justify-between gap-4 border-t pt-5', dark ? 'border-white/10' : 'border-line')}>
          <p className="leading-tight">
            <span className={cn('block text-xs uppercase tracking-[0.12em]', dark ? 'text-mist' : 'text-body')}>{t.tour.from}</span>
            <span className="text-2xl font-bold">{price}</span>
            <span className={cn('ml-1 text-sm', dark ? 'text-mist' : 'text-body')}>{t.tour.perPerson}</span>
          </p>
          <BookButton experienceId={tour.bokunId} tourTitle={tour.title} size="sm" className="relative z-10" />
        </div>
        <Link to={href} className="relative z-10 mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-cyan hover:underline">
          {t.tours.discover}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
