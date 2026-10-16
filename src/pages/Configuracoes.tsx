import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { ConnectionCard } from '@/components/organisms/ConnectionCard';
import { NotificationSettings } from '@/components/organisms/NotificationSettings';
import { StoreDataCard } from '@/components/organisms/StoreDataCard';
import { ListPage } from '@/components/templates/ListPage';
import { useConnection, useStartConnection, useSyncStatus } from '@/hooks/useConnection';
import { useNotificationPrefs, useShopProfile, useUpdateNotificationPref, useUpdateShopProfile } from '@/hooks/useConfig';
import { useTheme } from '@/hooks/useTheme';
import { ApiError, api } from '@/lib/api';
import type { NotificationPrefView } from '@/lib/types';
import { applyTheme, type ThemePreference } from '@/lib/theme';

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'auto', label: 'Automático' },
] as const;

async function showTestPush(item: NotificationPrefView) {
  if (!item.push || item.kind !== 'SHIP_DEADLINE') return;
  if (typeof Notification === 'undefined') return;
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  if (permission !== 'granted') {
    toast.message('O celular bloqueou o aviso. Ative as notificações do navegador para testar.');
    return;
  }
  const payload = await api.testNotification(item.kind);
  new Notification(payload.title, { body: payload.body });
}

/**
 * Configurações: conexão, notificações, tema e dados da loja (SHP-126).
 * Só abre com `config.gerir`.
 */
export function ConfiguracoesPage() {
  const connectionQ = useConnection();
  const syncQ = useSyncStatus();
  const shopQ = useShopProfile();
  const notifQ = useNotificationPrefs();
  const renew = useStartConnection();
  const saveShop = useUpdateShopProfile();
  const saveNotif = useUpdateNotificationPref();
  const theme = useTheme();

  const error = connectionQ.error ?? shopQ.error ?? notifQ.error;
  const lastSync = syncQ.data?.find((s) => s.lastSuccessAt)?.lastSuccessAt;
  const lastSyncLabel = lastSync
    ? new Date(lastSync).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
    : null;

  async function onNotification(next: NotificationPrefView) {
    const turnedPushOn = next.push && !notifQ.data?.find((n) => n.kind === next.kind)?.push;
    try {
      await saveNotif.mutateAsync({ kind: next.kind, push: next.push, email: next.email });
      if (turnedPushOn) await showTestPush(next);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível salvar a notificação');
    }
  }

  return (
    <ListPage title="Configurações" className="mx-auto max-w-[920px]">
      {error ? (
        <InlineAlert tone="danger">
          {error instanceof ApiError ? error.message : 'Não foi possível carregar as configurações.'}
        </InlineAlert>
      ) : null}

      <ConnectionCard
        status={connectionQ.data ?? null}
        lastSyncLabel={lastSyncLabel}
        renewing={renew.isPending}
        onRenew={() => renew.mutate()}
      />

      <NotificationSettings
        items={notifQ.data ?? []}
        disabled={saveNotif.isPending}
        onChange={(next) => void onNotification(next)}
      />

      <section aria-labelledby="appearance-title" className="rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="appearance-title" className="font-display text-h2 font-bold">
              Aparência
            </h2>
            <p className="text-sm text-muted">O tema muda só para você.</p>
          </div>
          <SegmentedControl
            aria-label="Tema"
            value={theme.preference}
            onValueChange={(value) => {
              const next = value as ThemePreference;
              applyTheme(next);
              theme.setPreference(next);
            }}
            options={[...THEME_OPTIONS]}
          />
        </div>
      </section>

      <StoreDataCard
        profile={shopQ.data ?? null}
        saving={saveShop.isPending}
        onSave={async (next) => {
          try {
            await saveShop.mutateAsync(next);
            toast.success('Dados da loja salvos');
          } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Não foi possível salvar');
            throw err;
          }
        }}
      />
    </ListPage>
  );
}
