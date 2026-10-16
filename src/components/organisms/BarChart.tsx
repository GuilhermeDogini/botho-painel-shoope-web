import { useRef, useState, type HTMLAttributes, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import {
  CHART_FILL,
  ChartLegend,
  ChartTipBubble,
  defaultFormatValue,
  maxSeriesValue,
  tipFromElement,
  valueToPercent,
  type ChartFormatValue,
  type ChartSeries,
  type ChartTipState,
} from './chartsShared';

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Rótulos do eixo X (meses, dias…). */
  categories: ReadonlyArray<string>;
  /** Séries agrupadas por categoria (ex.: entradas + saídas). */
  series: ReadonlyArray<ChartSeries>;
  /** Altura da área das barras (px). */
  height?: number;
  /** Descrição acessível do gráfico. */
  'aria-label': string;
  showLegend?: boolean;
  /** Formata o valor no tooltip (padrão: número pt-BR). */
  formatValue?: ChartFormatValue;
}

/**
 * Barras agrupadas (mês a mês / dia a dia), no estilo `.bars` do DesignSystem.
 * Legenda sempre com texto + cor (nunca só cor). Tooltip no hover de cada barra.
 */
export function BarChart({
  categories,
  series,
  height = 160,
  'aria-label': ariaLabel,
  showLegend = true,
  formatValue = defaultFormatValue,
  className,
  ...rest
}: BarChartProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<ChartTipState | null>(null);
  const max = maxSeriesValue(series);
  const legend = series.map((s) => ({ label: s.label, tone: s.tone }));

  function showTip(e: MouseEvent<HTMLElement>, category: string, label: string, value: number) {
    const area = areaRef.current;
    if (!area) return;
    setTip(tipFromElement(area, e.currentTarget, category, [{ label, value }], formatValue));
  }

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      {showLegend && legend.length > 0 ? <ChartLegend items={legend} /> : null}
      <div
        ref={areaRef}
        role="img"
        aria-label={ariaLabel}
        className="relative flex items-end gap-1.5 border-b border-line-2 pt-2 sm:gap-2.5"
        style={{ height }}
        onMouseLeave={() => setTip(null)}
      >
        {categories.map((cat, i) => (
          <div
            key={`${cat}-${i}`}
            className="flex h-full min-w-0 flex-1 items-end justify-center gap-0.5 sm:gap-1"
          >
            {series.map((s) => {
              const value = s.values[i] ?? 0;
              const pct = valueToPercent(value, max);
              return (
                <div
                  key={s.id}
                  role="presentation"
                  tabIndex={0}
                  aria-label={`${cat}: ${s.label} ${formatValue(value)}`}
                  className={cn(
                    'w-[42%] max-w-[18px] min-w-[4px] cursor-default rounded-t-[4px] outline-none',
                    'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
                    CHART_FILL[s.tone],
                    pct === 0 && 'min-h-0.5 opacity-40',
                  )}
                  style={{ height: `${Math.max(pct, pct === 0 ? 0.5 : pct)}%` }}
                  onMouseEnter={(e) => showTip(e, cat, s.label, value)}
                  onMouseMove={(e) => showTip(e, cat, s.label, value)}
                  onFocus={(e) => {
                    const area = areaRef.current;
                    if (!area) return;
                    setTip(
                      tipFromElement(area, e.currentTarget, cat, [{ label: s.label, value }], formatValue),
                    );
                  }}
                  onBlur={() => setTip(null)}
                />
              );
            })}
          </div>
        ))}
        {tip ? <ChartTipBubble tip={tip} /> : null}
      </div>
      <div className="flex gap-1.5 sm:gap-2.5">
        {categories.map((cat, i) => (
          <span
            key={`${cat}-x-${i}`}
            className="min-w-0 flex-1 truncate text-center text-xs text-muted tabular-nums"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
