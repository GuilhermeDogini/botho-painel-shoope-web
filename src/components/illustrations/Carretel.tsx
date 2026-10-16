import { useId } from 'react';
import type { IllustrationProps } from './types';
import { cn } from '@/lib/utils';

/** Carretel de linha — estado “nenhuma conversa”. Animado: gira e solta um pedaço de linha. */
export function Carretel({ animated = true, className, ...rest }: IllustrationProps) {
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 140 100"
      width={150}
      height={108}
      aria-hidden
      className={cn('text-ink-2', className)}
      {...rest}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={53} y={17} width={34} height={66} />
        </clipPath>
      </defs>
      {/* Voltas extras acima e abaixo do corpo: descendo 24 (duas voltas), o recorte visível fica igual ao inicial. */}
      <g clipPath={`url(#${clipId})`}>
        <path
          className={cn(animated && 'ill-spool')}
          d="M53 6 H87 M53 18 H87 M53 30 H87 M53 42 H87 M53 54 H87 M53 66 H87 M53 78 H87"
          stroke="var(--bt-salvia)"
          strokeWidth={2}
        />
      </g>
      <rect x={53} y={17} width={34} height={66} fill="none" stroke="currentColor" strokeWidth={3} />
      <rect x={46} y={8} width={48} height={9} rx={4} fill="var(--bt-line-2)" />
      <rect x={46} y={83} width={48} height={9} rx={4} fill="var(--bt-line-2)" />
      <path
        className={cn(animated && 'ill-thread')}
        d="M87 70 C 110 74, 120 88, 104 96"
        fill="none"
        stroke="var(--bt-salvia)"
        strokeWidth={2}
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
    </svg>
  );
}
