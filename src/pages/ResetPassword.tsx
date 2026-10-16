import { ChevronRight } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { LabelLogo } from '@/components/atoms/LabelLogo';
import { Logo } from '@/components/atoms/Logo';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { useResetPassword } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api';

/** Criar nova senha a partir do link do e-mail (SHP-68 + SHP-64). */
export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token')?.trim() ?? '', [params]);
  const reset = useResetPassword();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!token) {
      setLocalError('Este link está incompleto. Peça um novo em “Esqueci a senha”.');
      return;
    }
    if (password.length < 8) {
      setLocalError('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setLocalError('As senhas não são iguais.');
      return;
    }
    reset.mutate(
      { token, password },
      {
        onSuccess: () => navigate('/login', { replace: true, state: { resetOk: true } }),
        onError: (err) => {
          setLocalError(err instanceof ApiError ? err.message : 'Não deu para trocar a senha. Tente de novo.');
        },
      },
    );
  };

  return (
    <AuthLayout
      moldeLabel="Molde 02 · senha"
      aside={
        <>
          <Logo size="md" tone="onFabric" className="dark:hidden" />
          <Logo size="md" className="hidden dark:inline-flex" />
          <p className="text-[17px] leading-snug font-medium opacity-95">
            Escolha uma senha nova. Os outros aparelhos saem da conta por segurança.
          </p>
        </>
      }
    >
      <div className="flex justify-center pt-1.5">
        <LabelLogo size="md" word="botho brasil" subtitle="feito com carinho no Brasil" />
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <header className="text-center">
          <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-[-0.02em]">
            Criar uma senha nova
          </h1>
          <p className="bt-l-muted mt-1.5 text-[15px]">Mínimo de 8 caracteres. O link vale por 1 hora.</p>
        </header>
        <div>
          <label className="bt-l-label" htmlFor="np-senha">
            Nova senha
          </label>
          <div className="bt-lfield">
            <input
              id="np-senha"
              className="bt-lfield-input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </div>
        <div>
          <label className="bt-l-label" htmlFor="np-confirma">
            Confirmar senha
          </label>
          <div className="bt-lfield">
            <input
              id="np-confirma"
              className="bt-lfield-input"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </div>
        {localError ? (
          <p className="bt-l-err-msg" role="alert">
            {localError}
          </p>
        ) : null}
        <div className="bt-tagwrap">
          <button type="submit" className="bt-tagbtn" disabled={reset.isPending} aria-busy={reset.isPending || undefined}>
            {reset.isPending ? 'Aguarde…' : 'Salvar senha'}
            {!reset.isPending ? <ChevronRight size={20} strokeWidth={2} aria-hidden /> : null}
          </button>
        </div>
        <div className="text-center">
          <Link to="/login" className="bt-l-link">
            Voltar para entrar
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
