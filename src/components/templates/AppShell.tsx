import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import type { ResolvedNavItem } from '@/app/nav';
import { Avatar } from '@/components/atoms/Avatar';
import { IconButton } from '@/components/atoms/IconButton';
import { Logo } from '@/components/atoms/Logo';
import { NavItem, NavList } from '@/components/molecules/NavItem';
import { cn } from '@/lib/utils';

export interface AppShellUser {
  name: string;
  roleLabel: string;
}

export interface AppShellProps {
  user: AppShellUser | undefined;
  /** Itens da lateral (já filtrados por papel / ready). */
  sideItems: ReadonlyArray<ResolvedNavItem>;
  /** Até 5 abas da barra inferior (inclui “Mais” se houver overflow). */
  bottomItems: ReadonlyArray<ResolvedNavItem>;
  onLogout: () => void;
  /** Faixa global (conexão), acima do conteúdo em todas as telas. */
  banner?: ReactNode;
  /**
   * O conteúdo ocupa a altura da janela (lista + conversa).
   * As outras telas continuam rolando a página.
   */
  fill?: boolean;
  children: ReactNode;
  /**
   * Prévia (Vitrine/Storybook sem router aninhado): controla a rota ativa
   * e troca de item via callback em vez de `NavLink`.
   */
  previewPath?: string;
  onPreviewNavigate?: (to: string) => void;
}

function pathActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

type ShellViewProps = Omit<AppShellProps, 'previewPath'> & {
  pathname: string;
  preview: boolean;
};

function AppShellView({
  user,
  sideItems,
  bottomItems,
  onLogout,
  banner,
  children,
  pathname,
  preview,
  onPreviewNavigate,
  fill = false,
}: ShellViewProps) {
  const bottomCols = Math.max(1, Math.min(5, bottomItems.length));

  return (
    <div className={cn('flex min-h-dvh flex-col bg-bg md:flex-row', fill && 'h-dvh overflow-hidden')}>
      <aside className="sticky top-0 hidden h-dvh w-[252px] shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex min-h-0 flex-1 flex-col gap-0.5 px-3.5 py-5">
          {preview ? (
            <button
              type="button"
              className="mb-3 inline-flex min-h-11 cursor-pointer items-center rounded-sm border-0 bg-transparent px-1"
              aria-label="Botho Brasil, início"
              onClick={() => onPreviewNavigate?.('/')}
            >
              <Logo size="sm" />
            </button>
          ) : (
            <NavLink
              to="/"
              className="mb-3 inline-flex min-h-11 items-center rounded-sm px-1 no-underline"
              aria-label="Botho Brasil, início"
            >
              <Logo size="sm" />
            </NavLink>
          )}

          <NavList variant="side" aria-label="Menu principal" className="min-h-0 flex-1 overflow-y-auto">
            {sideItems.map((item) =>
              preview ? (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  variant="side"
                  active={pathActive(pathname, item.to)}
                  count={item.count}
                  className={item.sepBefore ? 'mt-2 border-t border-line pt-2' : undefined}
                  onClick={() => onPreviewNavigate?.(item.to)}
                >
                  {item.label}
                </NavItem>
              ) : (
                <NavItem
                  key={item.id}
                  asChild
                  icon={item.icon}
                  variant="side"
                  active={pathActive(pathname, item.to)}
                  count={item.count}
                  className={item.sepBefore ? 'mt-2 border-t border-line pt-2' : undefined}
                >
                  <NavLink to={item.to} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                </NavItem>
              ),
            )}
          </NavList>

          <div className="mt-auto flex items-center gap-2.5 border-t border-line pt-3">
            <Avatar name={user?.name ?? '?'} size="md" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">{user?.name ?? '—'}</div>
              <div className="truncate text-xs text-muted">{user?.roleLabel ?? ''}</div>
            </div>
            <IconButton icon={LogOut} label="Sair" onClick={onLogout} />
          </div>
        </div>
      </aside>

      <div className={cn('flex min-h-0 min-w-0 flex-1 flex-col', fill && 'overflow-hidden')}>
        {banner ? <div className="sticky top-0 z-30">{banner}</div> : null}

        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur md:hidden">
          {preview ? (
            <button
              type="button"
              className="inline-flex cursor-pointer items-center border-0 bg-transparent p-0"
              aria-label="Botho Brasil, início"
              onClick={() => onPreviewNavigate?.('/')}
            >
              <Logo size="sm" />
            </button>
          ) : (
            <NavLink to="/" className="inline-flex items-center no-underline" aria-label="Botho Brasil, início">
              <Logo size="sm" />
            </NavLink>
          )}
          <IconButton icon={LogOut} label="Sair" onClick={onLogout} />
        </header>

        <main
          className={cn(
            'mx-auto flex w-full min-h-0 flex-1 flex-col',
            fill
              ? 'max-w-none overflow-hidden'
              : 'max-w-[1440px] px-4 pt-5 md:px-8 md:pt-6',
            !fill && (bottomItems.length > 0 ? 'pb-28 md:pb-12' : 'pb-12'),
            fill && bottomItems.length > 0 && 'pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0',
          )}
        >
          {children}
        </main>

        {bottomItems.length > 0 ? (
          <div
            className={cn(
              'z-30 border-t border-line bg-surface md:hidden',
              preview ? 'sticky bottom-0' : 'pb-safe fixed inset-x-0 bottom-0',
            )}
          >
            <NavList
              variant="bottom"
              aria-label="Menu principal"
              className="px-1 pt-0.5"
              style={{ gridTemplateColumns: `repeat(${bottomCols}, minmax(0, 1fr))` }}
            >
              {bottomItems.map((item) => {
                const active =
                  item.id === 'mais'
                    ? pathname === '/mais' ||
                      !bottomItems.some((t) => t.id !== 'mais' && pathActive(pathname, t.to))
                    : pathActive(pathname, item.to);
                return preview ? (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    variant="bottom"
                    active={active}
                    count={item.count}
                    onClick={() => onPreviewNavigate?.(item.to)}
                  >
                    {item.label}
                  </NavItem>
                ) : (
                  <NavItem
                    key={item.id}
                    asChild
                    icon={item.icon}
                    variant="bottom"
                    active={active}
                    count={item.count}
                  >
                    <NavLink to={item.to} end={item.to === '/' || item.to === '/mais'}>
                      {item.label}
                    </NavLink>
                  </NavItem>
                );
              })}
            </NavList>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AppShellLive(props: Omit<AppShellProps, 'previewPath' | 'onPreviewNavigate'>) {
  const { pathname } = useLocation();
  return <AppShellView {...props} pathname={pathname} preview={false} />;
}

/**
 * Moldura das telas logadas (SHP-61):
 * lateral no desktop; TopBar + BottomNav (≤5) no celular; faixa global no topo.
 */
export function AppShell(props: AppShellProps) {
  if (props.previewPath !== undefined) {
    const { previewPath, ...rest } = props;
    return <AppShellView {...rest} pathname={previewPath} preview />;
  }
  return <AppShellLive {...props} />;
}
