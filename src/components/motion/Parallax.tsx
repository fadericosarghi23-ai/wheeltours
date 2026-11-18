import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

type Props = { src: string; srcSet?: string; sizes?: string; alt: string; className?: string; imgClassName?: string; strength?: number; eager?: boolean; width?: number; height?: number };

/** Immagine con parallasse dentro la sua cornice. */
export function ParallaxImage({ src, srcSet, sizes = '100vw', alt, className, imgClassName, strength = 10, eager, width, height }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{ y, scale: 1 + strength / 50 }}
        className={cn('absolute inset-0 h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
