import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProductCard } from './ProductCard';
import { PRODUCT_FIXTURES } from './productFixtures';

const meta = {
  title: 'Organisms/ProductCard',
  component: ProductCard,
  parameters: {
    docs: {
      description: {
        component: `
Card da grade de produtos (SHP-92): foto 3:4, preço, vendidas 30d, cores/tamanhos, estoque e selos.

## Como testar
1. Compare com ProductRow: mesmos dados (nome, preço, estoque, selos).
2. Clique nos ícones (Estoque, Turbinar, Duplicar, Pausar) e na seleção.
3. Stories Pausada / Turbinada / Acabando / Parada.
4. Viewport 390: sem overflow horizontal.
        `,
      },
    },
  },
  args: {
    onSelectedChange: fn(),
    onStock: fn(),
    onBoost: fn(),
    onDuplicate: fn(),
    onPause: fn(),
    onOpen: fn(),
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Turbinada: Story = {
  args: { item: PRODUCT_FIXTURES[0], selected: false },
};

export const FaixaDePreco: Story = {
  args: { item: PRODUCT_FIXTURES[1] },
};

export const Parada: Story = {
  args: { item: PRODUCT_FIXTURES[2] },
};

export const Pausada: Story = {
  args: { item: PRODUCT_FIXTURES[3] },
};

export const SemVariacao: Story = {
  args: { item: PRODUCT_FIXTURES[4] },
};

export const Grade: Story = {
  args: { item: PRODUCT_FIXTURES[0] },
  render: (args) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PRODUCT_FIXTURES.map((item) => (
        <ProductCard key={item.itemId} {...args} item={item} />
      ))}
    </div>
  ),
};
