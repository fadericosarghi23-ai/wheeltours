import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { Church, Ticket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Counter } from '@/components/motion/Counter';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { APPIAN_STOPS } from '@/data/site';

/**
 * Tour Catacombe e Via Appia: itinerario a tappe nell'ordine del testo originale.
 * Una linea si riempie lungo il percorso mentre si scorre; le due visite interne
 * (Catacombe con i 40 minuti del sito e Basilica) sono messe in evidenza.
 */
function StopRow({ i, name, inside, active, onActive }: { i: number; name: string; inside?: 'catacombs' | 'basilica'; active: boolean; onActive: (i: number) => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { margin: '-40% 0px -50% 0px' });
  useEffect(() => {
    if (seen) onActive(i);
  }, [seen, i, onActive]);
  return (
    <li ref={ref} className={cn('relative py-4 pl-12 sm:pl-14', inside && 'my-2')}>
      <span className={cn('absolute left-[9px] top-[1.35rem] grid size-[22px] place-items-center rounded-full border-2 text-[0.65rem] font-bold transition-colors duration-500', active || seen ? 'border-cyan bg-cyan text-white' : 'border-white/25 bg-night text-white/50')}>{i + 1}</span>
      <div className={cn('rounded-2xl transition-colors duration-500', inside ? 'border border-cyan/30 bg-cyan/10 p-4 sm:p-5' : '')}>
        <p className={cn('text-lg font-semibold transition-colors duration-500 sm:text-xl', seen || active ? 'text-white' : 'text-white/60')}>{name}</p>
        {inside && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan px-3 py-1 text-xs font-semibold text-white">
              <Church className="size-3.5" />
              {t.appian.inside}
            </span>
            {inside === 'catacombs' && (
              <>
                <span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  <b className="text-sm">{seen ? <Counter to={40} duration={1.2} /> : '40'}</b>
                  {t.appian.minutes}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  <Ticket className="size-3.5 text-cyan" />
                  {t.appian.tickets}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export function AppianDescent() {
  const { lang } = useI18n();
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 50%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-[2px] bg-white/10" />
      <motion.span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-[2px] origin-top bg-cyan" style={{ scaleY: fill }} />
      {APPIAN_STOPS.map((s, i) => (
        <StopRow key={s.en} i={i} name={s[lang]} inside={s.inside} active={i === active} onActive={setActive} />
      ))}
    </ol>
  );
}
