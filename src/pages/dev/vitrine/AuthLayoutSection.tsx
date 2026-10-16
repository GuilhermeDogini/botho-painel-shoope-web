import { useState } from 'react';
import { Logo } from '@/components/atoms/Logo';
import { LoginCard } from '@/components/organisms/LoginCard';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function AuthLayoutSection() {
  const [email, setEmail] = useState('gisele@bothobrasil.com.br');
  const [password, setPassword] = useState('flordebotao');
  const [msg, setMsg] = useState('');

  return (
    <VitrineSection
      id="auth"
      task="SHP-62"
      title="AuthLayout + LoginCard"
      note="Tecido + molde com costura animada; campos digitáveis e etiqueta Entrar. Confira claro/escuro e 390 px."
    >
      <VitrineGroup label="Login (interativo)">
        <div className="overflow-hidden rounded-lg border border-line">
          <AuthLayout
            className="min-h-[640px] py-10"
            footer={null}
            aside={
              <>
                <Logo size="md" tone="onFabric" className="dark:hidden" />
                <Logo size="md" className="hidden dark:inline-flex" />
                <p className="text-[15px] leading-snug font-medium opacity-95">
                  Pedidos, peças e dinheiro da loja na Shopee, num lugar só.
                </p>
              </>
            }
          >
            <LoginCard
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={() => setMsg(`Entrar: ${email}`)}
              onForgotPassword={() => setMsg('Esqueci a senha')}
              onInvite={() => setMsg('Convite')}
            />
            {msg ? <p className="text-center text-sm font-semibold text-brand-text">{msg}</p> : null}
          </AuthLayout>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
