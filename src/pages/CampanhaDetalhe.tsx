import { AlertTriangle, ArrowDown, ArrowUp, CircleDashed, Pause, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { Spinner } from '@/components/atoms/Spinner';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { MoneyField } from '@/components/molecules/MoneyField';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { StatCard } from '@/components/molecules/StatCard';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { DataTable, type DataTableColumn } from '@/components/organisms/DataTable';
import { LineChart } from '@/components/organisms/LineChart';
import { Modal } from '@/components/organisms/Modal';
import { DetailPage } from '@/components/templates/DetailPage';
import {
  useAdsCampaignDetail,
  usePauseCampaign,
  useResumeCampaign,
  useUpdateCampaignBudget,
} from '@/hooks/useAds';
import { useMe } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api';
import { money } from '@/lib/format';
import type { CampaignDetailPeriod, RoasTone } from '@/lib/types';

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

/**
 * Detalhe da campanha: KPIs, gráfico, keywords e peças (SHP-112).
 */
export function CampanhaDetalhePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const me = useMe();
  const canEdit = me.data?.permissions.includes('campanhas.editar') ?? false;
  const [period, setPeriod] = useState<CampaignDetailPeriod>(30);
  const detailQ = useAdsCampaignDetail(id, period);
  const pauseM = usePauseCampaign();
  const resumeM = useResumeCampaign();
  const budgetM = useUpdateCampaignBudget();

  const [confirmPause, setConfirmPause] = useState(false);
  const [confirmResume, setConfirmResume] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState('');

  const d = detailQ.data;
  const roasMeta = d ? ROAS[d.kpis.roasTone] : null;

  const chart = useMemo(() => {
    if (!d?.series.length) return null;
    const categories = d.series.map((p) => {
      const [, m, day] = p.date.split('-');
      return `${day}/${m}`;
    });
    const spend = d.series.map((p) => p.spend);
    const sales = d.series.map((p) => p.sales);
    const max = Math.max(1, ...spend, ...sales);
    const step = max / 3;
    const yLabels = [max, max - step, max - step * 2, 0].map((v) => money(Math.round(v)));
    return {
      categories,
      yLabels,
      bars: { id: 'sales', label: 'Vendas', tone: 'salvia' as const, values: sales },
      series: [{ id: 'spend', label: 'Gasto', tone: 'mostarda' as const, values: spend }],
    };
  }, [d]);

  const keywordCols = useMemo<
    DataTableColumn<{
      keyword: string;
      clicks: number;
      spend: number;
      sales: number;
      roas: number | null;
      roasTone: RoasTone;
    }>[]
  >(
    () => [
      {
        id: 'kw',
        header: 'Busca',
        card: 'primary',
        cell: (r) => <span className="font-semibold">{r.keyword}</span>,
      },
      {
        id: 'clicks',
        header: 'Cliques',
        align: 'right',
        card: 'meta',
        cell: (r) => <span className="tabular-nums">{r.clicks}</span>,
      },
      {
        id: 'spend',
        header: 'Gasto',
        align: 'right',
        card: 'meta',
        cell: (r) => <Money value={r.spend} />,
      },
      {
        id: 'sales',
        header: 'Vendas',
        align: 'right',
        card: 'trailing',
        cell: (r) => <Money value={r.sales} className="font-bold" />,
      },
      {
        id: 'roas',
        header: 'Retorno',
        card: 'badge',
        cell: (r) => {
          const h = ROAS[r.roasTone];
          return (
            <Tag icon={h.icon} tone={h.tone}>
              {formatRoas(r.roas)} · {h.label}
            </Tag>
          );
        },
      },
    ],
    [],
  );

  async function doPause() {
    try {
      await pauseM.mutateAsync(id);
      toast.success('Campanha pausada');
      setConfirmPause(false);
      void detailQ.refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível pausar');
    }
  }

  async function doResume() {
    try {
      await resumeM.mutateAsync(id);
      toast.success('Campanha retomada');
      setConfirmResume(false);
      void detailQ.refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível retomar');
    }
  }

  async function doBudget() {
    const n = Number(budgetDraft.replace(/\./g, '').replace(',', '.'));
    if (!Number.isFinite(n) || n < 1) {
      toast.error('Informe um orçamento válido');
      return;
    }
    try {
      const r = await budgetM.mutateAsync({ id, dailyBudget: n });
      toast.success(`Orçamento alterado para ${money(r.dailyBudget)} por dia.`);
      setBudgetOpen(false);
      void detailQ.refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível alterar o orçamento');
    }
  }

  if (detailQ.isLoading && !d) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (detailQ.error || !d) {
    return (
      <DetailPage title="Campanha" backLabel="Campanhas" onBack={() => void navigate('/campanhas')}>
        <InlineAlert tone="danger">
          {detailQ.error instanceof ApiError
            ? detailQ.error.message
            : 'Campanha não encontrada.'}
        </InlineAlert>
      </DetailPage>
    );
  }

  return (
    <>
      <DetailPage
        backLabel="Campanhas"
        onBack={() => void navigate('/campanhas')}
        title={d.name}
        badges={
          <>
            {d.status === 'active' ? (
              <Tag icon={Play} tone="ok">
                Ativa
              </Tag>
            ) : (
              <Tag icon={Pause} tone="neutral">
                Pausada
              </Tag>
            )}
            {roasMeta ? (
              <Tag icon={roasMeta.icon} tone={roasMeta.tone}>
                {formatRoas(d.kpis.roas)} · {roasMeta.label}
              </Tag>
            ) : null}
          </>
        }
        description={`${d.products.length} peça${d.products.length === 1 ? '' : 's'} · últimos ${d.periodDays} dias`}
        actions={
          canEdit ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBudgetDraft(String(d.dailyBudget).replace('.', ','));
                  setBudgetOpen(true);
                }}
              >
                Editar orçamento
              </Button>
              {d.on ? (
                <Button type="button" variant="outline" onClick={() => setConfirmPause(true)}>
                  Pausar
                </Button>
              ) : (
                <Button type="button" variant="primary" onClick={() => setConfirmResume(true)}>
                  Retomar
                </Button>
              )}
            </div>
          ) : null
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Orçamento/dia" value={d.kpis.dailyBudget} variant="soft" size="md" />
          <StatCard label="Gasto" value={d.kpis.spend} variant="soft" size="md" />
          <StatCard
            label="Vendas"
            value={d.kpis.sales}
            hint={`${d.kpis.orders} pedido${d.kpis.orders === 1 ? '' : 's'}`}
            variant="soft"
            size="md"
          />
          <StatCard
            label="Cliques"
            value={d.kpis.clicks.toLocaleString('pt-BR')}
            hint={d.kpis.cpc != null ? `CPC ${money(d.kpis.cpc)}` : undefined}
            variant="soft"
            size="md"
          />
        </div>

        <section className="mt-6 flex flex-col gap-3 rounded-lg border border-line p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">Gasto × vendas</h2>
            <SegmentedControl
              value={String(period)}
              onValueChange={(v) => setPeriod(Number(v) as CampaignDetailPeriod)}
              options={[
                { value: '7', label: '7' },
                { value: '14', label: '14' },
                { value: '30', label: '30' },
                { value: '180', label: '180' },
              ]}
              aria-label="Período do gráfico"
            />
          </div>
          {chart ? (
            <LineChart
              aria-label="Gasto e vendas por dia"
              categories={chart.categories}
              bars={chart.bars}
              series={chart.series}
              yLabels={chart.yLabels}
              height={220}
              formatValue={(v) => money(v)}
            />
          ) : (
            <p className="text-sm text-muted">Sem dados neste período.</p>
          )}
          <p className="text-xs text-muted">Histórico disponível até {d.historyMaxDays} dias.</p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="flex min-w-0 flex-col gap-3">
            <h2 className="font-display text-lg font-bold">Palavras-chave</h2>
            {d.keywords == null ? (
              <p className="text-sm text-muted">A Shopee não expôs palavras-chave para esta campanha.</p>
            ) : d.keywords.length === 0 ? (
              <p className="text-sm text-muted">Nenhuma palavra-chave.</p>
            ) : (
              <DataTable
                aria-label="Palavras-chave da campanha"
                columns={keywordCols}
                rows={d.keywords}
                getRowId={(r) => r.keyword}
              />
            )}
          </section>

          <section className="flex min-w-0 flex-col gap-3">
            <h2 className="font-display text-lg font-bold">Peças</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {d.products.map((p) => (
                <li
                  key={p.itemId}
                  className="flex items-center gap-3 rounded-lg border border-line px-3 py-2"
                >
                  <Thumbnail src={p.imageUrl} alt="" size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{p.name}</div>
                    {p.sales != null ? (
                      <div className="text-xs text-muted">
                        Vendas <Money value={p.sales} />
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DetailPage>

      <ConfirmDialog
        open={confirmPause}
        onOpenChange={setConfirmPause}
        title={`Pausar “${d.name}”?`}
        summary="A campanha para de gastar crédito até você retomar."
        confirmLabel="Pausar"
        tone="danger"
        loading={pauseM.isPending}
        onConfirm={() => void doPause()}
      />
      <ConfirmDialog
        open={confirmResume}
        onOpenChange={setConfirmResume}
        title={`Retomar “${d.name}”?`}
        summary={`Volta a gastar até ${money(d.dailyBudget)} por dia do crédito de Ads.`}
        confirmLabel="Retomar"
        loading={resumeM.isPending}
        onConfirm={() => void doResume()}
      />

      <Modal
        open={budgetOpen}
        onOpenChange={setBudgetOpen}
        title="Editar orçamento"
        description={`De ${money(d.dailyBudget)} para o novo valor por dia.`}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setBudgetOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" loading={budgetM.isPending} onClick={() => void doBudget()}>
              Confirmar
            </Button>
          </>
        }
      >
        <MoneyField
          label="Orçamento diário"
          value={budgetDraft}
          onChange={(e) => setBudgetDraft(e.target.value)}
          onValueChange={(n) => {
            if (n != null) setBudgetDraft(n.toFixed(2).replace('.', ','));
          }}
        />
      </Modal>
    </>
  );
}
