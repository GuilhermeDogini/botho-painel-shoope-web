import type { HTMLAttributes } from 'react';
import { countText } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface CountBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number | null | undefined;
  /** Destacado (aba ou item de menu selecionado). */
  active?: boolean;
  /** Mostra "0" em vez de sumir (ex.: aba "Enviados 0"). */
  showZero?: boolean;
}

/** Contador em pílula para abas e menu. Some quando não há o que contar; "99+" acima de 99. */
export function CountBadge({ value, active = false, showZero = false, className, ...rest }: CountBadgeProps) {
  const text = showZero && value === 0 ? '0' : countText(value);
  if (!text) return null;
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-[11px] px-[7px] text-xs leading-none font-bold tabular-nums',
        active ? 'bg-brand text-brand-ink' : 'bg-surface-3 text-ink-2',
        className,
      )}
    >
      {text}
    </span>
  );
}
