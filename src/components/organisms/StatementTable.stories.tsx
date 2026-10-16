import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FIX_EXTRATO } from './financeiroFixtures';
import { StatementTable, type StatementKindFilter } from './StatementTable';

const meta = {
  title: 'Organisms/StatementTable',
  component: StatementTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StatementTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [q, setQ] = useState('');
    const [kind, setKind] = useState<StatementKindFilter>('all');
    return (
      <StatementTable
        rows={FIX_EXTRATO}
        total={FIX_EXTRATO.length}
        q={q}
        kind={kind}
        onQChange={setQ}
        onKindChange={setKind}
        onExportCsv={() => undefined}
        onExportPdf={() => undefined}
      />
    );
  },
};
