import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import map from '@/data/map.json';
import { ADDRESS } from '@/data/site';

/** nomi dei luoghi in mappa (da OpenStreetMap, tradotti) */
const LABELS: Record<string, { en: string; it: string; dx?: number; dy?: number }> = {
  'Basilica di Santa Maria Maggiore': { en: 'Santa Maria Maggiore', it: 'Santa Maria Maggiore', dx: 30, dy: 26 },
  'Basilica di San Pietro in Vincoli': { en: 'San Pietro in Vincoli', it: 'San Pietro in Vincoli', dy: 16 },
  Colosseo: { en: 'Colosseum', it: 'Colosseo' },
  'Fori Imperiali': { en: 'Imperial Forums', it: 'Fori Imperiali' },
  'Metro Cavour': { en: 'Cavour Metro (B)', it: 'Metro Cavour (B)', dx: -40, dy: -14 },
};

/**
 * Mappa della zona di Via Cavour 138 nei colori del sito, disegnata dai dati OpenStreetMap
 * (scripts/gen-map.mjs) e servita dal nostro dominio: nessun servizio esterno, nessun cookie.
 * Per le indicazioni stradali si apre Google Maps in una nuova scheda.
 */
export function MapEmbed({ className }: { className?: string }) {
  const { t, lang } = useI18n();
  return (
    <div className={cn('relative isolate overflow-hidden rounded-3xl border border-white/10 bg-night', className)}>
      <div className="relative aspect-[1200/1099] w-full">
        <motion.img
          src="/img/map-cavour.svg"
          alt={`${t.visit.address}: ${ADDRESS}`}
          className="absolute inset-0 size-full"
          initial={{ scale: 1.08, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_64%_38%,transparent_40%,rgb(27_37_47/0.7))]" />

        {/* luoghi vicini */}
        {map.landmarks.map((l, i) => (
          <motion.span
            key={l.name}
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-night/75 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-mist backdrop-blur-sm sm:text-xs"
            style={{ left: `calc(${l.x}% + ${LABELS[l.name]?.dx ?? 0}px)`, top: `calc(${l.y}% + ${LABELS[l.name]?.dy ?? 0}px)` }}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
          >
            {LABELS[l.name]?.[lang] ?? l.name}
          </motion.span>
        ))}

        {/* la sede */}
        <div className="absolute" style={{ left: `${map.pin.x}%`, top: `${map.pin.y}%` }}>
          <span aria-hidden className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-cyan/25 [animation-duration:2.6s]" />
          <motion.span
            className="relative flex -translate-x-1/2 -translate-y-full flex-col items-center"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 14 }}
          >
            <span className="grid size-16 place-items-center rounded-full bg-white p-2 shadow-[0_14px_30px_-8px_rgb(0_0_0/0.6)] ring-4 ring-cyan">
              <img src="/brand/emblem.svg" alt="" className="w-full" />
            </span>
            <span className="-mt-1 size-0 border-x-[9px] border-t-[12px] border-x-transparent border-t-cyan" />
          </motion.span>
        </div>

        <p className="absolute bottom-2 right-3 text-[0.65rem] text-white/50">
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" className="hover:text-white">
            {map.attribution}
          </a>
        </p>
      </div>

    </div>
  );
}
