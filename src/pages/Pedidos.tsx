import { Check, ListChecks, Printer } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { EmptyState } from '@/components/molecules/EmptyState';
import { BulkActionBar } from '@/components/organisms/BulkActionBar';
import {
  ORDER_TABS,
  OrdersList,
  type OrdersListFilters,
} from '@/components/organisms/OrdersList';
import {
  PrintPreviewModal,
  type LabelFormat,
  type PrintPreviewLabel,
} from '@/components/organisms/PrintPreviewModal';
import { ListPage } from '@/components/templates/ListPage';
import { useCan } from '@/hooks/useAuth';
import { last7DaysRange, useMarkPacked, useOrders, usePrintLabels } from '@/hooks/useOrders';
import { ApiError } from '@/lib/api';
import { separacaoPath } from '@/lib/separacao';
import type { OrderQuery, OrderSummary, OrderTab } from '@/lib/types';

const PAGE_SIZE = 20;

function isOrderTab(v: string | null): v is OrderTab {
  return Boolean(v && (ORDER_TABS as readonly string[]).includes(v));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function previewFromOrders(orders: ReadonlyArray<OrderSummary>): PrintPreviewLabel[] {
  return orders.map((o) => {
    const first = o.items[0];
    const piece = first
      ? [first.name, first.variation?.replace(',', ' · ')].filter(Boolean).join(' · ')
      : 'Peça';
    return {
      orderSn: o.orderSn,
      to: o.recipientName ?? o.buyerUsername ?? '—',
      address: [o.city, o.state].filter(Boolean).join('/') || '—',
      piece,
      service: 'Xpress',
    };
  });
}

/**
 * Página Pedidos (SHP-85): abas, filtros, seleção e ações em lote
 * (imprimir etiquetas, lista de separação, marcar embalado).
 */
export function PedidosPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const showMoney = useCan('financeiro.ver');
  const canPrint = useCan('pedidos.imprimir');

  const tab: OrderTab = isOrderTab(params.get('tab')) ? params.get('tab')! : 'a_enviar';
  const page = Math.max(1, Number(params.get('page') || '1') || 1);
  const filters: OrdersListFilters = {
    venceHoje: params.get('venceHoje') === '1',
    multiItem: params.get('multiItem') === '1',
    ultimos7Dias: params.get('ultimos7Dias') === '1',
    q: params.get('q') ?? '',
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printOpen, setPrintOpen] = useState(false);
  const [includeLabels, setIncludeLabels] = useState(true);
  const [includePackingList, setIncludePackingList] = useState(true);
  const [labelFormat, setLabelFormat] = useState<LabelFormat>('a4');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const range = useMemo(
    () => (filters.ultimos7Dias ? last7DaysRange() : null),
    [filters.ultimos7Dias],
  );

  const query: OrderQuery = useMemo(
    () => ({
      tab,
      page,
      pageSize: PAGE_SIZE,
      venceHoje: filters.venceHoje || undefined,
      multiItem: filters.multiItem || undefined,
      q: filters.q.trim() || undefined,
      from: range?.from,
      to: range?.to,
    }),
    [tab, page, filters.venceHoje, filters.multiItem, filters.q, range],
  );

  const ordersQ = useOrders(query);
  const markPacked = useMarkPacked();
  const printLabels = usePrintLabels();

  const orders = ordersQ.data?.items ?? [];
  const counts = ordersQ.data?.counts ?? {
    a_enviar: 0,
    aguardando_coleta: 0,
    enviados: 0,
    entregues: 0,
    cancelados: 0,
    devolucoes: 0,
  };
  const total = ordersQ.data?.total ?? 0;
  const venceHojeCount = ordersQ.data?.venceHoje ?? 0;

  const selectedOrders = useMemo(
    () => orders.filter((o) => selectedIds.includes(o.orderSn)),
    [orders, selectedIds],
  );

  useEffect(() => {
    setSelectedIds([]);
  }, [tab, filters.venceHoje, filters.multiItem, filters.ultimos7Dias, filters.q]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const patchParams = useCallback(
    (patch: Record<string, string | null>, opts?: { resetPage?: boolean }) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === '' || v === '0' || v === 'false') next.delete(k);
        else next.set(k, v);
      }
      if (opts?.resetPage !== false && !('page' in patch)) next.delete('page');
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const onTabChange = (next: OrderTab) => {
    patchParams({ tab: next === 'a_enviar' ? null : next });
  };

  const onFiltersChange = (next: OrdersListFilters) => {
    patchParams({
      venceHoje: next.venceHoje ? '1' : null,
      multiItem: next.multiItem ? '1' : null,
      ultimos7Dias: next.ultimos7Dias ? '1' : null,
      q: next.q.trim() || null,
    });
  };

  const openPrint = () => {
    if (!selectedIds.length) return;
    setIncludeLabels(true);
    setIncludePackingList(true);
    setLabelFormat('a4');
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setPrintOpen(true);
  };

  const onConfirmPrint = async () => {
    if (!selectedIds.length) return;
    const sns = [...selectedIds];
    try {
      if (includeLabels) {
        const blob = await printLabels.mutateAsync(sns);
        const name =
          sns.length === 1
            ? `etiqueta-${sns[0]!.toUpperCase()}.pdf`
            : `etiquetas-${sns.length}.pdf`;
        downloadBlob(blob, name);
        const url = URL.createObjectURL(blob);
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(url);
        toast.success(
          sns.length === 1 ? 'Etiqueta baixada' : `${sns.length} etiquetas baixadas`,
        );
      }
      setPrintOpen(false);
      if (includeLabels) setSelectedIds([]);
      if (includePackingList) {
        navigate(separacaoPath(sns));
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não deu para gerar o PDF.');
    }
  };

  const onMarkPacked = () => {
    if (!selectedIds.length) return;
    const sns = [...selectedIds];
    markPacked.mutate(
      { orderSns: sns, packed: true },
      {
        onSuccess: () => {
          setSelectedIds([]);
          toast.success(
            sns.length === 1 ? 'Pedido marcado como embalado' : `${sns.length} pedidos marcados como embalados`,
            {
              action: {
                label: 'Desfazer',
                onClick: () => {
                  markPacked.mutate(
                    { orderSns: sns, packed: false },
                    {
                      onSuccess: () => toast.message('Marcação desfeita'),
                      onError: (e) => toast.error(e.message),
                    },
                  );
                },
              },
            },
          );
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const onSeparacao = () => {
    if (!selectedIds.length) return;
    navigate(separacaoPath(selectedIds));
  };

  const syncHint = ordersQ.isFetching
    ? 'Atualizando…'
    : ordersQ.dataUpdatedAt
      ? `Atualizado · sincronizado com a Shopee`
      : undefined;

  if (ordersQ.isPending && !ordersQ.data) {
    return (
      <div className="flex min-h-[calc(100dvh-9.5rem)] w-full flex-col items-center justify-center px-4 md:min-h-[calc(100dvh-6rem)]">
        <Spinner layout="stack" label="Carregando pedidos…" />
      </div>
    );
  }

  return (
    <>
      <ListPage title="Pedidos" description={syncHint}>
        {ordersQ.isError ? (
          <EmptyState
            align="start"
            illustration={null}
            title="Não deu para carregar os pedidos"
            description={
              ordersQ.error instanceof ApiError
                ? ordersQ.error.message
                : 'Tente de novo em instantes.'
            }
            action={
              <Button variant="outline" onClick={() => void ordersQ.refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : (
          <OrdersList
            orders={orders}
            counts={counts}
            venceHojeCount={venceHojeCount}
            tab={tab}
            onTabChange={onTabChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            selectedIds={canPrint ? selectedIds : undefined}
            onSelectedIdsChange={canPrint ? setSelectedIds : undefined}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => patchParams({ page: p <= 1 ? null : String(p) }, { resetPage: false })}
            loading={ordersQ.isFetching && Boolean(ordersQ.data)}
            showMoney={showMoney}
            onOrderClick={(o) => navigate(`/pedidos/${encodeURIComponent(o.orderSn)}`)}
          />
        )}
      </ListPage>

      {canPrint ? (
        <BulkActionBar
          count={selectedIds.length}
          onClear={() => setSelectedIds([])}
          label={
            selectedIds.length === 1
              ? '1 pedido selecionado'
              : `${selectedIds.length} pedidos selecionados`
          }
        >
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={openPrint}
            disabled={printLabels.isPending}
          >
            Imprimir etiquetas
          </Button>
          <Button variant="outline" size="sm" icon={ListChecks} onClick={onSeparacao}>
            Lista de separação
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Check}
            onClick={onMarkPacked}
            loading={markPacked.isPending}
          >
            Marcar embalado
          </Button>
        </BulkActionBar>
      ) : null}

      <PrintPreviewModal
        open={printOpen}
        onOpenChange={setPrintOpen}
        orderCount={selectedIds.length}
        includeLabels={includeLabels}
        onIncludeLabelsChange={setIncludeLabels}
        includePackingList={includePackingList}
        onIncludePackingListChange={setIncludePackingList}
        labelFormat={labelFormat}
        onLabelFormatChange={setLabelFormat}
        previewLabels={previewFromOrders(selectedOrders.length ? selectedOrders : orders.filter((o) => selectedIds.includes(o.orderSn)))}
        pdfUrl={pdfUrl}
        loading={printLabels.isPending}
        onConfirm={() => void onConfirmPrint()}
      />
    </>
  );
}
