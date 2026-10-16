import { AlertTriangle, ArrowDown, ArrowUp, CircleDashed, Pause, Play } from 'lucide-react';
import { useMemo, type HTMLAttributes } from 'react';
import { Money } from '@/components/atoms/Money';
import { Switch } from '@/components/atoms/Switch';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { DataTable, type DataTableColumn } from '@/components/organisms/DataTable';
import type { CampaignFilter, CampaignView, RoasTone } from '@/lib/types';
import { cn } from '@/lib/utils';

export type { CampaignFilter };

const ROAS: Record<
  RoasTone,
  { tone: NonNullable<TagProps['tone']>; icon: typeof ArrowUp; label: string }
> = {
  good: { tone: 'ok', icon: ArrowUp, label: 'Bom' },
  warn: { tone: 'warn', icon: AlertTriangle, label: 'Atenção' },
  bad: { tone: 'danger', icon: ArrowDown, label: 'Ruim' },
  starting: { tone: 'neutral', icon: CircleDashed, label: 'Começando' },
};

function formatRoas(roas: number | null): string {
  if (roas == null) return '—';
  return `${roas.toFixed(1).replace('.', ',')}×`;
}

export interface CampaignTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  campaigns: ReadonlyArray<CampaignView>;
  counts: { all: number; active: number; paused: number };
  filter: CampaignFilter;
  periodDays: number;
  onFilterChange: (filter: CampaignFilter) => void;
  onToggle: (campaign: CampaignView, nextOn: boolean) => void;
  onRowClick?: (campaign: CampaignView) => void;
  togglingId?: string | null;
  loading?: boolean;
  canEdit?: boolean;
}

/**
 * Lista de campanhas: chips, DataTable, Tag de retorno e Switch (SHP-110).
 */
export function CampaignTable({
  campaigns,
  counts,
  filter,
  periodDays,
  onFilterChange,
  onToggle,
  onRowClick,
  togglingId = null,
  loading = false,
  canEdit = true,
  className,
  ...rest
}: CampaignTableProps) {
  const columns = useMemo<DataTableColumn<CampaignView>[]>(
    () => [
      {
        id: 'name',
        header: 'Campanha',
        card: 'primary',
        cell: (c) => (
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-ink">{c.name}</div>
            <div className="text-xs text-muted">{c.piecesLabel}</div>
          </div>
        ),
        sortValue: (c) => c.name,
      },
      {
        id: 'status',
        header: 'Status',
        card: 'badge',
        cell: (c) =>
          c.status === 'active' ? (
            <Tag icon={Play} tone="ok">
              Ativa
            </Tag>
          ) : (
            <Tag icon={Pause} tone="neutral">
              Pausada
            </Tag>
          ),
        sortValue: (c) => c.status,
      },
      {
        id: 'budget',
        header: 'Orçamento/dia',
        align: 'right',
        card: 'meta',
        cell: (c) => <Money value={c.dailyBudget} className="tabular-nums" />,
        sortValue: (c) => c.dailyBudget,
      },
      {
        id: 'spend',
        header: 'Gasto',
        align: 'right',
        card: 'meta',
        cell: (c) => <Money value={c.spend} className="tabular-nums" />,
        sortValue: (c) => c.spend,
      },
      {
        id: 'clicks',
        header: 'Cliques',
        align: 'right',
        card: false,
        cell: (c) => (
          <span className="tabular-nums text-sm">{c.clicks == null ? '—' : c.clicks.toLocaleString('pt-BR')}</span>
        ),
        sortValue: (c) => c.clicks ?? -1,
      },
      {
        id: 'sales',
        header: 'Vendas geradas',
        align: 'right',
        card: 'trailing',
        cell: (c) => <Money value={c.sales} className="font-bold tabular-nums" />,
        sortValue: (c) => c.sales,
      },
      {
        id: 'roas',
        header: 'Retorno',
        card: 'badge',
        cell: (c) => {
          const h = ROAS[c.roasTone];
          return (
            <Tag icon={h.icon} tone={h.tone}>
              {formatRoas(c.roas)} · {h.label}
            </Tag>
          );
        },
        sortValue: (c) => c.roas ?? -1,
      },
      {
        id: 'on',
        header: 'Ligada',
        shrink: true,
        card: false,
        cell: (c) => (
          <Switch
            aria-label={`Campanha ${c.name} ${c.on ? 'ligada' : 'desligada'}`}
            checked={c.on}
            disabled={!canEdit || togglingId === c.id}
            onCheckedChange={(next) => onToggle(c, next)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
    ],
    [canEdit, onToggle, togglingId],
  );

  return (
    <div {...rest} className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FilterChipList aria-label="Filtrar campanhas">
          <FilterChip selected={filter === 'all'} onClick={() => onFilterChange('all')}>
            Todas · {counts.all}
          </FilterChip>
          <FilterChip selected={filter === 'active'} onClick={() => onFilterChange('active')}>
            Ativas · {counts.active}
          </FilterChip>
          <FilterChip selected={filter === 'paused'} onClick={() => onFilterChange('paused')}>
            Pausadas · {counts.paused}
          </FilterChip>
        </FilterChipList>
        <span className="text-sm text-muted">Últimos {periodDays} dias</span>
      </div>

      <DataTable
        aria-label="Campanhas de Ads"
        columns={columns}
        rows={campaigns}
        getRowId={(c) => c.id}
        loading={loading}
        onRowClick={onRowClick}
        empty={
          <p className="py-8 text-center text-sm text-muted">
            Nenhuma campanha neste filtro.
          </p>
        }
        renderCard={(c) => {
          const h = ROAS[c.roasTone];
          return (
            <div className="flex flex-col gap-2.5 rounded-lg border border-line p-3">
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  className="min-w-0 text-left font-bold text-ink"
                  onClick={() => onRowClick?.(c)}
                >
                  {c.name}
                </button>
                <Switch
                  aria-label={`Campanha ${c.name} ${c.on ? 'ligada' : 'desligada'}`}
                  checked={c.on}
                  disabled={!canEdit || togglingId === c.id}
                  onCheckedChange={(next) => onToggle(c, next)}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.status === 'active' ? (
                  <Tag icon={Play} tone="ok">
                    Ativa
                  </Tag>
                ) : (
                  <Tag icon={Pause} tone="neutral">
                    Pausada
                  </Tag>
                )}
                <Tag icon={h.icon} tone={h.tone}>
                  Retorno {formatRoas(c.roas)} · {h.label}
                </Tag>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-surface-2 px-2 py-1.5">
                  <div className="text-[11px] text-muted">Por dia</div>
                  <Money value={c.dailyBudget} className="text-sm font-bold" />
                </div>
                <div className="rounded-md bg-surface-2 px-2 py-1.5">
                  <div className="text-[11px] text-muted">Gasto</div>
                  <Money value={c.spend} className="text-sm font-bold" />
                </div>
                <div className="rounded-md bg-surface-2 px-2 py-1.5">
                  <div className="text-[11px] text-muted">Vendas</div>
                  <Money value={c.sales} className="text-sm font-bold" />
                </div>
              </div>
            </div>
          );
        }}
      />

      <p className="text-sm text-muted">
        Retorno = vendas geradas ÷ gasto. Acima de 5× está bom; entre 2× e 5×, atenção; abaixo de 2×, a
        campanha está custando mais do que trazendo.
      </p>
    </div>
  );
}
