import type { Meta, StoryObj } from '@storybook/react-vite';
import { FIX_A_RECEBER } from './financeiroFixtures';
import { ReceivablesCard } from './ReceivablesCard';

const meta = {
  title: 'Organisms/ReceivablesCard',
  component: ReceivablesCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ReceivablesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: FIX_A_RECEBER.amount,
    groups: FIX_A_RECEBER.groups,
  },
};
