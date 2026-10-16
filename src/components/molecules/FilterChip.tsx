import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Filtro ligado (fundo ink, texto no contraste do tema). */
  active?: boolean;
  /** Contagem opcional no texto (ex.: "Vence hoje · 2") — o pai monta o rótulo. */
  children: ReactNode;
}

/** Chip de filtro (pílula). `aria-pressed` reflete `active`. */
export function FilterChip({
  active = false,
  className,
  type = 'button',
  children,
  ...rest
}: FilterChipProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors',
        active
          ? 'border-ink bg-ink text-bg'
          : 'border-line-2 bg-surface text-ink-2 hover:bg-surface-2',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface FilterChipListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `wrap` (padrão): quebra linha.
   * `scroll`: uma linha com rolagem horizontal interna (celular) — a página não rola de lado.
   */
  layout?: 'wrap' | 'scroll';
  /** Com `scroll`, estica até a borda no celular. */
  bleed?: boolean;
  'aria-label'?: string;
}

/** Fila de `FilterChip`. */
export function FilterChipList({
  layout = 'wrap',
  bleed = false,
  className,
  children,
  ...rest
}: FilterChipListProps) {
  const scroll = layout === 'scroll';
  return (
    <div
      {...rest}
      className={cn(
        'flex max-w-full min-w-0 gap-2',
        scroll
          ? cn(
              'flex-nowrap overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              bleed && '-mx-4 px-4 sm:-mx-0 sm:px-0',
            )
          : 'flex-wrap',
        className,
      )}
    >
      {children}
    </div>
  );
}
