import { Check } from 'lucide-react';
import { useMemo, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { ColorDot } from '@/components/atoms/ColorDot';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { parseMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  cellKey,
  cellTone,
  formatCellDisplay,
  type VariationGridChange,
  type VariationGridRow,
  type VariationMode,
} from './variationGridShared';

export type { VariationGridChange, VariationGridCell, VariationGridRow, VariationMode } from './variationGridShared';
export { buildVariationGrid } from './variationGridShared';

/** Coluna de cor sticky. */
const COLOR_W = '7.5rem';
/** Estoque: toque confortável. */
const STOCK_W = '4rem';
/** Preço: cabe "159,90". */
const PRICE_W = '5rem';

export interface VariationGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  sizes: ReadonlyArray<string>;
  rows: ReadonlyArray<VariationGridRow>;
  /** Controlado; se omitido, começa em estoque. */
  mode?: VariationMode;
  defaultMode?: VariationMode;
  onModeChange?: (mode: VariationMode) => void;
  /** Estoque ≤ este valor fica amarelo (design: 2). */
  lowStockAt?: number;
  /** Salvar alterações em lote (só células mudadas e vendáveis). */
  onSave?: (changes: VariationGridChange[], mode: VariationMode) => void;
  onCancel?: () => void;
  saving?: boolean;
  /** Esconde rodapé Salvar/Cancelar (ex.: modal que traz os próprios botões). */
  hideFooter?: boolean;
}

/**
 * Grade editável cor × tamanho (estoque ou preço).
 * Grid CSS alinhado (cabeçalho = coluna); no celular rola na horizontal.
 */
