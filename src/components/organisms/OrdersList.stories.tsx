import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { OrderCounts, OrderSummary, OrderTab } from '@/lib/types';
import { mockVestidoSrc, mockPantalonaSrc } from '@/stories/mocks';
import { OrdersList, type OrdersListFilters } from './OrdersList';

const meta = {
  title: 'Organisms/OrdersList',
  component: OrdersList,
  parameters: {
    docs: {
      description: {
        component: `
Lista de pedidos (SHP-82): TabList + FilterChip + SearchField + DataTable.

## Como deve funcionar
- Props-only: a página manda \`orders\`, \`counts\` e filtros.
- Desktop = tabela; celular (&lt;768px) = cards (DataTable).
- \`showMoney={false}\` esconde a coluna Valor (Expedição).

## Como testar
1. Troque abas e chips; a story controlada atualiza a seleção.
2. Redimensione para &lt;768px e confira os cards.
3. Tema claro/escuro: prazos e tags legíveis.
        `,
      },
    },
  },
} satisfies Meta<typeof OrdersList>;

export default meta;
type Story = StoryObj<typeof meta>;

const COUNTS: OrderCounts = {
  a_enviar: 6,
  aguardando_coleta: 4,
  enviados: 2,
  entregues: 8,
  cancelados: 1,
  devolucoes: 0,
};

const ORDERS: OrderSummary[] = [
  {
    orderSn: '251008K7Q2M',
    status: 'READY_TO_SHIP',
    tab: 'a_enviar',
    createdAt: '2026-10-07T15:00:00.000Z',
    paidAt: '2026-10-07T15:05:00.000Z',
    shipByDate: new Date().toISOString(),
    buyerUsername: 'anapaula.melo',
    recipientName: 'Ana P.',
    city: 'São Paulo',
    state: 'SP',
    zipcode: null,
    itemCount: 1,
    items: [
      {
        itemId: 1,
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
    updatedAt: '2026-10-07T15:05:00.000Z',
  },
  {
    orderSn: '251007H8W1R',
    status: 'READY_TO_SHIP',
    tab: 'a_enviar',
    createdAt: '2026-10-07T06:00:00.000Z',
    paidAt: '2026-10-07T06:05:00.000Z',
    shipByDate: new Date(Date.now() + 86400000).toISOString(),
    buyerUsername: 'fe.santos',
    recipientName: 'Fernanda S.',
    city: 'Curitiba',
    state: 'PR',
    zipcode: null,
    itemCount: 2,
    items: [
      {
        itemId: 2,
        modelId: 2,
        name: 'Pijama americano de malha',
        variation: 'Listrado anil,P',
        sku: 'PIJ-LIST-P',
        quantity: 1,
        imageUrl: mockPantalonaSrc,
        unitPrice: 94.9,
        itemTotal: 94.9,
      },
      {
        itemId: 2,
        modelId: 3,
        name: 'Pijama americano de malha',
        variation: 'Listrado anil,M',
        sku: 'PIJ-LIST-M',
        quantity: 1,
        imageUrl: mockPantalonaSrc,
        unitPrice: 94.9,
        itemTotal: 94.9,
      },
    ],
    currency: 'BRL',
    orderTotal: 189.8,
    updatedAt: '2026-10-07T06:05:00.000Z',
  },
];

function Interactive(props: { showMoney?: boolean }) {
  const [tab, setTab] = useState<OrderTab>('a_enviar');
  const [filters, setFilters] = useState<OrdersListFilters>({
    venceHoje: false,
    multiItem: false,
    ultimos7Dias: false,
    q: '',
  });
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <OrdersList
      orders={ORDERS}
      counts={COUNTS}
      venceHojeCount={2}
      tab={tab}
      onTabChange={setTab}
      filters={filters}
      onFiltersChange={setFilters}
      selectedIds={selected}
      onSelectedIdsChange={setSelected}
      showMoney={props.showMoney}
      total={ORDERS.length}
      pageSize={20}
    />
  );
}

export const Padrao: Story = {
  name: 'A enviar (admin)',
  render: () => <Interactive />,
};

export const Expedicao: Story = {
  name: 'Sem valores (Expedição)',
  render: () => <Interactive showMoney={false} />,
};
