import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinanceSummary } from './FinanceSummary';
import { FIX_PERIOD } from './financeiroFixtures';

const meta = {
  title: 'Organisms/FinanceSummary',
  component: FinanceSummary,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FinanceSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { period: FIX_PERIOD },
};

export const Loading: Story = {
  args: { period: null, loading: true },
};
