import type { Meta, StoryObj } from '@storybook/react-vite';
import { LowStockCard } from './LowStockCard';
import { INICIO_STOCK } from './inicioFixtures';

const meta = {
  title: 'Organisms/LowStockCard',
  component: LowStockCard,
  parameters: {
    docs: {
      description: {
        component: `
Estoque acabando (SHP-73): top variações com poucas unidades.

## Como testar
1. Clique em Repor.
2. Story Vazio.
3. Viewport 390: sem overflow horizontal.
        `,
      },
    },
  },
} satisfies Meta<typeof LowStockCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    items: INICIO_STOCK,
    onRepor: () => undefined,
  },
};

export const Vazio: Story = {
  args: { items: [], onRepor: () => undefined },
};
