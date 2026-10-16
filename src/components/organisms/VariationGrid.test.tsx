import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { VariationGrid } from './VariationGrid';
import { buildVariationGrid } from './variationGridShared';
import { MOLETOM_ROWS, MOLETOM_SIZES } from './variationGridFixtures';

afterEach(cleanup);

describe('buildVariationGrid', () => {
  test('agrupa cor × tamanho e marca célula ausente', () => {
    const { sizes, rows } = buildVariationGrid(
      [
        { modelId: 1, color: 'Rosa', size: 'P', price: 10, stock: 4 },
        { modelId: 2, color: 'Rosa', size: 'M', price: 10, stock: 2 },
        { modelId: 3, color: 'Anil', size: 'P', price: 12, stock: 1 },
      ],
      ['P', 'M', 'G'],
    );
    expect(sizes).toEqual(['P', 'M', 'G']);
    expect(rows).toHaveLength(2);
    expect(rows[0]!.cells[2]!.modelId).toBeNull();
    expect(rows[1]!.cells[1]!.modelId).toBeNull();
    expect(rows[1]!.cells[0]!.stock).toBe(1);
  });
});

describe('VariationGrid', () => {
  test('renderiza cores e tamanhos; célula off é —', () => {
    render(<VariationGrid sizes={[...MOLETOM_SIZES]} rows={MOLETOM_ROWS} hideFooter />);
    expect(screen.getByText('Rosa')).toBeTruthy();
    expect(screen.getByText('Azul anil')).toBeTruthy();
    expect(screen.getByLabelText('Azul anil G2 não vende')).toBeTruthy();
  });

  test('editar célula e salvar em lote', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <VariationGrid sizes={[...MOLETOM_SIZES]} rows={MOLETOM_ROWS} onSave={onSave} onCancel={() => undefined} />,
    );

    const save = screen.getByRole('button', { name: /Salvar na Shopee/i });
    expect((save as HTMLButtonElement).disabled).toBe(true);

    const rosaM = screen.getByLabelText('Rosa M');
    await user.clear(rosaM);
    await user.type(rosaM, '9');
    expect((save as HTMLButtonElement).disabled).toBe(false);

    await user.click(save);
    expect(onSave).toHaveBeenCalledTimes(1);
    const [changes, mode] = onSave.mock.calls[0]!;
    expect(mode).toBe('stock');
    expect(changes).toEqual([{ modelId: 2, value: 9 }]);
  });

  test('alternar para preço e aplicar em todas', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <VariationGrid
        sizes={['P', 'M']}
        rows={[
          {
            color: 'Rosa',
            colorHex: '#E9A6B9',
            cells: [
              { modelId: 1, stock: 4, price: 159.9 },
              { modelId: 2, stock: 2, price: 159.9 },
            ],
          },
        ]}
        onSave={onSave}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Preço' }));
    await user.type(screen.getByLabelText('Valor para todas'), '149,90');
    await user.click(screen.getByRole('button', { name: /Aplicar em todas/i }));
    await user.click(screen.getByRole('button', { name: /Salvar na Shopee/i }));

    expect(onSave).toHaveBeenCalled();
    const [changes, mode] = onSave.mock.calls[0]!;
    expect(mode).toBe('price');
    expect(changes).toHaveLength(2);
    expect(changes.every((c: { value: number }) => c.value === 149.9)).toBe(true);
  });
});
