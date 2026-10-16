import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const dividerVariants = cva('m-0 w-full shrink-0 border-0', {
  variants: {
    variant: {
      line: 'h-px bg-line',
      // pesponto: tracejado como a costura do design (passos do assistente, separação de blocos)
      stitch: 'h-0 border-t-[1.5px] border-dashed border-line-2',
      brand: 'h-0 border-t-[1.5px] border-dashed border-[color-mix(in_srgb,var(--bt-brand)_55%,transparent)]',
    },
  },
  defaultVariants: { variant: 'line' },
});

export interface DividerProps extends HTMLAttributes<HTMLHRElement>, VariantProps<typeof dividerVariants> {}

export function Divider({ variant, className, ...rest }: DividerProps) {
  return <hr {...rest} className={cn(dividerVariants({ variant }), className)} />;
}
