import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell } from 'lucide-react';
import { HomeGreeting } from './HomeGreeting';
import { INICIO_ADMIN_SHORTCUTS, INICIO_EXP_PILLS } from './inicioFixtures';

const meta = {
  title: 'Organisms/HomeGreeting',
  component: HomeGreeting,
  parameters: {
    docs: {
      description: {
        component: `
Saudação do Início (SHP-73): data, título, subtítulo e atalhos (admin) ou pílulas (Expedição).

## Como testar
1. Viewport 390: sem scroll horizontal; faixa de estampa no topo.
2. Clique nos atalhos (story Admin).
3. Tema claro/escuro.
        `,
      },
    },
  },
} satisfies Meta<typeof HomeGreeting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: {
    dateLabel: 'Quinta, 08/10',
    name: 'Gisele',
    subtitle: 'Você tem 6 pedidos para enviar hoje. Os 2 primeiros vencem às 18h.',
    shortcuts: INICIO_ADMIN_SHORTCUTS.map((s) => ({ ...s, onClick: () => undefined })),
    headerActions: (
      <button type="button" className="inline-flex size-11 items-center justify-center rounded-sm text-ink-2 hover:bg-surface-2" aria-label="Notificações">
        <Bell size={20} strokeWidth={1.75} />
      </button>
    ),
  },
};

export const Expedicao: Story = {
  name: 'Expedição',
  args: {
    dateLabel: 'Quinta, 08/10',
    name: 'Rafaela',
    subtitle: 'Hoje tem 6 pedidos para separar e embalar. Comece pelos 2 que vencem às 18h.',
    pills: INICIO_EXP_PILLS,
  },
};
