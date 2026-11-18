import { motion, useInView } from 'framer-motion';
import { createElement, useRef } from 'react';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Props = {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** anima all'ingresso nel viewport invece che al montaggio */
  inView?: boolean;
};

/**
 * Titolo a righe che salgono da una maschera.
 * Si osserva il titolo intero: le singole righe partono fuori dalla loro maschera
 * (overflow hidden) e non risulterebbero mai visibili all'IntersectionObserver.
 */
export function SplitTitle({ lines, as = 'h2', className, lineClassName, delay = 0, inView = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const show = !inView || seen;
  return createElement(
    as,
    { ref, className, 'aria-label': lines.join(' ') },
    lines.map((l, i) => (
      <span key={i} aria-hidden className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className={cn('block will-change-transform', lineClassName)}
          initial={{ y: '110%' }}
          animate={show ? { y: '0%' } : undefined}
          transition={{ duration: 1.15, ease: EASE_EXPO, delay: delay + i * 0.09 }}
        >
          {l}
        </motion.span>
      </span>
    )),
  );
}
