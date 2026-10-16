import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';

const DAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
const MONTHS = ['mai', 'jun', 'jul', 'ago', 'set', 'out'];

const meta = {
  title: 'Organisms/Gráficos',
  parameters: {
    docs: {
      description: {
        component: `
Gráficos simples Botho (CSS + SVG, sem lib).

## Como deve funcionar
- **BarChart:** barras agrupadas por categoria (entradas × saídas / mês a mês).
- **LineChart:** linha(s) com guias horizontais estilo fita; barras de fundo opcionais.
- **Legenda:** sempre texto + cor (nunca só cor).
- **Tooltip:** no hover (e foco) de cada barra/ponto — categoria + série + valor.
- Tokens \`salvia\` / \`mostarda\` / \`brand\` / … — legível em claro e escuro.

## Como testar
1. Story **Entradas e saídas**: passe o mouse nas barras e confira o tooltip.
2. Story **Mês a mês**: três séries (resultado em brand).
3. Story **Gasto × vendas**: tooltip nas barras verdes e nos pontos da linha.
4. Viewport ~390 e 1440; toolbar Tema.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const EntradasESaidas: Story = {
  name: 'Barras · 7 dias',
  render: () => (
    <div className="max-w-xl rounded-lg border border-line bg-surface p-4">
      <p className="mb-3 text-sm font-bold">Entradas × saídas · 7 dias</p>
      <BarChart
        aria-label="Entradas e saídas dos últimos 7 dias"
        categories={DAYS}
        height={140}
        series={[
          { id: 'in', label: 'Entradas', tone: 'salvia', values: [520, 610, 480, 702, 640, 590, 550] },
          { id: 'out', label: 'Saídas', tone: 'mostarda', values: [140, 160, 118, 171, 150, 130, 145] },
        ]}
      />
    </div>
  ),
};

export const MesAMes: Story = {
  name: 'Barras · mês a mês',
  render: () => (
    <div className="max-w-2xl rounded-lg border border-line bg-surface p-4">
      <p className="mb-3 text-sm font-bold">Mês a mês</p>
      <BarChart
        aria-label="Entradas, saídas e resultado de maio a outubro"
        categories={MONTHS}
        height={180}
        series={[
          { id: 'in', label: 'Entradas', tone: 'salvia', values: [6100, 8200, 10100, 12400, 16900, 5900] },
          { id: 'out', label: 'Saídas', tone: 'mostarda', values: [3200, 4100, 4500, 5200, 6100, 2800] },
          { id: 'net', label: 'Resultado', tone: 'brand', values: [2900, 4100, 5600, 7200, 10800, 3100] },
        ]}
      />
    </div>
  ),
};

export const GastoXVendas: Story = {
  name: 'Linha · gasto × vendas',
  render: () => {
    const days = Array.from({ length: 14 }, (_, i) => `${i + 1}/10`);
    const sales = [180, 220, 90, 260, 200, 310, 150, 280, 190, 240, 120, 300, 270, 210];
    const spend = [45, 80, 60, 140, 110, 190, 95, 220, 160, 250, 130, 280, 200, 170];
    return (
      <div className="max-w-2xl rounded-lg border border-line bg-surface p-4">
        <p className="mb-3 text-sm font-bold">Campanha · 14 dias</p>
        <LineChart
          aria-label="Vendas geradas pelo anúncio e gasto diário"
          categories={days}
          height={220}
          yLabels={['R$ 300', 'R$ 200', 'R$ 100', 'R$ 0']}
          formatValue={(n) =>
            n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          }
          bars={{ id: 'sales', label: 'Vendas geradas pelo anúncio', tone: 'salvia', values: sales }}
          series={[{ id: 'spend', label: 'Gasto por dia', tone: 'mostarda', values: spend }]}
        />
      </div>
    );
  },
};
