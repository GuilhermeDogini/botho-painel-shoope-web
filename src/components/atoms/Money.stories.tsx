import type { Meta, StoryObj } from '@storybook/react-vite';
import { MOCK_WALLET } from '@/stories/mocks';
import { Eyebrow } from './Eyebrow';
import { Heading } from './Heading';
import { Money } from './Money';
import { Text } from './Text';

const meta = {
  title: 'Atoms/Tipografia e Money',
  component: Money,
  parameters: {
    docs: {
      description: {
        component: `
Tipografia da Botho e valores em R$.

## Como deve funcionar
- **Heading:** \`level\` (h1…h4 semântico) separado de \`size\` (xl, big, h1, h2, h3 visual).
- **Eyebrow:** caixa alta 12 px (rótulo acima de número/bloco).
- **Text:** corpo / small / xs, com tons (ok, warn, danger…).
- **Money:** números tabulares, sem quebra; \`kind\` \`in\` (+ verde), \`out\` (− vermelho) ou \`neutral\`.
- \`value\` nulo/undefined → "—" (API tirou o valor com \`@RedactMoney\` para quem não tem \`financeiro.ver\`).
- \`plain\` tira a cor e mantém o sinal (ex.: gasto de Ads, que sai do crédito).

## Como testar
1. Tema claro/escuro.
2. Controls do Money: mude \`value\`, \`kind\`, \`plain\`.
3. Story **Valor escondido**: deve aparecer "—" e o leitor de tela ouve "sem valor".
4. Story **Extrato**: confira o alinhamento dos valores na coluna direita.
        `,
      },
    },
  },
  args: { value: MOCK_WALLET.net, kind: 'neutral', plain: false },
  argTypes: {
    value: { control: 'number' },
    kind: { control: 'select', options: ['neutral', 'in', 'out'] },
    plain: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Money>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutro: Story = { args: { value: 3412.85 } };

export const Entrada: Story = { args: { value: MOCK_WALLET.in, kind: 'in' } };

export const Saida: Story = { args: { value: MOCK_WALLET.commission, kind: 'out' } };

export const ValorEscondido: Story = {
  args: { value: undefined },
  parameters: {
    docs: { description: { story: 'Simula a resposta da API sem as chaves de dinheiro.' } },
  },
};

export const EscalaTipografica: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={2} size="xl">
        R$ 1.234
      </Heading>
      <Heading level={2} size="big">
        6 pedidos
      </Heading>
      <Heading level={1}>Pedidos</Heading>
      <Heading level={2}>Lista de separação</Heading>
      <Heading level={3}>Estoque acabando</Heading>
      <Text>Você tem 6 pedidos para enviar hoje.</Text>
      <Text size="small" tone="muted">
        Pago em 08/10 às 09:12
      </Text>
      <Eyebrow>Crédito de Ads</Eyebrow>
    </div>
  ),
};

export const Extrato: Story = {
  render: () => (
    <div className="max-w-md rounded-md border border-line">
      {[
        { label: 'Venda #K7Q2M', value: 119.9, kind: 'in' as const },
        { label: 'Comissão da Shopee', value: MOCK_WALLET.commission, kind: 'out' as const },
        { label: 'Taxa de serviço', value: MOCK_WALLET.serviceFee, kind: 'out' as const },
        { label: 'Frete (parte da loja)', value: MOCK_WALLET.shipping, kind: 'out' as const },
        { label: 'Gasto com Ads (crédito)', value: MOCK_WALLET.out, kind: 'out' as const, plain: true },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 text-sm last:border-0">
          <span>{row.label}</span>
          <Money value={row.value} kind={row.kind} plain={row.plain} className="font-bold" />
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 bg-surface-2 px-4 py-2.5 text-sm">
        <span className="font-bold">Ficou com a loja</span>
        <Money value={MOCK_WALLET.net} className="font-bold" />
      </div>
    </div>
  ),
};
