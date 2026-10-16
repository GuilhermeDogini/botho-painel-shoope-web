import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MOCK_ORDERS } from '@/stories/mocks';
import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { Select } from './Select';
import { Switch } from './Switch';
import { Textarea } from './Textarea';

const meta = {
  title: 'Atoms/Campos',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `
Campos de formulário: texto, área, lista, checkbox e switch.

## Como deve funcionar
- Foco: borda framboesa + anel suave (igual ao DesignSystem).
- \`invalid\`: borda vermelha (\`aria-invalid\`). A mensagem de erro fica no FormField (molécula SHP-48).
- **Select** é lista **Botho** (Radix): opções com fundo framboesa suave, não o menu azul do navegador. Continua aceitando \`<option>\`.
- **Checkbox:** área de toque 44 px; \`indeterminate\` para "Selecionar todos".
- **Switch:** Radix (\`role=switch\`); ligado = sálvia e bolinha à direita.

## Como testar
1. Tema claro/escuro.
2. Tab pelos campos; no Input/Textarea o anel framboesa aparece no foco.
3. Checkbox/Switch: Espaço alterna; o rótulo também clica.
4. Story **Lista**: abra o Select — a lista deve ser cream/framboesa, sem azul do SO.
5. Story **Selecionar pedidos**: marque um, confira o "meio marcado" em Selecionar todos.
        `,
      },
    },
  },
  args: { placeholder: 'Nome da peça', invalid: false, disabled: false, type: 'text' },
  argTypes: {
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultValue: { control: 'text' },
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const ComErro: Story = {
  args: { defaultValue: 'abc', invalid: true },
};

export const Desabilitado: Story = {
  args: { defaultValue: 'Vestido midi', disabled: true },
};

export const AreaDeTexto: StoryObj<typeof Textarea> = {
  render: (args) => <Textarea {...args} />,
  args: { placeholder: 'Conte o tecido, o caimento e as medidas.', rows: 4 },
};

export const Lista: StoryObj<typeof Select> = {
  render: (args) => (
    <Select {...args}>
      <option value="viscose">Viscose</option>
      <option value="algodao">Algodão</option>
      <option value="moletom">Moletom flanelado</option>
    </Select>
  ),
  args: { defaultValue: 'viscose' },
};

export const SelecionarPedidos: Story = {
  render: () => {
    const [picked, setPicked] = useState<string[]>([MOCK_ORDERS[0].id]);
    const ids = MOCK_ORDERS.map((o) => o.id);
    const all = picked.length === ids.length;
    const some = picked.length > 0 && !all;
    return (
      <div className="flex flex-col">
        <Checkbox
          label={<span className="font-semibold">Selecionar todos</span>}
          checked={all}
          indeterminate={some}
          onChange={() => setPicked(all ? [] : [...ids])}
        />
        {MOCK_ORDERS.map((o) => (
          <Checkbox
            key={o.id}
            label={`Pedido #${o.id} · ${o.buyer}`}
            checked={picked.includes(o.id)}
            onChange={() => setPicked((p) => (p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id]))}
            className="pl-6"
          />
        ))}
        <Checkbox label="Embalar para presente" defaultChecked />
      </div>
    );
  },
};

export const LigaDesliga: StoryObj<typeof Switch> = {
  render: () => {
    const [auto, setAuto] = useState(true);
    return (
      <div className="flex flex-col gap-1">
        <Switch label={auto ? 'Turbinar automático ligado' : 'Turbinar automático desligado'} checked={auto} onCheckedChange={setAuto} />
        <Switch label="Avisar por e-mail" defaultChecked={false} />
        <Switch label="Desabilitado" disabled defaultChecked />
      </div>
    );
  },
};
