import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { VariationGrid } from './VariationGrid';
import { MOLETOM_ROWS, MOLETOM_SIZES } from './variationGridFixtures';

const meta = {
  title: 'Organisms/VariationGrid',
  component: VariationGrid,
  parameters: {
    docs: {
      description: {
        component: `
Grade cor × tamanho (SHP-93): editar estoque ou preço, aplicar em todas e salvar em lote.

## Como testar
1. Alterne Estoque / Preço.
2. Edite uma célula (ex.: Rosa M); o botão Salvar habilita.
3. “Aplicar em todas” preenche as células vendáveis.
4. Células “—” não editam; 0 = vermelho; ≤2 = amarelo.
5. Viewport 390: grade rola na horizontal.
        `,
      },
    },
  },
  args: {
    sizes: [...MOLETOM_SIZES],
    rows: MOLETOM_ROWS,
    onSave: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof VariationGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estoque: Story = {
  args: { defaultMode: 'stock' },
};

export const Preco: Story = {
  args: { defaultMode: 'price' },
};

export const SemRodape: Story = {
  args: { hideFooter: true, onSave: undefined, onCancel: undefined },
};
