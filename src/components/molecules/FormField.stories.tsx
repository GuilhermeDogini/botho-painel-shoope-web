import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { MOCK_PRODUCTS } from '@/stories/mocks';
import { FormField } from './FormField';
import { MoneyField } from './MoneyField';
import { SearchField } from './SearchField';

const meta = {
  title: 'Molecules/Campos de formulário',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component: `
Rótulo + campo + ajuda/erro, valor em R$ e busca.

## Como deve funcionar
- **FormField:** liga \`label\` ↔ campo (\`htmlFor\`/\`id\`), \`hint\` ou \`error\` (erro some a ajuda e marca \`aria-invalid\`). \`required\` mostra * e \`aria-required\`.
- **MoneyField:** prefixo **R$**, texto à direita, máscara pt-BR (milhar com ponto; vírgula nos centavos). Ao sair, completa \`,00\`. \`onValueChange\` devolve número ou \`null\`.
- **SearchField:** ícone à esquerda; com texto, botão **Limpar**. Sem \`label\`, serve na barra.

## Como testar
1. Toolbar **Tema** claro/escuro.
2. Controls: \`error\`, \`hint\`, \`required\` no FormField.
3. Story **Com erro**: Tab no campo — anel vermelho; leitor de tela ouve a mensagem.
4. **MoneyField**: digite \`1202022\` → deve aparecer \`1.202.022\`; saia do campo → \`1.202.022,00\`.
5. **SearchField**: digite algo, clique em Limpar; o X some.
6. ~390 px: os campos ocupam a largura sem estourar.
        `,
      },
    },
  },
  args: {
    label: 'Nome da peça',
    hint: 'Como aparece na Shopee',
    required: false,
    children: <Input placeholder="Vestido midi estampa floral" />,
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    children: { control: false, table: { disable: true } },
    htmlFor: { control: false, table: { disable: true } },
  },
  render: (args) => <FormField {...args} className="max-w-sm" />,
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const Obrigatorio: Story = {
  args: { required: true, hint: 'Obrigatório para publicar' },
};

export const ComErro: Story = {
  args: {
    label: 'Preço',
    hint: 'Ex.: 49,90',
    error: 'Digite um valor em reais',
    children: <Input defaultValue="abc" />,
  },
};

export const ComSelect: Story = {
  args: {
    label: 'Tecido',
    hint: undefined,
    children: (
      <Select defaultValue="viscose">
        <option value="viscose">Viscose</option>
        <option value="algodao">Algodão</option>
        <option value="moletom">Moletom flanelado</option>
      </Select>
    ),
  },
};

export const ComTextarea: Story = {
  args: {
    label: 'Descrição',
    hint: 'Tecido, caimento e medidas',
    children: <Textarea placeholder="Conte o tecido, o caimento e as medidas." />,
  },
  render: (args) => <FormField {...args} className="max-w-md" />,
};

export const CampoDeDinheiro: StoryObj<typeof MoneyField> = {
  render: function MoneyDemo() {
    const [text, setText] = useState('129,90');
    const [parsed, setParsed] = useState<number | null>(129.9);
    return (
      <div className="flex max-w-sm flex-col gap-3">
        <MoneyField
          label="Valor"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onValueChange={setParsed}
          hint="Milhar com ponto; vírgula nos centavos (completa ao sair)"
        />
        <p className="text-sm text-muted">
          Número: <span className="font-mono text-ink">{parsed == null ? 'null' : String(parsed)}</span>
        </p>
        <MoneyField label="Com erro" defaultValue="abc" error="Digite um valor em reais" />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Peça de exemplo: **${MOCK_PRODUCTS[0].name}** · R$ ${MOCK_PRODUCTS[0].price.toFixed(2).replace('.', ',')}.`,
      },
    },
  },
};

export const CampoDeBusca: StoryObj<typeof SearchField> = {
  render: function SearchDemo() {
    const [q, setQ] = useState('pantalona');
    return (
      <div className="flex max-w-md flex-col gap-4">
        <SearchField
          label="Busca"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ('')}
          placeholder="Buscar pedido ou peça"
        />
        <SearchField placeholder="Buscar na barra (sem rótulo)" defaultValue="" />
      </div>
    );
  },
};

export const FormularioDaVitrine: Story = {
  args: {
    label: '—',
    children: <Input />,
  },
  render: function FormDemo() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [priceNum, setPriceNum] = useState<number | null>(null);
    const [query, setQuery] = useState('');
    const nameError = name.length > 0 && name.length < 3 ? 'Mínimo 3 caracteres' : undefined;
    const priceError = price.length > 0 && priceNum == null ? 'Digite um valor em reais' : undefined;

    return (
      <form
        className="grid max-w-lg gap-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <SearchField
          label="Buscar peça parecida"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Nome ou SKU"
        />
        <FormField label="Nome da peça" required hint="Como aparece na Shopee" error={nameError}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vestido midi" />
        </FormField>
        <MoneyField
          label="Preço de venda"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onValueChange={setPriceNum}
          error={priceError}
          hint={priceNum != null ? `Fica R$ ${priceNum.toFixed(2).replace('.', ',')}` : 'Ex.: 129,90'}
        />
        <FormField label="Tecido">
          <Select defaultValue="viscose">
            <option value="viscose">Viscose</option>
            <option value="algodao">Algodão</option>
          </Select>
        </FormField>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Formulário junto (como na Vitrine): digite nome curto ou preço inválido para ver o erro ao vivo.',
      },
    },
  },
};
