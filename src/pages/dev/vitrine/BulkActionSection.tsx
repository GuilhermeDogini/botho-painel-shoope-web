import { useState } from 'react';
import { ListChecks, Package, Printer } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { Deadline } from '@/components/molecules/Deadline';
import { ProductLine } from '@/components/molecules/ProductLine';
import { BulkActionBar } from '@/components/organisms/BulkActionBar';
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
];

const columns: DataTableColumn<OrderRow>[] = [
  {
    id: 'pedido',
    header: 'Pedido',
    shrink: true,
    card: 'trailing',
    cell: (r) => <span className="font-bold tabular-nums">#{r.id}</span>,
  },
  {
    id: 'peca',
    header: 'Peça',
    card: 'primary',
    cell: (r) => (
      <ProductLine name={r.name} imageSrc={r.imageSrc} variant={r.variant} colorHex={r.colorHex} size="sm" />
    ),
  },
  {
    id: 'valor',
    header: 'Valor',
    align: 'right',
    card: 'trailing',
    cell: (r) => <Money value={r.total} className="font-bold" />,
  },
  {
    id: 'prazo',
    header: 'Prazo',
    card: 'badge',
    cell: (r) => <Deadline urgency={r.urgency}>{r.due}</Deadline>,
  },
];

export function BulkActionSection() {
  const [selected, setSelected] = useState<string[]>([ROWS[0].id]);

  return (
    <VitrineSection
      id="bulk"
      task="SHP-58"
      title="BulkActionBar"
      note="Aparece ao selecionar e some ao limpar (X). Sticky: 16 px do fundo no desktop; ~84 px no celular (acima da nav). Não cobre a lista — a página tem padding inferior."
    >
      <VitrineGroup label="Com DataTable">
        <div className="relative flex flex-col gap-3 pb-24">
          <DataTable
            aria-label="Pedidos"
            columns={columns}
            rows={ROWS}
            getRowId={(r) => r.id}
            selectable
            selectedIds={selected}
            onSelectedIdsChange={setSelected}
            pageSize={10}
          />
          <BulkActionBar count={selected.length} onClear={() => setSelected([])}>
            <Button variant="primary" size="sm" icon={Printer}>
              Imprimir etiquetas
            </Button>
            <Button variant="outline" size="sm" icon={ListChecks}>
              Lista de separação
            </Button>
            <Button variant="outline" size="sm" icon={Package}>
              Marcar embalado
            </Button>
          </BulkActionBar>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Só a barra (inline)">
        <BulkActionBar count={2} position="inline" onClear={() => undefined}>
          <Button variant="primary" size="sm" icon={Printer}>
            Imprimir etiquetas
          </Button>
          <Button variant="outline" size="sm" icon={ListChecks}>
            Lista de separação
          </Button>
        </BulkActionBar>
      </VitrineGroup>
    </VitrineSection>
  );
}
