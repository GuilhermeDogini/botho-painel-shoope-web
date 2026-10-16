import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Avatar } from './Avatar';
import { CountBadge } from './CountBadge';
import { Thumbnail } from './Thumbnail';

afterEach(cleanup);

describe('Thumbnail', () => {
  test('sem foto mostra o cabide com o nome da peça', () => {
    render(<Thumbnail src={null} alt="Vestido midi" />);
    expect(screen.getByRole('img', { name: 'Vestido midi (sem foto)' })).toBeTruthy();
  });

  test('foto que falha vira cabide; foto nova volta a tentar', () => {
    const { rerender } = render(<Thumbnail src="/a.jpg" alt="Pantalona" />);
    fireEvent.error(screen.getByRole('img', { name: 'Pantalona' }));
    expect(screen.getByRole('img', { name: 'Pantalona (sem foto)' })).toBeTruthy();
    rerender(<Thumbnail src="/b.jpg" alt="Pantalona" />);
    expect((screen.getByRole('img', { name: 'Pantalona' }) as HTMLImageElement).getAttribute('src')).toBe('/b.jpg');
  });

  test('alt vazio deixa o cabide decorativo', () => {
    const { container } = render(<Thumbnail src={undefined} alt="" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});

describe('Avatar', () => {
  test('inicial maiúscula, com acento, e "?" sem nome', () => {
    const { container, rerender } = render(<Avatar name="  érica nunes" />);
    expect(container.textContent).toBe('É');
    rerender(<Avatar name="   " />);
    expect(container.textContent).toBe('?');
  });

  test('mesmo nome, mesma cor; tone explícito manda', () => {
    const a = render(<Avatar name="Bruna Lima" />).container.firstElementChild?.className;
    cleanup();
    const b = render(<Avatar name="Bruna Lima" />).container.firstElementChild?.className;
    expect(a).toBe(b);
    cleanup();
    const forced = render(<Avatar name="Bruna Lima" tone="anil" />).container.firstElementChild?.className;
    expect(forced).toContain('bg-anil-soft');
  });
});

describe('CountBadge', () => {
  test('zero some, a não ser com showZero; 99+ acima de 99', () => {
    const { container, rerender } = render(<CountBadge value={0} />);
    expect(container.textContent).toBe('');
    rerender(<CountBadge value={0} showZero />);
    expect(container.textContent).toBe('0');
    rerender(<CountBadge value={134} />);
    expect(container.textContent).toBe('99+');
    rerender(<CountBadge value={undefined} showZero />);
    expect(container.textContent).toBe('');
  });
});
