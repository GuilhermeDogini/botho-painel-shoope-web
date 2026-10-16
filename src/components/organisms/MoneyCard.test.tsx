import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrendingUp } from 'lucide-react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { MoneyCard } from './MoneyCard';
import { INICIO_CHART, INICIO_GOAL } from './inicioFixtures';

afterEach(cleanup);

describe('MoneyCard', () => {
  test('renderiza KPIs formatados', () => {
    render(
      <MoneyCard
        hoje={649.5}
        seteDias={4218.3}
        mes={5876.4}
        mesLabel="Outubro"
        aReceber={3412.85}
        carteira={1286.4}
        adsGasto={186.2}
        hojeDelta={{ label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp }}
        goal={INICIO_GOAL}
        chart={INICIO_CHART}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Dinheiro' })).toBeTruthy();
    expect(screen.getByText('Vendido hoje')).toBeTruthy();
    expect(screen.getByText('+12% vs. ontem')).toBeTruthy();
    expect(screen.getByText(/Meta de outubro/i)).toBeTruthy();
    expect(screen.getByLabelText(/Entradas e saídas/i)).toBeTruthy();
  });

  test('Financeiro dispara callback', async () => {
    const user = userEvent.setup();
    const onFinanceiro = vi.fn();
    render(<MoneyCard hoje={10} onFinanceiro={onFinanceiro} />);
    await user.click(screen.getByRole('button', { name: /Financeiro/i }));
    expect(onFinanceiro).toHaveBeenCalledTimes(1);
  });

  test('mostra mensagem bloqueada quando tudo é nulo', () => {
    render(<MoneyCard lockedMessage={<p>Sem acesso</p>} />);
    expect(screen.getByText('Sem acesso')).toBeTruthy();
  });
});
