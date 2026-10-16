import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Logo } from '@/components/atoms/Logo';
import { LoginCard, type LoginCardMode } from '@/components/organisms/LoginCard';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { useForgotPassword, useLogin } from '@/hooks/useAuth';
import { maskEmail } from '@/lib/maskEmail';

/**
 * Entrar / erro / esqueci a senha (SHP-68).
 * Convite com token: /convite?token=… · Nova senha: /redefinir-senha?token=…
 */
export function LoginPage() {
  const login = useLogin();
  const forgot = useForgotPassword();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const resetOk = Boolean((location.state as { resetOk?: boolean } | null)?.resetOk);
  const [mode, setMode] = useState<LoginCardMode>('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteHint, setInviteHint] = useState(false);

  const viewMode: LoginCardMode = mode === 'entrar' && login.isError ? 'erro' : mode;

  const moldeLabel =
    mode === 'esqueci' || mode === 'enviado' ? 'Molde 02 · senha' : 'Molde 01 · entrada';

  return (
    <AuthLayout
      moldeLabel={moldeLabel}
      aside={
        <>
          <Logo size="md" tone="onFabric" className="dark:hidden" />
          <Logo size="md" className="hidden dark:inline-flex" />
          <p className="text-[17px] leading-snug font-medium opacity-95">
            Pedidos, peças e dinheiro da loja na Shopee, num lugar só — com cara de Botho.
          </p>
        </>
      }
    >
      <LoginCard
        mode={viewMode}
        email={email}
        password={password}
        sentTo={maskEmail(email)}
        loading={login.isPending || forgot.isPending}
        onEmailChange={setEmail}
        onPasswordChange={(v) => {
          setPassword(v);
          if (login.isError) login.reset();
        }}
        onSubmit={() => {
          if (mode === 'entrar' || mode === 'erro') {
            login.mutate(
              { email, password },
              { onSuccess: () => navigate(from, { replace: true }) },
            );
            return;
          }
          if (mode === 'esqueci') {
            forgot.mutate(email, {
              onSuccess: () => setMode('enviado'),
              // Mesma UX se o e-mail não existir: o back sempre responde 204.
              onError: () => setMode('enviado'),
            });
          }
        }}
        onForgotPassword={() => {
          login.reset();
          setInviteHint(false);
          setMode('esqueci');
        }}
        onInvite={() => {
          setInviteHint(true);
          setMode('entrar');
        }}
        onBackToLogin={() => {
          login.reset();
          forgot.reset();
          setInviteHint(false);
          setMode('entrar');
        }}
        onResend={() => {
          if (!email.trim()) {
            setMode('esqueci');
            return;
          }
          forgot.mutate(email, { onSuccess: () => setMode('enviado'), onError: () => setMode('enviado') });
        }}
      />
      {resetOk ? (
        <p className="text-center text-sm font-semibold text-salvia-text" role="status">
          Senha nova salva. Entre com ela.
        </p>
      ) : null}
      {inviteHint ? (
        <p className="text-center text-sm text-muted" role="status">
          Abra o link do e-mail de convite para criar seu acesso. Se não recebeu, peça um novo à Admin.
        </p>
      ) : null}
    </AuthLayout>
  );
}
