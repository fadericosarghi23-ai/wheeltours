import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lenisStore } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Props = { open: boolean; onClose: () => void; title: string; closeLabel: string; children: ReactNode; className?: string };

/** Finestra modale accessibile (Esc, focus, blocco scroll), in stile shadcn Dialog. */
export function Dialog({ open, onClose, title, closeLabel, children, className }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    lenisStore.current?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panel.current?.focus());
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      lenisStore.current?.start();
      prev?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label={closeLabel} className="absolute inset-0 bg-night-deep/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            data-lenis-prevent
            className={cn('relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-night shadow-2xl outline-none sm:rounded-3xl', className)}
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
              <p className="font-display text-xl uppercase text-cyan sm:text-2xl">{title}</p>
              <button onClick={onClose} aria-label={closeLabel} className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-yellow hover:text-night">
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
