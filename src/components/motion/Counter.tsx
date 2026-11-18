import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = { to: number; from?: number; duration?: number; className?: string; pad?: number };

/** Numero che conta quando entra nel viewport. Solo cifre reali, ricavate dai contenuti. */
export function Counter({ to, from = 0, duration = 1.8, className, pad = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, from, to, duration]);
  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      {String(v).padStart(pad, '0')}
    </span>
  );
}
