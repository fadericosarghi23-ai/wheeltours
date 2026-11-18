import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Moon, MoveHorizontal, Sun } from 'lucide-react';
import { useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { photo, srcSet } from '@/data/content';

/**
 * Tour Roma in un giorno: le due partenze del testo originale (11:00 e 19:00) a confronto.
 * Cursore da trascinare tra il Colosseo di giorno e il Colosseo di sera (foto vere del cliente).
 */
export function DayNight() {
  const { t } = useI18n();
  const day = photo('da14f7b6-2997-4f6c-95e3-6915c3030066');
  const night = photo('669a4e24accd4b93b96e4e4986e88358-5823553535856459615-121-lg-');
  const box = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(50); // % di "giorno" visibile
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(pos, (v) => `${v}%`);
  const sunOpacity = useTransform(pos, [20, 80], [0.3, 1]);
  const moonOpacity = useTransform(pos, [20, 80], [1, 0.3]);
  const [mode, setMode] = useState<'day' | 'night' | null>(null);

  const setFromEvent = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    pos.set(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
    setMode(null);
  };
  const go = (m: 'day' | 'night') => {
    setMode(m);
    animate(pos, m === 'day' ? 100 : 0, { duration: 0.9, ease: [0.65, 0, 0.35, 1] });
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div
        ref={box}
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[2rem] border border-white/10"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromEvent(e.clientX);
        }}
        onPointerMove={(e) => e.buttons === 1 && setFromEvent(e.clientX)}
        role="slider"
        tabIndex={0}
        aria-label={t.dayNight.drag}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos.get())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') pos.set(Math.max(0, pos.get() - 5));
          if (e.key === 'ArrowRight') pos.set(Math.min(100, pos.get() + 5));
        }}
      >
        <img src={night.sizes.lg.src} srcSet={srcSet(night)} sizes="(min-width:1024px) 60vw, 100vw" alt={t.dayNight.evening} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <motion.img src={day.sizes.lg.src} alt={t.dayNight.morning} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: clip }} draggable={false} />
        <motion.div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-yellow" style={{ left }}>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-yellow text-night shadow-xl">
            <MoveHorizontal className="size-5" />
          </span>
        </motion.div>
        <motion.span style={{ opacity: sunOpacity }} className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-night/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
          <Sun className="size-4 text-yellow" /> 11:00
        </motion.span>
        <motion.span style={{ opacity: moonOpacity }} className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-night/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
          <Moon className="size-4 text-cyan" /> 19:00
        </motion.span>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mist">{t.dayNight.drag}</p>
        <div className="mt-5 grid gap-3">
          {(
            [
              { m: 'day', Icon: Sun, label: t.dayNight.morning },
              { m: 'night', Icon: Moon, label: t.dayNight.evening },
            ] as const
          ).map(({ m, Icon, label }) => (
            <button
              key={m}
              type="button"
              onClick={() => go(m)}
              aria-pressed={mode === m}
              className={cn(
                'group flex items-center gap-4 rounded-3xl border p-5 text-left transition-all duration-500',
                mode === m ? (m === 'day' ? 'border-yellow bg-yellow text-night' : 'border-cyan bg-cyan text-white') : 'border-white/10 bg-night-soft hover:border-white/30',
              )}
            >
              <span className={cn('grid size-14 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-12', mode === m ? 'bg-night/15' : 'bg-white/5')}>
                <Icon className="size-7" />
              </span>
              <span className="font-display text-3xl uppercase">{label}</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-mist">{t.dayNight.note}</p>
        <motion.p className="mt-6 inline-flex items-center gap-3 rounded-full bg-night-soft px-5 py-3 font-display text-2xl uppercase text-yellow" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          🍕 {t.dayNight.pizza} 🍧
        </motion.p>
      </div>
    </div>
  );
}
