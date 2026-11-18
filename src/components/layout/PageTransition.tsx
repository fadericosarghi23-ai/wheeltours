import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const EASE = [0.65, 0, 0.35, 1] as const;
let firstPaint = true;

/**
 * Transizione tra pagine sobria: un telo blu notte sale e scopre la pagina nuova,
 * con una sottile linea cyan (il colore del logo) sul bordo.
 */
function Curtain({ phase }: { phase: 'cover' | 'reveal' }) {
  const cover = phase === 'cover';
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] bg-night"
      variants={cover ? { initial: { y: '100%' }, enter: { y: '100%' }, exit: { y: '0%' } } : { initial: { y: '0%' }, enter: { y: '-100%' }, exit: { y: '-100%' } }}
      transition={{ duration: cover ? 0.45 : 0.55, ease: EASE, delay: cover ? 0 : 0.05 }}
    >
      <span className={`absolute inset-x-0 h-[3px] bg-cyan ${cover ? 'top-0' : 'bottom-0'}`} />
    </motion.div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const [skipEnter] = useState(() => {
    const v = firstPaint;
    firstPaint = false;
    return v;
  });
  if (prefersReducedMotion()) return <>{children}</>;
  return (
    <motion.div initial="initial" animate="enter" exit="exit">
      {children}
      <Curtain phase="cover" />
      {!skipEnter && <Curtain phase="reveal" />}
    </motion.div>
  );
}
