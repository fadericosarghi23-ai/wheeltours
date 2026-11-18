import { cn } from '@/lib/utils';

/**
 * Logo originale Wheel Tours: biga + scritta WHEEL.TOURS.
 * SVG ricavati dai PNG del sito attuale con scripts/trace-logo.mjs (public/brand).
 */
export function Logo({ className, variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img src="/brand/emblem.svg" alt="" width={1080} height={860} className="h-full w-auto" decoding="async" />
      <img
        src={variant === 'dark' ? '/brand/wordmark-dark.svg' : '/brand/wordmark-light.svg'}
        alt="Wheel Tours"
        width={515}
        height={82}
        className="h-[52%] w-auto"
        decoding="async"
      />
    </span>
  );
}
