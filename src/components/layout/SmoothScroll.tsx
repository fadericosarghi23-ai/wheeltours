import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, lenisStore, prefersReducedMotion } from '@/lib/motion';

/** Scroll fluido (Lenis) sincronizzato con GSAP ScrollTrigger. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisStore.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisStore.current = null;
    };
  }, []);
  return null;
}
