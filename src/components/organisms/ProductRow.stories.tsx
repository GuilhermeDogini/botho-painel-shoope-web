import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PRODUCT_FIXTURES } from './productFixtures';
import { ProductRow } from './ProductRow';

const meta = {
  title: 'Organisms/ProductRow',
  component: ProductRow,
  parameters: {
    docs: {
      description: {
        component: `
Linha da lista de produtos (SHP-92). Mesmos dados que ProductCard.

## Como testar
1. Compare selos e números com o ProductCard da mesma peça.
2. Clique nas ações e na seleção.
3. Viewport 390: campos empilham sem cortar.
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
} satisfies Meta<typeof ProductRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Turbinada: Story = {
  args: { item: PRODUCT_FIXTURES[0] },
};

export const Pausada: Story = {
  args: { item: PRODUCT_FIXTURES[3] },
};

export const Lista: Story = {
  args: { item: PRODUCT_FIXTURES[0] },
  render: (args) => (
    <div className="flex flex-col gap-2">
      {PRODUCT_FIXTURES.map((item) => (
        <ProductRow key={item.itemId} {...args} item={item} />
      ))}
    </div>
  ),
};
