import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Spinner } from '@/components/atoms/Spinner';
import { useCan, useMe } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api';
import type { Permission } from '@/lib/types';

function FullScreenSpinner({ label }: { label: string }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-4">
      <Spinner layout="stack" label={label} />
    </div>
  );
}

/** Só entra logado. Sem sessão, vai para o login e volta para onde estava depois. */
export function RequireAuth() {
  const me = useMe();
  const location = useLocation();
  if (me.isPending) return <FullScreenSpinner label="Abrindo…" />;
  if (me.error instanceof ApiError && me.error.status === 401) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (me.isError) return <div className="p-6 text-center text-sm text-danger">{me.error.message}</div>;
  return <Outlet />;
}

/** Tela de login: quem já está logado vai direto para o painel. */
export function PublicOnly({ children }: { children: ReactNode }) {
  const me = useMe();
  if (me.isPending) return <FullScreenSpinner label="Abrindo…" />;
  if (me.data) return <Navigate to="/" replace />;
  return children;
}

/** Rota que exige permissão. Sem ela, volta para o Início (o menu nem mostra o item). */
export function RequirePermission({ permission, children }: { permission: Permission; children: ReactNode }) {
  const can = useCan(permission);
  if (!can) return <Navigate to="/" replace />;
  return children;
}
