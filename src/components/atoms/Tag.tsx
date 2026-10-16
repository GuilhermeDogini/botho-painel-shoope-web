import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const tagVariants = cva('tag', {
  variants: {
    tone: {
      neutral: '',
      brand: '[--tag-bg:var(--bt-brand-soft)] [--tag-fg:var(--bt-brand-text)]',
      ok: '[--tag-bg:var(--bt-salvia-soft)] [--tag-fg:var(--bt-salvia-text)]',
      warn: '[--tag-bg:var(--bt-mostarda-soft)] [--tag-fg:var(--bt-mostarda-text)]',
      info: '[--tag-bg:var(--bt-anil-soft)] [--tag-fg:var(--bt-anil-text)]',
      danger: '[--tag-bg:var(--bt-danger-soft)] [--tag-fg:var(--bt-danger-text)]',
      solid: '[--tag-bg:var(--bt-brand)] [--tag-fg:var(--bt-brand-ink)]',
    },
    size: {
      md: '',
      lg: 'h-7 pr-3 text-[13px]',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof tagVariants> {
  /** Obrigatório: o status nunca fica só na cor (regra do design). */
  icon: LucideIcon;
  children: ReactNode;
}

/** Etiqueta de roupa com furinho: status de pedido, peça, campanha. */
export function Tag({ icon: Icon, tone, size, className, children, ...rest }: TagProps) {
  return (
    <span {...rest} className={cn(tagVariants({ tone, size }), className)}>
      <Icon size={13} strokeWidth={2} aria-hidden className="shrink-0" />
      {children}
    </span>
  );
}
