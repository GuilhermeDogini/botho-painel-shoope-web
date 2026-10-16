import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Deadline } from './Deadline';
import { ProductLine } from './ProductLine';

afterEach(cleanup);

describe('ProductLine', () => {
  test('mostra nome, variação e SKU', () => {
    render(
      <ProductLine name="Vestido midi" variant="Azul anil · M" colorHex="#2F4A9A" sku="SKU-1" imageSrc={null} />,
    );
    expect(screen.getByText('Vestido midi')).toBeTruthy();
    expect(screen.getByText('Azul anil · M')).toBeTruthy();
    expect(screen.getByText('SKU-1')).toBeTruthy();
  });

  test('extra e trailing aparecem', () => {
    render(
      <ProductLine
        name="Conjunto"
        imageSrc={null}
        extra="+ 1 item"
        trailing={<Deadline urgency="today">Hoje, 18h</Deadline>}
      />,
    );
    expect(screen.getByText('+ 1 item')).toBeTruthy();
    expect(screen.getByText('Hoje, 18h')).toBeTruthy();
  });
});

describe('Deadline', () => {
  test('hoje usa tom de perigo (framboesa soft)', () => {
    const { container } = render(<Deadline urgency="today">Hoje, 18h</Deadline>);
    expect(container.firstElementChild?.className).toMatch(/danger/);
  });

  test('amanhã usa tom de atenção', () => {
    const { container } = render(<Deadline urgency="tomorrow">Amanhã</Deadline>);
    expect(container.firstElementChild?.className).toMatch(/mostarda|warn/);
  });
});
