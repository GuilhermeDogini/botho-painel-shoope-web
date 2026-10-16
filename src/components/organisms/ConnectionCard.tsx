import { Check, Clock, Link2, Lock, RefreshCw, Store, Unlink } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { TapeProgress } from '@/components/molecules/TapeProgress';
import type { ConnectionStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const AUTH_SPAN_DAYS = 365;

export interface ConnectionCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  status: ConnectionStatus | null;
  lastSyncLabel?: string | null;
  renewing?: boolean;
  onRenew?: () => void;
}

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Conexão com a Shopee: estado, fita até o vencimento e renovar (SHP-125).
 */
export function ConnectionCard({
  status,
  lastSyncLabel,
  renewing = false,
  onRenew,
  className,
  ...rest
}: ConnectionCardProps) {
  const titleId = 'connection-card-title';
  if (!status) {
    return (
      <section
        {...rest}
        aria-labelledby={titleId}
        aria-busy="true"
        className={cn('rounded-lg border border-line bg-surface p-6', className)}
      >
        <h2 id={titleId} className="font-display text-h2 font-bold">
          Conexão com a Shopee
        </h2>
        <p className="mt-1 text-sm text-muted">Carregando a conexão…</p>
      </section>
    );
  }

  const down = !status.connected || status.needsReauth;
  const warn = Boolean(status?.warn && !down);
  const expires = formatWhen(status?.authExpiresAt ?? null);
  const elapsed =
    status?.daysLeft == null ? 0 : Math.min(AUTH_SPAN_DAYS, Math.max(0, AUTH_SPAN_DAYS - status.daysLeft));

  const tag = down
    ? { label: 'Desconectada', tone: 'danger' as const, icon: Unlink }
    : warn
      ? { label: `Vence em ${status?.daysLeft ?? 0} dias`, tone: 'warn' as const, icon: Clock }
      : { label: 'Conectada', tone: 'ok' as const, icon: Check };

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn(
        'rounded-lg border bg-surface p-6',
        warn ? 'border-dashed border-mostarda/50' : 'border-line',
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <span
          className={cn(
            'inline-flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-surface-2',
            down ? 'text-danger-text' : warn ? 'text-mostarda-text' : 'text-salvia-text',
          )}
        >
          {down ? <Unlink size={22} aria-hidden /> : <Link2 size={22} aria-hidden />}
        </span>
        <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 id={titleId} className="font-display text-h2 font-bold">
              Conexão com a Shopee
            </h2>
            <Tag icon={tag.icon} tone={tag.tone}>
              {tag.label}
            </Tag>
          </div>
          <p className="text-[17px] font-bold">
            {down
              ? 'A conexão caiu'
              : expires
                ? `Conectada até ${expires}`
                : 'Conectada'}
          </p>
          <p className="text-sm text-muted">
            {down
              ? 'Pode ter vencido ou a senha da Shopee foi trocada. Reconecte para voltar a sincronizar. Nada foi perdido.'
              : warn
                ? 'Renove antes de vencer para pedidos, estoque e chat continuarem atualizando. Leva menos de 1 minuto.'
                : 'Tudo certo. A gente avisa 15 dias antes de vencer para você renovar com um toque.'}
          </p>
          {!down ? (
            <TapeProgress
              className="mt-1.5 max-w-[460px]"
              value={elapsed}
              max={AUTH_SPAN_DAYS}
              size="sm"
              tone={warn ? 'warn' : 'ok'}
              aria-label="Prazo da autorização da loja"
              scale={['conectou', 'aviso 15 dias antes', 'vence']}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant={down || warn ? 'primary' : 'outline'}
            icon={RefreshCw}
            disabled={!onRenew || renewing}
            onClick={onRenew}
          >
            {down ? 'Reconectar' : warn ? 'Renovar conexão' : 'Renovar agora'}
          </Button>
          <span className="text-center text-xs text-muted">Abre a Shopee para autorizar</span>
        </div>
      </div>
      <div className="my-4 border-t border-line" />
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Store size={14} aria-hidden />
          Loja: {status?.shopName ?? '—'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock size={14} aria-hidden />
          API oficial · sua senha da Shopee nunca passa por aqui
        </span>
        {lastSyncLabel ? (
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw size={14} aria-hidden />
            Última sincronização: {lastSyncLabel}
          </span>
        ) : null}
      </div>
    </section>
  );
}
