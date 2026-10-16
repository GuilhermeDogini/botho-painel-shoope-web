import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ChatsWaitingCard } from './ChatsWaitingCard';
import { INICIO_CHATS } from './inicioFixtures';

afterEach(cleanup);

describe('ChatsWaitingCard', () => {
  test('lista chats aguardando', () => {
    render(<ChatsWaitingCard chats={INICIO_CHATS} />);
    expect(screen.getByRole('heading', { name: /Esperando resposta/i })).toBeTruthy();
    expect(screen.getByText('Ana Paula')).toBeTruthy();
    expect(screen.getByText(/enviar hoje ainda/i)).toBeTruthy();
    expect(screen.getByText('42 min')).toBeTruthy();
  });

  test('Abrir e chat disparam callbacks', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onChat = vi.fn();
    render(
      <ChatsWaitingCard
        chats={[{ ...INICIO_CHATS[0], onClick: onChat }]}
        onOpen={onOpen}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Abrir/i }));
    await user.click(screen.getByRole('button', { name: /Ana Paula/i }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onChat).toHaveBeenCalledTimes(1);
  });
});
