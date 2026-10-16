import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/atoms/Spinner';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { FinanceSummary } from '@/components/organisms/FinanceSummary';
import { ReceivablesCard } from '@/components/organisms/ReceivablesCard';
import { StatementTable, type StatementKindFilter } from '@/components/organisms/StatementTable';
import { WalletCard } from '@/components/organisms/WalletCard';
import { WhereMoneyWent } from '@/components/organisms/WhereMoneyWent';
import { ListPage } from '@/components/templates/ListPage';
import {
  useFinanceiroAReceber,
  useFinanceiroExtrato,
  useFinanceiroResumo,
} from '@/hooks/useFinanceiro';
import { ApiError, api } from '@/lib/api';
import type { ExtratoQuery, FinancePeriodPreset } from '@/lib/types';

const PERIOD_OPTIONS = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'sete', label: '7 dias' },
  { value: 'mes', label: 'Mês' },
  { value: 'pers', label: 'Personalizado' },
] as const;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Financeiro: resumo, a receber, carteira, para onde foi e extrato (SHP-118).
 * Só monta com `financeiro.ver` (rota guardada).
 */
export function FinanceiroPage() {
  const [period, setPeriod] = useState<FinancePeriodPreset>('mes');
  const [customFrom, setCustomFrom] = useState('2026-09-15');
  const [customTo, setCustomTo] = useState('2026-10-08');
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<StatementKindFilter>('all');
  const [exporting, setExporting] = useState(false);

  const from = period === 'pers' ? customFrom : undefined;
  const to = period === 'pers' ? customTo : undefined;

  const resumoQ = useFinanceiroResumo(period, from, to);
  const aReceberQ = useFinanceiroAReceber();

  const extratoQuery = useMemo<ExtratoQuery>(() => {
    const query: ExtratoQuery = { limit: 100, q: q.trim() || undefined };
    if (kind !== 'all') query.kind = kind;
    if (period === 'pers') {
      query.from = customFrom;
      query.to = customTo;
    } else if (resumoQ.data?.period) {
      query.from = resumoQ.data.period.from.slice(0, 10);
      query.to = resumoQ.data.period.to.slice(0, 10);
    }
    return query;
  }, [q, kind, period, customFrom, customTo, resumoQ.data?.period]);

  const extratoQ = useFinanceiroExtrato(extratoQuery);

  const error = resumoQ.error ?? aReceberQ.error ?? extratoQ.error;

  async function exportFile(format: 'csv' | 'pdf') {
    setExporting(true);
    try {
      const blob =
        format === 'csv'
          ? await api.financeiroExtratoCsv(extratoQuery)
          : await api.financeiroExtratoPdf(extratoQuery);
      downloadBlob(blob, `extrato.${format}`);
      toast.success(format === 'csv' ? 'CSV baixado' : 'PDF baixado');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível exportar');
    } finally {
      setExporting(false);
    }
  }

  return (
    <ListPage
      title="Financeiro"
      description="Valores da Shopee já com descontos"
      actions={
        <SegmentedControl
          aria-label="Período"
          value={period}
          onValueChange={(v) => setPeriod(v as FinancePeriodPreset)}
          options={[...PERIOD_OPTIONS]}
        />
      }
    >
      {period === 'pers' ? (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted">
            De{' '}
            <input
              type="date"
              className="ml-1 rounded-md border border-line bg-surface px-2 py-1.5 text-sm"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
          </label>
          <label className="text-sm text-muted">
            até{' '}
            <input
              type="date"
              className="ml-1 rounded-md border border-line bg-surface px-2 py-1.5 text-sm"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </label>
        </div>
      ) : null}

      {error ? (
        <InlineAlert tone="danger">
          {error instanceof ApiError ? error.message : 'Não foi possível carregar o financeiro.'}
        </InlineAlert>
      ) : null}

      <FinanceSummary period={resumoQ.data?.period ?? null} loading={resumoQ.isLoading} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ReceivablesCard
          amount={aReceberQ.data?.amount ?? null}
          groups={aReceberQ.data?.groups ?? []}
          loading={aReceberQ.isLoading}
        />
        <WalletCard
          balance={aReceberQ.data?.balance ?? null}
          repasses={aReceberQ.data?.repasses ?? []}
          loading={aReceberQ.isLoading}
        />
        <WhereMoneyWent
          where={resumoQ.data?.period.where ?? null}
          per100={resumoQ.data?.period.per100 ?? null}
          loading={resumoQ.isLoading}
        />
      </div>

      {extratoQ.isLoading && !extratoQ.data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <StatementTable
          rows={extratoQ.data?.items ?? []}
          total={extratoQ.data?.total ?? 0}
          q={q}
          kind={kind}
          loading={extratoQ.isFetching}
          onQChange={setQ}
          onKindChange={setKind}
          onExportCsv={() => void exportFile('csv')}
          onExportPdf={() => void exportFile('pdf')}
          exporting={exporting}
        />
      )}
    </ListPage>
  );
}
