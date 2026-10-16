import type { IllustrationProps } from './types';
import { cn } from '@/lib/utils';

/** Arara vazia com cabides — estado “nenhum pedido”. Animada: os cabides balançam e assentam. */
export function AraraVazia({ animated = true, className, ...rest }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 100"
      width={150}
      height={108}
      aria-hidden
      className={cn('text-ink-2', className)}
      {...rest}
    >
      <path
        d="M14 18 H126 M20 18 V94 M120 18 V94 M10 94 H30 M110 94 H130"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <g
        className={cn(animated && 'ill-sway')}
        fill="none"
        stroke="var(--bt-mostarda)"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M50 18 q0 -7 5 -7 q5 0 5 5 q0 4 -5 6 v4 l-18 12 h36 l-18 -12" />
      </g>
      <g
        className={cn(animated && 'ill-sway ill-sway-late')}
        fill="none"
        stroke="var(--bt-brand)"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      >
        <path d="M86 18 q0 -7 5 -7 q5 0 5 5 q0 4 -5 6 v4 l-18 12 h36 l-18 -12" />
      </g>
    </svg>
  );
}
