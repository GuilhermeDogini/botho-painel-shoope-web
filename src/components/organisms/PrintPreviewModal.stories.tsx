import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import {
  PrintPreviewModal,
  type LabelFormat,
  type PrintPreviewLabel,
} from './PrintPreviewModal';

const PREVIEW: PrintPreviewLabel[] = [
  {
    orderSn: '251008K7Q2M',
    to: 'Ana P. S.',
    address: 'Rua A*** · São Paulo/SP',
    piece: 'Vestido midi · Azul anil · M',
    service: 'Xpress',
  },
  {
    orderSn: '251007H8W1R',
    to: 'Carla M.',
    address: 'Av. B*** · Guarulhos/SP',
    piece: 'Pijama · Listrado anil · P',
    service: 'Xpress',
  },
  {
    orderSn: '251008J3T9P',
    to: 'Juliana',
    address: 'Rua C*** · Osasco/SP',
    piece: 'Moletom · Rosa · G',
    service: 'Coleta',
  },
];

/** PDF mínimo (%PDF) para demo da prévia em iframe. */
const TINY_PDF = `%PDF-1.1
1 0 obj<<>>endobj
2 0 obj<</Length 44>>stream
BT /F1 24 Tf 100 700 Td (Botho etiquetas) Tj ET
endstream
endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Contents 2 0 R>>endobj
4 0 obj<</Type/Catalog/Pages<</Kids[3 0 R]/Count 1>>>>endobj
trailer<</Root 4 0 R>>
%%EOF`;

const meta = {
  title: 'Organisms/PrintPreviewModal',
  component: PrintPreviewModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Modal de impressão (SHP-84): etiquetas + lista, formato A4/térmica, prévia do PDF.

## Como deve funcionar
- Props-only: opções e \`pdfUrl\` (blob) vêm da página.
- Sem PDF: prévia em papel; com \`pdfUrl\`: iframe do PDF.
- Referência: modal em \`design/opcao-a/Pedidos.dc.html\`.

## Como testar
1. Abrir → marcar/desmarcar etiquetas e lista.
2. Trocar A4 / térmica.
3. Story “Com PDF” → iframe da prévia.
        `,
      },
    },
  },
} satisfies Meta<typeof PrintPreviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function Interactive({ withPdf = false }: { withPdf?: boolean }) {
  const [open, setOpen] = useState(true);
  const [labels, setLabels] = useState(true);
  const [lista, setLista] = useState(true);
  const [format, setFormat] = useState<LabelFormat>('a4');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!withPdf) return;
    const blob = new Blob([TINY_PDF], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [withPdf]);

  return (
    <div className="flex min-h-[480px] w-[min(100vw,960px)] flex-col items-center justify-center gap-4 p-4">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir impressão
      </Button>
      <PrintPreviewModal
        open={open}
        onOpenChange={setOpen}
        orderCount={3}
        includeLabels={labels}
        onIncludeLabelsChange={setLabels}
        includePackingList={lista}
        onIncludePackingListChange={setLista}
        labelFormat={format}
        onLabelFormatChange={setFormat}
        previewLabels={PREVIEW}
        pdfUrl={pdfUrl}
        onConfirm={() => {
          toast.success('PDF pronto', { description: 'Na página real baixa o arquivo da API.' });
          setOpen(false);
        }}
      />
    </div>
  );
}

export const Papel: Story = {
  name: 'Prévia em papel',
  args: {
    open: true,
    onOpenChange: () => undefined,
    orderCount: 3,
    includeLabels: true,
    onIncludeLabelsChange: () => undefined,
    includePackingList: true,
    onIncludePackingListChange: () => undefined,
    labelFormat: 'a4',
    onLabelFormatChange: () => undefined,
    onConfirm: () => undefined,
  },
  render: () => <Interactive />,
};

export const ComPdf: Story = {
  name: 'Prévia abre o PDF',
  args: {
    open: true,
    onOpenChange: () => undefined,
    orderCount: 3,
    includeLabels: true,
    onIncludeLabelsChange: () => undefined,
    includePackingList: true,
    onIncludePackingListChange: () => undefined,
    labelFormat: 'a4',
    onLabelFormatChange: () => undefined,
    onConfirm: () => undefined,
  },
  render: () => <Interactive withPdf />,
};
