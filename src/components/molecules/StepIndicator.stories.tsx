import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { StepIndicator } from './StepIndicator';

const CADASTRO_STEPS = ['Fotos', 'Categoria', 'Detalhes', 'Variações', 'Preço e envio', 'Revisar'];

const meta = {
  title: 'Molecules/StepIndicator',
  component: StepIndicator,
  parameters: {
    docs: {
      description: {
        component: `
Passos do assistente (fita).

## Como deve funcionar
- Passos **feitos** = círculo sálvia + ✓.
- Passo **atual** = pílula brand-soft + número brand.
- Passos **futuros** = círculo tracejado.
- No celular (\`< md\`): esconde rótulos inativos e mostra "Passo X de N · nome".
- Com \`onStepClick\`, os passos são clicáveis.

## Como testar
1. Story **Assistente**: clique na fita — done / atual / futuro mudam.
2. Controls: mude \`current\` (1–6) e veja os estados.
3. Redimensione o canvas para ~390 px e confira o resumo mobile.
        `,
      },
    },
  },
  args: {
    steps: CADASTRO_STEPS,
    current: 3,
    mobileSummary: true,
    'aria-label': 'Passos',
  },
  argTypes: {
    current: { control: { type: 'number', min: 1, max: 6, step: 1 } },
    mobileSummary: { control: 'boolean' },
    onStepClick: { control: false, table: { disable: true } },
    steps: { control: false },
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UmPasso: Story = {
  render: (args) => (
    <div className="max-w-2xl rounded-md border border-line bg-surface p-3">
      <StepIndicator {...args} />
    </div>
  ),
};

export const Assistente: Story = {
  parameters: { controls: { disable: true } },
  render: function AssistenteDemo() {
    const [step, setStep] = useState(3);
    return (
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="text-xs text-muted">Clique num passo para mudar o estado (done / atual / futuro).</p>
        <div className="rounded-md border border-line bg-surface p-3">
          <StepIndicator steps={CADASTRO_STEPS} current={step} onStepClick={setStep} />
        </div>
        <p className="text-sm text-muted">
          Conteúdo do passo <span className="font-bold text-ink">{CADASTRO_STEPS[step - 1]}</span>.
        </p>
      </div>
    );
  },
};
