import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CampaignWizard,
  type CampaignDurationDays,
  type CampaignWizardProduct,
} from './CampaignWizard';

const PRODUCTS: CampaignWizardProduct[] = [
  { itemId: 1, name: 'Conjunto moletom flanelado', imageUrl: null },
  { itemId: 2, name: 'Conjunto de ficar em casa', imageUrl: null },
  { itemId: 3, name: 'Vestido midi estampa floral', imageUrl: null },
  { itemId: 4, name: 'Camisa de viscose', imageUrl: null },
  { itemId: 5, name: 'Calça pantalona', imageUrl: null },
  { itemId: 6, name: 'Blusa animal print', imageUrl: null },
];

const meta = {
  title: 'Organisms/CampaignWizard',
  component: CampaignWizard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Wizard de nova campanha (SHP-111): peças → orçamento/duração → revisar. Usa WizardPage.
        `,
      },
    },
  },
} satisfies Meta<typeof CampaignWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    const [selectedIds, setSelectedIds] = useState<number[]>([1, 2]);
    const [dailyBudget, setDailyBudget] = useState(15);
    const [durationDays, setDurationDays] = useState<CampaignDurationDays>(14);
    const [ack, setAck] = useState(false);
    return (
      <div className="p-6">
        <CampaignWizard
          products={PRODUCTS}
          selectedIds={selectedIds}
          onToggleProduct={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
            )
          }
          dailyBudget={dailyBudget}
          onDailyBudgetChange={setDailyBudget}
          durationDays={durationDays}
          onDurationChange={setDurationDays}
          creditAvailable={38.2}
          acknowledgedCredit={ack}
          onAcknowledgedChange={setAck}
          step={step}
          onStepChange={setStep}
          onBack={() => undefined}
          onSubmit={() => undefined}
        />
      </div>
    );
  },
};
