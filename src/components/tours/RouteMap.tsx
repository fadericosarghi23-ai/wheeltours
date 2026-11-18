import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { MapPin, Play, RotateCcw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SPOKE_PATH } from '@/components/brand/WheelGlyph';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BASE_POINT, HIGHLIGHT_STOPS, TIBER } from '@/data/site';

/**
 * Tour Highlights: mappa schematica di Roma con le tappe del testo originale, posizionate con le loro
 * coordinate reali. "Ride the route" fa percorrere il giro a un golf cart (la ruota del logo).
 */
const W = 1000;
const H = 780;
const px = (lon: number, lat: number): [number, number] => [((lon - 12.452) / 0.048) * W, ((41.912 - lat) / 0.028) * H];

/** posizione delle etichette: Piazza Navona, Pantheon e Minerva sono a pochi metri, si separano */
const ABOVE = { textAnchor: 'middle', y: -26 } as const;
type Label = { textAnchor: 'middle' | 'end' | 'start'; x?: number; y: number };
const LABELS: Record<number, Label> = { 3: { textAnchor: 'end', x: -22, y: 6 }, 5: { textAnchor: 'start', x: 20, y: 30 } };
const labelFor = (i: number): Label => LABELS[i] ?? ABOVE;

/** curva morbida che passa per tutti i punti (Catmull-Rom -> Bézier) */
function smooth(points: [number, number][]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function RouteMap() {
  const { t, lang } = useI18n();
  const stops = useMemo(() => HIGHLIGHT_STOPS.map((s) => ({ name: s[lang], xy: px(s.lon, s.lat) })), [lang]);
  const base = px(BASE_POINT.lon, BASE_POINT.lat);
  const routeD = useMemo(() => smooth([base, ...stops.map((s) => s.xy), base]), [stops, base]);
  const tiberD = useMemo(() => smooth(TIBER.map(([lo, la]) => px(lo, la))), []);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, margin: '0px 0px -20% 0px' });
  const t01 = useMotionValue(0);
  const [cart, setCart] = useState<{ x: number; y: number; a: number } | null>(null);

  useMotionValueEvent(t01, 'change', (v) => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    const pt = p.getPointAtLength(v * L);
    setCart({ x: pt.x, y: pt.y, a: ((v * L) / 26) * (180 / Math.PI) });
    // tappa più vicina al carrello
    let best = -1;
    let bd = 34;
    stops.forEach((s, i) => {
      const d = Math.hypot(s.xy[0] - pt.x, s.xy[1] - pt.y);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    if (best >= 0) setActive(best);
  });

  const play = () => {
    setPlaying(true);
    t01.set(0);
    animate(t01, 1, { duration: 11, ease: 'linear', onComplete: () => (setPlaying(false), setPlayed(true)) });
  };

  return (
    <div className="grid gap-6">
      <div ref={box} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night-deep">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={t.route.title}>
          <defs>
            <pattern id="grid-dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="rgb(204 214 223 / 0.12)" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#grid-dots)" />
          {/* Tevere */}
          <motion.path d={tiberD} fill="none" stroke="var(--wt-sky)" strokeOpacity="0.35" strokeWidth="34" strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }} />
          <text x={px(12.4692, 41.8975)[0] - 70} y={px(12.4692, 41.8975)[1] + 40} fill="var(--wt-sky)" fillOpacity="0.7" fontSize="22" fontStyle="italic" transform={`rotate(-58 ${px(12.4692, 41.8975)[0] - 70} ${px(12.4692, 41.8975)[1] + 40})`}>
            {t.route.river}
          </text>
          {/* percorso */}
          <motion.path d={routeD} fill="none" stroke="var(--wt-cyan)" strokeOpacity="0.25" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <motion.path ref={pathRef} d={routeD} fill="none" stroke="var(--wt-cyan)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 2.4, delay: 0.4, ease: [0.65, 0, 0.35, 1] }} />
          {/* sede */}
          <g transform={`translate(${base[0]},${base[1]})`}>
            <circle r="22" fill="var(--wt-yellow)" fillOpacity="0.18" />
            <circle r="11" fill="var(--wt-yellow)" stroke="var(--wt-night)" strokeWidth="3" />
          </g>
          {/* tappe */}
          {stops.map((s, i) => {
            const on = active === i;
            return (
              <g key={s.name} transform={`translate(${s.xy[0]},${s.xy[1]})`}>
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: 0.8 + i * 0.12, type: 'spring', stiffness: 260, damping: 16 }}
                className="cursor-pointer"
                onClick={() => setActive(i)}
              >
                {on && <circle r="30" fill="var(--wt-yellow)" fillOpacity="0.2" className="animate-ping [transform-box:fill-box] [transform-origin:center]" />}
                <circle r={on ? 17 : 13} fill={on ? 'var(--wt-yellow)' : 'var(--wt-night)'} stroke={on ? 'var(--wt-night)' : 'var(--wt-cyan)'} strokeWidth="3" style={{ transition: 'all .3s' }} />
                <text textAnchor="middle" y="5" fontSize="14" fontWeight="700" fill={on ? 'var(--wt-night)' : 'white'}>
                  {i + 1}
                </text>
                <text {...labelFor(i)} fontSize={on ? 24 : 19} fontWeight="700" fill={on ? 'var(--wt-yellow)' : 'rgb(255 255 255 / 0.75)'} paintOrder="stroke" stroke="var(--wt-night-deep)" strokeWidth="6" style={{ transition: 'all .3s' }}>
                  {s.name}
                </text>
              </motion.g>
              </g>
            );
          })}
          {/* golf cart: la ruota del logo che rotola lungo il giro */}
          {cart && (
            <g transform={`translate(${cart.x},${cart.y}) rotate(${cart.a}) scale(0.26)`}>
              <circle r="100" fill="var(--wt-night)" stroke="var(--wt-logo-cyan)" strokeWidth="14" />
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d={SPOKE_PATH} transform={`rotate(${i * 45})`} fill="var(--wt-yellow)" />
              ))}
            </g>
          )}
        </svg>
        <p className="absolute bottom-3 left-4 text-[0.7rem] uppercase tracking-[0.18em] text-white/50">{t.route.diagram}</p>
      </div>

      <div className="flex flex-col">
        <p className="text-mist">{t.route.hint}</p>
        <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {stops.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-300',
                  active === i ? 'border-yellow bg-yellow text-night' : 'border-white/10 bg-night-soft text-white hover:border-cyan',
                )}
              >
                <span className={cn('grid size-7 shrink-0 place-items-center rounded-full text-xs', active === i ? 'bg-night text-yellow' : 'bg-cyan/15 text-cyan')}>{i + 1}</span>
                {s.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 text-sm text-mist">
          <MapPin className="size-4 text-yellow" />
          {t.route.base}
        </p>
        <Button onClick={play} disabled={playing} className="mt-6 self-start">
          {played ? <RotateCcw /> : <Play />}
          {played ? t.route.replay : t.route.play}
        </Button>
      </div>
    </div>
  );
}
