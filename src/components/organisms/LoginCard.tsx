import { AlertTriangle, ChevronRight, Eye, EyeOff, Lock } from 'lucide-react';
import { type FormEvent, type HTMLAttributes, useId, useState } from 'react';
import { LabelLogo } from '@/components/atoms/LabelLogo';
import { cn } from '@/lib/utils';

export type LoginCardMode = 'entrar' | 'erro' | 'esqueci' | 'enviado' | 'convite';

export interface LoginCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  mode?: LoginCardMode;
  email?: string;
  password?: string;
  name?: string;
  newPassword?: string;
  /** E-mail mascarado na tela "link enviado". */
  sentTo?: string;
  /** Papel do convite (ex.: Expedição). */
  inviteRole?: string;
  /** Quem convidou. */
  invitedBy?: string;
  /** E-mail do convite (somente leitura). */
  inviteEmail?: string;
  loading?: boolean;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onNameChange?: (value: string) => void;
  onNewPasswordChange?: (value: string) => void;
  onSubmit?: () => void;
  onForgotPassword?: () => void;
  onInvite?: () => void;
  onBackToLogin?: () => void;
  onResend?: () => void;
}

/**
 * Cartão de login Botho (Login.dc.html): gola, campos com pesponto no foco,
 * botão etiqueta e estados entrar / erro / esqueci / enviado / convite.
 */
