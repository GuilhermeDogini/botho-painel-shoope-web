import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Calendar, Check, Clock, PauseCircle, Rocket, Scissors, TrendingUp, Truck } from 'lucide-react';
import { CountBadge } from './CountBadge';
import { Tag } from './Tag';

const meta = {
  title: 'Atoms/Tag e CountBadge',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: `
Etiqueta de roupa (furinho à esquerda) e contador em pílula.

## Como deve funcionar
- **Tag:** sempre texto + ícone (o tipo exige \`icon\` — status nunca só por cor).
- Tons: \`neutral\`, \`brand\`, \`ok\`, \`warn\`, \`info\`, \`danger\`, \`solid\`.
- Tamanhos: \`md\` (24 px) e \`lg\` (28 px).
- **CountBadge:** some com 0 (a não ser \`showZero\`); \`99+\` acima de 99; \`active\` = framboesa (aba selecionada).

## Como testar
1. Tema claro/escuro — o furinho e as cores soft devem continuar legíveis.
2. Confira os exemplos do card: "Vence hoje", "A separar", "Turbinada", "Pausada", "Retorno 6,2× · Bom".
3. CountBadge: zero some na story; com \`showZero\` aparece 0; 134 vira 99+.
        `,
      },
    },
  },
  args: { children: 'Vence hoje', tone: 'danger', size: 'md', icon: AlertTriangle },
  argTypes: {
    children: { control: 'text' },
    tone: {
      control: 'select',
      options: ['neutral', 'brand', 'ok', 'warn', 'info', 'danger', 'solid'],
    },
    size: { control: 'select', options: ['md', 'lg'] },
    icon: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VenceHoje: Story = {
  args: { tone: 'danger', icon: AlertTriangle, children: 'Vence hoje' },
};

export const TodosOsTons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag tone="danger" icon={AlertTriangle}>
        Vence hoje
      </Tag>
      <Tag tone="warn" icon={Clock}>
        Amanhã
      </Tag>
      <Tag tone="ok" icon={Check}>
        Entregue
      </Tag>
      <Tag tone="info" icon={Truck}>
        Em trânsito
      </Tag>
      <Tag tone="brand" icon={Scissors}>
        A separar
      </Tag>
      <Tag tone="solid" icon={Rocket}>
        Turbinada
      </Tag>
      <Tag icon={PauseCircle}>Pausada</Tag>
      <Tag icon={Calendar}>10/10</Tag>
      <Tag tone="ok" size="lg" icon={TrendingUp}>
        Retorno 6,2× · Bom
      </Tag>
    </div>
  ),
};

export const Contadores: StoryObj<typeof CountBadge> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="inline-flex items-center gap-2">
        A enviar <CountBadge value={6} active />
      </span>
      <span className="inline-flex items-center gap-2">
        Aguardando <CountBadge value={4} />
      </span>
      <span className="inline-flex items-center gap-2">
        Enviados <CountBadge value={0} showZero />
      </span>
      <span className="inline-flex items-center gap-2">
        Devoluções <CountBadge value={0} /> <span className="text-muted">(zero some)</span>
      </span>
      <span className="inline-flex items-center gap-2">
        Conversas <CountBadge value={134} />
      </span>
    </div>
  ),
};
