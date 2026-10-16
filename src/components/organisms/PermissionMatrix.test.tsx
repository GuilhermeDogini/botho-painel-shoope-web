import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { MATRIX } from './equipeShared';
import { PermissionMatrix } from './PermissionMatrix';

afterEach(cleanup);

describe('PermissionMatrix', () => {
  test('renderiza título, legenda e papéis', () => {
    render(<PermissionMatrix />);
    expect(screen.getByText('O que cada papel pode fazer')).toBeTruthy();
    const legend = screen.getByLabelText('Legenda');
    expect(legend.textContent).toMatch(/Pode/);
    expect(legend.textContent).toMatch(/Só vê/);
    expect(legend.textContent).toMatch(/Não acessa/);
    for (const role of MATRIX.roles) {
      expect(screen.getByRole('columnheader', { name: role })).toBeTruthy();
    }
  });

  test('lista permissões do MATRIX', () => {
    render(<PermissionMatrix data={MATRIX} />);
    expect(screen.getByText('Ver pedidos')).toBeTruthy();
    expect(screen.getByText('Convidar e desativar pessoas')).toBeTruthy();
    expect(screen.getByText('Conexão com a Shopee e dados da loja')).toBeTruthy();
    expect(MATRIX.permissions).toHaveLength(11);
  });

  test('tabela acessível com role=table', () => {
    render(<PermissionMatrix />);
    expect(screen.getByRole('table', { name: 'Matriz de permissões por papel' })).toBeTruthy();
  });

  test('title null omite o heading', () => {
    render(<PermissionMatrix title={null} />);
    expect(screen.queryByText('O que cada papel pode fazer')).toBeNull();
  });
});
