import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { Select } from './Select';

beforeAll(() => {
  // Radix Select usa Pointer Capture; o jsdom não implementa.
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

afterEach(cleanup);

describe('Select', () => {
  test('é combobox Botho (botão), não <select> nativo', () => {
    render(
      <Select defaultValue="viscose" aria-label="Tecido">
        <option value="viscose">Viscose</option>
        <option value="algodao">Algodão</option>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Tecido' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(document.querySelector('select')).toBeNull();
    expect(trigger.textContent).toContain('Viscose');
  });

  test('abre a lista e escolhe um item', async () => {
    const onValueChange = vi.fn();
    render(
      <Select defaultValue="viscose" onValueChange={onValueChange} aria-label="Tecido">
        <option value="viscose">Viscose</option>
        <option value="algodao">Algodão</option>
        <option value="moletom">Moletom flanelado</option>
      </Select>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Tecido' });
    await userEvent.click(trigger);
    const option = await screen.findByRole('option', { name: 'Algodão' });
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith('algodao');
    expect(trigger.textContent).toContain('Algodão');
  });

  test('invalid marca aria-invalid no gatilho', () => {
    render(
      <Select invalid aria-label="Tecido" defaultValue="viscose">
        <option value="viscose">Viscose</option>
      </Select>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
  });
});
