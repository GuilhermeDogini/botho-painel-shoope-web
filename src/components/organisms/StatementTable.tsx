import {
  ArrowDownToLine,
  ArrowLeftRight,
  Download,
  Info,
  Megaphone,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useMemo, type HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { Tag } from '@/components/atoms/Tag';
import { SearchField } from '@/components/molecules/SearchField';
import { DataTable, type DataTableColumn } from '@/components/organisms/DataTable';
import type { ExtratoLine, WalletTxnKind } from '@/lib/types';
import { cn } from '@/lib/utils';

export type StatementKindFilter = 'all' | WalletTxnKind;

const KIND_OPTIONS: { value: StatementKindFilter; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'SALE_RELEASE', label: 'Vendas' },
  { value: 'COMMISSION', label: 'Comissões' },
  { value: 'SHIPPING', label: 'Frete' },
  { value: 'ADS_TOPUP', label: 'Recarga de Ads' },
  { value: 'REFUND', label: 'Devoluções' },
  { value: 'PAYOUT', label: 'Repasses' },
  { value: 'OTHER', label: 'Outros' },
];

function kindTone(kind: WalletTxnKind): 'ok' | 'danger' | 'warn' | 'info' | 'neutral' {
  switch (kind) {
    case 'SALE_RELEASE':
      return 'ok';
    case 'REFUND':
      return 'danger';
    case 'ADS_TOPUP':
      return 'warn';
    case 'PAYOUT':
      return 'neutral';
    default:
      return 'info';
  }
}

function kindIcon(kind: WalletTxnKind): LucideIcon {
  switch (kind) {
    case 'SALE_RELEASE':
      return ShoppingBag;
    case 'REFUND':
      return RotateCcw;
    case 'ADS_TOPUP':
      return Megaphone;
    case 'PAYOUT':
      return ArrowDownToLine;
    case 'SHIPPING':
      return Truck;
    case 'COMMISSION':
      return Package;
    default:
      return ArrowLeftRight;
  }
}

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export interface StatementTableProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  rows: ReadonlyArray<ExtratoLine>;
  total: number;
  q: string;
  kind: StatementKindFilter;
  loading?: boolean;
  onQChange: (q: string) => void;
  onKindChange: (kind: StatementKindFilter) => void;
  onExportCsv?: () => void;
  onExportPdf?: () => void;
  exporting?: boolean;
}

/**
 * Extrato: busca, filtro de tipo, DataTable com saldo por linha (SHP-117).
 */
export function StatementTable({
  rows,
  total,
  q,
  kind,
  loading = false,
  onQChange,
  onKindChange,
  onExportCsv,
  onExportPdf,
  exporting = false,
  className,
  ...rest
}: StatementTableProps) {
  const titleId = 'statement-title';

  const columns = useMemo<DataTableColumn<ExtratoLine>[]>(
    () => [
      {
        id: 'date',
        header: 'Data',
        cell: (r) => <span className="text-sm tabular-nums">{fmtWhen(r.createTime)}</span>,
        card: 'meta',
        sortValue: (r) => r.createTime,
        sortable: true,
      },
      {
        id: 'desc',
        header: 'Descrição',
        cell: (r) => (
          <div className="min-w-0">
            <div className="text-sm font-bold">{r.description ?? r.kindLabel}</div>
            {r.subtitle ? <div className="text-xs text-muted">{r.subtitle}</div> : null}
          </div>
        ),
        card: 'primary',
      },
      {
        id: 'kind',
        header: 'Tipo',
        cell: (r) => (
          <Tag icon={kindIcon(r.kind)} tone={kindTone(r.kind)}>
            {r.kindLabel}
          </Tag>
        ),
        card: 'badge',
      },
      {
        id: 'src',
        header: 'Sai de',
        cell: () => <span className="text-xs text-muted">Carteira</span>,
        card: false,
      },
      {
        id: 'amount',
        header: 'Valor',
        align: 'right',
        cell: (r) => (
          <Money
            value={r.amount}
            kind={r.amount >= 0 ? 'in' : 'out'}
            className="font-bold tabular-nums"
          />
        ),
        card: 'trailing',
        sortValue: (r) => r.amount,
        sortable: true,
      },
      {
        id: 'balance',
        header: 'Saldo da carteira',
        align: 'right',
        cell: (r) => <Money value={r.balance} className="text-sm text-muted tabular-nums" />,
        card: 'meta',
      },
    ],
    [],
  );

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn('rounded-lg border border-line bg-surface', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 pt-5 pb-3">
        <h2 id={titleId} className="font-display text-h2 font-bold">
          Extrato
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!onExportCsv || exporting}
            onClick={onExportCsv}
          >
            <Download size={14} aria-hidden className="mr-1" />
            CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!onExportPdf || exporting}
            onClick={onExportPdf}
          >
            <Download size={14} aria-hidden className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-3.5">
        <SearchField
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          onClear={() => onQChange('')}
          placeholder="Buscar pedido ou descrição"
          aria-label="Buscar no extrato"
          className="min-w-[220px] flex-1"
        />
        <select
          className="min-h-10 min-w-[160px] rounded-md border border-line bg-surface px-3 text-sm"
          aria-label="Tipo"
          value={kind}
          onChange={(e) => onKindChange(e.target.value as StatementKindFilter)}
        >
          {KIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mx-5 mb-3.5 flex gap-2 rounded-lg bg-anil/15 px-3 py-2.5 text-sm text-ink">
        <Info size={16} className="mt-0.5 shrink-0 text-anil-text" aria-hidden />
        <div>
          <b>Recarga de Ads</b> tira dinheiro da carteira e põe no crédito de Ads.{' '}
          <b>Gasto com Ads</b> sai desse crédito, então não muda o saldo da carteira (não aparece
          aqui).
        </div>
      </div>

      <DataTable
        aria-label="Extrato da carteira"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        loading={loading}
        empty={
          <div className="px-5 py-10 text-center text-sm text-muted">
            Nenhum lançamento. Ajuste os filtros ou aguarde a sincronização do extrato.
          </div>
        }
        defaultSort={{ id: 'date', dir: 'desc' }}
      />
      {total > 0 ? (
        <p className="px-5 py-3 text-xs text-muted">
          {rows.length} de {total} lançamento{total === 1 ? '' : 's'}
        </p>
      ) : null}
    </section>
  );
}
