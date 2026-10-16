import { useRef, useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import {
  CHART_FILL,
  CHART_STROKE,
  ChartLegend,
  ChartTipBubble,
  defaultFormatValue,
  maxSeriesValue,
  tipAtClient,
  valueToPercent,
  type ChartFormatValue,
  type ChartSeries,
  type ChartTipState,
} from './chartsShared';

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Rótulos sob o gráfico (ou só extremos). */
  categories: ReadonlyArray<string>;
  /** Séries de linha. */
  series: ReadonlyArray<ChartSeries>;
  /** Barras de fundo opcionais (ex.: vendas sob o gasto). */
  bars?: ChartSeries;
  /**
   * Rótulos do eixo Y, do topo para a base (ex.: ["R$ 300", "R$ 200", "R$ 100", "R$ 0"]).
   * Sem isso, o eixo some.
   */
  yLabels?: ReadonlyArray<string>;
  height?: number;
  'aria-label': string;
  showLegend?: boolean;
  /** Formata o valor no tooltip (padrão: número pt-BR). */
  formatValue?: ChartFormatValue;
}

/** Pontos no centro de cada coluna (como CampanhaDetalhe: (i+0.5)/n). */
function toPolylinePoints(values: ReadonlyArray<number>, max: number): string {
  const n = values.length;
  if (n === 0) return '';
  return values
    .map((v, i) => {
      const x = ((i + 0.5) / n) * 100;
      const y = 100 - valueToPercent(v, max);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

/**
 * Linha (e barras opcionais) com eixos no estilo fita (guias horizontais).
 * Tooltip segue a coluna sob o mouse (todas as séries do dia).
 */
export function LineChart({
  categories,
  series,
  bars,
  yLabels,
  height = 220,
  'aria-label': ariaLabel,
  showLegend = true,
  formatValue = defaultFormatValue,
  className,
  ...rest
}: LineChartProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<ChartTipState | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const allForMax = bars ? [...series, bars] : series;
  const max = maxSeriesValue(allForMax);
  const legend = [
    ...(bars ? [{ label: bars.label, tone: bars.tone }] : []),
    ...series.map((s) => ({ label: s.label, tone: s.tone, line: true as const })),
  ];

  const showAllX = categories.length <= 8;
  const pointCount = Math.max(
    categories.length,
    bars?.values.length ?? 0,
    ...series.map((s) => s.values.length),
    1,
  );

  function rowsForIndex(i: number): { label: string; value: number }[] {
    const rows: { label: string; value: number }[] = [];
    if (bars) rows.push({ label: bars.label, value: bars.values[i] ?? 0 });
    for (const s of series) rows.push({ label: s.label, value: s.values[i] ?? 0 });
    return rows;
  }

  function showTipAt(i: number, clientX: number, clientY: number) {
    const area = areaRef.current;
    if (!area || pointCount <= 0) return;
    const idx = Math.min(pointCount - 1, Math.max(0, i));
    setActiveIndex(idx);
    const cat = categories[idx] ?? String(idx + 1);
    setTip(tipAtClient(area, clientX, clientY, cat, rowsForIndex(idx), formatValue));
  }

  function clearTip() {
    setTip(null);
    setActiveIndex(null);
  }

  /** Posição Y da linha no índice ativo (para o marcador HTML, sem distorção do SVG). */
  function lineMarkerTopPct(seriesIndex: number, pointIndex: number): number | null {
    const s = series[seriesIndex];
    if (!s) return null;
    const v = s.values[pointIndex] ?? 0;
    return 100 - valueToPercent(v, max);
  }

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-2', className)}>
      {showLegend && legend.length > 0 ? <ChartLegend items={legend} /> : null}

      <div
        className={cn('grid min-w-0 gap-2', yLabels?.length ? 'grid-cols-[52px_minmax(0,1fr)]' : 'grid-cols-1')}
        style={{ height }}
      >
        {yLabels && yLabels.length > 0 ? (
          <div
            className="flex flex-col justify-between pb-[18px] text-right text-xs text-muted tabular-nums"
            aria-hidden
          >
            {yLabels.map((lab) => (
              <span key={lab}>{lab}</span>
            ))}
          </div>
        ) : null}

        <div
          ref={areaRef}
          role="img"
          aria-label={ariaLabel}
          className="relative mb-[18px] min-w-0 cursor-crosshair border-b border-line-2"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, var(--bt-line) 0 1px, transparent 1px calc(100% / 3))',
          }}
          onMouseLeave={clearTip}
        >
          {bars ? (
            <div className="pointer-events-none absolute inset-0 flex items-end gap-0.5 px-0.5" aria-hidden>
              {bars.values.map((v, i) => (
                <div
                  key={`${bars.id}-${i}`}
                  className={cn(
                    'min-w-0 flex-1 rounded-t-[3px] transition-opacity',
                    CHART_FILL[bars.tone],
                    activeIndex !== null && activeIndex !== i && 'opacity-45',
                  )}
                  style={{ height: `${Math.max(0.5, valueToPercent(v, max))}%` }}
                />
              ))}
            </div>
          ) : null}

          {/* Faixas por categoria — hover estável (não depende só do clientX) */}
          <div className="absolute inset-0 z-[1] flex">
            {Array.from({ length: pointCount }, (_, i) => {
              const cat = categories[i] ?? String(i + 1);
              const rowsLabel = [
                ...(bars ? [`${bars.label} ${formatValue(bars.values[i] ?? 0)}`] : []),
                ...series.map((s) => `${s.label} ${formatValue(s.values[i] ?? 0)}`),
              ].join(', ');
              return (
                <div
                  key={`hit-${i}`}
                  role="presentation"
                  tabIndex={0}
                  aria-label={`${cat}: ${rowsLabel}`}
                  className="h-full min-w-0 flex-1 outline-none focus-visible:bg-brand/10"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    showTipAt(i, rect.left + rect.width / 2, e.clientY || rect.top + rect.height * 0.35);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    showTipAt(i, e.clientX || rect.left + rect.width / 2, e.clientY || rect.top + rect.height * 0.35);
                  }}
                  onFocus={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    showTipAt(i, rect.left + rect.width / 2, rect.top + rect.height * 0.35);
                  }}
                  onBlur={clearTip}
                />
              );
            })}
          </div>

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-[2] size-full overflow-visible"
            aria-hidden
          >
            {series.map((s) => (
              <polyline
                key={s.id}
                points={toPolylinePoints(s.values, max)}
                fill="none"
                stroke={CHART_STROKE[s.tone]}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* Marcador redondo em HTML (SVG com preserveAspectRatio=none achata círculos) */}
          {activeIndex !== null &&
            series.map((s, si) => {
              const top = lineMarkerTopPct(si, activeIndex);
              if (top === null) return null;
              const left =
                pointCount <= 1 ? 50 : ((activeIndex + 0.5) / pointCount) * 100;
              return (
                <span
                  key={`${s.id}-mark`}
                  aria-hidden
                  className="pointer-events-none absolute z-[3] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    background: CHART_STROKE[s.tone],
                  }}
                />
              );
            })}

          {tip ? <ChartTipBubble tip={tip} /> : null}
        </div>
      </div>

      {categories.length > 0 ? (
        <div
          className={cn(
            'flex text-xs text-muted tabular-nums',
            yLabels?.length ? 'pl-[60px]' : undefined,
            showAllX ? 'justify-between gap-1' : 'justify-between',
          )}
        >
          {showAllX
            ? categories.map((c, i) => (
                <span key={`${c}-${i}`} className="min-w-0 flex-1 truncate text-center">
                  {c}
                </span>
              ))
            : (
              <>
                <span>{categories[0]}</span>
                <span>{categories[categories.length - 1]}</span>
              </>
            )}
        </div>
      ) : null}
    </div>
  );
}
