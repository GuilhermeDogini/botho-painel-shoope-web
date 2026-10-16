import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, Plus, Printer, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './Button';
import { IconButton } from './IconButton';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
Botão principal da Botho e botão só de ícone.

## Como deve funcionar
- **6 estilos:** \`primary\`, \`soft\`, \`outline\` (padrão), \`ghost\`, \`danger\`, \`link\` — iguais ao DesignSystem.
- **Tamanhos:** \`lg\` 52 px, \`md\` 44 px, \`sm\` 40 px no visual (área de toque 44 px no compacto).
- \`loading\` troca o ícone pelo giro, trava o clique e marca \`aria-busy\`.
- \`asChild\` aplica o estilo num filho (ex.: \`<Link>\`).
- \`type\` padrão é \`button\` (não envia formulário sem querer).

## Como testar
1. Toolbar **Tema** → claro e escuro.
2. Controls: troque \`variant\`, \`size\`, \`loading\`, \`disabled\`, \`fullWidth\`.
3. Teclado: Tab até o botão, Enter/Espaço dispara (exceto loading/disabled).
4. Story **IconButton**: confira o contador \`4\` e \`99+\`; o \`aria-label\` inclui o número.
5. Redimensione para ~390 px e use a story **Largura total**.
        `,
      },
    },
  },
  args: {
    children: 'Imprimir etiquetas',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'soft', 'outline', 'ghost', 'danger', 'link'],
    },
    size: { control: 'select', options: ['lg', 'md', 'sm'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    icon: { control: false, table: { disable: true } },
    iconRight: { control: false, table: { disable: true } },
    asChild: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    type: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primario: Story = {
  args: { variant: 'primary', icon: Printer, children: 'Imprimir etiquetas' },
};

export const Suave: Story = {
  args: { variant: 'soft', icon: Plus, children: 'Cadastrar peça' },
};

export const Contorno: Story = {
  args: { variant: 'outline', children: 'Lista de separação' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancelar' },
};

export const Perigo: Story = {
  args: { variant: 'danger', icon: Trash2, children: 'Sim, cancelar pedido' },
};

export const LinkEstilo: Story = {
  args: { variant: 'link', iconRight: ChevronRight, children: 'Ver todos' },
};

export const Carregando: Story = {
  args: { variant: 'primary', loading: true, children: 'Enviando' },
};

export const Desabilitado: Story = {
  args: { variant: 'primary', disabled: true, children: 'Desabilitado' },
};

export const LarguraTotal: Story = {
  args: { variant: 'primary', size: 'lg', fullWidth: true, icon: Printer, children: 'Imprimir 6 etiquetas' },
  parameters: { docs: { description: { story: 'No celular o CTA principal costuma ocupar 100% da largura.' } } },
};

export const ComoLink: Story = {
  render: () => (
    <Button asChild variant="soft" icon={Plus}>
      <Link to="/produtos/nova">Cadastrar peça</Link>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Usa `asChild` + `Link` do react-router. No Storybook o destino não muda de página de verdade.',
      },
    },
  },
};

export const TodosOsEstilos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button variant="primary" icon={Printer}>
        Primário
      </Button>
      <Button variant="soft" icon={Plus}>
        Suave
      </Button>
      <Button>Contorno</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" icon={Trash2}>
        Perigo
      </Button>
      <Button variant="link" iconRight={ChevronRight}>
        Link
      </Button>
    </div>
  ),
};

export const IconButtonNotificacoes: StoryObj<typeof IconButton> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton icon={Printer} label="Imprimir" />
      <IconButton icon={Printer} label="Notificações" bordered badge={4} />
      <IconButton icon={Printer} label="Alertas" bordered badge={128} />
      <IconButton icon={Trash2} label="Apagar" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`IconButton`: 44×44, `label` obrigatório (leitor de tela), contador no canto (99+ acima de 99).',
      },
    },
  },
};
