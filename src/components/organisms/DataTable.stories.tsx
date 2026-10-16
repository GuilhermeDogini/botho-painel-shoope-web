import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { Money } from '@/components/atoms/Money';
import { Deadline } from '@/components/molecules/Deadline';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ProductLine } from '@/components/molecules/ProductLine';
import {
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  mockPantalonaSrc,
  mockVestidoSrc,
} from '@/stories/mocks';
import { DataTable, type DataTableColumn } from './DataTable';

type OrderRow = {
  id: string;
  buyer: string;
  total: number;
  due: string;
  urgency: 'today' | 'tomorrow' | 'date';
  name: string;
  variant: string;
  colorHex: string;
  imageSrc: string | null;
};

const ROWS: OrderRow[] = [
  {
    id: MOCK_ORDERS[0].id,
    buyer: MOCK_ORDERS[0].buyer,
    total: MOCK_ORDERS[0].total,
    due: MOCK_ORDERS[0].due,
    urgency: 'today',
    name: MOCK_PRODUCTS[0].name,
    variant: `${MOCK_PRODUCTS[0].color} · ${MOCK_PRODUCTS[0].size}`,
    colorHex: '#2F4A9A',
    imageSrc: mockVestidoSrc,
  },
  {
    id: MOCK_ORDERS[1].id,
    buyer: MOCK_ORDERS[1].buyer,
    total: MOCK_ORDERS[1].total,
    due: MOCK_ORDERS[1].due,
    urgency: 'date',
    name: MOCK_PRODUCTS[1].name,
    variant: `${MOCK_PRODUCTS[1].color} · ${MOCK_PRODUCTS[1].size}`,
    colorHex: '#9C6640',
    imageSrc: mockPantalonaSrc,
  },
  {
    id: MOCK_ORDERS[2].id,
    buyer: MOCK_ORDERS[2].buyer,
    total: MOCK_ORDERS[2].total,
    due: MOCK_ORDERS[2].due,
    urgency: 'tomorrow',
    name: MOCK_PRODUCTS[2].name,
    variant: `${MOCK_PRODUCTS[2].color} · ${MOCK_PRODUCTS[2].size}`,
    colorHex: '#E9A6B9',
    imageSrc: null,
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `X${i + 10}`,
    buyer: ['Marina', 'Beatriz', 'Leticia', 'Patricia'][i % 4],
    total: 79.9 + i * 10,
    due: i % 2 === 0 ? 'Amanhã' : '12/10',
    urgency: (i % 2 === 0 ? 'tomorrow' : 'date') as OrderRow['urgency'],
    name: MOCK_PRODUCTS[i % 3].name,
    variant: `${MOCK_PRODUCTS[i % 3].color} · ${MOCK_PRODUCTS[i % 3].size}`,
    colorHex: ['#2F4A9A', '#9C6640', '#E9A6B9'][i % 3],
    imageSrc: i % 3 === 0 ? mockVestidoSrc : i % 3 === 1 ? mockPantalonaSrc : null,
  })),
];

const columns: DataTableColumn<OrderRow>[] = [
  {
    id: 'pedido',
    header: 'Pedido',
    shrink: true,
    sortable: true,
    sortValue: (r) => r.id,
    card: 'trailing',
    cell: (r) => (
      <div>
        <div className="font-bold tabular-nums">#{r.id}</div>
        <div className="text-xs text-muted">{r.buyer}</div>
      </div>
    ),
  },
  {
    id: 'peca',
    header: 'Peça',
    sortable: true,
    sortValue: (r) => r.name,
    card: 'primary',
    cell: (r) => (
      <ProductLine name={r.name} imageSrc={r.imageSrc} variant={r.variant} colorHex={r.colorHex} size="sm" />
    ),
  },
  {
    id: 'valor',
    header: 'Valor',
    align: 'right',
    sortable: true,
    sortValue: (r) => r.total,
    card: 'trailing',
    cell: (r) => <Money value={r.total} className="font-bold" />,
  },
  {
    id: 'prazo',
    header: 'Prazo',
    sortable: true,
    sortValue: (r) => r.due,
    card: 'badge',
    cell: (r) => <Deadline urgency={r.urgency}>{r.due}</Deadline>,
  },
];

const meta = {
  title: 'Organisms/DataTable',
  parameters: {
    docs: {
      description: {
        component: `
Tabela responsiva: desktop = tabela; celular = cards. Mesma definição de colunas.

## Como deve funcionar
- **columns:** \`cell\`, \`sortable\`/\`sortValue\`, \`card\` (primary/meta/badge/trailing/false).
- **selectable:** checkboxes + “selecionar todos” (indeterminate).
- **sort / page:** controlados ou internos; paginação cliente se não passar \`total\`.
- **loading:** skeleton; **empty:** EmptyState (ou slot).
- Clique no cabeçalho cicla asc → desc → sem ordenação.

## Como testar
1. Story **Pedidos**: selecione linhas; ordene por Valor; mude de página (4 por página).
2. Redimensione para ~390 px: vira cards com os mesmos dados.
3. Story **Vazio** e **Carregando**.
4. Tema claro/escuro.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Pedidos: Story = {
  render: function PedidosTable() {
    const [selected, setSelected] = useState<string[]>([ROWS[0].id]);
    return (
      <div className="flex flex-col gap-3">
        <DataTable
          aria-label="Pedidos"
          columns={columns}
          rows={ROWS}
          getRowId={(r) => r.id}
          selectable
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          pageSize={4}
        />
        <p className="text-xs text-muted">
          Selecionados: {selected.length ? selected.join(', ') : 'nenhum'}
        </p>
      </div>
    );
  },
};

export const Carregando: Story = {
  render: () => (
    <DataTable
      aria-label="Pedidos"
      columns={columns}
      rows={[]}
      getRowId={(r) => r.id}
      selectable
      loading
    />
  ),
};

export const Vazio: Story = {
  render: () => (
    <DataTable
      aria-label="Pedidos"
      columns={columns}
      rows={[]}
      getRowId={(r) => r.id}
      empty={
        <EmptyState
          illustration="arara"
          title="Nenhum pedido para enviar"
          description="Tudo despachado por hoje."
        />
      }
    />
  ),
};

export const SemSelecao: Story = {
  render: function NoSelect() {
    const cols = useMemo(() => columns.map((c) => ({ ...c })), []);
    return (
      <DataTable
        aria-label="Extrato"
        columns={cols}
        rows={ROWS.slice(0, 5)}
        getRowId={(r) => r.id}
        pageSize={5}
      />
    );
  },
};
