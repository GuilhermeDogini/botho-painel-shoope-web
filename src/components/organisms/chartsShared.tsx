import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type ChartTone = 'brand' | 'mostarda' | 'salvia' | 'anil' | 'danger';

export const CHART_FILL: Record<ChartTone, string> = {
  brand: 'bg-brand',
  mostarda: 'bg-mostarda',
  salvia: 'bg-salvia',
  anil: 'bg-anil',
  danger: 'bg-danger',
};

/** Cor CSS para stroke SVG (tokens Botho). */
export const CHART_STROKE: Record<ChartTone, string> = {
  brand: 'var(--bt-brand)',
  mostarda: 'var(--bt-mostarda)',
  salvia: 'var(--bt-salvia)',
  anil: 'var(--bt-anil)',
  danger: 'var(--bt-danger)',
};

export interface ChartSeries {
  id: string;
  label: string;
  tone: ChartTone;
  /** Um valor por categoria (mesmo comprimento de `categories`). */
  values: number[];
}

export interface ChartLegendItem {
  label: string;
  tone: ChartTone;
  /** Linha fina na legenda (série de linha). */
  line?: boolean;
}

/** Estado do tooltip flutuante no hover de uma barra/ponto. */
export interface ChartTipState {
  /** Posição em % dentro da área do gráfico (0–100). */
  leftPct: number;
  topPct: number;
  category: string;
  /** Uma ou mais séries (ex.: vendas + gasto no mesmo dia). */
  rows: ReadonlyArray<{ label: string; valueText: string }>;
}

export type ChartFormatValue = (value: number) => string;

export function defaultFormatValue(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value);
}

export function ChartLegend({ items, className }: { items: ChartLegendItem[]; className?: string }) {
  return (
    <ul className={cn('m-0 flex list-none flex-wrap gap-x-3.5 gap-y-1 p-0 text-[13px] text-ink-2', className)}>
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn(
              'inline-block shrink-0 rounded-[3px]',
              item.line ? 'h-[3px] w-2.5' : 'size-2.5',
              CHART_FILL[item.tone],
            )}
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Bolha ink: categoria + série(s) + valor. */
export function ChartTipBubble({ tip }: { tip: ChartTipState }) {
  const style: CSSProperties = {
    left: `${tip.leftPct}%`,
    top: `${tip.topPct}%`,
    transform: 'translate(-50%, calc(-100% - 8px))',
  };
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 max-w-[min(240px,85%)] rounded-md bg-ink px-2.5 py-1.5 text-left text-xs text-bg shadow-2"
      style={style}
    >
      <div className="font-semibold tabular-nums">{tip.category}</div>
      {tip.rows.map((row) => (
        <div key={row.label} className="text-bg/85">
          {row.label}: <span className="font-bold tabular-nums text-bg">{row.valueText}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Calcula a posição do tip relativa a um container (área do gráfico).
 * `anchorEl` = barra/ponto sob o mouse.
 */
export function tipFromElement(
  container: HTMLElement,
  anchorEl: HTMLElement,
  category: string,
  rows: ReadonlyArray<{ label: string; value: number }>,
  formatValue: ChartFormatValue,
): ChartTipState {
  const cRect = container.getBoundingClientRect();
  const aRect = anchorEl.getBoundingClientRect();
  const midX = aRect.left + aRect.width / 2 - cRect.left;
  const topY = aRect.top - cRect.top;
  const w = cRect.width || 1;
  const h = cRect.height || 1;
  return {
    leftPct: Math.min(92, Math.max(8, (midX / w) * 100)),
    topPct: Math.min(95, Math.max(4, (topY / h) * 100)),
    category,
    rows: rows.map((r) => ({ label: r.label, valueText: formatValue(r.value) })),
  };
}

/** Índice da categoria sob o ponteiro (0..n-1), pelo eixo X do container. */
export function categoryIndexFromClientX(
  container: HTMLElement,
  clientX: number,
  count: number,
): number {
  if (count <= 0) return 0;
  const rect = container.getBoundingClientRect();
  const w = rect.width || 1;
  const ratio = Math.min(0.999, Math.max(0, (clientX - rect.left) / w));
  return Math.min(count - 1, Math.floor(ratio * count));
}

export function tipAtClient(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  category: string,
  rows: ReadonlyArray<{ label: string; value: number }>,
  formatValue: ChartFormatValue,
): ChartTipState {
  const cRect = container.getBoundingClientRect();
  const w = cRect.width || 1;
  const h = cRect.height || 1;
  return {
    leftPct: Math.min(92, Math.max(8, ((clientX - cRect.left) / w) * 100)),
    topPct: Math.min(95, Math.max(4, ((clientY - cRect.top) / h) * 100)),
    category,
    rows: rows.map((r) => ({ label: r.label, valueText: formatValue(r.value) })),
  };
}

export function maxSeriesValue(series: ReadonlyArray<Pick<ChartSeries, 'values'>>): number {
  let max = 0;
  for (const s of series) {
    for (const v of s.values) {
      if (Number.isFinite(v) && v > max) max = v;
    }
  }
  return max > 0 ? max : 1;
}

export function valueToPercent(value: number, max: number): number {
  if (!Number.isFinite(value) || value <= 0 || max <= 0) return 0;
  return Math.min(100, (value / max) * 100);
}
