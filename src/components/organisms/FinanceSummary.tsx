import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Money } from '@/components/atoms/Money';
import { StatCard } from '@/components/molecules/StatCard';
import type { PeriodSummary } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface FinanceSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  period: PeriodSummary | null;
  loading?: boolean;
}

/**
 * KPIs do período: entradas, saídas e resultado (SHP-117).
 * Usa StatCard + Money.
 */
export function FinanceSummary({ period, loading = false, className, ...rest }: FinanceSummaryProps) {
  const titleId = 'finance-summary-title';
  const empty = loading && !period;

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn(
        'rounded-lg border border-dashed border-brand/30 bg-surface p-6',
        className,
      )}
    >
      <h2 id={titleId} className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
        {empty ? 'Carregando período…' : (period?.title ?? 'Período')}
      </h2>
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label={
            <span className="inline-flex items-center gap-1.5">
              <ArrowUp size={14} className="text-salvia-text" aria-hidden />
              Entradas · vendas
            </span>
          }
          value={empty ? null : (period?.amount ?? null)}
          hint={period ? `${period.orderCount} pedido${period.orderCount === 1 ? '' : 's'}` : undefined}
        />
        <StatCard
          label={
            <span className="inline-flex items-center gap-1.5">
              <ArrowDown size={14} className="text-mostarda-text" aria-hidden />
              Saídas · descontos e gastos
            </span>
          }
          value={
            empty || period?.out == null ? null : (
              <span className="text-ink">
                − <Money value={period.out} className="text-[length:inherit] font-bold" />
              </span>
            )
          }
          hint="comissões, taxas, frete, Ads e devoluções"
        />
        <StatCard
          label={
            <span className="inline-flex items-center gap-1.5">
              <Wallet size={14} className="text-brand" aria-hidden />
              Resultado
            </span>
          }
          value={empty ? null : (period?.net ?? null)}
          hint={
            period?.marginPct != null
              ? `sobram ${period.marginPct}% do vendido`
              : undefined
          }
          className="[&_.money]:text-brand"
        />
      </div>
    </section>
  );
}
