import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { IconButton } from '@/components/atoms/IconButton';
import { Skeleton } from '@/components/atoms/Skeleton';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export type DataTableAlign = 'left' | 'right';
export type DataTableSortDir = 'asc' | 'desc';

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: DataTableAlign;
  /** Coluna estreita (checkbox, seta). */
  shrink?: boolean;
  sortable?: boolean;
  /** Valor usado na ordenação cliente. */
  sortValue?: (row: T) => string | number | null | undefined;
  /**
   * No card (celular):
   * - `primary` = bloco principal
   * - `meta` = linha auxiliar
   * - `badge` = tags/prazos
   * - `trailing` = canto (valor)
   * - `false` = só na tabela
   */
  card?: 'primary' | 'meta' | 'badge' | 'trailing' | false;
  className?: string;
  headerClassName?: string;
}

export interface DataTableSort {
  id: string;
  dir: DataTableSortDir;
}

export interface DataTableProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: ReadonlyArray<T>;
  getRowId: (row: T) => string;
  'aria-label': string;
  /** Seleção múltipla. */
  selectable?: boolean;
  selectedIds?: ReadonlyArray<string>;
  defaultSelectedIds?: ReadonlyArray<string>;
  onSelectedIdsChange?: (ids: string[]) => void;
  /** Ordenação (controlada ou não). */
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Paginação 1-based. Sem `total`, pagina as `rows` no cliente. */
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  /** Estado vazio custom; padrão EmptyState “arara”. */
  empty?: ReactNode;
  /** Card custom no celular. */
  renderCard?: (row: T, ctx: { selected: boolean; toggle: () => void }) => ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

function compareValues(a: string | number | null | undefined, b: string | number | null | undefined): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'pt-BR', { numeric: true, sensitivity: 'base' });
}

