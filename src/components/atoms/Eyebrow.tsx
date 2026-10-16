import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type EyebrowProps = HTMLAttributes<HTMLSpanElement>;

/** Rótulo em caixa alta acima de um número ou bloco ("CRÉDITO DE ADS"). */
export function Eyebrow({ className, ...rest }: EyebrowProps) {
  return <span {...rest} className={cn('text-xs leading-[1.2] font-bold tracking-[.08em] text-muted uppercase', className)} />;
}
