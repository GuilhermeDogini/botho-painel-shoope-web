import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ActiveCampaignsCard } from './ActiveCampaignsCard';
import { INICIO_CAMPAIGNS } from './inicioFixtures';

afterEach(cleanup);

describe('ActiveCampaignsCard', () => {
  test('lista campanhas com status', () => {
    render(<ActiveCampaignsCard campaigns={INICIO_CAMPAIGNS} />);
    expect(screen.getByRole('heading', { name: /Campanhas ativas/i })).toBeTruthy();
    expect(screen.getByText('Moletons de inverno')).toBeTruthy();
    expect(screen.getByText('Bom')).toBeTruthy();
    expect(screen.getByText('Atenção')).toBeTruthy();
    expect(screen.getByText('Ruim')).toBeTruthy();
    expect(screen.getByText(/Retorno 6,2×/i)).toBeTruthy();
  });

  test('Ver dispara callback', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    render(<ActiveCampaignsCard campaigns={INICIO_CAMPAIGNS} onView={onView} />);
    await user.click(screen.getByRole('button', { name: /^Ver$/i }));
    expect(onView).toHaveBeenCalledTimes(1);
  });
});
