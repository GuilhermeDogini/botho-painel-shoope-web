import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { AttributeForm, hasAttributeValue } from './AttributeForm';
import { ATTRIBUTE_FIXTURES, ATTRIBUTE_VALUES_SAMPLE } from './attributeFormFixtures';

afterEach(cleanup);

describe('hasAttributeValue', () => {
  test('detecta valueId e texto', () => {
    expect(hasAttributeValue([{ attributeId: 1, valueId: 11 }])).toBe(true);
    expect(hasAttributeValue([{ attributeId: 1, valueId: 0, text: 'x' }])).toBe(true);
    expect(hasAttributeValue([{ attributeId: 1, valueId: 0, text: '  ' }])).toBe(false);
    expect(hasAttributeValue(undefined)).toBe(false);
  });
});

describe('AttributeForm', () => {
  test('multi_select dispara onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AttributeForm
        attributes={ATTRIBUTE_FIXTURES}
        values={ATTRIBUTE_VALUES_SAMPLE}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Trabalho' }));
    expect(onChange).toHaveBeenCalledWith(
      2,
      expect.arrayContaining([
        expect.objectContaining({ valueId: 21 }),
        expect.objectContaining({ valueId: 22 }),
        expect.objectContaining({ valueId: 23 }),
      ]),
    );
  });

  test('texto opcional em Mais detalhes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AttributeForm attributes={ATTRIBUTE_FIXTURES} values={{}} onChange={onChange} />,
    );

    await user.click(screen.getByText(/Mais detalhes/i));
    await user.type(screen.getByRole('textbox', { name: 'Composição' }), 'x');
    expect(onChange).toHaveBeenCalledWith(3, [{ attributeId: 3, valueId: 0, text: 'x' }]);
  });

  test('estado vazio', () => {
    render(<AttributeForm attributes={[]} values={{}} onChange={() => undefined} />);
    expect(screen.getByText(/não pede características/i)).toBeTruthy();
  });
});
