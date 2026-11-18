import { animate, AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookButton } from '@/components/booking/Booking';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { content } from '@/data/content';
import { getTours } from '@/data/tours';

/**
 * Calcolatore del gruppo. Usa solo i dati del sito attuale: prezzo "from" per persona,
 * sconto di €9 per i bambini 0-6, codice WHEEL10 (10%), 7 posti per golf cart, gruppo fino a 14.
 * Esclude "Rome in a Day": il prezzo pubblicato (€500 a persona) è da confermare col cliente.
 */
const PER_CART = 7;
const MAX = 14;
const CHILD_DISCOUNT = 9;

function Stepper({ label, value, set, min = 0, max }: { label: string; value: number; set: (n: number) => void; min?: number; max: number }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-night px-4 py-3">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`${t.calc.less}: ${label}`} disabled={value <= min} onClick={() => set(value - 1)} className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-yellow hover:text-night disabled:opacity-30">
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center font-display text-2xl" aria-live="polite">
          {value}
        </span>
        <button type="button" aria-label={`${t.calc.more}: ${label}`} disabled={value >= max} onClick={() => set(value + 1)} className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-yellow hover:text-night disabled:opacity-30">
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function AnimatedEuro({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const c = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => ref.current && (ref.current.textContent = `€${Math.round(v)}`),
    });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span ref={ref}>€{Math.round(value)}</span>;
}

export function GroupCalculator() {
  const { t, lang } = useI18n();
  const tours = getTours(lang).filter((x) => x.slug !== 'rome-in-a-day-pizza-gelato');
  const [slug, setSlug] = useState(tours[0].slug);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [coupon, setCoupon] = useState(true);
  const tour = tours.find((x) => x.slug === slug)!;
  const people = adults + kids;
  const carts = Math.max(1, Math.ceil(people / PER_CART));
  const gross = adults * tour.priceAmount + kids * (tour.priceAmount - CHILD_DISCOUNT);
  const total = coupon ? gross * 0.9 : gross;

  return (
    <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-night-soft p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mist">{t.calc.tour}</p>
        <div className="grid grid-cols-2 gap-2">
          {tours.map((x) => (
            <button key={x.slug} type="button" onClick={() => setSlug(x.slug)} aria-pressed={slug === x.slug} className={cn('rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition', slug === x.slug ? 'border-cyan bg-cyan text-white' : 'border-white/10 bg-night hover:border-white/30')}>
              {x.short}
            </button>
          ))}
        </div>
        <Stepper label={t.calc.adults} value={adults} set={setAdults} min={1} max={MAX - kids} />
        <Stepper label={t.calc.kids} value={kids} set={setKids} max={MAX - adults} />
        <p className="px-1 text-xs text-mist">{t.calc.kidsNote}</p>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-yellow/40 bg-yellow/10 px-4 py-3 text-sm font-semibold text-yellow">
          <input type="checkbox" checked={coupon} onChange={(e) => setCoupon(e.target.checked)} className="size-4 accent-[var(--wt-yellow)]" />
          <span className="font-promo">{t.calc.coupon(content.promo.code)}</span>
        </label>
      </div>

      <div className="flex flex-col">
        {/* golf cart con i posti */}
        <div className="flex flex-wrap gap-4">
          <AnimatePresence initial={false}>
            {Array.from({ length: carts }, (_, c) => (
              <motion.div key={c} initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="rounded-2xl border border-white/10 bg-night p-3">
                <div className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: PER_CART }, (_, s) => {
                    const seat = c * PER_CART + s;
                    const kind = seat < adults ? 'a' : seat < people ? 'k' : '';
                    return <motion.span key={s} layout className={cn('size-5 rounded-md transition-colors duration-300', kind === 'a' ? 'bg-cyan' : kind === 'k' ? 'bg-yellow' : 'bg-white/10')} />;
                  })}
                </div>
                <svg viewBox="0 0 120 40" className="mt-2 w-[104px]" aria-hidden>
                  <rect x="6" y="6" width="108" height="16" rx="6" fill="white" opacity=".9" />
                  <circle cx="28" cy="28" r="10" fill="var(--wt-night-deep)" stroke="var(--wt-logo-cyan)" strokeWidth="4" />
                  <circle cx="92" cy="28" r="10" fill="var(--wt-night-deep)" stroke="var(--wt-logo-cyan)" strokeWidth="4" />
                </svg>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <p className="mt-3 text-sm text-mist">
          <b className="text-white">{carts}</b> {t.calc.carts(carts)} · <b className="text-white">{people}</b>/{MAX} {t.calc.seats}
        </p>
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mist">{t.calc.total}</p>
          <p className="font-display text-7xl text-yellow">
            <AnimatedEuro value={total} />
          </p>
          <p className="mt-2 text-xs text-mist">{t.calc.note}</p>
          {people >= MAX && (
            <p className="mt-3 flex items-start gap-2 text-sm text-yellow">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {t.calc.over}
            </p>
          )}
        </div>
        <BookButton experienceId={tour.bokunId} tourTitle={tour.title} className="mt-6 self-start" />
      </div>
    </div>
  );
}
