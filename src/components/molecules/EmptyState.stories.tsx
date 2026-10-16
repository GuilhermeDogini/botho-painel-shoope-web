import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, RefreshCw, Rocket, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { EMPTY_ILLUSTRATIONS } from '@/components/illustrations';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: `
Estado vazio com ilustração de costura.

## Como deve funcionar
- **illustration:** \`arara\` | \`cabide\` | \`carretel\` | \`tesoura\` | \`agulha\`, ou um ReactNode. \`null\` esconde.
- **title** + **description** + **action** (botão/link opcional).
- **align:** \`center\` (listas) ou \`start\` (erro / sem permissão).
- **animated** (padrão sim): ~2 s de movimento e ~3 s de descanso, em loop. Arara e cabide balançam; carretel gira e solta linha; tesoura corta duas vezes; agulha entra e sai do tecido. Some com “reduzir movimento” do sistema.
- Mesmo componente em Pedidos, Produtos e Conversas — só mudam as props.

## Como testar
1. Tema claro/escuro — traços e acentos (brand/mostarda/sálvia) legíveis.
2. Story **Pedidos / Produtos / Conversas**: textos e CTAs do design.
3. Story **Ilustrações**: as cinco no traço da marca, animadas. Desligue \`animated\` nos Controls para ver parado.
4. ~390 px: bloco centralizado, sem rolagem lateral; botão tocável ≥ 44 px.
5. Desktop: o card pode ficar mais largo; o texto continua com \`max-width\` legível.
        `,
      },
    },
  },
  args: {
    illustration: 'arara',
    animated: true,
    title: 'Nenhum pedido para enviar',
    description: 'Tudo despachado por hoje. Que tal turbinar umas peças para chegar mais pedido?',
    align: 'center',
  },
  argTypes: {
    animated: { control: 'boolean' },
    illustration: {
      control: 'select',
      options: [...EMPTY_ILLUSTRATIONS, null],
    },
    align: { control: 'select', options: ['center', 'start'] },
    action: { control: false, table: { disable: true } },
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pedidos: Story = {
  args: {
    illustration: 'arara',
    title: 'Nenhum pedido para enviar',
    description: 'Tudo despachado por hoje. Que tal turbinar umas peças para chegar mais pedido?',
    action: (
      <Button variant="soft" icon={Rocket}>
        Turbinar peças
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-line bg-surface shadow-1">
        <Story />
      </div>
    ),
  ],
};

export const ProdutosBusca: Story = {
  args: {
    illustration: 'cabide',
    title: 'Nenhuma peça com “macacão”',
    description: 'Confira a escrita ou tente outra palavra, como a cor ou o tecido.',
    action: (
      <Button variant="outline" icon={X}>
        Limpar busca
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-line bg-surface shadow-1">
        <Story />
      </div>
    ),
  ],
};

export const Conversas: Story = {
  args: {
    illustration: 'carretel',
    title: 'Nenhuma conversa esperando',
    description: 'Você respondeu todo mundo. As novas mensagens aparecem aqui.',
    action: <Button variant="outline">Ver todas as conversas</Button>,
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-line bg-surface shadow-1">
        <Story />
      </div>
    ),
  ],
};

export const CatalogoVazio: Story = {
  args: {
    illustration: 'agulha',
    title: 'Ainda não tem peça cadastrada',
    description: 'Cadastre a primeira com fotos 3:4, cor e tamanho. Dá para salvar rascunho.',
    action: (
      <Button variant="primary" icon={Plus}>
        Cadastrar peça
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-line bg-surface shadow-1">
        <Story />
      </div>
    ),
  ],
};

export const ErroConexao: Story = {
  args: {
    illustration: 'tesoura',
    align: 'start',
    title: 'Não conseguimos falar com a Shopee agora',
    description: 'Isso costuma passar em poucos minutos. Seus dados estão seguros, só não estão atualizando.',
    action: (
      <Button variant="primary" icon={RefreshCw}>
        Tentar de novo
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg rounded-lg border border-line bg-surface p-2 shadow-1">
        <Story />
      </div>
    ),
  ],
};

export const Ilustracoes: Story = {
  render: ({ animated }) => (
    <div className="flex flex-wrap items-end justify-center gap-6">
      {EMPTY_ILLUSTRATIONS.map((kind) => (
        <div key={kind} className="flex w-36 flex-col items-center gap-2">
          <EmptyState illustration={kind} animated={animated} title={kind} className="px-2 py-4" />
        </div>
      ))}
    </div>
  ),
};
