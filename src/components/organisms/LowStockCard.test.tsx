import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { LowStockCard } from './LowStockCard';
import { INICIO_STOCK } from './inicioFixtures';

afterEach(cleanup);

describe('LowStockCard', () => {
  test('lista itens e quantidades', () => {
    render(<LowStockCard items={INICIO_STOCK} />);
    expect(screen.getByRole('heading', { name: /Estoque acabando/i })).toBeTruthy();
    expect(screen.getByText('Vestido midi estampa floral')).toBeTruthy();
    expect(screen.getByText('1 un.')).toBeTruthy();
    expect(screen.getByText('Esgotou')).toBeTruthy();
  });

  test('Repor dispara callback', async () => {
    const user = userEvent.setup();
    const onRepor = vi.fn();
    render(<LowStockCard items={INICIO_STOCK.slice(0, 1)} onRepor={onRepor} />);
    await user.click(screen.getByRole('button', { name: /Repor/i }));
    expect(onRepor).toHaveBeenCalledTimes(1);
  });

  test('estado vazio', () => {
    render(<LowStockCard items={[]} />);
    expect(screen.getByText(/Estoque em dia/i)).toBeTruthy();
  });
});
