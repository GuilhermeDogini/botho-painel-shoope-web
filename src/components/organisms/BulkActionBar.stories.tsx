import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ListChecks, Package, Printer } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { BulkActionBar } from './BulkActionBar';

const meta = {
  title: 'Organisms/BulkActionBar',
  component: BulkActionBar,
  parameters: {
    docs: {
      description: {
        component: `
Barra de ações em lote (fundo ink).

## Como deve funcionar
- Com \`count > 0\` aparece; com \`0\` some (não renderiza).
- \`position="sticky"\` (padrão): assenta 16 px do fundo no desktop e ~84 px no celular (acima da nav).
- \`position="inline"\` para demos sem grudar.
- Botão \`primary\` fica framboesa; \`outline\`/\`ghost\` invertidos no fundo escuro.
- \`onClear\` mostra o X “Limpar seleção”.

## Como testar
1. Story **Com seleção**: clique nos checks — a barra sobe/some.
2. Clique no X: limpa e some.
3. Tema claro/escuro: barra usa \`bg-ink\` / \`text-bg\` (inverte sozinha).
4. Viewport ~390: barra não cobre a nav inferior (bottom 84 px).
        `,
      },
    },
  },
  args: {
    count: 2,
    position: 'inline',
  },
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComSelecao: Story = {
  parameters: { controls: { disable: true } },
  render: function Demo() {
    const [sel, setSel] = useState<string[]>(['a', 'b']);
    const items = [
      { id: 'a', label: 'Pedido #K7Q2M' },
      { id: 'b', label: 'Pedido #F6B4D' },
      { id: 'c', label: 'Pedido #P3X9A' },
    ];

    const toggle = (id: string) => {
      setSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    return (
      <div className="relative mx-auto flex min-h-[320px] max-w-lg flex-col gap-3 rounded-lg border border-line bg-surface p-4 pb-28">
        <p className="text-sm text-muted">Marque itens — a barra aparece embaixo (sticky neste quadro).</p>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <Checkbox
                label={item.label}
                checked={sel.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
            </li>
          ))}
        </ul>

        <BulkActionBar count={sel.length} onClear={() => setSel([])} position="sticky">
          <Button variant="primary" size="sm" icon={Printer}>
            Imprimir etiquetas
          </Button>
          <Button variant="outline" size="sm" icon={ListChecks}>
            Lista de separação
          </Button>
          <Button variant="outline" size="sm" icon={Package}>
            Marcar embalado
          </Button>
        </BulkActionBar>
      </div>
    );
  },
};

export const Inline: Story = {
  args: {
    count: 1,
    position: 'inline',
    label: '1 selecionado',
  },
  render: (args) => (
    <BulkActionBar {...args} onClear={() => undefined}>
      <Button variant="primary" size="sm" icon={Printer}>
        Imprimir etiquetas
      </Button>
      <Button variant="outline" size="sm" icon={ListChecks}>
        Lista de separação
      </Button>
    </BulkActionBar>
  ),
};