export function VariationGrid({
  sizes,
  rows,
  mode: modeProp,
  defaultMode = 'stock',
  onModeChange,
  lowStockAt = 2,
  onSave,
  onCancel,
  saving = false,
  hideFooter = false,
  className,
  ...rest
}: VariationGridProps) {
  const [modeInternal, setModeInternal] = useState<VariationMode>(defaultMode);
  const mode = modeProp ?? modeInternal;
  const setMode = (next: VariationMode) => {
    onModeChange?.(next);
    if (modeProp == null) setModeInternal(next);
  };

  const [draft, setDraft] = useState<Record<string, string>>({});
  const [applyText, setApplyText] = useState('');

  const sizeW = mode === 'price' ? PRICE_W : STOCK_W;
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `${COLOR_W} repeat(${sizes.length}, ${sizeW})`,
  };

  const baseline = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of rows) {
      for (const cell of row.cells) {
        if (cell.modelId == null) continue;
        const v = mode === 'stock' ? cell.stock : cell.price;
        if (v != null) map[cellKey(cell.modelId)] = v;
      }
    }
    return map;
  }, [rows, mode]);

  const displayOf = (modelId: number, fallback: number | null): string => {
    const key = cellKey(modelId);
    if (key in draft) return draft[key]!;
    return formatCellDisplay(mode, fallback, false);
  };

  const parseValue = (text: string): number | null => {
    if (mode === 'stock') {
      const n = Number(text.trim());
      if (!Number.isInteger(n) || n < 0) return null;
      return n;
    }
    const n = parseMoney(text);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const changes = (): VariationGridChange[] => {
    const out: VariationGridChange[] = [];
    for (const [key, text] of Object.entries(draft)) {
      const modelId = Number(key);
      const next = parseValue(text);
      if (next == null) continue;
      const prev = baseline[key];
      if (prev === next) continue;
      out.push({ modelId, value: next });
    }
    return out;
  };

  const dirty = changes().length > 0;

  const applyAll = () => {
    const next = parseValue(applyText);
    if (next == null) return;
    const formatted = formatCellDisplay(mode, next, false);
    const patch: Record<string, string> = {};
    for (const row of rows) {
      for (const cell of row.cells) {
        if (cell.modelId == null) continue;
        patch[cellKey(cell.modelId)] = formatted;
      }
    }
    setDraft((d) => ({ ...d, ...patch }));
  };

  const save = () => {
    const list = changes();
    if (!list.length || !onSave) return;
    onSave(list, mode);
  };

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-3', className)}>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <SegmentedControl
          aria-label="Editar"
          value={mode}
          onValueChange={(v) => {
            setDraft({});
            setApplyText('');
            setMode(v as VariationMode);
          }}
          options={[
            { value: 'stock', label: 'Estoque' },
            { value: 'price', label: 'Preço' },
          ]}
        />
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            inputMode={mode === 'stock' ? 'numeric' : 'decimal'}
            value={applyText}
            onChange={(e) => setApplyText(e.target.value)}
            placeholder={mode === 'stock' ? 'Qtd.' : 'R$'}
            aria-label="Valor para todas"
            className="h-10 w-24 shrink-0 rounded-sm border border-line-2 bg-surface px-3 text-sm tabular-nums"
          />
          <Button type="button" size="sm" variant="outline" onClick={applyAll} className="shrink-0">
            Aplicar em todas
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto overscroll-x-contain rounded-lg border border-line [-webkit-overflow-scrolling:touch]">
        <div role="table" className="w-max min-w-full">
          {/* Cabeçalho */}
          <div role="row" className="grid" style={gridStyle}>
            <div
              role="columnheader"
              className="sticky left-0 z-20 flex items-center bg-surface px-2.5 py-2.5 text-left text-[13px] font-bold text-muted"
            >
              Cor
            </div>
            {sizes.map((size) => (
              <div
                key={size}
                role="columnheader"
                className="flex items-center justify-center px-1 py-2.5 text-center text-[13px] font-bold text-muted"
              >
                {size}
              </div>
            ))}
          </div>

          {rows.map((row) => (
            <div key={row.color} role="row" className="grid border-t border-line" style={gridStyle}>
              <div
                role="rowheader"
                className="sticky left-0 z-10 flex min-w-0 items-center gap-2 bg-surface px-2.5 py-1.5 font-bold text-ink"
              >
                {row.colorHex ? (
                  <ColorDot color={row.colorHex} size="lg" label={row.color} className="shrink-0" />
                ) : null}
                <span className="truncate text-[13px] sm:text-sm">{row.color}</span>
              </div>
              {sizes.map((size, i) => {
                const cell = row.cells[i] ?? { modelId: null, stock: null, price: null };
                const off = cell.modelId == null;
                const raw = mode === 'stock' ? cell.stock : cell.price;
                const shown = off ? '—' : displayOf(cell.modelId!, raw);
                const draftNum =
                  !off && mode === 'stock'
                    ? (() => {
                        const n = Number(shown.trim());
                        return Number.isInteger(n) ? n : raw;
                      })()
                    : raw;
                const visual = cellTone(mode, draftNum, off, lowStockAt);

                return (
                  <div key={size} role="cell" className="flex items-center p-1">
                    <input
                      type="text"
                      inputMode={mode === 'stock' ? 'numeric' : 'decimal'}
                      disabled={off}
                      readOnly={off}
                      value={shown}
                      onChange={(e) => {
                        if (cell.modelId == null) return;
                        setDraft((d) => ({ ...d, [cellKey(cell.modelId!)]: e.target.value }));
                      }}
                      aria-label={off ? `${row.color} ${size} não vende` : `${row.color} ${size}`}
                      className={cn(
                        'h-11 w-full rounded-lg border-[1.5px] bg-surface px-0.5 text-center text-[13px] font-semibold tabular-nums text-ink sm:text-[15px]',
                        'focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--bt-brand)_18%,transparent)] focus:outline-none',
                        'disabled:cursor-default',
                        visual === 'off' && 'border-dashed border-line-2 bg-surface-2 text-muted',
                        visual === 'zero' && 'border-danger bg-danger-soft text-danger-text',
                        visual === 'low' && 'border-mostarda bg-mostarda-soft text-mostarda-text',
                        visual === 'ok' && 'border-line-2',
                      )}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-3.5">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3.5 shrink-0 rounded-full bg-mostarda-soft shadow-[inset_0_0_0_1.5px_var(--bt-mostarda)]" />
          {lowStockAt} ou menos
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3.5 shrink-0 rounded-full bg-danger-soft shadow-[inset_0_0_0_1.5px_var(--bt-danger)]" />
          Esgotado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3.5 shrink-0 rounded-full bg-surface-2 shadow-[inset_0_0_0_1.5px_var(--bt-line-2)]" />
          “—” não vende esse tamanho
        </span>
      </div>

      {!hideFooter && (onSave || onCancel) ? (
        <div className="flex flex-col-reverse gap-2 border-t border-line pt-3 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="w-full sm:w-auto">
              Cancelar
            </Button>
          ) : null}
          {onSave ? (
            <Button
              type="button"
              variant="primary"
              icon={Check}
              loading={saving}
              disabled={!dirty}
              onClick={save}
              className="w-full sm:w-auto"
            >
              Salvar na Shopee
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
