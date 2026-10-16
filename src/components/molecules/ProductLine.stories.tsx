import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scissors } from 'lucide-react';
import { Money } from '@/components/atoms/Money';
import { Tag } from '@/components/atoms/Tag';
import { MOCK_ORDERS, MOCK_PRODUCTS, mockPantalonaSrc, mockVestidoSrc } from '@/stories/mocks';
import { Deadline } from './Deadline';
import { ProductLine } from './ProductLine';

const meta = {
  title: 'Molecules/ProductLine e Deadline',
  component: ProductLine,
  parameters: {
    docs: {
      description: {
        component: `
Linha de peça e prazo com urgência.

## Como deve funcionar
- **ProductLine:** foto (\`Thumbnail\`) + nome + variação (opcional \`ColorDot\`) + SKU + extra. \`trailing\` para prazo/preço. Tamanhos sm/md/lg.
- **Deadline:** urgência \`today\` / \`tomorrow\` / \`date\` / \`collect\` / \`done\` / \`cancelled\` → Tag com ícone (nunca só cor).
- Mesmo bloco na lista (Início) e no card (Pedidos celular).

## Como testar
1. Tema claro/escuro.
2. Story **Lista de pedidos**: prazos Hoje / Amanhã / data.
3. Story **Card celular**: foto lg + Deadline + Money.
4. Sem foto: cabide; extra "+ 1 item" em anil.
5. ~390 px: truncar nome sem estourar.
        `,
      },
    },
  },
  args: {
    name: MOCK_PRODUCTS[0].name,
    imageSrc: mockVestidoSrc,
    variant: `${MOCK_PRODUCTS[0].color} · ${MOCK_PRODUCTS[0].size}`,
    colorHex: '#2F4A9A',
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    imageSrc: { control: 'text' },
    trailing: { control: false, table: { disable: true } },
    extra: { control: 'text' },
  },
} satisfies Meta<typeof ProductLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UmaLinha: Story = {
  args: {
    trailing: (
      <>
        <Deadline urgency="today">Hoje, 18h</Deadline>
        <Money value={MOCK_PRODUCTS[0].price} className="text-sm font-bold" />
      </>
    ),
  },
};

export const ListaDePedidos: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col divide-y divide-line">
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
  ),
};

export const CardCelular: Story = {
  render: () => (
    <div className="w-[360px] max-w-full rounded-md border border-line bg-surface p-3 shadow-1">
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
  ),
};

export const Prazos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Deadline urgency="today">Hoje, 18h</Deadline>
      <Deadline urgency="tomorrow">Amanhã, 09/10</Deadline>
      <Deadline urgency="date">10/10</Deadline>
      <Deadline urgency="collect">Coleta hoje</Deadline>
      <Deadline urgency="done">Entregue 07/10</Deadline>
      <Deadline urgency="cancelled">Cancelado pela compradora</Deadline>
    </div>
  ),
};
