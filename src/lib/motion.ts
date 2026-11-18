import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_DRAW = [0.65, 0, 0.35, 1] as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** istanza Lenis condivisa (impostata da SmoothScroll) */
export const lenisStore: { current: Lenis | null } = { current: null };

export function scrollToTop() {
  if (lenisStore.current) lenisStore.current.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
