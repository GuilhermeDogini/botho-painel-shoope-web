import { cleanup, render, screen } from '@testing-library/react';
import { TrendingUp } from 'lucide-react';
import { afterEach, describe, expect, test } from 'vitest';
import { KeyValueList, KeyValueRow } from './KeyValueRow';
import { StatCard } from './StatCard';

afterEach(cleanup);

const plain = (s: string | null) => (s ?? '').replace(/\u00a0/g, ' ');

describe('StatCard', () => {
  test('mostra rótulo, valor em R$ e variação com ícone', () => {
    render(
      <StatCard
        label="Vendido hoje"
        value={649.5}
        delta={{ label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp }}
      />,
    );
    expect(screen.getByText('Vendido hoje')).toBeTruthy();
    expect(plain(screen.getByText(/649/).textContent)).toMatch(/R\$\s*649,50/);
    expect(screen.getByText('+12% vs. ontem')).toBeTruthy();
  });

  test('valor nulo vira travessão acessível', () => {
    render(<StatCard label="Carteira" value={null} />);
    expect(screen.getByText('sem valor')).toBeTruthy();
  });
});

describe('KeyValueRow', () => {
  test('desconto com sinal e total em destaque', () => {
    render(
      <KeyValueList aria-label="Valores">
        <KeyValueRow label="Comissão" value={18.19} moneyKind="out" tone="danger" />
        <KeyValueRow label="Líquido" value={99.92} tone="ok" emphasis flush />
      </KeyValueList>,
    );
    expect(plain(screen.getByText(/18/).textContent)).toMatch(/−/);
    expect(screen.getByText('Líquido').className).toMatch(/font-bold/);
  });
});
