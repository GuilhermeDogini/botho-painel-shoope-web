import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Bloco cinza que pulsa no lugar do conteúdo. Tamanho e raio por classe (`h-4 w-3/4`, `rounded-lg`).
 * É decorativo: quem carrega anuncia com um <Spinner> ou aria-busy no contêiner.
 */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return <div aria-hidden {...rest} className={cn('skel', className)} />;
}
