import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { MATRIX } from './equipeShared';
import { buildRoleCardsFromMatrix, RoleCards } from './RoleCards';

afterEach(cleanup);

describe('RoleCards', () => {
  test('renderiza um card por papel da MATRIX', () => {
    const roles = buildRoleCardsFromMatrix();
    render(<RoleCards roles={roles} />);
    expect(screen.getByLabelText('Permissões por papel')).toBeTruthy();
    for (const name of MATRIX.roles) {
      expect(screen.getByText(name)).toBeTruthy();
    }
  });

  test('Admin pode tudo (listas derivadas)', () => {
    const roles = buildRoleCardsFromMatrix();
    const admin = roles[0];
    expect(admin.pode).toHaveLength(MATRIX.permissions.length);
    expect(admin.ve).toHaveLength(0);
    expect(admin.nao).toHaveLength(0);

    render(<RoleCards roles={[admin]} />);
    expect(screen.getByText('Pode')).toBeTruthy();
    expect(screen.queryByText('Não acessa')).toBeNull();
  });

  test('Expedição tem Pode e Não acessa', () => {
    const roles = buildRoleCardsFromMatrix();
    const exp = roles[1];
    expect(exp.pode).toContain('Ver pedidos');
    expect(exp.pode).toContain('Imprimir etiquetas e lista de separação');
    expect(exp.nao.length).toBeGreaterThan(0);

    render(<RoleCards roles={[exp]} />);
    expect(screen.getByText('Ver pedidos')).toBeTruthy();
    expect(screen.getByText('Não acessa')).toBeTruthy();
  });

  test('cards não forçam overflow-x', () => {
    const { container } = render(<RoleCards roles={buildRoleCardsFromMatrix()} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/overflow-x-hidden/);
    expect(root.className).toMatch(/min-w-0/);
  });
});
