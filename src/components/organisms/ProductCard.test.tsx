import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ProductCard } from './ProductCard';
import { PRODUCT_FIXTURES } from './productFixtures';
import { ProductRow } from './ProductRow';

afterEach(cleanup);

describe('ProductCard e ProductRow', () => {
  test('card e linha mostram os mesmos dados da peça turbinada', () => {
    const item = PRODUCT_FIXTURES[0];
    const { rerender } = render(<ProductCard item={item} />);
    expect(screen.getByText(item.name)).toBeTruthy();
    expect(screen.getByText('Turbinada')).toBeTruthy();
    expect(screen.getByText('1 variação acabando')).toBeTruthy();
    expect(screen.getByText(/34 vendidas · 30d/i)).toBeTruthy();
    expect(screen.getByText(/18 em estoque/i)).toBeTruthy();
    expect(screen.getByText(/3 cores · P ao GG/i)).toBeTruthy();

    rerender(<ProductRow item={item} />);
    expect(screen.getByText(item.name)).toBeTruthy();
    expect(screen.getByText('Turbinada')).toBeTruthy();
    expect(screen.getByText('1 variação acabando')).toBeTruthy();
    expect(screen.getByText('34')).toBeTruthy();
    expect(screen.getByText('18')).toBeTruthy();
    expect(screen.getByText('Vestidos')).toBeTruthy();
  });

  test('selo Pausada na chemise; sem Turbinada', () => {
    render(<ProductCard item={PRODUCT_FIXTURES[3]} />);
    expect(screen.getByText('Pausada')).toBeTruthy();
    expect(screen.queryByText('Turbinada')).toBeNull();
    expect(screen.getByText('Sem estoque')).toBeTruthy();
  });

  test('selo Parada há 30 dias', () => {
    render(<ProductRow item={PRODUCT_FIXTURES[2]} />);
    expect(screen.getByText('Parada há 30 dias')).toBeTruthy();
  });

  test('ações e seleção disparam callbacks', async () => {
    const user = userEvent.setup();
    const onStock = vi.fn();
    const onPause = vi.fn();
    const onSelectedChange = vi.fn();
    const item = PRODUCT_FIXTURES[0];

    render(
      <ProductCard
        item={item}
        selected={false}
        onSelectedChange={onSelectedChange}
        onStock={onStock}
        onPause={onPause}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Estoque/i }));
    expect(onStock).toHaveBeenCalledWith(item);

    await user.click(screen.getByRole('button', { name: `Pausar ${item.name}` }));
    expect(onPause).toHaveBeenCalledWith(item);

    await user.click(screen.getByRole('checkbox', { name: `Selecionar ${item.name}` }));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  test('faixa de preço no moletom', () => {
    render(<ProductCard item={PRODUCT_FIXTURES[1]} />);
    // Money formata com vírgula BR; dois valores na faixa.
    expect(screen.getByText(/159/)).toBeTruthy();
    expect(screen.getByText(/169/)).toBeTruthy();
  });
});
