import { Outlet, useMatch, useOutletContext } from 'react-router';
import { resolveNav, type ResolvedNavItem } from '@/app/nav';
import { GlobalConnectionBanner } from '@/components/organisms/GlobalConnectionBanner';
import { AppShell } from '@/components/templates/AppShell';
import { useLogout, useMe } from '@/hooks/useAuth';
import { useConnection, useStartConnection } from '@/hooks/useConnection';
import type { Role } from '@/lib/types';

export type ShellOutletContext = {
  moreItems: ReadonlyArray<ResolvedNavItem>;
  onLogout: () => void;
};

export function useShellOutlet(): ShellOutletContext {
  return useOutletContext<ShellOutletContext>();
}

/** Rota-moldura: busca pessoa/conexão e monta o AppShell com menu por papel. */
export function ShellRoute() {
  const { data: me } = useMe();
  const connection = useConnection();
  const connect = useStartConnection();
  const logout = useLogout();

  const fill = useMatch('/conversas') != null;
  const role = (me?.role ?? 'admin') as Role;
  const permissions = me?.permissions ?? [];
  const { side, bottom, more } = resolveNav(role, permissions);
  const onLogout = () => logout.mutate();

  const c = connection.data;
  const showBanner = Boolean(c?.needsReauth || (c && !c.connected));
  const bannerMessage = c?.needsReauth
    ? 'A conexão com a Shopee caiu. Pedidos, estoque e chat pararam de atualizar.'
    : 'Sua loja ainda não está conectada à Shopee.';

  return (
    <AppShell
      user={me}
      sideItems={side}
      bottomItems={bottom}
      onLogout={onLogout}
      fill={fill}
      banner={
        <GlobalConnectionBanner
          visible={showBanner}
          action={
            <button type="button" onClick={() => connect.mutate()} disabled={connect.isPending}>
              {connect.isPending ? 'Abrindo…' : 'Reconectar agora'}
            </button>
          }
        >
          {bannerMessage}
        </GlobalConnectionBanner>
      }
    >
      <Outlet context={{ moreItems: more, onLogout } satisfies ShellOutletContext} />
    </AppShell>
  );
}
