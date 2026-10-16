import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarRow } from './BarRow';
import { TapeProgress } from './TapeProgress';

const meta = {
  title: 'Molecules/Fita e barras',
  component: TapeProgress,
  parameters: {
    docs: {
      description: {
        component: `
Fita métrica (TapeProgress) e barras horizontais (BarRow).

## Como deve funcionar
- **TapeProgress:** \`value\`/\`max\` → %, ticks da utilitária \`tape\`, tons brand/ok/warn/danger/info. \`size="sm"\` fina. \`scale\` opcional sob a fita.
- **BarRow:** rótulo | trilha | valor. \`ratio\` 0–1 ou 0–100. Valor número → Money ("—" se nulo).
- 0% / parcial / 100% devem renderizar sem estourar.

## Como testar
1. Tema claro/escuro — ticks e preenchimento legíveis.
2. Story **Escalas**: 0%, 33%, 100% e tons.
3. Story **Para onde foi o dinheiro**: barras relativas (comissão 100%, frete 43%).
4. ~390 px: a fita e as barras encolhem sem rolagem lateral.
        `,
      },
    },
  },
  args: {
    'aria-label': 'Meta de outubro',
    value: 5876,
    max: 18000,
    tone: 'brand',
    size: 'md',
  },
  argTypes: {
    tone: { control: 'select', options: ['brand', 'ok', 'warn', 'danger', 'info'] },
    size: { control: 'select', options: ['md', 'sm'] },
    value: { control: 'number' },
    max: { control: 'number' },
    scale: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof TapeProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetaDoMes: Story = {
  args: {
    scale: ['0', '4,5 mil', '9 mil', '13,5 mil', '18 mil'],
  },
};

export const Escalas: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-5">
      <div>
        <div className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">0%</div>
        <TapeProgress aria-label="Vazio" value={0} max={100} />
      </div>
      <div>
        <div className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">33% · brand</div>
        <TapeProgress
          aria-label="Parcial"
          value={33}
          max={100}
          scale={['0', '4,5 mil', '9 mil', '13,5 mil', '18 mil']}
        />
      </div>
      <div>
        <div className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">100%</div>
        <TapeProgress aria-label="Completo" value={100} max={100} tone="ok" />
      </div>
      <div className="flex flex-col gap-2">
        <TapeProgress aria-label="Ok" value={66} size="sm" tone="ok" />
        <TapeProgress aria-label="Atenção" value={20} size="sm" tone="warn" />
        <TapeProgress aria-label="Perigo" value={8} size="sm" tone="danger" />
        <TapeProgress aria-label="Info" value={45} size="sm" tone="info" />
      </div>
    </div>
  ),
};

export const ParaOndeFoiODinheiro: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-2.5">
      <BarRow label="Comissão" value={822} ratio={1} tone="brand" />
      <BarRow label="Frete" value={352} ratio={0.43} tone="mostarda" />
      <BarRow label="Ads" value={186.2} ratio={0.23} tone="anil" />
      <BarRow label="Taxas" value={98} ratio={0.12} tone="danger" />
      <BarRow label="Sem valor" value={null} ratio={0} tone="salvia" />
    </div>
  ),
};
