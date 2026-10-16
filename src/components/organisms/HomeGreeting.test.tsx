import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { HomeGreeting } from './HomeGreeting';

afterEach(cleanup);

describe('HomeGreeting', () => {
  test('renderiza saudação e subtítulo', () => {
    render(
      <HomeGreeting
        dateLabel="Quinta, 08/10"
        name="Gisele"
        subtitle="Você tem 6 pedidos para enviar hoje."
      />,
    );
    expect(screen.getByLabelText('Saudação')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Bom dia, Gisele/i })).toBeTruthy();
    expect(screen.getByText(/6 pedidos/i)).toBeTruthy();
  });

  test('atalho dispara onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <HomeGreeting
        dateLabel="Quinta, 08/10"
        name="Gisele"
        subtitle="Linha"
        shortcuts={[{ id: 'cad', label: 'Cadastrar peça', icon: Plus, variant: 'soft', onClick }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Cadastrar peça/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('pílulas da expedição aparecem', () => {
    render(
      <HomeGreeting
        dateLabel="Quinta, 08/10"
        name="Rafaela"
        subtitle="Separar"
        pills={[{ id: 'c', label: 'Coleta hoje, 15h–18h', icon: Plus }]}
      />,
    );
    expect(screen.getByText(/Coleta hoje/i)).toBeTruthy();
  });
});
