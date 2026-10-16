import type { Meta, StoryObj } from '@storybook/react-vite';
import { FIX_PERIOD } from './financeiroFixtures';
import { WhereMoneyWent } from './WhereMoneyWent';

const meta = {
  title: 'Organisms/WhereMoneyWent',
  component: WhereMoneyWent,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof WhereMoneyWent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    where: FIX_PERIOD.where,
    per100: FIX_PERIOD.per100,
  },
};
