import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { OrderCounts, OrderSummary } from '@/lib/types';
import { deadlineOf, formatVariation, OrdersList } from './OrdersList';

afterEach(() => cleanup());

const COUNTS: OrderCounts = {
  a_enviar: 6,
  aguardando_coleta: 4,
  enviados: 2,
  entregues: 8,
  cancelados: 1,
  devolucoes: 1,
};

const ORDER: OrderSummary = {
  orderSn: '251008K7Q2M',
  status: 'READY_TO_SHIP',
  tab: 'a_enviar',
  createdAt: '2026-10-07T15:00:00.000Z',
  paidAt: '2026-10-07T15:05:00.000Z',
  shipByDate: '2026-10-10T21:00:00.000Z',
  buyerUsername: 'anapaula.melo',
  recipientName: 'Ana P.',
  city: 'São Paulo',
  state: 'SP',
  zipcode: '01***-***',
  itemCount: 1,
  items: [
    {
      itemId: 900_101,
      modelId: 1,
      name: 'Vestido midi estampa floral',
      variation: 'Azul anil,M',
      sku: 'VMF-ANIL-M',
      quantity: 1,
      imageUrl: null,
      unitPrice: 129.9,
      itemTotal: 129.9,
    },
  ],
  currency: 'BRL',
  orderTotal: 129.9,
  updatedAt: '2026-10-07T15:05:00.000Z',
};

describe('OrdersList helpers', () => {
  test('formatVariation', () => {
    expect(formatVariation('Azul anil,M')).toBe('Azul anil · M');
    expect(formatVariation(null)).toBeUndefined();
  });

  test('deadlineOf hoje', () => {
    const now = new Date('2026-10-10T12:00:00.000Z');
    const d = deadlineOf('2026-10-10T21:00:00.000Z', now);
    expect(d?.urgency).toBe('today');
  });
});

describe('OrdersList', () => {
  test('mostra abas, filtro e linha do pedido', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    const onFiltersChange = vi.fn();

    render(
      <OrdersList
        orders={[ORDER]}
        counts={COUNTS}
        venceHojeCount={2}
        tab="a_enviar"
        onTabChange={onTabChange}
        filters={{ venceHoje: false, multiItem: false, ultimos7Dias: false, q: '' }}
        onFiltersChange={onFiltersChange}
      />,
    );

    expect(screen.getByRole('tab', { name: /A enviar/i })).toBeTruthy();
    expect(screen.getByText(/Vestido midi/i)).toBeTruthy();
    expect(screen.getByText(/Azul anil · M/i)).toBeTruthy();

    await user.click(screen.getByRole('tab', { name: /Devoluções/i }));
    expect(onTabChange).toHaveBeenCalledWith('devolucoes');

    await user.click(screen.getByRole('button', { name: /Vence hoje/i }));
    expect(onFiltersChange).toHaveBeenCalledWith(expect.objectContaining({ venceHoje: true }));
  });

  test('esconde valor sem showMoney', () => {
    render(
      <OrdersList
        orders={[ORDER]}
        counts={COUNTS}
        venceHojeCount={0}
        tab="a_enviar"
        onTabChange={() => undefined}
        filters={{ venceHoje: false, multiItem: false, ultimos7Dias: false, q: '' }}
        onFiltersChange={() => undefined}
        showMoney={false}
      />,
    );
    expect(screen.queryAllByRole('columnheader', { name: 'Valor' })).toHaveLength(0);
    expect(screen.queryAllByText(/R\$\s*129/)).toHaveLength(0);
  });
});
