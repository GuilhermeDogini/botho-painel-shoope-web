import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { EmptyState } from '@/components/molecules/EmptyState';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { StatCard } from '@/components/molecules/StatCard';
import { IdleStockList } from '@/components/organisms/IdleStockList';
import { RestockList, buyListToCsv, buySuggestionId } from '@/components/organisms/RestockList';
import { RestockModal } from '@/components/organisms/RestockModal';
import { StockAlertTable } from '@/components/organisms/StockAlertTable';
import { ListPage } from '@/components/templates/ListPage';
import { useEstoque, useRestock, useUpdateReorderPoint } from '@/hooks/useEstoque';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useProduct } from '@/hooks/useProducts';
import { ApiError } from '@/lib/api';
import type { BuySuggestion, StockAlertRow } from '@/lib/types';

/**
 * Estoque: alertas, lista de compra, paradas e repor em lote (SHP-102).
 */
export function EstoquePage() {
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const estoqueQ = useEstoque();
  const updatePoint = useUpdateReorderPoint();
  const restock = useRestock();

  const [selectedBuy, setSelectedBuy] = useState<string[]>([]);
  const [reporItemId, setReporItemId] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const productQ = useProduct(reporItemId);
  const data = estoqueQ.data;
  const summary = data?.summary;

  const itemOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const a of data?.alerts ?? []) {
      if (!map.has(a.itemId)) map.set(a.itemId, a.name);
    }
    for (const b of data?.buyList ?? []) {
      if (!map.has(b.itemId)) map.set(b.itemId, b.name);
    }
    return [...map.entries()].map(([itemId, name]) => ({ itemId, name }));
  }, [data?.alerts, data?.buyList]);

  useEffect(() => {
    if (!data?.buyList.length) {
      setSelectedBuy([]);
      return;
    }
    setSelectedBuy(data.buyList.map(buySuggestionId));
  }, [data?.buyList]);

  const openRepor = (row?: StockAlertRow) => {
    if (row) {
      setReporItemId(row.itemId);
      setPickerOpen(true);
      return;
    }
    const first = itemOptions[0]?.itemId ?? data?.alerts[0]?.itemId ?? null;
    if (first == null) {
      toast.message('Nenhuma peça com alerta para repor');
      return;
    }
    setReporItemId(first);
    setPickerOpen(true);
  };

  const onExportCsv = (selected: BuySuggestion[]) => {
    if (!selected.length) {
      toast.message('Marque pelo menos um item para exportar');
      return;
    }
    const blob = new Blob([buyListToCsv(selected)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-compra.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`CSV com ${selected.length} ${selected.length === 1 ? 'item' : 'itens'}`);
  };

  const onConfirmRestock = (lines: { modelId: number; quantity: number }[]) => {
    if (reporItemId == null || !lines.length) return;
    restock.mutate(
      lines.map((l) => ({ itemId: reporItemId, modelId: l.modelId, quantity: l.quantity })),
      {
        onSuccess: (res) => {
          const total = res.success.reduce((s, x) => s + x.added, 0);
          const changed = res.success.length;
          if (res.failed.length) {
            toast.message(
              `Atualizado +${total} em ${changed} variações; ${res.failed.length} falharam`,
            );
          } else {
            toast.success(`Estoque atualizado: +${total} peças em ${changed} variações.`);
          }
          setPickerOpen(false);
          setReporItemId(null);
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : 'Não deu para repor');
        },
      },
    );
  };

  return (
    <ListPage
      title="Estoque"
      description={
        summary
          ? `${summary.totalUnits} peças em estoque · previsão pelas vendas dos últimos 14 dias`
          : undefined
      }
      actions={
        <Button type="button" variant="primary" size="sm" icon={Plus} onClick={() => openRepor()}>
          Repor estoque
        </Button>
      }
    >
      {estoqueQ.isPending ? <Spinner label="Carregando estoque…" /> : null}
      {estoqueQ.isError ? (
        <InlineAlert tone="danger">
          {estoqueQ.error instanceof Error ? estoqueQ.error.message : 'Erro ao carregar estoque'}
        </InlineAlert>
      ) : null}

      {summary ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Acabando"
            value={`${summary.lowCount} variações`}
            className="[&_.tabular-nums]:text-mostarda-text"
          />
          <StatCard
            label="Esgotadas"
            value={`${summary.outCount} variações`}
            className="[&_.tabular-nums]:text-danger-text"
          />
          <StatCard label="Paradas há 30 dias" value={`${summary.idleCount} peças`} />
          <StatCard
            label="Ponto de reposição"
            value={`${summary.defaultReorderPoint} un.`}
            hint="padrão da loja"
          />
        </div>
      ) : null}

      {data && !data.alerts.length && !data.buyList.length && !data.idle.length ? (
        <EmptyState
          title="Estoque em dia"
          description="Nenhum alerta, nada a comprar e nenhuma peça parada."
        />
      ) : null}

      {data && data.alerts.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold">Alertas por variação</h2>
          <StockAlertTable
            rows={data.alerts}
            loading={estoqueQ.isFetching && !estoqueQ.isPending}
            onReorderPointChange={(row, point) => {
              updatePoint.mutate(
                { itemId: row.itemId, modelId: row.modelId, reorderPoint: point },
                {
                  onError: (err) =>
                    toast.error(err instanceof ApiError ? err.message : 'Não salvou o ponto'),
                },
              );
            }}
            onRepor={openRepor}
          />
        </section>
      ) : null}

      {data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <RestockList
            items={data.buyList}
            selectedIds={selectedBuy}
            onSelectedIdsChange={setSelectedBuy}
            onExportCsv={onExportCsv}
          />
          <IdleStockList
            items={data.idle}
            onBoost={(item) => navigate(`/turbinar?item=${item.itemId}`)}
            onCampaign={() => toast.message('Campanhas entram no próximo épico')}
          />
        </div>
      ) : null}

      <RestockModal
        open={pickerOpen}
        onOpenChange={(open) => {
          setPickerOpen(open);
          if (!open) setReporItemId(null);
        }}
        mobile={mobile}
        product={productQ.data}
        loading={productQ.isPending || productQ.isFetching}
        saving={restock.isPending}
        onChangeItem={() => {
          if (itemOptions.length < 2 || reporItemId == null) {
            toast.message('Só há esta peça nos alertas');
            return;
          }
          const idx = itemOptions.findIndex((o) => o.itemId === reporItemId);
          const next = itemOptions[(idx + 1) % itemOptions.length];
          if (next) setReporItemId(next.itemId);
        }}
        onConfirm={onConfirmRestock}
      />
    </ListPage>
  );
}
