import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import type { CategoryNode } from '@/lib/types';
import { CategoryPicker } from './CategoryPicker';
import { CATEGORY_FIXTURES, RECENT_CATEGORY_LABELS } from './categoryPickerFixtures';

function Demo(args: { loading?: boolean; error?: string | null; withRecent?: boolean }) {
  const [selected, setSelected] = useState<CategoryNode | null>(CATEGORY_FIXTURES[0] ?? null);
  return (
    <div className="mx-auto max-w-xl p-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold">Categoria</h2>
      </div>
      <CategoryPicker
        categories={CATEGORY_FIXTURES}
        selected={selected}
        onSelect={setSelected}
        loading={args.loading}
        error={args.error}
        recentLabels={args.withRecent ? [...RECENT_CATEGORY_LABELS] : undefined}
      />
    </div>
  );
}

const meta = {
  title: 'Organisms/CategoryPicker',
  component: CategoryPicker,
  parameters: {
    docs: {
      description: {
        component: `
Busca de categoria do cadastro (SHP-95): filtra o path, atalhos recentes e seleção com check.

## Como testar
1. Digite “vestido” — só vestidos.
2. Clique num resultado (check + destaque).
3. Em “Usadas por você”, clique Pijamas e veja a lista filtrar.
4. Story Vazio: mensagem amigável.
        `,
      },
    },
  },
  args: {
    categories: CATEGORY_FIXTURES,
    onSelect: fn(),
  },
} satisfies Meta<typeof CategoryPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComBusca: Story = {
  render: () => <Demo withRecent />,
};

export const Carregando: Story = {
  render: () => <Demo loading />,
};

export const Erro: Story = {
  render: () => <Demo error="Não deu para carregar as categorias." />,
};

export const Vazio: Story = {
  args: {
    categories: [],
    onSelect: fn(),
  },
};
