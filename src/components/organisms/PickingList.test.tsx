import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { packingLineKey, PickingList, shortOrderSn } from './PickingList';
import { DEMO_PACKING_GROUPS, DEMO_PACKING_NOTES } from './pickingFixtures';

afterEach(() => cleanup());

describe('packingLineKey / shortOrderSn', () => {
  test('chave estável e pedido curto', () => {
    expect(packingLineKey(1, 2, 'Azul,M')).toBe('1:2:Azul,M');
    expect(shortOrderSn('251008K7Q2M')).toBe('#K7Q2M');
  });
});

describe('PickingList', () => {
  test('mostra progresso e risca ao tocar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const key = packingLineKey(102, 1, 'Azul anil,M');

    const { rerender } = render(
      <PickingList
        groups={DEMO_PACKING_GROUPS}
        notes={DEMO_PACKING_NOTES}
        checkedKeys={[]}
        onCheckedKeysChange={onChange}
      />,
    );

    expect(screen.getByText(/0 de 7 peças separadas/i)).toBeTruthy();
    expect(screen.getByText(/Vestido midi/i)).toBeTruthy();
    expect(screen.getByText(/embalar para presente/i)).toBeTruthy();

    const box = screen.getByRole('checkbox', { name: /Separar Azul anil · M/i });
    await user.click(box);
    expect(onChange).toHaveBeenCalledWith([key]);

    rerender(
      <PickingList
        groups={DEMO_PACKING_GROUPS}
        notes={DEMO_PACKING_NOTES}
        checkedKeys={[key]}
        onCheckedKeysChange={onChange}
      />,
    );
    expect(screen.getByText(/1 de 7 peças separadas/i)).toBeTruthy();
  });

  test('lista vazia', () => {
    render(
      <PickingList groups={[]} checkedKeys={[]} onCheckedKeysChange={() => undefined} empty />,
    );
    expect(screen.getByText(/Nenhuma peça para separar/i)).toBeTruthy();
  });
});
