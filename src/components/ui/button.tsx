import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Bottone in stile shadcn. La variante default riprende il "Book now" del sito attuale
 * (fondo #00B8F2, testo bianco); all'hover il riempimento giallo della barra promo sale dal basso.
 */
const buttonVariants = cva(
  'group/btn relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-sans font-semibold uppercase tracking-[0.08em] transition-[color,transform,box-shadow] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0 before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-y-100',
  {
    variants: {
      variant: {
        default: 'bg-cyan text-white before:bg-yellow hover:text-night',
        yellow: 'bg-yellow text-night before:bg-white',
        outline: 'border-2 border-white/70 text-white before:bg-white hover:text-night',
        whatsapp: 'bg-whatsapp text-white before:bg-white hover:text-night',
        ghost: 'text-white before:bg-white/10',
      },
      size: {
        sm: 'h-10 px-5 text-[0.75rem]',
        default: 'h-12 px-8 text-[0.82rem]',
        lg: 'h-14 px-10 text-[0.9rem]',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';

export { Button, buttonVariants };
