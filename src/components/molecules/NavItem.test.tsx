import { cleanup, render, screen } from '@testing-library/react';
import { Home, Package } from 'lucide-react';
import { afterEach, describe, expect, test } from 'vitest';
import { NavItem, NavList } from './NavItem';

afterEach(cleanup);

describe('NavItem', () => {
  test('solto: o ativo desenha o próprio fundo e marca aria-current', () => {
    render(
      <NavItem icon={Package} active>
        Pedidos
      </NavItem>,
    );
    const item = screen.getByRole('button', { name: 'Pedidos' });
    expect(item.getAttribute('aria-current')).toBe('page');
    expect(item.className).toMatch(/bg-brand-soft/);
  });

  test('dentro do NavList: o fundo do ativo sai do item e vira o destaque da lista', () => {
    const { container } = render(
      <NavList aria-label="Menu">
        <NavItem icon={Home}>Início</NavItem>
        <NavItem icon={Package} active>
          Pedidos
        </NavItem>
      </NavList>,
    );
    const item = screen.getByRole('button', { name: 'Pedidos' });
    expect(item.className).not.toMatch(/bg-brand-soft/);
    const highlight = container.querySelector('nav > span[aria-hidden]');
    expect(highlight?.className).toMatch(/bg-brand-soft/);
  });

  test('NavList sem item ativo não desenha destaque', () => {
    const { container } = render(
      <NavList aria-label="Menu" variant="bottom">
        <NavItem variant="bottom" icon={Home}>
          Início
        </NavItem>
      </NavList>,
    );
    expect(container.querySelector('nav > span[aria-hidden]')).toBeNull();
  });
});
