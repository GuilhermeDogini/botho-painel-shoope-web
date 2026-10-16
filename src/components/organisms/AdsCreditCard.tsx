import { AlertTriangle, ExternalLink, Pause } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { Tag } from '@/components/atoms/Tag';
import type { AdsCredit } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface AdsCreditCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  credit: AdsCredit | null;
  loading?: boolean;
}

/**
 * Crédito de Ads: saldo, ritmo, recarga no Seller Center (SHP-110).
 */
export function AdsCreditCard({ credit, loading = false, className, ...rest }: AdsCreditCardProps) {
  const titleId = 'ads-credit-title';
  const low = credit != null && credit.daysLeft != null && credit.daysLeft <= 3;

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn(
        'flex flex-wrap items-center gap-6 rounded-lg border border-line border-dashed border-brand/30 bg-surface p-6',
        className,
      )}
    >
      <div className="flex min-w-[280px] flex-1 flex-col gap-1.5">
        <span id={titleId} className="text-xs font-bold uppercase tracking-wide text-muted">
          Crédito de Ads
        </span>
        {loading && !credit ? (
          <span className="font-display text-5xl font-bold tabular-nums text-muted">…</span>
        ) : (
          <Money value={credit?.total ?? null} className="font-display text-5xl font-bold tracking-tight" />
        )}
        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-brand" aria-hidden />
            Pago <Money value={credit?.paid ?? null} className="font-bold text-ink" />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-mostarda" aria-hidden />
            Grátis (bônus) <Money value={credit?.free ?? null} className="font-bold text-ink" />
          </span>
        </div>
        {credit && credit.spendPerDay > 0 ? (
          <p
            className={cn(
              'flex items-start gap-1.5 text-sm',
              low ? 'font-semibold text-mostarda-text' : 'text-muted',
            )}
          >
            {low ? (
              <AlertTriangle size={14} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
            ) : null}
            <span className="min-w-0">
              {credit.daysLeft != null
                ? `Dá para ~${credit.daysLeft} dia${credit.daysLeft === 1 ? '' : 's'} no ritmo atual `
                : 'Ritmo atual '}
              <span className="whitespace-nowrap">
                (<Money value={credit.spendPerDay} className="font-semibold" /> por dia)
              </span>
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex max-w-md flex-1 flex-col gap-2.5">
        {credit?.rechargeUrl ? (
          <Button
            asChild
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <a href={credit.rechargeUrl} target="_blank" rel="noopener noreferrer">
              Recarregar na Shopee
              <ExternalLink size={16} strokeWidth={2} aria-hidden className="ml-1.5" />
            </a>
          </Button>
        ) : (
          <Button variant="primary" size="lg" disabled>
            Recarregar na Shopee
          </Button>
        )}
        <div className="rounded-lg bg-surface-2 p-3">
          <Tag icon={Pause} tone={credit?.autoTopupEnabled ? 'ok' : 'neutral'}>
            {credit?.autoTopupEnabled ? 'Recarga automática ligada' : 'Recarga automática desligada'}
          </Tag>
        </div>
        <p className="text-xs text-muted">
          Recarga e saque de crédito só no Seller Center da Shopee. Com a recarga automática ligada lá, o
          saldo sobe sozinho e as campanhas não param.
        </p>
      </div>
    </section>
  );
}
