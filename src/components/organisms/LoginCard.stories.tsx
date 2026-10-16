import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { Logo } from '@/components/atoms/Logo';
import { LoginCard, type LoginCardMode } from './LoginCard';

const meta = {
  title: 'Organisms/LoginCard',
  component: LoginCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Cartão de login (SHP-67): gola, campos com pesponto no foco, etiqueta Entrar, estados do design.

## Como testar
1. Digite nos campos; no foco aparece a costura tracejada.
2. Passe o mouse na etiqueta — ela balança.
3. Stories de erro / esqueci / convite.
        `,
      },
    },
  },
} satisfies Meta<typeof LoginCard>;

export default meta;
type Story = StoryObj<typeof LoginCard>;

function Shell({ mode }: { mode: LoginCardMode }) {
  const [email, setEmail] = useState('gisele@bothobrasil.com.br');
  const [password, setPassword] = useState(mode === 'erro' ? 'botho2025' : 'flordebotao');
  const [name, setName] = useState('Rafaela Souza');
  const [newPassword, setNewPassword] = useState('');

  return (
    <AuthLayout
      aside={
        <>
          <Logo size="md" tone="onFabric" className="dark:hidden" />
          <Logo size="md" className="hidden dark:inline-flex" />
          <p className="text-[17px] leading-snug font-medium opacity-95">
            Pedidos, peças e dinheiro da loja na Shopee, num lugar só.
          </p>
        </>
      }
    >
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
        onSubmit={() => undefined}
        onForgotPassword={() => undefined}
        onInvite={() => undefined}
        onBackToLogin={() => undefined}
        onResend={() => undefined}
      />
    </AuthLayout>
  );
}

export const Entrar: Story = { name: 'Entrar', render: () => <Shell mode="entrar" /> };
export const Erro: Story = { name: 'Senha errada', render: () => <Shell mode="erro" /> };
export const Esqueci: Story = { name: 'Esqueci a senha', render: () => <Shell mode="esqueci" /> };
export const Enviado: Story = { name: 'Link enviado', render: () => <Shell mode="enviado" /> };
export const Convite: Story = { name: 'Convite', render: () => <Shell mode="convite" /> };
