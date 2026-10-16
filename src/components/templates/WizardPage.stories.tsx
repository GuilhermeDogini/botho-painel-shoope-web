import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { WizardPage } from './WizardPage';

const STEPS = ['Fotos', 'Categoria', 'Detalhes', 'Variações', 'Preço e envio', 'Revisar'];

const meta = {
  title: 'Templates/WizardPage',
  component: WizardPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Assistente (SHP-63): passos + rodapé com rascunho — como Cadastrar.dc.html.

## Como testar
1. Clique em Continuar / Voltar e nos passos.
2. “Salvar rascunho” aparece a partir de sm.
        `,
      },
    },
  },
} satisfies Meta<typeof WizardPage>;

export default meta;
type Story = StoryObj<typeof WizardPage>;

function Demo() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState('Rascunho salvo às 10:48');
  const last = step >= STEPS.length;

  return (
    <WizardPage
      title="Cadastrar peça"
      backLabel="Produtos"
      onBack={() => undefined}
      draftStatus={draft}
      steps={STEPS}
      currentStep={step}
      onStepClick={setStep}
      disableBack={step <= 1}
      onPrevious={() => setStep((s) => Math.max(1, s - 1))}
      onSaveDraft={() => setDraft(`Rascunho salvo às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`)}
      primaryLabel={last ? 'Publicar na Shopee' : 'Continuar'}
      primaryShowChevron={!last}
      onPrimary={() => setStep((s) => Math.min(STEPS.length, s + 1))}
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-h2 font-bold">{STEPS[step - 1]}</h2>
        <p className="text-muted">Conteúdo do passo {step} de {STEPS.length} (organismos entram nas telas).</p>
      </div>
    </WizardPage>
  );
}

export const Cadastrar: Story = {
  name: 'Cadastrar peça (demo)',
  render: () => <Demo />,
};
