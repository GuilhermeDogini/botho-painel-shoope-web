import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Switch } from './Switch';

afterEach(cleanup);

describe('Switch', () => {
  test('é um role=switch com o rótulo como nome; clique no rótulo alterna', async () => {
    const onChange = vi.fn();
    render(<Switch label="Avisar por e-mail" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Avisar por e-mail' });
    expect(sw.getAttribute('aria-checked')).toBe('false');
    await userEvent.click(screen.getByText('Avisar por e-mail'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });

  test('teclado: Tab chega e Espaço alterna', async () => {
    render(<Switch label="Turbinar automático" defaultChecked />);
    const sw = screen.getByRole('switch');
    await userEvent.tab();
    expect(document.activeElement).toBe(sw);
    await userEvent.keyboard(' ');
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  test('desabilitado não alterna', async () => {
    const onChange = vi.fn();
    render(<Switch label="Bloqueado" disabled onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
