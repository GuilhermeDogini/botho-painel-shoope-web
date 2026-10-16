import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './DataTable';

afterEach(cleanup);

type Row = { id: string; name: string; value: number };

const rows: Row[] = [
  { id: 'a', name: 'Vestido', value: 100 },
  { id: 'b', name: 'Pantalona', value: 50 },
  { id: 'c', name: 'Conjunto', value: 200 },
];

const columns: DataTableColumn<Row>[] = [
  {
    id: 'name',
    header: 'Peça',
    sortable: true,
    sortValue: (r) => r.name,
    card: 'primary',
    cell: (r) => r.name,
  },
  {
    id: 'value',
    header: 'Valor',
    align: 'right',
    sortable: true,
    sortValue: (r) => r.value,
    card: 'trailing',
    cell: (r) => r.value,
  },
];

describe('DataTable', () => {
  test('ordena ao clicar no cabeçalho', async () => {
    const user = userEvent.setup();
    render(
      <DataTable aria-label="Teste" columns={columns} rows={rows} getRowId={(r) => r.id} pageSize={10} />,
    );

    const table = screen.getByRole('table', { name: 'Teste' });
    await user.click(within(table).getByRole('button', { name: /Valor/i }));

    const cells = within(table).getAllByRole('cell');
    // Após ordenar asc por valor: 50, 100, 200 (cada linha tem name+value)
    const values = cells.filter((_, i) => i % 2 === 1).map((c) => c.textContent);
    expect(values).toEqual(['50', '100', '200']);
  });

  test('seleciona todos da página', async () => {
    const user = userEvent.setup();
    const onSelected = vi.fn();
    render(
      <DataTable
        aria-label="Teste"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        selectable
        selectedIds={[]}
        onSelectedIdsChange={onSelected}
        pageSize={10}
      />,
    );

    await user.click(screen.getByLabelText('Selecionar todos'));
    expect(onSelected).toHaveBeenCalledWith(['a', 'b', 'c']);
  });

  test('mostra empty quando não há linhas', () => {
    render(
      <DataTable aria-label="Vazia" columns={columns} rows={[]} getRowId={(r) => r.id} />,
    );
    expect(screen.getByText('Nada por aqui')).toBeTruthy();
  });
});
