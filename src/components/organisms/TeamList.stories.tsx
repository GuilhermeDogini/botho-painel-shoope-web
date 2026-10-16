import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MessageCircle, Shield, Shirt, Truck, Wallet } from 'lucide-react';
import { TeamList, type TeamListPerson } from './TeamList';

const meta = {
  title: 'Organisms/TeamList',
  component: TeamList,
  parameters: {
    docs: {
      description: {
        component: `
Lista de pessoas da equipe (Avatar, nome, e-mail, Tag de papel, status, convite, Switch).

## Como deve funcionar
- Props-only: a página decide status, pending e o switch.
- Em ~390 px a linha quebra (\`flex-wrap\`); sem scroll horizontal forçado.
- \`isYou\` mostra “(você)”; \`pending\` mostra “Reenviar convite”; \`showSwitch\` controla o acesso.

## Como testar
1. Viewport 390: a lista não empurra a página para o lado.
2. Clique no Switch / Reenviar (story interativa).
3. Tema claro/escuro: tons de status e Tag legíveis.
        `,
      },
    },
  },
} satisfies Meta<typeof TeamList>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASE: TeamListPerson[] = [
  {
    id: 'g',
    name: 'Gisele Botho',
    email: 'gisele@bothobrasil.com.br',
    roleLabel: 'Admin',
    roleIcon: Shield,
    roleTone: 'brand',
    isYou: true,
    status: 'Dona da loja',
    statusTone: 'muted',
  },
  {
    id: 'r',
    name: 'Rafaela Souza',
    email: 'rafaela.souza@gmail.com',
    roleLabel: 'Expedição',
    roleIcon: Truck,
    roleTone: 'info',
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'b',
    name: 'Bruna Lima',
    email: 'brunalima.atende@gmail.com',
    roleLabel: 'Atendimento',
    roleIcon: MessageCircle,
    roleTone: 'ok',
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'c',
    name: 'Camila Rocha',
    email: 'camila.rocha@outlook.com',
    roleLabel: 'Cadastro e estoque',
    roleIcon: Shirt,
    roleTone: 'warn',
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'mm',
    name: 'Márcio Alves',
    email: 'contato@alvescontabil.com.br',
    roleLabel: 'Financeiro',
    roleIcon: Wallet,
    roleTone: 'neutral',
    status: 'Convite enviado 06/10',
    statusTone: 'warn',
    pending: true,
  },
  {
    id: 'j',
    name: 'Jéssica Nunes',
    email: 'jessica.nunes@gmail.com',
    roleLabel: 'Expedição',
    roleIcon: Truck,
    roleTone: 'info',
    status: 'Desativada',
    statusTone: 'danger',
    showSwitch: true,
    active: false,
  },
];

export const Completa: Story = {
  parameters: { controls: { disable: true } },
  render: function Demo() {
    const [active, setActive] = useState<Record<string, boolean>>({
      r: true,
      b: true,
      c: true,
      j: false,
    });

    const people = BASE.map((p) => {
      if (!p.showSwitch) return p;
      const on = active[p.id] ?? p.active ?? false;
      return {
        ...p,
        active: on,
        status: on ? 'Ativa · entrou hoje' : 'Desativada',
        statusTone: (on ? 'muted' : 'danger') as TeamListPerson['statusTone'],
        onActiveChange: (next: boolean) => setActive((prev) => ({ ...prev, [p.id]: next })),
      };
    });

    return (
      <div className="mx-auto max-w-3xl min-w-0">
        <TeamList
          people={people.map((p) =>
            p.pending
              ? { ...p, onResendInvite: () => undefined }
              : p,
          )}
        />
      </div>
    );
  },
};

export const Mobile390: Story = {
  parameters: {
    controls: { disable: true },
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="mx-auto w-[390px] max-w-full min-w-0 overflow-x-hidden border border-dashed border-line p-2">
      <TeamList people={BASE} />
    </div>
  ),
};
