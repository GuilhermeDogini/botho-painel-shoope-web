import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import type { OrderDetail } from '@/lib/types';
import { mockVestidoSrc } from '@/stories/mocks';
import { OrderDetailBody } from './OrderDetailBody';

const meta = {
  title: 'Organisms/OrderDetail',
  component: OrderDetailBody,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Detalhe do pedido (SHP-83): OrderTimeline, OrderItems, OrderValues, DeliveryCard e BuyerCard.

## Como deve funcionar
- Props-only: a página manda o \`OrderDetail\` da API.
- \`showMoney={false}\` esconde o bloco Valores (Expedição).
- Endereço mascarado + nota; “3ª compra” no BuyerCard.

## Como testar
1. Story admin: conferir andamento, itens, valores e sidebar.
2. Story Expedição: Valores some.
3. Tema claro/escuro; viewport estreito (~390).
        `,
      },
    },
  },
} satisfies Meta<typeof OrderDetailBody>;

export default meta;
type Story = StoryObj<typeof meta>;

const ORDER: OrderDetail = {
  orderSn: '251008K7Q2M',
  status: 'READY_TO_SHIP',
  tab: 'a_enviar',
  createdAt: '2026-10-08T12:12:00.000Z',
  paidAt: '2026-10-08T12:12:00.000Z',
  shipByDate: new Date().toISOString(),
  buyerUsername: 'anapaula.melo',
  recipientName: 'Ana P. S.',
  city: 'São Paulo',
  state: 'SP',
  zipcode: '03***-***',
  itemCount: 1,
  items: [
    {
      itemId: 900_101,
      modelId: 1,
      name: 'Vestido midi estampa floral',
      variation: 'Azul anil,M',
      sku: 'VMF-ANIL-M',
      quantity: 1,
      imageUrl: mockVestidoSrc,
      unitPrice: 129.9,
      itemTotal: 129.9,
    },
  ],
  currency: 'BRL',
  orderTotal: 129.9,
  updatedAt: '2026-10-08T12:12:00.000Z',
  messageToSeller: 'Se der, embala para presente? É aniversário da minha mãe.',
  address: {
    name: 'Ana P. S.',
    phone: '******99',
    line: 'Rua A*** M*****, 1**',
    district: 'Tatuapé',
    city: 'São Paulo',
    state: 'SP',
    zipcode: '03***-***',
  },
  paymentMethod: 'Pix',
  shippingCarrier: 'Shopee Xpress',
  cancelBy: null,
  cancelReason: null,
  trackingNumber: null,
  labelPrintedAt: null,
  buyerOrderCount: 3,
  buyerSince: '2026-05-01T12:00:00.000Z',
  syncedAt: new Date().toISOString(),
  escrow: {
    bruto: 129.9,
    comissao: 18.19,
    taxaItem: 4,
    frete: 7.79,
    liquido: 99.92,
    liberacaoEm: '2026-10-18T12:00:00.000Z',
  },
};

export const Admin: Story = {
  name: 'Admin (com valores)',
  args: {
    order: ORDER,
    showMoney: true,
    onChat: () => toast.message('Conversar', { description: 'Fluxo real no chat (épico Atendimento).' }),
  },
};

export const Expedicao: Story = {
  name: 'Expedição (sem valores)',
  args: {
    order: ORDER,
    showMoney: false,
    onChat: () => toast.message('Conversar'),
  },
};

export const ComRastreio: Story = {
  name: 'Com etiqueta / rastreio',
  args: {
    order: {
      ...ORDER,
      status: 'PROCESSED',
      trackingNumber: 'BRMOCKK7Q2M',
      labelPrintedAt: '2026-10-08T13:40:00.000Z',
    },
    showMoney: true,
    onCopyTracking: () => toast.success('Código copiado (demo)'),
  },
};