export function LoginCard({
  mode = 'entrar',
  email = '',
  password = '',
  name = '',
  newPassword = '',
  sentTo = 'gi•••••@bothobrasil.com.br',
  inviteRole = 'Expedição',
  invitedBy = 'Gisele',
  inviteEmail = 'rafaela.souza@gmail.com',
  loading = false,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onNewPasswordChange,
  onSubmit,
  onForgotPassword,
  onInvite,
  onBackToLogin,
  onResend,
  className,
  ...rest
}: LoginCardProps) {
  const uid = useId();
  const [showPass, setShowPass] = useState(false);
  const hasErr = mode === 'erro';
  const view = hasErr ? 'entrar' : mode;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div {...rest} className={cn('flex flex-col gap-[18px]', className)}>
      <div className="flex justify-center pt-1.5">
        <LabelLogo size="md" word="botho brasil" subtitle="feito com carinho no Brasil" />
      </div>

      {view === 'entrar' ? (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <header className="text-center">
            <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-[-0.02em]">
              Que bom te ver de novo
            </h1>
            <p className="bt-l-muted mt-1.5 text-[15px]">Entre para cuidar dos pedidos de hoje.</p>
          </header>

          <div>
            <label className="bt-l-label" htmlFor={`${uid}-email`}>
              E-mail
            </label>
            <div className="bt-lfield">
              <input
                id={`${uid}-email`}
                className="bt-lfield-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => onEmailChange?.(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="bt-l-label" htmlFor={`${uid}-senha`}>
              Senha
            </label>
            <div className={cn('bt-lfield', hasErr && 'is-err')}>
              <div className="relative flex items-center">
                <input
                  id={`${uid}-senha`}
                  className="bt-lfield-input pr-[52px]"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => onPasswordChange?.(e.target.value)}
                  aria-invalid={hasErr || undefined}
                  aria-describedby={hasErr ? `${uid}-erro` : undefined}
                  required
                />
                <button
                  type="button"
                  className="absolute right-0.5 inline-flex size-11 items-center justify-center rounded-sm text-muted hover:bg-surface-2"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPass ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
                </button>
              </div>
              {hasErr ? (
                <>
                  <div className="bt-lfield-err-box" aria-hidden />
                  <svg className="bt-lfield-fray" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden>
                    <path d="M2 3 L60 3 Q66 4 70 2 L118 3 Q124 7 120 11 M126 3 L186 3 Q190 6 196 4 Q200 10 194 14 M204 3 L298 3" />
                    <path d="M120 11 q-3 3 -8 2 M194 14 q4 1 7 -2" opacity={0.7} />
                  </svg>
                </>
              ) : null}
            </div>
            {hasErr ? (
              <p id={`${uid}-erro`} className="bt-l-err-msg" role="alert">
                <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
                <span>A senha não confere. Confira o Caps Lock ou use “Esqueci a senha”.</span>
              </p>
            ) : null}
          </div>

          <div className="-mt-2 flex justify-end">
            <button type="button" className="bt-l-link" onClick={onForgotPassword}>
              Esqueci a senha
            </button>
          </div>

          <TagSubmit loading={loading}>Entrar</TagSubmit>

          <p className="bt-l-muted text-center text-sm">
            Primeira vez aqui?{' '}
            <button type="button" className="bt-l-link" onClick={onInvite}>
              Usar convite da equipe
            </button>
          </p>
        </form>
      ) : null}

      {view === 'esqueci' ? (
        <form onSubmit={submit} className="flex flex-col gap-[18px]">
          <header className="text-center">
            <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-[-0.02em]">
              Esqueceu a senha? Acontece.
            </h1>
            <p className="bt-l-muted mt-1.5 text-[15px]">
              Digite seu e-mail. Mandamos um link para você criar uma senha nova.
            </p>
          </header>
          <div>
            <label className="bt-l-label" htmlFor={`${uid}-email2`}>
              E-mail
            </label>
            <div className="bt-lfield">
              <input
                id={`${uid}-email2`}
                className="bt-lfield-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => onEmailChange?.(e.target.value)}
                required
              />
            </div>
          </div>
          <TagSubmit loading={loading}>Enviar link</TagSubmit>
          <div className="text-center">
            <button type="button" className="bt-l-link" onClick={onBackToLogin}>
              Voltar para entrar
            </button>
          </div>
        </form>
      ) : null}

      {view === 'enviado' ? (
        <div className="flex flex-col items-center gap-[18px] text-center">
          <svg viewBox="0 0 80 60" width={96} height={72} aria-hidden>
            <rect x={6} y={10} width={68} height={44} rx={6} fill="none" stroke="var(--bt-brand)" strokeWidth={2} />
            <path d="M8 13 L40 36 L72 13" fill="none" stroke="var(--bt-brand)" strokeWidth={2} />
            <path d="M14 50 H66" stroke="var(--bt-mostarda)" strokeWidth={2} strokeDasharray="4 3" />
          </svg>
          <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-[-0.02em]">Link enviado!</h1>
          <p className="bt-l-muted text-[15px]">
            Mandamos para <b>{sentTo}</b>. Confira a caixa de entrada e o spam. O link vale por 1 hora.
          </p>
          <button
            type="button"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-brand bg-brand font-semibold text-brand-ink hover:bg-brand-hover"
            onClick={onBackToLogin}
          >
            Voltar para entrar
          </button>
          <button type="button" className="bt-l-link" onClick={onResend}>
            Não chegou? Enviar de novo
          </button>
        </div>
      ) : null}

      {view === 'convite' ? (
        <form onSubmit={submit} className="flex flex-col gap-3.5">
          <header className="text-center">
            <h1 className="font-display text-2xl leading-[1.15] font-bold tracking-[-0.02em]">
              Bem-vinda à equipe!
            </h1>
            <p className="bt-l-muted mt-1.5 text-[15px]">
              A {invitedBy} te convidou como{' '}
              <span className="inline-flex align-middle items-center gap-1 rounded-full bg-anil-soft px-2 py-0.5 text-xs font-bold text-anil-text">
                {inviteRole}
              </span>
            </p>
          </header>
          <div>
            <label className="bt-l-label" htmlFor={`${uid}-nome`}>
              Seu nome
            </label>
            <div className="bt-lfield">
              <input
                id={`${uid}-nome`}
                className="bt-lfield-input"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => onNameChange?.(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="bt-l-label" htmlFor={`${uid}-cv-email`}>
              E-mail do convite
            </label>
            <div className="relative flex items-center">
              <Lock size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 text-muted" aria-hidden />
              <input
                id={`${uid}-cv-email`}
                className="bt-lfield-input border-dashed bg-transparent pl-10"
                type="email"
                value={inviteEmail}
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="bt-l-label" htmlFor={`${uid}-nova`}>
              Crie uma senha
            </label>
            <div className="bt-lfield">
              <input
                id={`${uid}-nova`}
                className="bt-lfield-input"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => onNewPasswordChange?.(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <p className="bt-l-muted mt-1.5 text-[13px]">Mínimo de 8 caracteres. Convite válido até 15/10.</p>
          </div>
          <TagSubmit loading={loading}>Criar meu acesso</TagSubmit>
          <div className="text-center">
            <button type="button" className="bt-l-link" onClick={onBackToLogin}>
              Já tenho conta
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function TagSubmit({ children, loading }: { children: string; loading?: boolean }) {
  return (
    <div className="bt-tagwrap">
      <svg className="bt-tag-cord" viewBox="0 0 62 40" aria-hidden>
        <path d="M52 30 C 36 30, 30 6, 4 4" />
        <path d="M52 30 C 40 34, 22 28, 2 14" opacity={0.7} />
      </svg>
      <button type="submit" className="bt-tagbtn" disabled={loading} aria-busy={loading || undefined}>
        {loading ? 'Aguarde…' : children}
        {!loading ? <ChevronRight size={20} strokeWidth={2} aria-hidden /> : null}
      </button>
    </div>
  );
}
