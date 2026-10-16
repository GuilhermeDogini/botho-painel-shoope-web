import { Scissors } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Money } from '@/components/atoms/Money';
import { BarRow, type BarRowTone } from '@/components/molecules/BarRow';
import type { PeriodWhereParts } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface WhereMoneyWentProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  where: PeriodWhereParts | null;
  /** De cada R$ 100 vendidos, quanto ficou (ex.: 71). */
  per100: number | null;
  loading?: boolean;
}

const PARTS: { key: keyof PeriodWhereParts; label: string; tone: BarRowTone }[] = [
  { key: 'commission', label: 'Comissão', tone: 'brand' },
  { key: 'fees', label: 'Taxas', tone: 'anil' },
  { key: 'shippingFee', label: 'Frete', tone: 'mostarda' },
  { key: 'ads', label: 'Ads', tone: 'salvia' },
  { key: 'refunds', label: 'Devoluções', tone: 'danger' },
];

/**
 * “Para onde foi o dinheiro” com BarRow (SHP-117).
 */
export function WhereMoneyWent({
  where,
  per100,
  loading = false,
  className,
  ...rest
}: WhereMoneyWentProps) {
  const titleId = 'where-money-title';
  const values = PARTS.map((p) => where?.[p.key] ?? 0);
  const max = Math.max(...values, 1);

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn('flex flex-col rounded-lg border border-line bg-surface p-5', className)}
    >
      <h2 id={titleId} className="mb-3 inline-flex items-center gap-2 font-display text-lg font-bold">
        <Scissors size={18} className="text-brand" aria-hidden />
        Para onde foi o dinheiro
      </h2>
      <p className="mb-3 text-xs text-muted">
        {loading && where == null
          ? 'Carregando…'
          : per100 != null
            ? `De cada R$ 100 vendidos, R$ ${per100} ficaram com a loja.`
            : 'Sem vendas no período.'}
      </p>
      <div className="flex flex-col gap-3">
        {PARTS.map((p) => {
          const value = where?.[p.key] ?? null;
          return (
            <BarRow
              key={p.key}
              label={p.label}
              value={loading && where == null ? null : value}
              ratio={value != null ? value / max : 0}
              tone={p.tone}
            />
          );
        })}
      </div>
      {where ? (
        <p className="mt-3 text-xs text-muted">
          Total das saídas:{' '}
          <Money
            value={
              where.commission + where.fees + where.shippingFee + where.ads + where.refunds
            }
            className="font-semibold text-ink"
          />
        </p>
      ) : null}
    </section>
  );
}
