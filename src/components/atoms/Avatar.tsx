import { cn } from '@/lib/utils';

const TONES = {
  mostarda: 'bg-mostarda-soft text-mostarda-text',
  anil: 'bg-anil-soft text-anil-text',
  salvia: 'bg-salvia-soft text-salvia-text',
  brand: 'bg-brand-soft text-brand-text',
} as const;

export type AvatarTone = keyof typeof TONES;

const TONE_ORDER: AvatarTone[] = ['mostarda', 'anil', 'salvia', 'brand'];

const SIZES = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-11 text-base',
} as const;

export interface AvatarProps {
  /** Nome da pessoa. A inicial e (sem `tone`) a cor saem dele, sempre iguais para o mesmo nome. */
  name: string;
  tone?: AvatarTone;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Bolinha com a inicial. Decorativa: o nome deve estar escrito ao lado. */
export function Avatar({ name, tone, size = 'md', className }: AvatarProps) {
  const clean = name.trim();
  const initial = clean ? clean[0].toLocaleUpperCase('pt-BR') : '?';
  const hash = [...clean].reduce((sum, ch) => sum + (ch.codePointAt(0) ?? 0), 0);
  const resolvedTone = tone ?? TONE_ORDER[hash % TONE_ORDER.length];

  return (
    <span
      aria-hidden
      title={clean || undefined}
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold select-none', TONES[resolvedTone], SIZES[size], className)}
    >
      {initial}
    </span>
  );
}
