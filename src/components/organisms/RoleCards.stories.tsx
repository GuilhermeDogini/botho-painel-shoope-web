import type { Meta, StoryObj } from '@storybook/react-vite';
import { buildRoleCardsFromMatrix, RoleCards } from './RoleCards';

const meta = {
  title: 'Organisms/RoleCards',
  component: RoleCards,
  parameters: {
    docs: {
      description: {
        component: `
Cards mobile: um por papel, com listas Pode / Só vê / Não acessa.

## Como deve funcionar
- Props-only (\`roles\`). Use \`buildRoleCardsFromMatrix()\` a partir de \`MATRIX\`.
- Em ~390 px não força scroll horizontal.
- Seções “Só vê” / “Não acessa” somem quando a lista está vazia.

## Como testar
1. Viewport 390: cards empilham sem estourar a largura.
2. Compare com a coluna do papel na PermissionMatrix.
        `,
      },
    },
  },
} satisfies Meta<typeof RoleCards>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROLES = buildRoleCardsFromMatrix();

export const DaMatrix: Story = {
  args: { roles: ROLES },
};

export const Mobile390: Story = {
  parameters: {
    controls: { disable: true },
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="mx-auto w-[390px] max-w-full min-w-0 overflow-x-hidden border border-dashed border-line p-2">
      <RoleCards roles={ROLES} />
    </div>
  ),
};
