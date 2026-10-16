import { Scissors } from 'lucide-react';
import { Money } from '@/components/atoms/Money';
import { Tag } from '@/components/atoms/Tag';
import { Deadline } from '@/components/molecules/Deadline';
import { ProductLine } from '@/components/molecules/ProductLine';
import { MOCK_ORDERS, MOCK_PRODUCTS, mockPantalonaSrc, mockVestidoSrc } from '@/stories/mocks';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function ProductLineSection() {
  return (
    <VitrineSection
      id="product-line"
      task="SHP-53"
      title="ProductLine e Deadline"
      note="Mesma molécula na lista (Início) e no card (Pedidos). Prazos: hoje / amanhã / data / coleta."
    >
      <VitrineGroup label="Lista (como no Início)">
        <div className="flex max-w-lg flex-col divide-y divide-line rounded-md border border-line px-3">
          <ProductLine
            className="py-2.5"
            name={MOCK_PRODUCTS[0].name}
            imageSrc={mockVestidoSrc}
            variant="Azul anil · M"
            colorHex="#2F4A9A"
            trailing={
              <>
                <Deadline urgency="today">Hoje, 18h</Deadline>
                <Money value={129.9} className="text-sm font-bold" />
              </>
            }
          />
          <ProductLine
            className="py-2.5"
            name={MOCK_PRODUCTS[1].name}
            imageSrc={mockPantalonaSrc}
            variant="Caramelo · G1"
            colorHex="#9C6640"
            trailing={
              <>
                <Deadline urgency="tomorrow">Amanhã</Deadline>
                <Money value={139.9} className="text-sm font-bold" />
              </>
            }
          />
          <ProductLine
            className="py-2.5"
            name={MOCK_PRODUCTS[2].name}
            imageSrc={null}
            variant="Rosa · P"
            colorHex="#E9A6B9"
            sku="SKU-8821"
            extra="+ 1 item: Pijama · Listrado · M"
            trailing={
              <>
                <Deadline urgency="date">10/10</Deadline>
                <Money value={189.9} className="text-sm font-bold" />
              </>
            }
          />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Card (como Pedidos no celular)">
        <div className="max-w-sm rounded-md border border-line bg-surface p-3 shadow-1">
          <ProductLine
            size="lg"
            name={MOCK_PRODUCTS[0].name}
            imageSrc={mockVestidoSrc}
            variant="Azul anil · M"
            colorHex="#2F4A9A"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Deadline urgency="today">Hoje, 18h</Deadline>
            <Tag tone="brand" icon={Scissors}>
              A separar
            </Tag>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted">
              {MOCK_ORDERS[0].buyer} · <span className="font-mono tabular-nums">#{MOCK_ORDERS[0].id}</span>
            </span>
            <Money value={129.9} className="font-bold" />
          </div>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Todos os prazos">
        <div className="flex flex-wrap gap-2">
          <Deadline urgency="today">Hoje, 18h</Deadline>
          <Deadline urgency="tomorrow">Amanhã, 09/10</Deadline>
          <Deadline urgency="date">10/10</Deadline>
          <Deadline urgency="collect">Coleta hoje</Deadline>
          <Deadline urgency="done">Entregue 07/10</Deadline>
          <Deadline urgency="cancelled">Cancelado pela compradora</Deadline>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
