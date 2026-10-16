import type { IllustrationProps } from './types';
import { cn } from '@/lib/utils';

/** Cabide — estado “nenhuma peça / busca vazia”. Animado: balança no gancho e o pesponto corre. */
export function Cabide({ animated = true, className, ...rest }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 100"
      width={150}
      height={108}
      aria-hidden
      className={cn('text-ink-2', className)}
      {...rest}
    >
      <g className={cn(animated && 'ill-sway')}>
        <path
          d="M70 22 a7 7 0 1 1 7 -7 c0 4 -4 6 -7 9 v6"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path
          d="M70 30 L24 64 a5 5 0 0 0 3 9 h86 a5 5 0 0 0 3 -9 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </g>
      <path
        className={cn(animated && 'ill-thread')}
        d="M40 86 H100"
        stroke="var(--bt-brand)"
        strokeWidth={2}
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
    </svg>
  );
}
