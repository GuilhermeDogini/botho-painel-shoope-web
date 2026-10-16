import { AlertTriangle } from 'lucide-react';
import { day } from '@/lib/format';
import type { ConnectionStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * LEGADO (substituído pela faixa global da SHP-60). Aviso em todas as telas quando a conexão
 * está para vencer ou já caiu. Na tela inicial o cartão da conexão já mostra isso.
 */
export function ConnectionBanner({ connection: c, isHome, onConnect, connecting }: { connection: ConnectionStatus | undefined; isHome: boolean; onConnect: () => void; connecting: boolean }) {
  if (!c || isHome) return null;

  if (!c.connected && !c.needsReauth) {
    return <Banner tone="warn" text="Sua loja ainda não está conectada à Shopee." action="Conectar" onAction={onConnect} loading={connecting} />;
  }
  if (!c.warn) return null;
  return c.needsReauth ? (
    <Banner tone="danger" text="A conexão com a Shopee caiu. Reconecte para continuar." action="Reconectar" onAction={onConnect} loading={connecting} />
  ) : (
    <Banner
      tone="warn"
      text={`A conexão com a Shopee vence em ${c.daysLeft} dia(s) (${day(c.authExpiresAt)}). Leva 30 segundos para renovar.`}
      action="Renovar agora"
      onAction={onConnect}
      loading={connecting}
    />
  );
}

function Banner({ tone, text, action, onAction, loading }: { tone: 'warn' | 'danger'; text: string; action: string; onAction: () => void; loading: boolean }) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 text-sm', tone === 'danger' ? 'bg-danger-soft text-danger-text' : 'bg-mostarda-soft text-mostarda-text')}>
      <AlertTriangle className="size-5 shrink-0" strokeWidth={1.75} />
      <span className="min-w-0 flex-1 font-medium">{text}</span>
      <button onClick={onAction} disabled={loading} className="min-h-9 rounded-lg bg-surface/70 px-3 font-semibold disabled:opacity-60">
        {loading ? 'Abrindo…' : action}
      </button>
    </div>
  );
}
