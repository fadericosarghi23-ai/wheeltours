import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES, useI18n } from '@/lib/i18n';
import type { TourSlug } from '@/data/site';
import { getTours } from '@/data/tours';

/**
 * "Qual è il tour giusto per te?". Le risposte rimandano a quanto dicono i testi del sito:
 * Highlights = piazze e fontane, 7 partenze; Catacombe = Appia e visita interna, 3 partenze;
 * Rome in a Day = "best tour for people with limited time", 11:00 e 19:00. Domande scritte da noi.
 */
const H: TourSlug = 'rome-highlights-golf-cart-tour';
const C: TourSlug = 'catacombs-appian-way-golf-cart-tour';
const D: TourSlug = 'rome-in-a-day-pizza-gelato';

export function TourQuiz() {
  const { t, to, lang } = useI18n();
  const tours = getTours(lang);
  const Q = [
    { q: t.quiz.q1, a: [{ l: t.quiz.q1a, s: H }, { l: t.quiz.q1b, s: C }, { l: t.quiz.q1c, s: D }] },
    { q: t.quiz.q2, a: [{ l: t.quiz.q2a, s: D }, { l: t.quiz.q2b, s: null }] },
    { q: t.quiz.q3, a: [{ l: t.quiz.q3a, s: H }, { l: t.quiz.q3b, s: D }, { l: t.quiz.q3c, s: C }] },
  ];
  const [answers, setAnswers] = useState<(TourSlug | null)[]>([]);
  const step = answers.length;
  const done = step >= Q.length;

  const result = (() => {
    const score: Record<TourSlug, number> = { [H]: 0, [C]: 0, [D]: 0 } as Record<TourSlug, number>;
    answers.forEach((s, i) => s && (score[s] += i === 0 ? 2 : 1)); // la prima risposta pesa di più
    return tours.find((x) => x.slug === (Object.entries(score).sort((a, b) => b[1] - a[1])[0][0] as TourSlug))!;
  })();

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night-soft p-6 sm:p-10">
      <div className="mb-6 flex gap-1.5">
        {Q.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < step ? 'bg-yellow' : 'bg-white/15'}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">{t.quiz.step(step + 1, Q.length)}</p>
            <p className="mt-2 text-2xl font-semibold leading-snug sm:text-3xl">{Q[step].q}</p>
            <div className="mt-7 grid gap-3">
              {Q[step].a.map((a) => (
                <button key={a.l} type="button" onClick={() => setAnswers([...answers, a.s])} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-night px-5 py-4 text-left font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow hover:bg-yellow hover:text-night">
                  {a.l}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="r" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
            <img src={result.cover.sizes.sm.src} alt="" className="aspect-square w-full rounded-3xl object-cover" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">{t.quiz.result}</p>
              <p className="mt-2 text-3xl font-semibold leading-tight text-white">{result.short}</p>
              <p className="mt-3 text-mist">{result.title}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={to(ROUTES.tour(result.slug))} className={buttonVariants()}>
                  {t.quiz.see}
                </Link>
                <button type="button" onClick={() => setAnswers([])} className={buttonVariants({ variant: 'ghost' })}>
                  <RotateCcw />
                  {t.quiz.restart}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
