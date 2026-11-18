import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Barra promo del sito attuale ("Use WHEEL10 to save 10%"): RocknRoll One, giallo su cyan. Ferma, centrata. */
export function PromoBar({ className }: { className?: string }) {
  const { t } = useI18n();
  const [a, b] = t.promo.text.split(t.promo.code);
  return (
    <div className={cn('flex h-8 items-center justify-center overflow-hidden whitespace-nowrap bg-cyan px-3 text-center font-promo text-[0.7rem] uppercase text-yellow sm:text-[0.9rem] sm:tracking-wide', className)}>
      {a}
      <b className="mx-1 rounded bg-night/20 px-1.5">{t.promo.code}</b>
      {b}
    </div>
  );
}
