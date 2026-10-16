import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { InlineAlert } from './InlineAlert';
import { Toast } from './Toast';

afterEach(cleanup);

describe('InlineAlert', () => {
  test('mostra o texto e o tom no role status', () => {
    render(<InlineAlert tone="warn">Saldo de Ads dá para ~2 dias.</InlineAlert>);
    const alert = screen.getByRole('status');
    expect(alert.textContent).toContain('Saldo de Ads');
    expect(alert.className).toMatch(/mostarda/);
  });
});

describe('Toast', () => {
  test('ação Desfazer e fechar disparam callbacks', async () => {
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    render(
      <Toast actionLabel="Desfazer" onAction={onAction} onDismiss={onDismiss} animate={false}>
        3 etiquetas prontas.
      </Toast>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(onAction).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
