import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Home,
  MessageCircle,
  MoreHorizontal,
  Package,
  Shirt,
} from 'lucide-react';
import { NavItem, NavList } from './NavItem';

const meta = {
  title: 'Molecules/NavItem',
  component: NavItem,
  parameters: {
    docs: {
      description: {
        component: `
Item de navegação (lateral e barra inferior) e a lista que anima o destaque.

## Como deve funcionar
- **\`variant="side"\`:** ícone + rótulo + contador; ativo = fundo brand-soft + contorno tracejado.
- **\`variant="bottom"\`:** coluna ícone + rótulo; ativo = ícone em pílula brand + traço no topo; badge absoluto.
- **\`NavList\`:** envolve os itens; a pílula (lateral) ou o traço (barra) **desliza** até o novo ativo; o ícone da barra dá um “pop”. Some com “reduzir movimento”.
- **\`asChild\`:** passa o estilo para \`<Link>\` / \`<a>\`.

## Como testar
1. Story **Lateral**: clique Pedidos / Conversas / Produtos — a pílula desliza.
2. Story **Barra inferior**: clique os 5 itens — o traço desliza e o ícone dá o pop.
3. Story **Um item**: no Controls, alterne \`variant\`, \`active\` e \`count\` (sem lista, sem deslizar).
4. Tema claro/escuro; alvos ≥ 44 px (side) / 52 px (bottom).
        `,
      },
    },
  },
  args: {
    icon: Package,
    children: 'Pedidos',
    variant: 'side',
    active: true,
    count: 6,
  },
  argTypes: {
    variant: { control: 'select', options: ['side', 'bottom'] },
    active: { control: 'boolean' },
    count: { control: 'number' },
    showZero: { control: 'boolean' },
    asChild: { control: 'boolean' },
    icon: { control: false, table: { disable: true } },
    children: { control: 'text' },
  },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

type SideKey = 'pedidos' | 'conversas' | 'produtos';
type BottomKey = 'inicio' | 'pedidos' | 'conversas' | 'produtos' | 'mais';

export const Lateral: Story = {
  parameters: { controls: { disable: true } },
  render: function LateralDemo() {
    const [active, setActive] = useState<SideKey>('pedidos');
    return (
      <NavList aria-label="Menu" className="w-[220px] rounded-md border border-line p-2">
        <NavItem icon={Package} active={active === 'pedidos'} count={6} onClick={() => setActive('pedidos')}>
          Pedidos
        </NavItem>
        <NavItem
          icon={MessageCircle}
          active={active === 'conversas'}
          count={3}
          onClick={() => setActive('conversas')}
        >
          Conversas
        </NavItem>
        <NavItem icon={Shirt} active={active === 'produtos'} onClick={() => setActive('produtos')}>
          Produtos
        </NavItem>
      </NavList>
    );
  },
};

export const BarraInferior: Story = {
  parameters: { controls: { disable: true } },
  render: function BottomDemo() {
    const [active, setActive] = useState<BottomKey>('inicio');
    return (
      <div className="mx-auto w-full max-w-md">
        <NavList
          variant="bottom"
          aria-label="Principal"
          className="rounded-md border border-line bg-surface px-1 pt-1 pb-3.5 shadow-[0_-6px_20px_-12px_rgba(0,0,0,.25)]"
        >
          <NavItem variant="bottom" icon={Home} active={active === 'inicio'} onClick={() => setActive('inicio')}>
            Início
          </NavItem>
          <NavItem
            variant="bottom"
            icon={Package}
            active={active === 'pedidos'}
            count={6}
            onClick={() => setActive('pedidos')}
          >
            Pedidos
          </NavItem>
          <NavItem
            variant="bottom"
            icon={MessageCircle}
            active={active === 'conversas'}
            onClick={() => setActive('conversas')}
          >
            Conversas
          </NavItem>
          <NavItem variant="bottom" icon={Shirt} active={active === 'produtos'} onClick={() => setActive('produtos')}>
            Produtos
          </NavItem>
          <NavItem variant="bottom" icon={MoreHorizontal} active={active === 'mais'} onClick={() => setActive('mais')}>
            Mais
          </NavItem>
        </NavList>
      </div>
    );
  },
};

/** Playground: Controls mudam variant / active / count (item solto, sem deslizar). */
export const UmItem: Story = {
  render: (args) =>
    args.variant === 'bottom' ? (
      <div className="grid w-full max-w-[96px] rounded-md border border-line bg-surface px-1 pt-1 pb-3">
        <NavItem {...args} />
      </div>
    ) : (
      <div className="w-[220px] rounded-md border border-line p-2">
        <NavItem {...args} />
      </div>
    ),
};
