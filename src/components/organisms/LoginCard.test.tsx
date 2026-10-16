import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { LoginCard } from './LoginCard';

afterEach(cleanup);

describe('LoginCard', () => {
  test('permite digitar e clicar em Entrar', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onEmailChange = vi.fn();

    render(
      <LoginCard
        email="loja@botho.com"
        password="segredo"
        onEmailChange={onEmailChange}
        onPasswordChange={() => undefined}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText('E-mail'), 'x');
    expect(onEmailChange).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /entrar/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('mostra erro de senha', () => {
    render(<LoginCard mode="erro" email="a@b.com" password="x" />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText(/senha não confere/i)).toBeTruthy();
  });
});
