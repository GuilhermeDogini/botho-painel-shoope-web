import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { PrintPreviewModal } from './PrintPreviewModal';

afterEach(() => cleanup());

vi.mock('@/hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
}));

describe('PrintPreviewModal', () => {
  test('mostra opções e confirma', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onLabels = vi.fn();

    render(
      <PrintPreviewModal
        open
        onOpenChange={() => undefined}
        orderCount={3}
        includeLabels
        onIncludeLabelsChange={onLabels}
        includePackingList
        onIncludePackingListChange={() => undefined}
        labelFormat="a4"
        onLabelFormatChange={() => undefined}
        previewLabels={[
          {
            orderSn: '251008K7Q2M',
            to: 'Ana',
            address: 'SP',
            piece: 'Vestido',
          },
        ]}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('heading', { name: /Imprimir 3 pedidos/i })).toBeTruthy();
    expect(screen.getByText(/Etiquetas de envio/i)).toBeTruthy();
    expect(screen.getAllByText(/Lista de separação/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/2 página\(s\)/i)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /Baixar PDF e imprimir/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('com pdfUrl abre iframe da prévia', () => {
    render(
      <PrintPreviewModal
        open
        onOpenChange={() => undefined}
        orderCount={1}
        includeLabels
        onIncludeLabelsChange={() => undefined}
        includePackingList={false}
        onIncludePackingListChange={() => undefined}
        labelFormat="thermal"
        onLabelFormatChange={() => undefined}
        pdfUrl="blob:http://localhost/fake-pdf"
        onConfirm={() => undefined}
      />,
    );

    const frame = screen.getByTitle('Prévia do PDF');
    expect(frame.getAttribute('src')).toBe('blob:http://localhost/fake-pdf');
  });
});
