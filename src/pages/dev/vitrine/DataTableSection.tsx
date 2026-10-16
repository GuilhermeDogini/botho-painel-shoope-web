import { useState } from 'react';
import { Money } from '@/components/atoms/Money';
import { Deadline } from '@/components/molecules/Deadline';
import { ProductLine } from '@/components/molecules/ProductLine';
import { DataTable, type DataTableColumn } from '@/components/organisms/DataTable';
import {
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  mockPantalonaSrc,
  mockVestidoSrc,
} from '@/stories/mocks';
import { VitrineGroup, VitrineSection } from './VitrineSection';

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
  {
    id: 'M2L8C',
    buyer: 'Marina',
    total: 159.9,
    due: 'Amanhã',
    urgency: 'tomorrow',
    name: MOCK_PRODUCTS[0].name,
    variant: 'Azul anil · P',
    colorHex: '#2F4A9A',
    imageSrc: mockVestidoSrc,
  },
  {
    id: 'R4T1K',
    buyer: 'Beatriz',
    total: 99.9,
    due: '11/10',
    urgency: 'date',
    name: MOCK_PRODUCTS[1].name,
    variant: 'Caramelo · M',
    colorHex: '#9C6640',
    imageSrc: mockPantalonaSrc,
  },
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

export function DataTableSection() {
  const [selected, setSelected] = useState<string[]>([ROWS[0].id]);
  const [loading, setLoading] = useState(false);

  return (
    <VitrineSection
      id="datatable"
      task="SHP-57"
      title="DataTable"
      note="Desktop = tabela; celular (&lt;768px) = cards. Clique nos cabeçalhos para ordenar; paginação 3 por página. Redimensione a janela para ver a troca."
    >
      <VitrineGroup label="Pedidos (seleção + ordenação + página)">
        <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted">
          <button
            type="button"
            className="underline"
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 900);
            }}
          >
            Simular carregamento
          </button>
          <span>· selecionados: {selected.length}</span>
        </div>
        <DataTable
          aria-label="Pedidos"
          columns={columns}
          rows={ROWS}
          getRowId={(r) => r.id}
          selectable
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          pageSize={3}
          loading={loading}
        />
      </VitrineGroup>
    </VitrineSection>
  );
}
