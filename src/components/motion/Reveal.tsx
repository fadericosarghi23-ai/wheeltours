import { motion, useInView, type HTMLMotionProps } from 'framer-motion';
import { useRef } from 'react';
import { EASE_EXPO } from '@/lib/motion';

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number; once?: boolean };

/** Entrata allo scroll: sale e appare. */
export function Reveal({ delay = 0, y = 36, once = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE_EXPO, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Immagine che si scopre dal basso come un foglio che scorre.
 * Si osserva il contenitore esterno: un elemento con clip-path inset(100%) non risulta mai
 * "visibile" all'IntersectionObserver e l'animazione non partirebbe.
 */
export function RevealImage({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : undefined}
        transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
