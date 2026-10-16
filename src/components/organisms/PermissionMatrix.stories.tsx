import type { Meta, StoryObj } from '@storybook/react-vite';
import { MATRIX } from './equipeShared';
import { PermissionMatrix } from './PermissionMatrix';

const meta = {
  title: 'Organisms/PermissionMatrix',
  component: PermissionMatrix,
  parameters: {
    docs: {
      description: {
        component: `
Tabela desktop de permissões × papéis (Pode / Só vê / Não).

## Como deve funcionar
- Dados via props (\`data\`); padrão = constante \`MATRIX\` do design.
- Legenda no canto; em viewport estreita o miolo rola com \`overflow-x: auto\` (não estoura a página).
- No celular a página Equipe deve preferir \`RoleCards\`.

## Como testar
1. Conteúdo bate com Equipe.dc.html (11 permissões × 5 papéis).
2. Encolha a janela: scroll interno, sem empurrar o layout.
3. Tema claro/escuro: ícones sálvia / anil / muted.
        `,
      },
    },
  },
  args: {
    data: MATRIX,
    showLegend: true,
  },
} satisfies Meta<typeof PermissionMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const SemTitulo: Story = {
  args: { title: null },
};
