import type {
  AReceberResponse,
  ExtratoLine,
  PeriodSummary,
  ResumoResponse,
} from '@/lib/types';

export const FIX_PERIOD: PeriodSummary = {
  preset: 'mes',
  title: 'Outubro até agora · 01/10 a 08/10',
  from: '2026-10-01T03:00:00.000Z',
  to: '2026-10-08T12:00:00.000Z',
  amount: 5876.4,
  out: 1717.48,
  net: 4158.92,
  orderCount: 42,
  per100: 71,
  marginPct: 71,
  where: {
    commission: 822.7,
    fees: 168,
    shippingFee: 352.58,
    ads: 214.3,
    refunds: 159.9,
  },
};

export const FIX_RESUMO: ResumoResponse = {
  period: FIX_PERIOD,
  months: [
    { month: '2026-05', label: 'mai', amount: 6100, out: 1830, net: 4270 },
    { month: '2026-06', label: 'jun', amount: 8400, out: 2490, net: 5910 },
    { month: '2026-07', label: 'jul', amount: 10200, out: 3020, net: 7180 },
    { month: '2026-08', label: 'ago', amount: 12900, out: 3810, net: 9090 },
    { month: '2026-09', label: 'set', amount: 16900, out: 4960, net: 11940 },
    { month: '2026-10', label: 'out*', amount: 5876, out: 1717, net: 4159 },
  ],
};

export const FIX_A_RECEBER: AReceberResponse = {
  amount: 3412.85,
  orderCount: 34,
  groups: [
    { date: '2026-10-09', label: '09/10', orderCount: 4, amount: 412.3 },
    { date: '2026-10-10', label: '10/10', orderCount: 9, amount: 896.1 },
    { date: '2026-10-13', label: '13/10', orderCount: 11, amount: 1104.25 },
    { date: '2026-10-15', label: '15/10', orderCount: 10, amount: 1000.2 },
  ],
  balance: 1286.4,
  repasses: [
    { id: 'r1', createTime: '2026-10-01T13:15:00.000Z', label: '01/10 · Itaú ••4821', amount: 2140 },
    { id: 'r2', createTime: '2026-09-24T14:00:00.000Z', label: '24/09 · Itaú ••4821', amount: 1870.5 },
  ],
};

export const FIX_EXTRATO: ExtratoLine[] = [
  {
    id: 'e1',
    transactionId: '9100008',
    kind: 'SALE_RELEASE',
    kindLabel: 'Venda liberada',
    amount: 91.92,
    balance: 1286.4,
    description: 'Venda liberada',
    subtitle: 'Pedido #251006C4M2Z · Tatiane',
    orderSn: '251006C4M2Z',
    buyerName: 'Tatiane',
    createTime: '2026-10-08T09:00:00.000Z',
  },
  {
    id: 'e2',
    transactionId: '9100007',
    kind: 'SALE_RELEASE',
    kindLabel: 'Venda liberada',
    amount: 114.84,
    balance: 1194.48,
    description: 'Venda liberada',
    subtitle: 'Pedido #251006B7K9L · Renata',
    orderSn: '251006B7K9L',
    buyerName: 'Renata',
    createTime: '2026-10-08T09:00:00.000Z',
  },
  {
    id: 'e3',
    transactionId: '9100006',
    kind: 'ADS_TOPUP',
    kindLabel: 'Recarga de Ads',
    amount: -100,
    balance: 1079.64,
    description: 'Recarga de crédito de Ads',
    subtitle: 'Da carteira para o crédito de Ads',
    orderSn: null,
    buyerName: null,
    createTime: '2026-10-07T21:20:00.000Z',
  },
  {
    id: 'e4',
    transactionId: '9100004',
    kind: 'REFUND',
    kindLabel: 'Devolução',
    amount: -159.9,
    balance: 1079.72,
    description: 'Devolução',
    subtitle: 'Pedido #250929P2Q7Z · tamanho não serviu',
    orderSn: '250929P2Q7Z',
    buyerName: null,
    createTime: '2026-10-06T17:22:00.000Z',
  },
  {
    id: 'e5',
    transactionId: '9100001',
    kind: 'PAYOUT',
    kindLabel: 'Repasse',
    amount: -2140,
    balance: 1117.36,
    description: 'Repasse para o banco',
    subtitle: 'Itaú ••4821',
    orderSn: null,
    buyerName: null,
    createTime: '2026-10-01T13:15:00.000Z',
  },
];

/** Seller Center — saque da carteira (HANDOFF: sem API de saque). */
export const SHOPEE_WITHDRAW_URL = 'https://seller.shopee.com.br';
