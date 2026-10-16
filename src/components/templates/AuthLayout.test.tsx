import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { AuthLayout } from './AuthLayout';

afterEach(cleanup);

describe('AuthLayout', () => {
  test('renderiza molde com rótulos e conteúdo', () => {
    render(
      <AuthLayout moldeLabel="Molde 01 · entrada" cutLabel="Corte 1×">
        <p>Formulário</p>
      </AuthLayout>,
    );
    expect(screen.getByText('Molde 01 · entrada')).toBeTruthy();
    expect(screen.getByText('Corte 1×')).toBeTruthy();
    expect(screen.getByText('Formulário')).toBeTruthy();
  });

  test('aside opcional', () => {
    const { rerender } = render(
      <AuthLayout aside={<span>Copy do lado</span>} footer={null}>
        <span>Miolo</span>
      </AuthLayout>,
    );
    expect(screen.getByText('Copy do lado')).toBeTruthy();
    rerender(
      <AuthLayout footer={null}>
        <span>Miolo</span>
      </AuthLayout>,
    );
    expect(screen.queryByText('Copy do lado')).toBeNull();
  });

  test('costura do molde presente', () => {
    const { container } = render(
      <AuthLayout footer={null}>
        <span>Miolo</span>
      </AuthLayout>,
    );
    expect(container.querySelector('.bt-stitch-line')).toBeTruthy();
    expect(container.querySelector('.bt-molde-needle')).toBeTruthy();
  });
});

