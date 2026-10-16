import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { OrdersToShipCard } from './OrdersToShipCard';
import { INICIO_ORDERS } from './inicioFixtures';

const demo = {
  onViewAll: () => toast.message('Ver todos os pedidos', { description: 'Na página Início (SHP-74) isso abre /pedidos.' }),
  onPrintLabels: () => toast.message('Imprimir etiquetas', { description: 'Fluxo real na página de pedidos (SHP-84/85).' }),
  onSeparacao: () => toast.message('Lista de separação', { description: 'Fluxo real na página de separação (SHP-87).' }),
};

const meta = {
  title: 'Organisms/OrdersToShipCard',
  component: OrdersToShipCard,
  parameters: {
    docs: {
      description: {
        component: `
Pedidos a enviar (SHP-73): contagem grande, urgência, imprimir etiquetas, lista de separação e pedidos.

## Como testar
1. Clique em Imprimir / Separação / Ver todos — aparece um toast (rotas reais vêm nas páginas de Pedidos).
2. Story Expedição: fita de progresso.
3. Viewport 390: botões empilham; sem scroll horizontal.
        `,
      },
    },
  },
} satisfies Meta<typeof OrdersToShipCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: {
    count: 6,
    dueLabel: '2 vencem hoje às 18h',
    orders: INICIO_ORDERS.map((o) => ({
      ...o,
      onClick: () => toast.message(`Pedido ${o.name}`, { description: 'Abriria o detalhe do pedido.' }),
    })),
    ...demo,
  },
};

export const Expedicao: Story = {
  name: 'Expedição',
  args: {
    count: 6,
    dueLabel: '2 vencem hoje às 18h',
    orders: INICIO_ORDERS,
    packing: { packed: 4, total: 6 },
    ...demo,
  },
};

export const Vazio: Story = {
  args: {
    count: 0,
    orders: [],
    ...demo,
  },
};
