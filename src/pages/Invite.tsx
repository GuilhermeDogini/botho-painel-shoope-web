import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Logo } from '@/components/atoms/Logo';
import { LoginCard } from '@/components/organisms/LoginCard';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { useAcceptInvite } from '@/hooks/useAuth';
import { api, ApiError } from '@/lib/api';

/** Aceitar convite da equipe (SHP-68 + SHP-65): /convite?token=… */
export function InvitePage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token')?.trim() ?? '', [params]);
  const navigate = useNavigate();
  const accept = useAcceptInvite();
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const preview = useQuery({
    queryKey: ['invite', token],
    queryFn: () => api.invitePreview(token),
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) {
    return (
      <AuthLayout moldeLabel="Molde 03 · convite" cutLabel="Equipe">
        <p className="text-center text-sm text-muted">
          Este link está incompleto. Peça um novo convite a quem administra a loja.
        </p>
        <div className="text-center">
          <button type="button" className="bt-l-link" onClick={() => navigate('/login')}>
            Ir para entrar
          </button>
        </div>
      </AuthLayout>
    );
  }

  if (preview.isLoading) {
    return (
      <AuthLayout moldeLabel="Molde 03 · convite" cutLabel="Equipe">
        <p className="text-center text-sm text-muted">Conferindo o convite…</p>
      </AuthLayout>
    );
  }

  if (preview.isError || !preview.data) {
    const msg =
      preview.error instanceof ApiError ? preview.error.message : 'Não foi possível abrir este convite.';
    return (
      <AuthLayout moldeLabel="Molde 03 · convite" cutLabel="Equipe">
        <p className="bt-l-err-msg justify-center text-center" role="alert">
          {msg}
        </p>
        <div className="text-center">
          <button type="button" className="bt-l-link" onClick={() => navigate('/login')}>
            Ir para entrar
          </button>
        </div>
      </AuthLayout>
    );
  }

  const inv = preview.data;

  return (
    <AuthLayout
      moldeLabel="Molde 03 · convite"
      cutLabel="Equipe"
      aside={
        <>
          <Logo size="md" tone="onFabric" className="dark:hidden" />
          <Logo size="md" className="hidden dark:inline-flex" />
          <p className="text-[17px] leading-snug font-medium opacity-95">
            {inv.invitedBy} te chamou para cuidar da loja com a equipe Botho.
          </p>
        </>
      }
    >
      <LoginCard
        mode="convite"
        name={name}
        newPassword={newPassword}
        inviteEmail={inv.email}
        inviteRole={inv.roleLabel}
        invitedBy={inv.invitedBy}
        loading={accept.isPending}
        onNameChange={setName}
        onNewPasswordChange={setNewPassword}
        onSubmit={() => {
          setError(null);
          accept.mutate(
            { token, name, password: newPassword },
            {
              onSuccess: () => navigate('/', { replace: true }),
              onError: (err) => {
                setError(err instanceof ApiError ? err.message : 'Não deu para criar o acesso.');
              },
            },
          );
        }}
        onBackToLogin={() => navigate('/login')}
      />
      {error ? (
        <p className="bt-l-err-msg justify-center text-center" role="alert">
          {error}
        </p>
      ) : null}
    </AuthLayout>
  );
}
