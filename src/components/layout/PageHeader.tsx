import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { cn } from '@/lib/utils';
import { srcSet, type Photo } from '@/data/content';

type Props = { kicker?: string; title: string[]; intro?: ReactNode; image?: Photo; children?: ReactNode; className?: string; titleClassName?: string };

/** Testata delle pagine interne: titolo a righe che salgono, foto in parallasse, ruota che gira con lo scroll. */
export function PageHeader({ kicker, title, intro, image, children, className, titleClassName }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  return (
    <section ref={ref} className={cn('relative isolate overflow-hidden bg-night pb-16 pt-36 sm:pb-24 sm:pt-44', className)}>
      {image && (
        <motion.div className="absolute inset-0 -z-10" style={{ y }}>
          <motion.img src={image.sizes.lg.src} srcSet={srcSet(image)} sizes="100vw" alt="" className="h-full w-full object-cover" style={{ scale }} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/60 to-night" />
        </motion.div>
      )}
      <div className="container-wt">
        {kicker && (
          <motion.p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-cyan sm:text-sm" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            {kicker}
          </motion.p>
        )}
        <SplitTitle as="h1" lines={title} inView={false} delay={0.15} className={cn('max-w-5xl font-display text-[2.2rem] uppercase text-white sm:text-5xl lg:text-6xl', titleClassName)} />
        {intro && (
          <motion.div className="mt-6 max-w-2xl text-lg text-mist" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            {intro}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
