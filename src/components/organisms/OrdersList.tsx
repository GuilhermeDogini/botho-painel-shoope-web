import {
  AlertTriangle,
  Calendar,
  Check,
  Layers,
  Package,
  Printer,
  RotateCcw,
  Truck,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Money } from '@/components/atoms/Money';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { Deadline, type DeadlineUrgency } from '@/components/molecules/Deadline';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { ProductLine } from '@/components/molecules/ProductLine';
import { SearchField } from '@/components/molecules/SearchField';
import { TabItem, TabList } from '@/components/molecules/TabItem';
import { DataTable, type DataTableColumn } from '@/components/organisms/DataTable';
import type { OrderCounts, OrderSummary, OrderTab } from '@/lib/types';
import { cn } from '@/lib/utils';

export const ORDER_TAB_LABELS: Record<OrderTab, string> = {
  a_enviar: 'A enviar',
  aguardando_coleta: 'Aguardando coleta',
  enviados: 'Enviados',
  entregues: 'Entregues',
  cancelados: 'Cancelados',
  devolucoes: 'Devoluções',
};

export const ORDER_TABS = Object.keys(ORDER_TAB_LABELS) as OrderTab[];

export interface OrdersListFilters {
  venceHoje: boolean;
  multiItem: boolean;
  /** Filtra pela data da compra nos últimos 7 dias (`from`/`to` na API). */
  ultimos7Dias: boolean;
  q: string;
}

export interface OrdersListProps {
  orders: ReadonlyArray<OrderSummary>;
  counts: OrderCounts;
  /** Contagem do chip "Vence hoje". */
  venceHojeCount: number;
  tab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  filters: OrdersListFilters;
  onFiltersChange: (next: OrdersListFilters) => void;
  selectedIds?: ReadonlyArray<string>;
  onSelectedIdsChange?: (ids: string[]) => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  /** Sem financeiro.ver: esconde a coluna Valor. */
  showMoney?: boolean;
  onOrderClick?: (order: OrderSummary) => void;
  empty?: ReactNode;
  className?: string;
}

/** Variação Shopee "Azul anil,M" → "Azul anil · M". */
export function formatVariation(variation: string | null | undefined): string | undefined {
  if (!variation?.trim()) return undefined;
  const i = variation.lastIndexOf(',');
  if (i < 0) return variation.trim();
  return `${variation.slice(0, i).trim()} · ${variation.slice(i + 1).trim()}`;
}

/** Prazo + urgência a partir de shipByDate (Brasília aproximada pelo ISO). */
export function deadlineOf(
  shipByDate: string | null,
  now = new Date(),
): { urgency: DeadlineUrgency; label: string } | null {
  if (!shipByDate) return null;
  const due = new Date(shipByDate);
  if (Number.isNaN(due.getTime())) return null;

  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  const startDayAfter = new Date(startTomorrow);
  startDayAfter.setDate(startDayAfter.getDate() + 1);

  const hh = due.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (due < startTomorrow) {
    return { urgency: 'today', label: due < now ? `Atrasado · ${hh}` : `Hoje, ${hh}` };
  }
  if (due < startDayAfter) {
    return { urgency: 'tomorrow', label: `Amanhã, ${hh}` };
  }
  return {
    urgency: 'date',
    label: due.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
  };
}

function primaryItem(order: OrderSummary) {
  const first = order.items[0];
  if (!first) return { name: 'Sem itens', variant: undefined as string | undefined, imageUrl: null as string | null, extra: undefined as string | undefined };
  const extra =
    order.itemCount > (first.quantity || 1) || order.items.length > 1
      ? `+ ${order.itemCount - first.quantity} item${order.itemCount - first.quantity === 1 ? '' : 's'}`
      : undefined;
  return {
    name: first.name,
    variant: formatVariation(first.variation),
    imageUrl: first.imageUrl,
    extra,
  };
}

function statusLabel(order: OrderSummary): {
  text: string;
  tone: NonNullable<TagProps['tone']>;
  icon: LucideIcon;
} {
  // Status interno do painel (SHP-80) — não muda a aba Shopee; só a etiqueta na lista.
  if (order.packedAt) {
    return { text: 'Embalado', tone: 'ok', icon: Package };
  }
  if (order.labelPrintedAt) {
    return { text: 'Etiqueta impressa', tone: 'info', icon: Printer };
  }
  switch (order.status) {
    case 'READY_TO_SHIP':
    case 'RETRY_SHIP':
    case 'INVOICE_PENDING':
      return { text: 'A enviar', tone: 'warn', icon: Package };
    case 'PROCESSED':
      return { text: 'Aguardando coleta', tone: 'info', icon: Truck };
    case 'SHIPPED':
      return { text: 'Enviado', tone: 'info', icon: Truck };
    case 'TO_CONFIRM_RECEIVE':
    case 'COMPLETED':
      return { text: 'Entregue', tone: 'ok', icon: Check };
    case 'IN_CANCEL':
    case 'CANCELLED':
      return { text: 'Cancelado', tone: 'neutral', icon: X };
    case 'TO_RETURN':
      return { text: 'Devolução', tone: 'danger', icon: RotateCcw };
    default:
      return { text: order.status, tone: 'neutral', icon: Package };
  }
}

