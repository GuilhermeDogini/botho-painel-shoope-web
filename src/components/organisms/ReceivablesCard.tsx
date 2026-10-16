import { Clock, Hourglass } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Money } from '@/components/atoms/Money';
import { Tag } from '@/components/atoms/Tag';
import type { AReceberGroup } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ReceivablesCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  amount: number | null;
  groups: ReadonlyArray<AReceberGroup>;
  loading?: boolean;
}

/**
 * A receber: total em liberação + grupos por data (SHP-117).
 */
export function ReceivablesCard({
  amount,
  groups,
  loading = false,
  className,
  ...rest
}: ReceivablesCardProps) {
  const titleId = 'receivables-title';

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn('flex flex-col rounded-lg border border-line bg-surface p-5', className)}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 id={titleId} className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <Clock size={18} className="text-anil-text" aria-hidden />
          A receber
        </h2>
        <Tag icon={Hourglass} tone="info">
          Em liberação
        </Tag>
      </div>
      {loading && amount == null ? (
        <span className="font-display text-[32px] font-bold text-muted">…</span>
      ) : (
        <Money value={amount} className="font-display text-[32px] font-bold tracking-tight" />
      )}
      <p className="mt-1 mb-2.5 text-xs text-muted">
        A Shopee libera o dinheiro depois que a compradora recebe a peça.
      </p>
      <ul className="flex flex-col divide-y divide-line">
        {groups.map((g) => (
          <li key={g.date ?? 'sem-data'} className="flex min-h-11 items-center gap-3 py-2">
            <span className="inline-flex min-w-[58px] justify-center rounded-full bg-surface-2 px-2.5 py-1 text-sm font-semibold tabular-nums">
              {g.label}
            </span>
            <span className="grow text-sm text-muted">
              {g.orderCount} pedido{g.orderCount === 1 ? '' : 's'}
            </span>
            <Money value={g.amount} className="text-sm font-bold" />
          </li>
        ))}
        {!loading && groups.length === 0 ? (
          <li className="py-3 text-sm text-muted">Nada em liberação no momento.</li>
        ) : null}
      </ul>
    </section>
  );
}
