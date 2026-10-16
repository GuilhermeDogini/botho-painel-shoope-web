import type { IllustrationProps } from './types';
import { cn } from '@/lib/utils';

/** Agulha e linha — estado genérico / catálogo vazio. Animada: entra e sai do tecido e a linha corre. */
export function Agulha({ animated = true, className, ...rest }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 100"
      width={150}
      height={108}
      aria-hidden
      className={cn('text-ink-2', className)}
      {...rest}
    >
      <g className={cn(animated && 'ill-needle')} fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M78 12 C 92 28, 88 48, 72 62 L 58 76" strokeWidth={3} />
        <ellipse cx={82} cy={10} rx={7} ry={5} strokeWidth={2.5} />
        <path d="M58 76 L 42 90" strokeWidth={2.5} />
      </g>
      <path
        className={cn(animated && 'ill-thread')}
        d="M72 40 C 96 36, 110 52, 98 68 C 88 80, 70 74, 78 60"
        fill="none"
        stroke="var(--bt-anil)"
        strokeWidth={2}
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <circle cx={98} cy={68} r={3} fill="var(--bt-anil)" />
    </svg>
  );
}
