import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Logo } from '@/components/atoms/Logo';
import { LoginCard, type LoginCardMode } from '@/components/organisms/LoginCard';
import { AuthLayout } from './AuthLayout';

const meta = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Template de autenticação (SHP-62): tecido Botho + cartão molde com costura.

## Como deve funcionar
- Fundo framboesa + estampa no claro; noite no escuro.
- Ao abrir, a agulha costura o pesponto em ~1,2 s (reduced-motion: só o traçado final).
- Campos digitáveis; no foco, pesponto tracejado; botão etiqueta Entrar clicável.
- Mesmo casco para login, esqueci a senha e convite.

## Como testar
1. Digite e-mail e senha; clique em **Entrar** (feedback na story).
2. **Esqueci a senha** / **Usar convite** mudam o miolo.
3. Viewport ~390 e 1440; toolbar Tema.
        `,
      },
    },
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof AuthLayout>;

const Aside = (
  <>
    <Logo size="md" tone="onFabric" className="dark:hidden" />
    <Logo size="md" className="hidden dark:inline-flex" />
    <p className="text-[17px] leading-snug font-medium opacity-95">
      Pedidos, peças e dinheiro da loja na Shopee, num lugar só.
    </p>
  </>
);

function LoginDemo({ initialMode = 'entrar' as LoginCardMode }) {
  const [mode, setMode] = useState<LoginCardMode>(initialMode);
  const [email, setEmail] = useState('gisele@bothobrasil.com.br');
  const [password, setPassword] = useState('flordebotao');
  const [name, setName] = useState('Rafaela Souza');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const moldeLabel =
    mode === 'esqueci' || mode === 'enviado'
      ? 'Molde 02 · senha'
      : mode === 'convite'
        ? 'Molde 03 · convite'
        : 'Molde 01 · entrada';

  return (
    <AuthLayout aside={Aside} moldeLabel={moldeLabel} cutLabel={mode === 'convite' ? 'Equipe' : 'Corte 1×'}>
      <LoginCard
        mode={mode}
        email={email}
        password={password}
        name={name}
        newPassword={newPassword}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onNameChange={setName}
        onNewPasswordChange={setNewPassword}
        onSubmit={() => {
          if (mode === 'entrar' || mode === 'erro') {
            setFeedback(`Entrar com ${email}`);
            setMode(password === 'errada' ? 'erro' : 'entrar');
          } else if (mode === 'esqueci') {
            setMode('enviado');
            setFeedback('Link enviado');
          } else if (mode === 'convite') {
            setFeedback(`Acesso criado para ${name}`);
          }
        }}
        onForgotPassword={() => {
          setMode('esqueci');
          setFeedback('');
        }}
        onInvite={() => {
          setMode('convite');
          setFeedback('');
        }}
        onBackToLogin={() => {
          setMode('entrar');
          setFeedback('');
        }}
        onResend={() => setFeedback('Link reenviado')}
      />
      {feedback ? (
        <p className="text-center text-sm font-semibold text-brand-text" role="status">
          {feedback}
        </p>
      ) : null}
    </AuthLayout>
  );
}

export const Login: Story = {
  name: 'Login',
  render: () => <LoginDemo />,
};

export const SenhaErrada: Story = {
  name: 'Senha errada',
  render: () => <LoginDemo initialMode="erro" />,
};

export const EsqueciSenha: Story = {
  name: 'Esqueci a senha',
  render: () => <LoginDemo initialMode="esqueci" />,
};

export const Convite: Story = {
  name: 'Convite',
  render: () => <LoginDemo initialMode="convite" />,
};
