import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';
import { Skeleton } from './Skeleton';
import { Spinner } from './Spinner';

const meta = {
  title: 'Atoms/Feedback',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: `
Carregando e divisores.

## Como deve funcionar
- **Spinner:** linha "costurando" + texto (\`Costurando os dados…\` por padrão). \`role=status\`.
- **Skeleton:** bloco que pulsa no lugar do conteúdo (decorativo).
- **Divider:** \`line\`, \`stitch\` (pesponto) ou \`brand\` (pesponto framboesa).
- Com **movimento reduzido** no sistema: nada anima (skeleton liso, linha parada).

## Como testar
1. Tema claro/escuro.
2. No SO, ligue "Reduzir movimento" / \`prefers-reduced-motion\` e recarregue — Spinner e Skeleton param.
3. Story **Linha de peça**: simula a lista carregando (foto + duas linhas).
4. Divisores: confira o tracejado do pesponto.
        `,
      },
    },
  },
  args: { label: 'Costurando os dados…', hideLabel: false },
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Costurando: Story = {};

export const TextoCustomizado: Story = {
  args: { label: 'Buscando pedidos na Shopee…' },
};

export const LinhaDePeca: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3" aria-busy="true">
      <Spinner label="Carregando peças…" />
      {[80, 70].map((w) => (
        <div key={w} className="flex gap-3">
          <Skeleton className="h-16 w-12 shrink-0" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <Skeleton className="h-3.5" style={{ width: `${w}%` }} />
            <Skeleton className="h-3" style={{ width: `${w - 30}%` }} />
          </div>
        </div>
      ))}
      <Skeleton className="h-[130px] rounded-lg" />
    </div>
  ),
};

export const Divisores: StoryObj<typeof Divider> = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4 text-sm text-muted">
      <span>Linha</span>
      <Divider />
      <span>Pesponto</span>
      <Divider variant="stitch" />
      <span>Pesponto framboesa</span>
      <Divider variant="brand" />
    </div>
  ),
};
