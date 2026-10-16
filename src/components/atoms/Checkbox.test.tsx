import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { Checkbox } from './Checkbox';

afterEach(cleanup);

function Controlled() {
  const [on, setOn] = useState(false);
  return <Checkbox label="Embalar para presente" checked={on} onChange={(e) => setOn(e.target.checked)} />;
}

describe('Checkbox', () => {
  test('o texto ao lado é o nome e também marca ao clicar', async () => {
    render(<Controlled />);
    const box = screen.getByRole('checkbox', { name: 'Embalar para presente' }) as HTMLInputElement;
    await userEvent.click(screen.getByText('Embalar para presente'));
    expect(box.checked).toBe(true);
  });

  test('teclado: Tab chega e Espaço alterna', async () => {
    render(<Controlled />);
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    await userEvent.tab();
    expect(document.activeElement).toBe(box);
    await userEvent.keyboard(' ');
    expect(box.checked).toBe(true);
    await userEvent.keyboard(' ');
    expect(box.checked).toBe(false);
  });

  test('indeterminate liga e desliga a propriedade do DOM', () => {
    const { rerender } = render(<Checkbox aria-label="Selecionar todos" indeterminate checked={false} onChange={() => {}} />);
    const box = screen.getByRole('checkbox', { name: 'Selecionar todos' }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    rerender(<Checkbox aria-label="Selecionar todos" indeterminate={false} checked onChange={() => {}} />);
    expect(box.indeterminate).toBe(false);
  });
});
