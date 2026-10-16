import type { IllustrationProps } from './types';
import { cn } from '@/lib/utils';

/** Tesoura — erro / corte. Animada: dá dois cortes e a linha pontilhada avança. */
export function Tesoura({ animated = true, className, ...rest }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={72}
      height={72}
      aria-hidden
      className={cn('text-ink-2', className)}
      {...rest}
    >
      <g className={cn(animated && 'ill-snip-a')} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
        <circle cx={24} cy={26} r={12} />
        <path d="M34 32 L72 62" />
      </g>
      <g className={cn(animated && 'ill-snip-b')} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
        <circle cx={24} cy={56} r={12} />
        <path d="M34 50 L52 36" />
      </g>
      <path
        className={cn(animated && 'ill-thread')}
        d="M58 32 L74 18"
        stroke="var(--bt-danger)"
        strokeWidth={3}
        strokeDasharray="4.5 4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
