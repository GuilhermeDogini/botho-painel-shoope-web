import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Shield, Truck } from 'lucide-react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { TeamList } from './TeamList';

afterEach(cleanup);

const PEOPLE = [
  {
    id: 'g',
    name: 'Gisele Botho',
    email: 'gisele@bothobrasil.com.br',
    roleLabel: 'Admin',
    roleIcon: Shield,
    roleTone: 'brand' as const,
    isYou: true,
    status: 'Dona da loja',
  },
  {
    id: 'r',
    name: 'Rafaela Souza',
    email: 'rafaela.souza@gmail.com',
    roleLabel: 'Expedição',
    roleIcon: Truck,
    roleTone: 'info' as const,
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'm',
    name: 'Márcio Alves',
    email: 'contato@alvescontabil.com.br',
    roleLabel: 'Financeiro',
    roleIcon: Shield,
    status: 'Convite enviado 06/10',
    statusTone: 'warn' as const,
    pending: true,
  },
];

describe('TeamList', () => {
  test('renderiza pessoas com nome, e-mail e papel', () => {
    render(<TeamList people={PEOPLE} />);
    expect(screen.getByLabelText('Pessoas')).toBeTruthy();
    expect(screen.getByText('Gisele Botho')).toBeTruthy();
    expect(screen.getByText('(você)')).toBeTruthy();
    expect(screen.getByText('rafaela.souza@gmail.com')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
    expect(screen.getByText('Expedição')).toBeTruthy();
  });

  test('Reenviar convite dispara callback', async () => {
    const user = userEvent.setup();
    const onResend = vi.fn();
    render(
      <TeamList
        people={PEOPLE.map((p) => (p.pending ? { ...p, onResendInvite: onResend } : p))}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Reenviar convite' }));
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  test('Switch chama onActiveChange', async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(
      <TeamList
        people={PEOPLE.map((p) =>
          p.showSwitch ? { ...p, onActiveChange } : p,
        )}
      />,
    );
    await user.click(screen.getByLabelText('Acesso de Rafaela Souza'));
    expect(onActiveChange).toHaveBeenCalled();
  });

  test('lista não força overflow-x na raiz', () => {
    const { container } = render(<TeamList people={PEOPLE} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/overflow-x-hidden/);
    expect(root.className).toMatch(/min-w-0/);
  });
});
