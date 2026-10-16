import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const headingVariants = cva('m-0 text-ink', {
  variants: {
    size: {
      xl: 'font-display text-xl font-extrabold tracking-[-.04em] tabular-nums',
      big: 'font-display text-big font-bold tracking-[-.03em] tabular-nums',
      h1: 'font-display text-h1 font-bold tracking-[-.025em]',
      h2: 'font-display text-h2 font-bold tracking-[-.015em]',
      // h3 do design é na fonte da interface, não na de título.
      h3: 'font-sans text-h3 font-bold tracking-normal',
    },
  },
  defaultVariants: { size: 'h2' },
});

type Level = 1 | 2 | 3 | 4;

const SIZE_BY_LEVEL: Record<Level, NonNullable<VariantProps<typeof headingVariants>['size']>> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h3',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Nível semântico (h1…h4). O tamanho visual vem de `size`; sem `size`, segue o nível. */
  level?: Level;
}

export function Heading({ level = 2, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...rest} className={cn(headingVariants({ size: size ?? SIZE_BY_LEVEL[level] }), className)} />;
}
