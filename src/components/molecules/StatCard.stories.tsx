import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { MOCK_WALLET } from '@/stories/mocks';
import { KeyValueList, KeyValueRow } from './KeyValueRow';
import { StatCard } from './StatCard';

const meta = {
  title: 'Molecules/StatCard e KeyValue',
  component: StatCard,
  parameters: {
    docs: {
      description: {
        component: `
KPIs (StatCard) e linhas de valor (KeyValueRow).

## Como deve funcionar
- **StatCard:** rótulo + valor grande (R$ via \`Money\`, ou texto). \`delta\` com ícone + texto (nunca só cor). \`hint\` auxiliar. \`variant="soft"\` = bloco surface-2.
- **KeyValueRow:** rótulo à esquerda, valor à direita. Número/\`null\` → Money ("—"). \`tone\` + \`moneyKind\` para descontos (− vermelho). \`emphasis\` no total.
- Valores vazios / sem \`financeiro.ver\`: passe \`null\` → "—".

## Como testar
1. Tema claro/escuro.
2. Story **KPIs**: confira +12% (verde) e −8% (vermelho) com ícone.
3. Story **Valores do pedido**: descontos em vermelho com sinal −; líquido em destaque verde.
4. Story **Vazios**: todos os "—" legíveis e com \`sr-only\` "sem valor" no Money.
        `,
      },
    },
  },
  args: {
    label: 'Vendido hoje',
    value: 649.5,
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    variant: { control: 'select', options: ['plain', 'soft'] },
    size: { control: 'select', options: ['md', 'sm'] },
    delta: { control: false, table: { disable: true } },
    hint: { control: 'text' },
    icon: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UmKPI: Story = {
  args: {
    label: 'Vendido hoje',
    value: 649.5,
    delta: { label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp },
  },
};

export const KPIs: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
      <StatCard
        label="Vendido hoje"
        value={649.5}
        delta={{ label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp }}
      />
      <StatCard label="7 dias" value={4218.3} />
      <StatCard
        label="Outubro"
        value={5876.4}
        delta={{ label: '−8% vs. meta', tone: 'danger', icon: TrendingDown }}
      />
      <StatCard label="A receber" value={MOCK_WALLET.in} hint="em liberação pela Shopee" variant="soft" size="sm" />
      <StatCard label="Na carteira" value={MOCK_WALLET.out} hint="disponível para saque" variant="soft" size="sm" icon={Wallet} />
      <StatCard label="Pedidos hoje" value={<span className="money">6</span>} hint="para enviar" variant="soft" size="sm" />
    </div>
  ),
};

export const ValoresDoPedido: StoryObj = {
  render: () => (
    <KeyValueList aria-label="Valores do pedido" className="max-w-md rounded-md border border-line px-4">
      <KeyValueRow label="Valor da peça (bruto)" value={129.9} />
      <KeyValueRow
        label={
          <>
            Comissão Shopee <span className="text-muted">(14%)</span>
          </>
        }
        value={18.19}
        moneyKind="out"
        tone="danger"
      />
      <KeyValueRow label="Taxa por item vendido" value={4} moneyKind="out" tone="danger" />
      <KeyValueRow
        label={
          <>
            Frete <span className="text-muted">(frete grátis, 6%)</span>
          </>
        }
        value={7.79}
        moneyKind="out"
        tone="danger"
      />
      <KeyValueRow
        label="Líquido a receber"
        hint="Liberado pela Shopee após a entrega · previsão 18/10"
        value={99.92}
        tone="ok"
        emphasis
        flush
      />
    </KeyValueList>
  ),
};

export const Vazios: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Vendido hoje" value={null} hint="sem permissão financeira" />
        <StatCard label="Na carteira" value={undefined} variant="soft" size="sm" />
      </div>
      <KeyValueList aria-label="Extrato oculto" className="rounded-md border border-line px-4">
        <KeyValueRow label="Venda #K7Q2M" value={null} />
        <KeyValueRow label="Comissão" value={null} flush />
      </KeyValueList>
    </div>
  ),
};
