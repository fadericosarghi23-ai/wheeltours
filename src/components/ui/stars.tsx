import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Stelle di valutazione (come lo star-rating del sito attuale, in giallo). */
export function Stars({ rating, className, label }: { rating: number; className?: string; label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block size-[1em]">
            <Star className="absolute inset-0 size-full text-yellow/30" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-[1em] fill-yellow text-yellow" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
