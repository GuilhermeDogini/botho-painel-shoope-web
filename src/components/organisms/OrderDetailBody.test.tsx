import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import type { OrderDetail } from '@/lib/types';
import { OrderDetailBody } from './OrderDetailBody';
import { OrderValues } from './OrderValues';

afterEach(() => cleanup());

const ORDER: OrderDetail = {
  orderSn: '251008K7Q2M',
  status: 'READY_TO_SHIP',
  tab: 'a_enviar',
  createdAt: '2026-10-08T12:12:00.000Z',
  paidAt: '2026-10-08T12:12:00.000Z',
  shipByDate: '2026-10-10T21:00:00.000Z',
  buyerUsername: 'anapaula.melo',
  recipientName: 'Ana P. S.',
  city: 'São Paulo',
  state: 'SP',
  zipcode: '03***-***',
  itemCount: 1,
  items: [
    {
      itemId: 1,
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
  updatedAt: '2026-10-08T12:12:00.000Z',
  messageToSeller: 'Embala para presente?',
  address: {
    name: 'Ana P. S.',
    phone: null,
    line: 'Rua A***',
    district: 'Tatuapé',
    city: 'São Paulo',
    state: 'SP',
    zipcode: '03***-***',
  },
  paymentMethod: 'Pix',
  shippingCarrier: 'Shopee Xpress',
  cancelBy: null,
  cancelReason: null,
  buyerOrderCount: 3,
  buyerSince: '2026-05-01T12:00:00.000Z',
  syncedAt: '2026-10-10T12:00:00.000Z',
  escrow: {
    bruto: 129.9,
    comissao: 18.19,
    taxaItem: 4,
    frete: 7.79,
    liquido: 99.92,
    liberacaoEm: '2026-10-18T12:00:00.000Z',
  },
};

describe('OrderDetailBody', () => {
  test('mostra andamento, item, compradora e valores', () => {
    render(<OrderDetailBody order={ORDER} showMoney />);
    expect(screen.getByRole('heading', { name: 'Andamento' })).toBeTruthy();
    expect(screen.getByText(/Vestido midi/i)).toBeTruthy();
    expect(screen.getByText(/Embala para presente/i)).toBeTruthy();
    expect(screen.getByText(/3ª compra na Botho/i)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Valores' })).toBeTruthy();
    expect(screen.getByText(/Líquido a receber/i)).toBeTruthy();
    expect(screen.getByText(/proteger a compradora/i)).toBeTruthy();
  });

  test('sem showMoney some o bloco Valores', () => {
    render(<OrderDetailBody order={ORDER} showMoney={false} />);
    expect(screen.queryByRole('heading', { name: 'Valores' })).toBeNull();
    expect(screen.queryByText(/Líquido a receber/i)).toBeNull();
  });
});

describe('OrderValues', () => {
  test('showMoney false sem lockedMessage não renderiza nada', () => {
    const { container } = render(<OrderValues escrow={ORDER.escrow} showMoney={false} />);
    expect(container.innerHTML).toBe('');
  });
});
