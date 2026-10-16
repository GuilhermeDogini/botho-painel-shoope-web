import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';

afterEach(cleanup);

describe('BarChart', () => {
  test('renderiza legendas com texto', () => {
    render(
      <BarChart
        aria-label="Teste barras"
        categories={['a', 'b']}
        series={[
          { id: 'in', label: 'Entradas', tone: 'salvia', values: [10, 20] },
          { id: 'out', label: 'Saídas', tone: 'mostarda', values: [5, 8] },
        ]}
      />,
    );
    expect(screen.getByText('Entradas')).toBeTruthy();
    expect(screen.getByText('Saídas')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Teste barras' })).toBeTruthy();
  });

  test('mostra tooltip no hover da barra', async () => {
    const user = userEvent.setup();
    render(
      <BarChart
        aria-label="Teste tip"
        categories={['seg']}
        series={[{ id: 'in', label: 'Entradas', tone: 'salvia', values: [520] }]}
      />,
    );
    await user.hover(screen.getByLabelText('seg: Entradas 520'));
    expect(screen.getByRole('tooltip')).toBeTruthy();
    expect(screen.getByRole('tooltip').textContent).toMatch(/Entradas/);
    expect(screen.getByRole('tooltip').textContent).toMatch(/520/);
  });
});

describe('LineChart', () => {
  test('renderiza linha com barras de fundo e eixo Y', () => {
    render(
      <LineChart
        aria-label="Teste linha"
        categories={['1', '2', '3']}
        yLabels={['100', '0']}
        bars={{ id: 'sales', label: 'Vendas', tone: 'salvia', values: [40, 60, 50] }}
        series={[{ id: 'spend', label: 'Gasto', tone: 'mostarda', values: [10, 12, 11] }]}
      />,
    );
    expect(screen.getByText('Vendas')).toBeTruthy();
    expect(screen.getByText('Gasto')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Teste linha' })).toBeTruthy();
  });

  test('tooltip segue a coluna e lista vendas + gasto', async () => {
    const user = userEvent.setup();
    render(
      <LineChart
        aria-label="Teste tip linha"
        categories={['1', '2']}
        bars={{ id: 'sales', label: 'Vendas', tone: 'salvia', values: [180, 220] }}
        series={[{ id: 'spend', label: 'Gasto', tone: 'mostarda', values: [12, 13] }]}
      />,
    );
    await user.hover(screen.getByLabelText(/1: Vendas 180/));
    const tip = screen.getByRole('tooltip');
    expect(tip.textContent).toMatch(/Vendas/);
    expect(tip.textContent).toMatch(/Gasto/);

    await user.hover(screen.getByLabelText(/2: Vendas 220/));
    const tip2 = screen.getByRole('tooltip');
    expect(tip2.textContent).toMatch(/220/);
    expect(tip2.textContent).toMatch(/13/);
  });
});