/**
 * Lista de pedidos: abas, chips de filtro, busca e DataTable (tabela no desktop / cards no celular).
 * Props-only — a página (SHP-85) busca na API.
 */
export function OrdersList({
  orders,
  counts,
  venceHojeCount,
  tab,
  onTabChange,
  filters,
  onFiltersChange,
  selectedIds,
  onSelectedIdsChange,
  page,
  pageSize = 20,
  total,
  onPageChange,
  loading = false,
  showMoney = true,
  onOrderClick,
  empty,
  className,
}: OrdersListProps) {
  const moneyCol: DataTableColumn<OrderSummary> = {
    id: 'valor',
    header: 'Valor',
    align: 'right',
    sortable: true,
    sortValue: (o) => o.orderTotal ?? 0,
    card: 'trailing',
    cell: (o) =>
      o.orderTotal != null ? <Money value={o.orderTotal} className="font-bold" /> : <span className="text-muted">—</span>,
  };

  const columns: DataTableColumn<OrderSummary>[] = [
    {
      id: 'pedido',
      header: 'Pedido',
      shrink: true,
      sortable: true,
      sortValue: (o) => o.orderSn,
      card: 'trailing',
      cell: (o) => (
        <div>
          <div className="font-bold tabular-nums">#{o.orderSn.slice(-8)}</div>
          <div className="text-xs text-muted">
            {new Date(o.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      id: 'peca',
      header: 'Peça',
      sortable: true,
      sortValue: (o) => o.items[0]?.name ?? '',
      card: 'primary',
      cell: (o) => {
        const p = primaryItem(o);
        return (
          <ProductLine
            name={p.name}
            imageSrc={p.imageUrl}
            variant={p.variant}
            extra={p.extra}
            size="sm"
          />
        );
      },
    },
    {
      id: 'compradora',
      header: 'Compradora',
      sortable: true,
      sortValue: (o) => o.buyerUsername ?? o.recipientName ?? '',
      card: 'meta',
      cell: (o) => (
        <span className="text-sm text-ink-2">{o.buyerUsername ?? o.recipientName ?? '—'}</span>
      ),
    },
    ...(showMoney ? [moneyCol] : []),
    {
      id: 'prazo',
      header: 'Prazo de envio',
      sortable: true,
      sortValue: (o) => o.shipByDate ?? '',
      card: 'badge',
      cell: (o) => {
        const d = deadlineOf(o.shipByDate);
        if (!d) return <span className="text-muted">—</span>;
        return <Deadline urgency={d.urgency}>{d.label}</Deadline>;
      },
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (o) => o.status,
      card: 'meta',
      cell: (o) => {
        const s = statusLabel(o);
        return (
          <Tag tone={s.tone} icon={s.icon} size="md">
            {s.text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className={cn('flex min-w-0 flex-col gap-4', className)}>
      <TabList aria-label="Status do pedido">
        {ORDER_TABS.map((t) => (
          <TabItem key={t} active={tab === t} count={counts[t]} onClick={() => onTabChange(t)}>
            {ORDER_TAB_LABELS[t]}
          </TabItem>
        ))}
      </TabList>

      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterChipList layout="scroll" bleed className="min-w-0 w-full md:flex-1">
          {tab === 'a_enviar' ? (
            <FilterChip
              active={filters.venceHoje}
              onClick={() => onFiltersChange({ ...filters, venceHoje: !filters.venceHoje })}
            >
              <AlertTriangle className="size-3.5" aria-hidden />
              Vence hoje · {venceHojeCount}
            </FilterChip>
          ) : null}
          <FilterChip
            active={filters.multiItem}
            onClick={() => onFiltersChange({ ...filters, multiItem: !filters.multiItem })}
          >
            <Layers className="size-3.5" aria-hidden />
            Mais de 1 item
          </FilterChip>
          <FilterChip
            active={filters.ultimos7Dias}
            onClick={() => onFiltersChange({ ...filters, ultimos7Dias: !filters.ultimos7Dias })}
          >
            <Calendar className="size-3.5" aria-hidden />
            Últimos 7 dias
          </FilterChip>
        </FilterChipList>

        <SearchField
          fieldClassName="w-full shrink-0 md:w-72"
          value={filters.q}
          onChange={(e) => onFiltersChange({ ...filters, q: e.target.value })}
          onClear={() => onFiltersChange({ ...filters, q: '' })}
          placeholder="Buscar nº, compradora ou peça"
          aria-label="Buscar pedidos"
        />
      </div>

      <DataTable
        aria-label="Pedidos"
        columns={columns}
        rows={orders}
        getRowId={(o) => o.orderSn}
        selectable={Boolean(onSelectedIdsChange)}
        selectedIds={selectedIds}
        onSelectedIdsChange={onSelectedIdsChange}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        loading={loading}
        onRowClick={onOrderClick}
        empty={
          empty ?? (
            <EmptyState
              title={tab === 'devolucoes' ? 'Nenhuma devolução aberta' : 'Nenhum pedido nesta aba'}
              description={
                tab === 'devolucoes'
                  ? 'Quando uma compradora pedir devolução, ela aparece aqui.'
                  : 'Tente outra aba ou limpe os filtros.'
              }
            />
          )
        }
      />
    </div>
  );
}
