import { ExternalLink, Wallet } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import type { RepasseLine } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SHOPEE_WITHDRAW_URL } from './financeiroFixtures';

export interface WalletCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  balance: number | null;
  repasses: ReadonlyArray<RepasseLine>;
  withdrawUrl?: string;
  loading?: boolean;
}

/**
 * Carteira Shopee + “Sacar na Shopee” legível + repasses (SHP-117).
 */
export function WalletCard({
  balance,
  repasses,
  withdrawUrl = SHOPEE_WITHDRAW_URL,
  loading = false,
  className,
  ...rest
}: WalletCardProps) {
  const titleId = 'wallet-card-title';

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn('flex flex-col rounded-lg border border-line bg-surface p-5', className)}
    >
      <div className="mb-2 flex items-center gap-2">
        <h2 id={titleId} className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <Wallet size={18} className="text-salvia-text" aria-hidden />
          Carteira Shopee
        </h2>
      </div>
      {loading && balance == null ? (
        <span className="font-display text-[32px] font-bold text-muted">…</span>
      ) : (
        <Money value={balance} className="font-display text-[32px] font-bold tracking-tight" />
      )}
      <p className="mt-1 mb-3 text-xs text-muted">Disponível para saque agora.</p>

      <Button asChild variant="primary" className="w-full">
        <a href={withdrawUrl} target="_blank" rel="noopener noreferrer">
          Sacar na Shopee
          <ExternalLink size={16} strokeWidth={2} aria-hidden className="ml-1.5" />
        </a>
      </Button>
      <p className="mt-2 text-xs text-muted">
        O saque só pode ser feito no Seller Center. O dinheiro vai para a conta bancária cadastrada lá.
      </p>

      <div className="my-3.5 border-t border-line" />
      <span className="mb-1 text-sm font-bold">Repasses feitos</span>
      <ul className="flex flex-col divide-y divide-line">
        {repasses.map((r) => (
          <li key={r.id} className="flex min-h-11 items-center justify-between gap-3 py-1.5">
            <span className="text-sm">{r.label}</span>
            <Money value={r.amount} className="text-sm font-bold" />
          </li>
        ))}
        {!loading && repasses.length === 0 ? (
          <li className="py-2 text-sm text-muted">Nenhum repasse no extrato ainda.</li>
        ) : null}
      </ul>
    </section>
  );
}
