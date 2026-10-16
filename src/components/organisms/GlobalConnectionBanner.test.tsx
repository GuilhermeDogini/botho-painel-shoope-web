import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { AlertChipButton, AlertStrip } from './AlertStrip';
import { GlobalConnectionBanner } from './GlobalConnectionBanner';

afterEach(cleanup);

describe('GlobalConnectionBanner', () => {
  test('não renderiza com visible=false', () => {
    const { container } = render(
      <GlobalConnectionBanner visible={false}>Offline</GlobalConnectionBanner>,
    );
    expect(container.firstChild).toBeNull();
  });

  test('mostra mensagem, ação e role=alert', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <GlobalConnectionBanner
        action={
          <button type="button" onClick={onClick}>
            Reconectar agora
          </button>
        }
      >
        A conexão com a Shopee venceu ontem.
      </GlobalConnectionBanner>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText(/venceu ontem/)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Reconectar agora' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('AlertStrip', () => {
  test('chips listam texto completo e respondem ao clique', async () => {
    const user = userEvent.setup();
    const onRepor = vi.fn();
    render(
      <AlertStrip layout="wrap">
        <AlertChipButton role="listitem" tone="warn" cta="Renovar">
          Conexão com a Shopee vence em 12 dias
        </AlertChipButton>
        <AlertChipButton role="listitem" tone="danger" cta="Repor" onClick={onRepor}>
          5 variações acabando
        </AlertChipButton>
      </AlertStrip>,
    );
    expect(screen.getByLabelText('Avisos')).toBeTruthy();
    expect(screen.getByText('Conexão com a Shopee vence em 12 dias')).toBeTruthy();
    await user.click(screen.getByText('5 variações acabando'));
    expect(onRepor).toHaveBeenCalledTimes(1);
  });
});
