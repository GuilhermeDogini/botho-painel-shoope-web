import type { HTMLAttributes, ReactNode } from 'react';
import { Money } from '@/components/atoms/Money';
import { cn } from '@/lib/utils';

export type BarRowTone = 'brand' | 'mostarda' | 'salvia' | 'anil' | 'danger';

const BAR_COLOR: Record<BarRowTone, string> = {
  brand: 'bg-brand',
  mostarda: 'bg-mostarda',
  salvia: 'bg-salvia',
  anil: 'bg-anil',
  danger: 'bg-danger',
};

export interface BarRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  /**
   * Valor à direita. Número/`null` → `Money`.
   * ReactNode para texto livre ("33%").
   */
  value: number | null | undefined | ReactNode;
  /**
   * Proporção da barra: 0–1 ou 0–100 (valores > 1 tratados como %).
   * Ex.: comissão 100% da fatia → `1` ou `100`.
   */
  ratio: number;
  tone?: BarRowTone;
}

function toPercent(ratio: number): number {
  if (!Number.isFinite(ratio) || ratio <= 0) return 0;
  const pct = ratio <= 1 ? ratio * 100 : ratio;
  return Math.min(100, pct);
}

/**
 * Barra horizontal com rótulo e valor ("para onde foi o dinheiro").
 * Espelha `.hbar` do DesignSystem.
 */
export function BarRow({
  label,
  value,
  ratio,
  tone = 'brand',
  className,
  ...rest
}: BarRowProps) {
  const pct = toPercent(ratio);
  const isMoneyLike = typeof value === 'number' || value == null;

  return (
    <div
      {...rest}
      className={cn(
        'grid grid-cols-[minmax(90px,140px)_minmax(0,1fr)_auto] items-center gap-3 text-sm',
        className,
      )}
    >
      <span className="min-w-0 truncate text-ink">{label}</span>
      <div
        className="h-3.5 min-w-0 overflow-hidden rounded-[4px] bg-surface-2"
        role="presentation"
        aria-hidden
      >
        <div className={cn('h-full rounded-[4px]', BAR_COLOR[tone])} style={{ width: `${pct}%` }} />
      </div>
      <span className="shrink-0 text-right font-bold tabular-nums text-ink">
        {isMoneyLike ? <Money value={value as number | null | undefined} /> : value}
      </span>
    </div>
  );
}
