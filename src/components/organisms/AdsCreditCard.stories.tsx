import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsCreditCard } from './AdsCreditCard';
import type { AdsCredit } from '@/lib/types';

const CREDIT: AdsCredit = {
  total: 38.2,
  paid: 28.2,
  free: 10,
  spendPerDay: 18.6,
  daysLeft: 2,
  autoTopupEnabled: false,
  rechargeUrl: 'https://seller.shopee.com.br/portal/marketing/pas/balance',
};

const meta = {
  title: 'Organisms/AdsCreditCard',
  component: AdsCreditCard,
  parameters: {
    docs: {
      description: {
        component: `
Crédito de Ads (SHP-110): saldo, pago/grátis, ritmo e link do Seller Center.
        `,
      },
    },
  },
} satisfies Meta<typeof AdsCreditCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: { credit: CREDIT },
};

export const AutotopupLigado: Story = {
  args: { credit: { ...CREDIT, autoTopupEnabled: true, daysLeft: 12 } },
};

export const Carregando: Story = {
  args: { credit: null, loading: true },
};
