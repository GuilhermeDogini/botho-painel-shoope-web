import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Input } from '@/components/atoms/Input';
import { FormField } from './FormField';
import { MoneyField } from './MoneyField';
import { SearchField } from './SearchField';

afterEach(cleanup);

describe('FormField', () => {
  test('liga o rótulo ao campo e anuncia a ajuda', () => {
    render(
      <FormField label="Nome da peça" hint="Como aparece na Shopee" htmlFor="nome">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText('Nome da peça');
    expect(input.id).toBe('nome');
    const hint = screen.getByText('Como aparece na Shopee');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  test('erro: mensagem com alerta, aria-invalid e some a ajuda', () => {
    render(
      <FormField label="Preço" hint="Ex.: 49,90" error="Digite um valor em reais">
        <Input defaultValue="abc" />
      </FormField>,
    );
    const input = screen.getByLabelText('Preço');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toContain('Digite um valor em reais');
    expect(screen.queryByText('Ex.: 49,90')).toBeNull();
  });

  test('obrigatório marca aria-required', () => {
    render(
      <FormField label="SKU" required>
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText(/SKU/).getAttribute('aria-required')).toBe('true');
  });
});

describe('MoneyField', () => {
  test('máscara de milhar e onValueChange com vírgula', async () => {
    const onValueChange = vi.fn();
    render(<MoneyField label="Valor" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Valor') as HTMLInputElement;
    expect(input.className).toMatch(/pl-11/);
    expect(input.className).toMatch(/text-right/);
    await userEvent.type(input, '1202022');
    expect(input.value).toBe('1.202.022');
    expect(onValueChange).toHaveBeenLastCalledWith(1202022);
    await userEvent.type(input, ',90');
    expect(input.value).toBe('1.202.022,90');
    expect(onValueChange).toHaveBeenLastCalledWith(1202022.9);
  });

  test('ao sair completa os centavos', async () => {
    render(<MoneyField label="Valor" defaultValue="10" />);
    const input = screen.getByLabelText('Valor') as HTMLInputElement;
    expect(input.value).toBe('10,00');
    await userEvent.clear(input);
    await userEvent.type(input, '129,9');
    await userEvent.tab();
    expect(input.value).toBe('129,90');
  });

  test('vazio devolve null', async () => {
    const onValueChange = vi.fn();
    render(<MoneyField label="Valor" defaultValue="10" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Valor');
    await userEvent.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });
});

describe('SearchField', () => {
  test('mostra limpar e zera o valor', async () => {
    const onClear = vi.fn();
    render(<SearchField label="Busca" defaultValue="vestido" onClear={onClear} />);
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    expect(box.value).toBe('vestido');
    await userEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
    expect(onClear).toHaveBeenCalled();
    expect(box.value).toBe('');
  });
});
