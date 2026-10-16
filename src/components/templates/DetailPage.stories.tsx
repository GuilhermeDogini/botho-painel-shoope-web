import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, MessageCircle, Printer, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { DetailPage } from './DetailPage';

const meta = {
  title: 'Templates/DetailPage',
  component: DetailPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Detalhe (SHP-63): voltar, cabeçalho e colunas — como PedidoDetalhe.dc.html.

Os botões da demo só mostram feedback. PDF de etiqueta real = SHP-79 (back) + SHP-84 (PrintPreviewModal).
        `,
      },
    },
  },
} satisfies Meta<typeof DetailPage>;

export default meta;
type Story = StoryObj<typeof DetailPage>;

function PedidoDemo() {
  const [feedback, setFeedback] = useState('');
  const [printed, setPrinted] = useState(false);

  return (
    <DetailPage
      backLabel="Pedidos"
      onBack={() => setFeedback('Voltar para a lista (demo)')}
      title="Pedido #251008K7Q2M"
      badges={
        <Tag tone="danger" icon={AlertTriangle} size="lg">
          Enviar até hoje, 18h
        </Tag>
      }
      description="Pago em 08/10 às 09:12 · Ana Paula · 1 peça"
      actions={
        <>
          <Button
            type="button"
            variant="primary"
            icon={Printer}
            onClick={() => {
              setPrinted(true);
              setFeedback(
                'Demo: etiqueta marcada como impressa. O PDF da Shopee entra em SHP-79/SHP-84.',
              );
            }}
          >
            Imprimir etiqueta
          </Button>
          <Button
            type="button"
            variant="outline"
            icon={MessageCircle}
            onClick={() => setFeedback('Demo: abrir conversa com a compradora (SHP chat).')}
          >
            Conversar
          </Button>
          <Button
            type="button"
            variant="ghost"
            icon={X}
            className="text-danger-text"
            onClick={() => setFeedback('Demo: abrir confirmação de cancelamento.')}
          >
            Cancelar
          </Button>
        </>
      }
      sidebar={
        <>
          <section className="rounded-lg border border-line bg-surface p-5">
            <h2 className="text-h3 font-bold">Entrega</h2>
            <p className="mt-2 text-sm text-muted">Rua A*** · Tatuapé · São Paulo/SP</p>
          </section>
          <section className="rounded-lg border border-line bg-surface p-5">
            <h2 className="text-h3 font-bold">Rastreio</h2>
            {printed ? (
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted">Código</span>
                  <span className="font-bold tabular-nums">BR2510086341SPX</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted">Transportadora</span>
                  <span className="font-bold">Shopee Xpress</span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">Aparece após gerar a etiqueta.</p>
            )}
          </section>
        </>
      }
    >
      <section className="rounded-lg border border-line bg-surface p-5">
        <h2 className="text-h3 font-bold">Itens</h2>
        <p className="mt-2 text-sm text-muted">Coluna principal (itens, valores, andamento).</p>
        {feedback ? (
          <p className="mt-4 rounded-md bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-text" role="status">
            {feedback}
          </p>
        ) : null}
      </section>
    </DetailPage>
  );
}

export const Pedido: Story = {
  name: 'Pedido (demo)',
  render: () => <PedidoDemo />,
};
