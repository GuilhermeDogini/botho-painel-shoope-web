import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { packingLineKey, PickingList } from './PickingList';
import { DEMO_COLOR_HEX, DEMO_PACKING_GROUPS, DEMO_PACKING_NOTES } from './pickingFixtures';

const meta = {
  title: 'Organisms/PickingList',
  component: PickingList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Lista de separação (SHP-84): riscar tocando, progresso “3 de 7 peças”.

## Como deve funcionar
- Props-only: \`groups\` / \`notes\` da API; \`checkedKeys\` na página.
- Riscar persiste enquanto a lista (página) estiver aberta.
- Referência: \`design/opcao-a/Separacao.dc.html\`.

## Como testar
1. Toque numa linha — risca e atualiza o progresso.
2. Toque de novo — desarisca.
3. Tema claro/escuro; viewport ~390.
        `,
      },
    },
  },
} satisfies Meta<typeof PickingList>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(props: { initial?: string[] }) {
  const [checked, setChecked] = useState<string[]>(props.initial ?? []);
  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <PickingList
        groups={DEMO_PACKING_GROUPS}
        notes={DEMO_PACKING_NOTES}
        checkedKeys={checked}
        onCheckedKeysChange={setChecked}
        colorHexByItemId={DEMO_COLOR_HEX}
      />
    </div>
  );
}

const preChecked = [
  packingLineKey(102, 1, 'Azul anil,M'),
  packingLineKey(103, 1, 'Rosa,G'),
  packingLineKey(105, 1, 'Caramelo,G1'),
];

export const Interativa: Story = {
  name: 'Interativa (3 de 7)',
  args: {
    groups: DEMO_PACKING_GROUPS,
    checkedKeys: [],
    onCheckedKeysChange: () => undefined,
  },
  render: () => <Demo initial={preChecked} />,
};

export const Vazia: Story = {
  args: {
    groups: [],
    checkedKeys: [],
    onCheckedKeysChange: () => undefined,
    empty: true,
  },
};
