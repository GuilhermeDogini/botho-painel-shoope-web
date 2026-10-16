import { AlertTriangle, PackageX, Plus } from 'lucide-react';
import { useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { Input } from '@/components/atoms/Input';
import { Tag } from '@/components/atoms/Tag';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { ProductLine } from '@/components/molecules/ProductLine';
import { DataTable, type DataTableColumn } from '@/components/organisms/DataTable';
import type { StockAlertRow } from '@/lib/types';
import { cn } from '@/lib/utils';

export type StockAlertFilter = 'todas' | 'esgotadas' | 'plus';

const FILTERS: { id: StockAlertFilter; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'esgotadas', label: 'Esgotadas' },
  { id: 'plus', label: 'Plus size' },
];

const PLUS_SIZE_RE = /^(G1|G2|G3|GG|XG|XXG|Plus)$/i;

function isPlusSize(row: StockAlertRow): boolean {
  const parts = (row.variation ?? '').split('·').map((s) => s.trim());
  const size = parts[parts.length - 1] ?? '';
  return PLUS_SIZE_RE.test(size);
}

function forecastLabel(row: StockAlertRow): string {
  if (row.stock <= 0) return 'Sem estoque agora';
  if (row.daysLeft == null) return 'Sem vendas recentes';
  return `Acaba em ~${row.daysLeft} dias`;
}

function rateLabel(row: StockAlertRow): string {
  if (row.dailyRate <= 0) return row.sold14d > 0 ? `vendeu ${row.sold14d} em 14 dias` : 'sem vendas em 14 dias';
  const rounded = row.dailyRate < 1 ? row.dailyRate.toFixed(1).replace('.', ',') : String(Math.round(row.dailyRate * 10) / 10);
  return `vende ~${rounded} por dia`;
}

function barPct(row: StockAlertRow): number {
  if (row.daysLeft == null || row.stock <= 0) return 0;
  return Math.max(4, Math.min(100, (row.daysLeft / 14) * 100));
}

function rowId(row: StockAlertRow): string {
  return `${row.itemId}-${row.modelId}`;
}

function ReorderPointInput({
  row,
  onCommit,
}: {
  row: StockAlertRow;
  onCommit: (row: StockAlertRow, point: number) => void;
}) {
  const [text, setText] = useState(String(row.reorderPoint));
  useEffect(() => {
    setText(String(row.reorderPoint));
  }, [row.reorderPoint]);
  return (
    <label className="inline-flex items-center gap-1.5">
      <Input
        inputMode="numeric"
        aria-label={`Ponto de reposição de ${row.name} ${row.variation ?? ''}`.trim()}
        value={text}
        onChange={(e) => setText(e.target.value.replace(/\D/g, ''))}
        onBlur={() => {
          const n = Number(text);
          if (!Number.isFinite(n) || n < 0) {
            setText(String(row.reorderPoint));
            return;
          }
          const next = Math.min(9999, n);
          setText(String(next));
          if (next !== row.reorderPoint) onCommit(row, next);
        }}
        className="h-10 w-16 px-2 text-center tabular-nums"
      />
      <span className="text-xs text-muted">un.</span>
    </label>
  );
}

export interface StockAlertTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  rows: ReadonlyArray<StockAlertRow>;
  filter?: StockAlertFilter;
  defaultFilter?: StockAlertFilter;
  onFilterChange?: (filter: StockAlertFilter) => void;
  onReorderPointChange: (row: StockAlertRow, point: number) => void;
  onRepor: (row: StockAlertRow) => void;
  loading?: boolean;
}

/**
 * Alertas por variação: DataTable no desktop, cards no celular (SHP-100).
 */
export function StockAlertTable({
  rows,
  filter: filterProp,
  defaultFilter = 'todas',
  onFilterChange,
  onReorderPointChange,
  onRepor,
  loading = false,
  className,
  ...rest
}: StockAlertTableProps) {
  const [filterInternal, setFilterInternal] = useState<StockAlertFilter>(defaultFilter);
  const filter = filterProp ?? filterInternal;
  const setFilter = (next: StockAlertFilter) => {
    onFilterChange?.(next);
    if (filterProp == null) setFilterInternal(next);
  };

  const filtered = useMemo(() => {
    switch (filter) {
      case 'esgotadas':
        return rows.filter((r) => r.status === 'out');
      case 'plus':
        return rows.filter(isPlusSize);
      default:
        return rows;
    }
  }, [rows, filter]);

  const columns: DataTableColumn<StockAlertRow>[] = [
    {
      id: 'variation',
      header: 'Variação',
      card: 'primary',
      cell: (row) => (
        <ProductLine
          name={row.name}
          imageSrc={row.imageUrl}
          variant={row.variation ?? undefined}
          colorHex={row.color ?? undefined}
          sku={row.sku ?? undefined}
          size="sm"
        />
      ),
    },
    {
      id: 'stock',
      header: 'Estoque',
      align: 'right',
      card: 'badge',
      sortValue: (row) => row.stock,
      cell: (row) =>
        row.stock <= 0 ? (
          <Tag icon={PackageX} tone="danger">
            Esgotou
          </Tag>
        ) : (
          <Tag icon={AlertTriangle} tone={row.daysLeft != null && row.daysLeft <= 3 ? 'warn' : 'neutral'}>
            {row.stock} un.
          </Tag>
        ),
    },
    {
      id: 'forecast',
      header: 'Previsão',
      card: 'meta',
      sortValue: (row) => row.daysLeft ?? 9999,
      cell: (row) => (
        <div className="flex min-w-[9rem] flex-col gap-1">
          <span className="text-sm font-bold text-ink">{forecastLabel(row)}</span>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className={cn(
                'h-full rounded-full',
                row.stock <= 0 ? 'bg-danger' : row.daysLeft != null && row.daysLeft <= 3 ? 'bg-mostarda' : 'bg-salvia',
              )}
              style={{ width: `${barPct(row)}%` }}
            />
          </div>
          <span className="text-xs text-muted">{rateLabel(row)}</span>
        </div>
      ),
    },
    {
      id: 'point',
      header: 'Avisar com',
      align: 'right',
      card: false,
      cell: (row) => (
        <ReorderPointInput row={row} onCommit={onReorderPointChange} />
      ),
    },
    {
      id: 'action',
      header: '',
      shrink: true,
      card: 'trailing',
      cell: (row) => (
        <>
          <Button type="button" size="sm" variant="outline" className="hidden sm:inline-flex" onClick={() => onRepor(row)}>
            Repor
          </Button>
          <IconButton
            type="button"
            label={`Repor ${row.name}`}
            icon={Plus}
            className="sm:hidden"
            onClick={() => onRepor(row)}
          />
        </>
      ),
    },
  ];

  return (
    <div {...rest} className={cn('flex flex-col gap-3', className)}>
      <FilterChipList>
        {FILTERS.map((f) => (
          <FilterChip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </FilterChip>
        ))}
      </FilterChipList>
      <DataTable
        aria-label="Alertas por variação"
        columns={columns}
        rows={filtered}
        getRowId={rowId}
        loading={loading}
        pageSize={20}
      />
    </div>
  );
}
