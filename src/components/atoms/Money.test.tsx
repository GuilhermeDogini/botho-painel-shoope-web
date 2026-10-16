import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Money } from './Money';

afterEach(cleanup);

describe('Money', () => {
  test('valor escondido pela API (@RedactMoney) mostra traço e avisa o leitor de tela', () => {
    const { container } = render(<Money value={undefined} />);
    expect(container.textContent).toBe('—sem valor');
    expect(container.querySelector('[aria-hidden]')?.textContent).toBe('—');
  });

  test('null e NaN também viram traço', () => {
    for (const value of [null, Number.NaN]) {
      const { container, unmount } = render(<Money value={value} />);
      expect(container.textContent).toBe('—sem valor');
      unmount();
    }
  });

  test('entrada verde, saída vermelha, e "plain" tira a cor mas mantém o sinal', () => {
    const { getByText } = render(
      <>
        <Money value={10} kind="in" />
        <Money value={5} kind="out" />
        <Money value={7} kind="out" plain />
      </>,
    );
    expect(getByText(/\+ R\$\s10,00/).className).toContain('text-salvia-text');
    expect(getByText(/− R\$\s5,00/).className).toContain('text-danger-text');
    const plainOut = getByText(/− R\$\s7,00/);
    expect(plainOut.className).not.toContain('text-danger-text');
    expect(plainOut.className).toContain('money');
  });
});
