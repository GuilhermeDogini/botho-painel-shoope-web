import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { BulkActionBar } from './BulkActionBar';

afterEach(cleanup);

describe('BulkActionBar', () => {
  test('não renderiza com count 0', () => {
    const { container } = render(<BulkActionBar count={0} />);
    expect(container.firstChild).toBeNull();
  });

  test('mostra contagem singular e plural', () => {
    const { rerender } = render(<BulkActionBar count={1} position="inline" />);
    expect(screen.getByText('1 selecionado')).toBeTruthy();
    rerender(<BulkActionBar count={3} position="inline" />);
    expect(screen.getByText('3 selecionados')).toBeTruthy();
  });

  test('onClear no botão limpar', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<BulkActionBar count={2} onClear={onClear} position="inline" />);
    await user.click(screen.getByLabelText('Limpar seleção'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
