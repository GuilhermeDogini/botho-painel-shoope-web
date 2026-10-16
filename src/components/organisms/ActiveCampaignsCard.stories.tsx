import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveCampaignsCard } from './ActiveCampaignsCard';
import { INICIO_CAMPAIGNS } from './inicioFixtures';

const meta = {
  title: 'Organisms/ActiveCampaignsCard',
  component: ActiveCampaignsCard,
  parameters: {
    docs: {
      description: {
        component: `
Campanhas ativas (SHP-73): gasto, vendas e ROAS com status Bom / Atenção / Ruim.

## Como testar
1. Clique em Ver.
2. Confira tags com ícone + texto (nunca só cor).
        `,
      },
    },
  },
} satisfies Meta<typeof ActiveCampaignsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    activeCount: 3,
    campaigns: INICIO_CAMPAIGNS,
    onView: () => undefined,
  },
};

export const Vazio: Story = {
  args: { campaigns: [], onView: () => undefined },
};
