import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const textVariants = cva('m-0', {
  variants: {
    size: {
      body: 'text-base',
      small: 'text-sm',
      xs: 'text-xs',
    },
    tone: {
      ink: 'text-ink',
      soft: 'text-ink-2',
      muted: 'text-muted',
      brand: 'text-brand-text',
      ok: 'text-salvia-text',
      warn: 'text-mostarda-text',
      info: 'text-anil-text',
      danger: 'text-danger-text',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
  },
  defaultVariants: { size: 'body', tone: 'ink', weight: 'regular' },
});

export interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

export function Text({ as: Tag = 'p', size, tone, weight, className, ...rest }: TextProps) {
  return <Tag {...rest} className={cn(textVariants({ size, tone, weight }), className)} />;
}
