import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TapeTone = 'brand' | 'ok' | 'warn' | 'danger' | 'info';

const TONE_FILL: Record<TapeTone, string> = {
  brand: '[--tape-fill:var(--bt-brand)]',
  ok: '[--tape-fill:var(--bt-salvia)]',
  warn: '[--tape-fill:var(--bt-mostarda)]',
  danger: '[--tape-fill:var(--bt-danger)]',
  info: '[--tape-fill:var(--bt-anil)]',
};

export interface TapeProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Valor atual (ex.: 5876). */
  value: number;
  /** Máximo da escala (ex.: 18000). Padrão 100 (aí `value` é %). */
  max?: number;
  tone?: TapeTone;
  /** `sm` = fita fina (14 px). */
  size?: 'md' | 'sm';
  /** Marcadores sob a fita ("0", "9 mil", "18 mil"). */
  scale?: ReactNode[];
  /** Nome acessível do progresso. */
  'aria-label': string;
}

function clampPercent(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

/**
 * Fita métrica de progresso (metas, vagas, prazo).
 * Usa o utilitário `tape` do tema + preenchimento com `--tape-fill`.
 */
export function TapeProgress({
  value,
  max = 100,
  tone = 'brand',
  size = 'md',
  scale,
  className,
  'aria-label': ariaLabel,
  ...rest
}: TapeProgressProps) {
  const pct = clampPercent(value, max);

  return (
    <div {...rest} className={cn('min-w-0', className)}>
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Number.isFinite(value) ? Math.min(Math.max(value, 0), max) : 0}
        className={cn('tape w-full', size === 'sm' && 'h-3.5', TONE_FILL[tone])}
      >
        <div
          className="absolute inset-y-0 left-0 border-r-2 border-ink"
          style={{ width: `${pct}%`, background: 'var(--tape-fill)' }}
        />
      </div>
      {scale && scale.length > 0 ? (
        <div className="mt-1 flex justify-between text-[11px] font-semibold text-muted tabular-nums">
          {scale.map((mark, i) => (
            <span key={i}>{mark}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
