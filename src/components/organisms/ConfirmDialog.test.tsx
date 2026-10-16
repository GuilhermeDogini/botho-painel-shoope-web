import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

afterEach(cleanup);

describe('ConfirmDialog', () => {
  test('mostra título, resumo e chama onConfirm', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Pausar 3 peças?"
        summary="Elas somem da busca até você reativar."
        confirmLabel="Pausar 3 peças"
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Pausar 3 peças?')).toBeTruthy();
    expect(screen.getByText(/somem da busca/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Pausar 3 peças' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('tone danger usa botão destrutivo', () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => undefined}
        title="Excluir?"
        confirmLabel="Excluir peça"
        tone="danger"
        onConfirm={() => undefined}
      />,
    );
    const confirm = screen.getByRole('button', { name: 'Excluir peça' });
    expect(confirm.className).toMatch(/bg-danger|border-danger/);
  });

  test('Voltar pede fechamento', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Pausar?"
        confirmLabel="Pausar"
        onConfirm={() => undefined}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
