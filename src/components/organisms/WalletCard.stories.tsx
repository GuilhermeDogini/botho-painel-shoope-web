import type { Meta, StoryObj } from '@storybook/react-vite';
import { FIX_A_RECEBER } from './financeiroFixtures';
import { WalletCard } from './WalletCard';

const meta = {
  title: 'Organisms/WalletCard',
  component: WalletCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof WalletCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    balance: FIX_A_RECEBER.balance,
    repasses: FIX_A_RECEBER.repasses,
  },
};
