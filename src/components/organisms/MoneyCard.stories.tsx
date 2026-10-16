import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/molecules/EmptyState';
import { MoneyCard } from './MoneyCard';
import { INICIO_CHART, INICIO_GOAL } from './inicioFixtures';

const meta = {
  title: 'Organisms/MoneyCard',
  component: MoneyCard,
  parameters: {
    docs: {
      description: {
        component: `
Dinheiro do Início (SHP-73): KPIs, meta, carteira/Ads e gráfico de barras.

## Como testar
1. Clique em Financeiro.
2. Story Sem permissão: mensagem bloqueada.
3. Hover nas barras do gráfico.
        `,
      },
    },
  },
} satisfies Meta<typeof MoneyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completo: Story = {
  args: {
    hoje: 649.5,
    seteDias: 4218.3,
    mes: 5876.4,
    mesLabel: 'Outubro',
    aReceber: 3412.85,
    carteira: 1286.4,
    adsGasto: 186.2,
    hojeDelta: { label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp },
    goal: INICIO_GOAL,
    chart: INICIO_CHART,
    onFinanceiro: () => undefined,
  },
};

export const SemPermissao: Story = {
  name: 'Sem permissão',
  args: {
    lockedMessage: (
      <EmptyState
        illustration="carretel"
        align="center"
        title="Sem acesso ao financeiro"
        description="Peça o papel financeiro.ver para ver os números."
        className="w-full py-2"
      />
    ),
  },
};
