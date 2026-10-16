import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { IconButton } from '@/components/atoms/IconButton';
import type { BuySuggestion } from '@/lib/types';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

function suggestionId(item: BuySuggestion): string {
  return `${item.itemId}-${item.modelId}`;
}

function csvEscape(value: string): string {
  if (/[;"\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** CSV só dos itens marcados (UTF-8 com BOM para Excel). */
export function buyListToCsv(items: ReadonlyArray<BuySuggestion>): string {
  const rows = [['Peça', 'Variação', 'Quantidade sugerida (30 dias)']];
  for (const b of items) {
    rows.push([b.name, b.variation ?? '', String(b.qty)]);
  }
  return `\uFEFF${rows.map((r) => r.map(csvEscape).join(';')).join('\r\n')}\r\n`;
}

export interface RestockListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: ReadonlyArray<BuySuggestion>;
  selectedIds: ReadonlyArray<string>;
  onSelectedIdsChange: (ids: string[]) => void;
  /** Exporta só o que está marcado. */
  onExportCsv: (selected: BuySuggestion[]) => void;
  onPrintPdf?: () => void;
  exporting?: boolean;
  pageSize?: number;
}

/**
 * Lista “Para comprar ou produzir” com seleção, paginação e exportação CSV (SHP-100).
 */
export function RestockList({
  items,
  selectedIds,
  onSelectedIdsChange,
  onExportCsv,
  onPrintPdf,
  exporting = false,
  pageSize = PAGE_SIZE,
  className,
  ...rest
}: RestockListProps) {
  const [page, setPage] = useState(1);
  const allIds = useMemo(() => items.map(suggestionId), [items]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedItems = items.filter((i) => selectedSet.has(suggestionId(i)));
  const selectedUnits = selectedItems.reduce((s, i) => s + i.qty, 0);
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && !allSelected;

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const showingFrom = items.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, items.length);

  const toggle = (id: string) => {
    onSelectedIdsChange(
      selectedSet.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    );
  };

  const toggleAll = () => {
    onSelectedIdsChange(allSelected ? [] : allIds);
  };

  return (
    <section {...rest} className={cn('flex flex-col gap-3 rounded-lg border border-line p-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">Para comprar ou produzir</h2>
          <p className="text-sm text-muted">Quantidade sugerida para cobrir 30 dias de vendas.</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          icon={Download}
          loading={exporting}
          disabled={selectedItems.length === 0}
          onClick={() => onExportCsv(selectedItems)}
        >
          Exportar CSV
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Nada a repor pelo ritmo atual de vendas.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={toggleAll}
            label={allSelected ? 'Desmarcar todos' : 'Marcar todos'}
            className="px-1"
          />
          <ul className="flex flex-col gap-2">
            {pageItems.map((item) => {
              const id = suggestionId(item);
              const on = selectedSet.has(id);
              return (
                <li key={id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                      on ? 'border-brand bg-brand-soft/40' : 'border-line hover:bg-surface-2',
                    )}
                  >
                    <Checkbox
                      checked={on}
                      onChange={() => toggle(id)}
                      aria-label={`Marcar ${item.name}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{item.name}</div>
                      {item.variation ? (
                        <div className="truncate text-xs text-muted">{item.variation}</div>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full bg-salvia-soft px-2.5 py-1 text-xs font-bold text-salvia-text tabular-nums">
                      +{item.qty} un.
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm text-muted">
            <span>
              Mostrando{' '}
              <span className="font-semibold text-ink-2 tabular-nums">
                {showingFrom}–{showingTo}
              </span>{' '}
              de <span className="tabular-nums">{items.length}</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="mr-1 tabular-nums">
                {pageSize} por página · Página {safePage}/{pageCount}
              </span>
              <IconButton
                icon={ChevronLeft}
                label="Página anterior"
                disabled={safePage <= 1}
                onClick={() => setPage(safePage - 1)}
              />
              <IconButton
                icon={ChevronRight}
                label="Próxima página"
                disabled={safePage >= pageCount}
                onClick={() => setPage(safePage + 1)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-sm text-muted">
          {selectedItems.length} {selectedItems.length === 1 ? 'item marcado' : 'itens marcados'} ·{' '}
          {selectedUnits} peças
        </span>
        {onPrintPdf ? (
          <Button type="button" size="sm" variant="ghost" icon={Printer} onClick={onPrintPdf}>
            Imprimir PDF
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export { suggestionId as buySuggestionId };
