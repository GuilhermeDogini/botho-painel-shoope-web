import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { OrdersToShipCard } from './OrdersToShipCard';
import { INICIO_ORDERS } from './inicioFixtures';

afterEach(cleanup);

describe('OrdersToShipCard', () => {
  test('mostra contagem e urgência', () => {
    render(<OrdersToShipCard count={6} dueLabel="2 vencem hoje às 18h" orders={INICIO_ORDERS.slice(0, 2)} />);
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText(/pedidos a enviar hoje/i)).toBeTruthy();
    expect(screen.getByText(/2 vencem hoje/i)).toBeTruthy();
  });

  test('callbacks de ações principais', async () => {
    const user = userEvent.setup();
    const onPrintLabels = vi.fn();
    const onSeparacao = vi.fn();
    const onViewAll = vi.fn();
    render(
      <OrdersToShipCard
        count={6}
        orders={INICIO_ORDERS.slice(0, 1)}
        onPrintLabels={onPrintLabels}
        onSeparacao={onSeparacao}
        onViewAll={onViewAll}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Imprimir etiquetas/i }));
    await user.click(screen.getByRole('button', { name: /Lista de separação/i }));
    await user.click(screen.getByRole('button', { name: /Ver todos/i }));
    expect(onPrintLabels).toHaveBeenCalledTimes(1);
    expect(onSeparacao).toHaveBeenCalledTimes(1);
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  test('clique no pedido', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <OrdersToShipCard
        count={1}
        orders={[{ ...INICIO_ORDERS[0], onClick }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Vestido midi/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('mostra progresso de separação', () => {
    render(
      <OrdersToShipCard count={6} orders={[]} packing={{ packed: 4, total: 6 }} />,
    );
    expect(screen.getByText(/4 de 6 embalados/i)).toBeTruthy();
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  test('raiz evita overflow horizontal', () => {
    const { container } = render(<OrdersToShipCard count={0} orders={[]} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/overflow-x-hidden/);
    expect(root.className).toMatch(/min-w-0/);
  });

  test('Expedição: sem R$ nos pedidos', () => {
    render(
      <OrdersToShipCard
        count={1}
        orders={[INICIO_ORDERS[0]]}
        showTotals={false}
      />,
    );
    expect(screen.queryByText(/R\$/)).toBeNull();
    expect(screen.getByText(/Vestido midi/i)).toBeTruthy();
  });
});
