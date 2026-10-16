import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CampaignTable, type CampaignFilter } from './CampaignTable';
import type { CampaignView } from '@/lib/types';

const ROWS: CampaignView[] = [
  {
    id: '1001',
    name: 'Moletons de inverno',
    piecesLabel: '3 peças',
    itemIds: [1, 2, 3],
    status: 'active',
    on: true,
    dailyBudget: 15,
    spend: 98.4,
    clicks: 412,
    sales: 612,
    roas: 6.2,
    roasTone: 'good',
    adType: 'manual',
  },
  {
    id: '1002',
    name: 'Vestidos floral',
    piecesLabel: '2 peças',
    itemIds: [4, 5],
    status: 'active',
    on: true,
    dailyBudget: 10,
    spend: 54.1,
    clicks: 198,
    sales: 189.9,
    roas: 3.5,
    roasTone: 'warn',
    adType: 'manual',
  },
  {
    id: '1003',
    name: 'Pijamas de malha',
    piecesLabel: '1 peça',
    itemIds: [6],
    status: 'active',
    on: true,
    dailyBudget: 8,
    spend: 33.7,
    clicks: 140,
    sales: 0,
    roas: 0,
    roasTone: 'bad',
    adType: 'manual',
  },
  {
    id: '1004',
    name: 'Pantalona alfaiataria',
    piecesLabel: '1 peça',
    itemIds: [7],
    status: 'paused',
    on: false,
    dailyBudget: 12,
    spend: 0,
    clicks: null,
    sales: 0,
    roas: 4.1,
    roasTone: 'starting',
    adType: 'manual',
  },
];

const meta = {
  title: 'Organisms/CampaignTable',
  component: CampaignTable,
  parameters: {
    docs: {
      description: {
        component: `
Tabela de campanhas (SHP-110): chips, Tag de retorno e Switch.
        `,
      },
    },
  },
} satisfies Meta<typeof CampaignTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => {
    const [filter, setFilter] = useState<CampaignFilter>('all');
    const [rows, setRows] = useState(ROWS);
    const filtered =
      filter === 'all' ? rows : rows.filter((r) => (filter === 'active' ? r.on : !r.on));
    return (
      <CampaignTable
        campaigns={filtered}
        counts={{
          all: rows.length,
          active: rows.filter((r) => r.on).length,
          paused: rows.filter((r) => !r.on).length,
        }}
        filter={filter}
        periodDays={7}
        onFilterChange={setFilter}
        onToggle={(c, next) => {
          setRows((prev) =>
            prev.map((r) =>
              r.id === c.id
                ? { ...r, on: next, status: next ? 'active' : 'paused' }
                : r,
            ),
          );
        }}
      />
    );
  },
};
