import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { BarRow } from './BarRow';
import { TapeProgress } from './TapeProgress';

afterEach(cleanup);

describe('TapeProgress', () => {
  test('expõe progressbar com 0%, parcial e 100%', () => {
    const { rerender } = render(<TapeProgress aria-label="Meta" value={0} max={100} />);
    let bar = screen.getByRole('progressbar', { name: 'Meta' });
    expect(bar.getAttribute('aria-valuenow')).toBe('0');

    rerender(<TapeProgress aria-label="Meta" value={33} max={100} />);
    bar = screen.getByRole('progressbar', { name: 'Meta' });
    expect(bar.getAttribute('aria-valuenow')).toBe('33');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('33%');

    rerender(<TapeProgress aria-label="Meta" value={100} max={100} />);
    bar = screen.getByRole('progressbar', { name: 'Meta' });
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('100%');
  });

  test('não passa de 100% se value > max', () => {
    render(<TapeProgress aria-label="Meta" value={200} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('100%');
  });
});

describe('BarRow', () => {
  test('mostra rótulo, valor e largura da barra', () => {
    render(<BarRow label="Frete" value={352} ratio={0.43} />);
    expect(screen.getByText('Frete')).toBeTruthy();
    expect(screen.getByText(/352/).textContent?.replace(/\u00a0/g, ' ')).toMatch(/R\$/);
    const fill = screen.getByText('Frete').parentElement?.querySelector('[aria-hidden] > div');
    expect((fill as HTMLElement).style.width).toBe('43%');
  });
});