/**
 * Tabela no desktop e lista de cards no celular, a partir da mesma definição de colunas.
 * Seleção, ordenação, paginação, skeleton e vazio — reutilizável em Pedidos, Estoque, etc.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  'aria-label': ariaLabel,
  selectable = false,
  selectedIds: selectedIdsProp,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  page: pageProp,
  defaultPage = 1,
  pageSize = 20,
  total: totalProp,
  onPageChange,
  loading = false,
  empty,
  renderCard,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const mobile = useIsMobile();
  const [selectedInternal, setSelectedInternal] = useState<string[]>([...defaultSelectedIds]);
  const [sortInternal, setSortInternal] = useState<DataTableSort | null>(defaultSort);
  const [pageInternal, setPageInternal] = useState(defaultPage);

  const selectedIds = selectedIdsProp ? [...selectedIdsProp] : selectedInternal;
  const sort = sortProp !== undefined ? sortProp : sortInternal;
  const page = pageProp ?? pageInternal;

  const setSelected = (ids: string[]) => {
    if (selectedIdsProp === undefined) setSelectedInternal(ids);
    onSelectedIdsChange?.(ids);
  };

  const setSort = (next: DataTableSort | null) => {
    if (sortProp === undefined) setSortInternal(next);
    onSortChange?.(next);
  };

  const setPage = (next: number) => {
    if (pageProp === undefined) setPageInternal(next);
    onPageChange?.(next);
  };

  const sortedRows = useMemo(() => {
    if (!sort) return [...rows];
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return [...rows];
    const copy = [...rows];
    copy.sort((ra, rb) => {
      const cmp = compareValues(col.sortValue!(ra), col.sortValue!(rb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, columns, sort]);

  const clientPaging = totalProp == null;
  const total = totalProp ?? sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);

  const pageRows = useMemo(() => {
    if (!clientPaging) return sortedRows;
    const start = (safePage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, clientPaging, safePage, pageSize]);

  const pageIds = pageRows.map(getRowId);
  const allSelected = selectable && pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected = selectable && pageIds.some((id) => selectedIds.includes(id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected([...new Set([...selectedIds, ...pageIds])]);
    }
  };

  const cycleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    if (!sort || sort.id !== col.id) {
      setSort({ id: col.id, dir: 'asc' });
      return;
    }
    if (sort.dir === 'asc') {
      setSort({ id: col.id, dir: 'desc' });
      return;
    }
    setSort(null);
  };

  const showingFrom = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, total);

  if (loading) {
    return (
      <div className={cn('overflow-hidden rounded-lg border border-line bg-surface', className)} aria-busy aria-label={ariaLabel}>
        <div className="space-y-0 p-0">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-line px-3.5 py-3 last:border-0">
              {selectable ? <Skeleton className="size-[22px] rounded-xs" /> : null}
              <Skeleton className="h-10 w-8 rounded-xs" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (total === 0 || (!loading && rows.length === 0 && clientPaging)) {
    return (
      <div className={cn('rounded-lg border border-line bg-surface', className)}>
        {empty ?? (
          <EmptyState
            illustration="arara"
            title="Nada por aqui"
            description="Quando houver itens, eles aparecem nesta lista."
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {mobile ? (
        <DataTableCards
          ariaLabel={ariaLabel}
          columns={columns}
          rows={pageRows}
          getRowId={getRowId}
          selectable={selectable}
          selectedIds={selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleAll={toggleAll}
          onToggle={(id) => setSelected(toggleId(selectedIds, id))}
          renderCard={renderCard}
          onRowClick={onRowClick}
          total={total}
        />
      ) : (
        <DataTableDesktop
          ariaLabel={ariaLabel}
          columns={columns}
          rows={pageRows}
          getRowId={getRowId}
          selectable={selectable}
          selectedIds={selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          sort={sort}
          onToggleAll={toggleAll}
          onToggle={(id) => setSelected(toggleId(selectedIds, id))}
          onSort={cycleSort}
          onRowClick={onRowClick}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          Mostrando{' '}
          <span className="font-semibold text-ink-2 tabular-nums">
            {showingFrom}–{showingTo}
          </span>{' '}
          de <span className="tabular-nums">{total}</span>
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
  );
}

function DataTableDesktop<T>({
  ariaLabel,
  columns,
  rows,
  getRowId,
  selectable,
  selectedIds,
  allSelected,
  someSelected,
  sort,
  onToggleAll,
  onToggle,
  onSort,
  onRowClick,
}: {
  ariaLabel: string;
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: ReadonlyArray<T>;
  getRowId: (row: T) => string;
  selectable: boolean;
  selectedIds: string[];
  allSelected: boolean;
  someSelected: boolean;
  sort: DataTableSort | null | undefined;
  onToggleAll: () => void;
  onToggle: (id: string) => void;
  onSort: (col: DataTableColumn<T>) => void;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full border-separate border-spacing-0 text-sm" aria-label={ariaLabel}>
        <thead>
          <tr>
            {selectable ? (
              <th className="w-0 border-b border-line bg-surface-2 px-2 py-1 whitespace-nowrap">
                <Checkbox
                  aria-label="Selecionar todos"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={onToggleAll}
                />
              </th>
            ) : null}
            {columns.map((col) => {
              const active = sort?.id === col.id;
              const SortIcon = !col.sortable
                ? null
                : active && sort?.dir === 'asc'
                  ? ArrowUp
                  : active && sort?.dir === 'desc'
                    ? ArrowDown
                    : ArrowUpDown;
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    'border-b border-line bg-surface-2 px-3.5 py-3 text-left text-[13px] font-semibold whitespace-nowrap text-muted',
                    col.align === 'right' && 'text-right',
                    col.shrink && 'w-0',
                    col.headerClassName,
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(col)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-sm text-[13px] font-semibold text-muted hover:text-ink',
                        col.align === 'right' && 'flex-row-reverse',
                      )}
                    >
                      {col.header}
                      {SortIcon ? <SortIcon size={14} strokeWidth={1.75} aria-hidden /> : null}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            const selected = selectedIds.includes(id);
            return (
              <tr
                key={id}
                data-selected={selected || undefined}
                className={cn(
                  'group',
                  onRowClick && 'cursor-pointer',
                  selected
                    ? '[&>td]:bg-[color-mix(in_srgb,var(--bt-brand-soft)_60%,var(--bt-surface))]'
                    : 'hover:[&>td]:bg-[color-mix(in_srgb,var(--bt-surface-2)_60%,transparent)]',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable ? (
                  <td
                    className="w-0 border-b border-line px-2 py-1 whitespace-nowrap group-last:border-b-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      aria-label={`Selecionar ${id}`}
                      checked={selected}
                      onChange={() => onToggle(id)}
                    />
                  </td>
                ) : null}
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      'border-b border-line px-3.5 py-3 align-middle group-last:border-b-0',
                      col.align === 'right' && 'text-right tabular-nums',
                      col.shrink && 'w-0 whitespace-nowrap',
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DataTableCards<T>({
  ariaLabel,
  columns,
  rows,
  getRowId,
  selectable,
  selectedIds,
  allSelected,
  someSelected,
  onToggleAll,
  onToggle,
  renderCard,
  onRowClick,
  total,
}: {
  ariaLabel: string;
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: ReadonlyArray<T>;
  getRowId: (row: T) => string;
  selectable: boolean;
  selectedIds: string[];
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
  onToggle: (id: string) => void;
  renderCard?: (row: T, ctx: { selected: boolean; toggle: () => void }) => ReactNode;
  onRowClick?: (row: T) => void;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2.5" aria-label={ariaLabel}>
      {selectable ? (
        <div className="flex items-center justify-between gap-2">
          <Checkbox
            label={<span className="text-sm font-bold">Selecionar todos</span>}
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={onToggleAll}
          />
          <span className="text-sm text-muted tabular-nums">{total} itens</span>
        </div>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {rows.map((row) => {
          const id = getRowId(row);
          const selected = selectedIds.includes(id);
          const toggle = () => onToggle(id);

          if (renderCard) {
            return (
              <li key={id}>
                {renderCard(row, { selected, toggle })}
              </li>
            );
          }

          const primary = columns.filter((c) => c.card === 'primary');
          const meta = columns.filter((c) => c.card === 'meta');
          const badges = columns.filter((c) => c.card === 'badge');
          const trailing = columns.filter((c) => c.card === 'trailing');
          const fallback =
            primary.length === 0 && meta.length === 0 && badges.length === 0 && trailing.length === 0
              ? columns.filter((c) => c.card !== false).slice(0, 3)
              : null;

          return (
            <li key={id}>
              <div
                className={cn(
                  'flex gap-1 rounded-md border border-line bg-surface py-3 pr-3 pl-1',
                  selected && 'border-brand bg-[color-mix(in_srgb,var(--bt-brand-soft)_45%,var(--bt-surface))]',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox aria-label={`Selecionar ${id}`} checked={selected} onChange={toggle} />
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  {fallback
                    ? fallback.map((col) => (
                        <div key={col.id} className={cn(col.align === 'right' && 'text-right', col.className)}>
                          {col.cell(row)}
                        </div>
                      ))
                    : null}
                  {primary.map((col) => (
                    <div key={col.id} className={col.className}>
                      {col.cell(row)}
                    </div>
                  ))}
                  {meta.map((col) => (
                    <div key={col.id} className={cn('text-sm text-muted', col.className)}>
                      {col.cell(row)}
                    </div>
                  ))}
                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((col) => (
                        <div key={col.id} className={col.className}>
                          {col.cell(row)}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {trailing.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      {trailing.map((col) => (
                        <div key={col.id} className={cn('font-bold', col.className)}>
                          {col.cell(row)}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
