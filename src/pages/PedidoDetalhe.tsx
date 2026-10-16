import { ListChecks, MessageCircle, Printer, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { NAV_CATALOG } from '@/app/nav';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Spinner } from '@/components/atoms/Spinner';
import { Deadline } from '@/components/molecules/Deadline';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FormField } from '@/components/molecules/FormField';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { OrderDetailBody } from '@/components/organisms/OrderDetailBody';
import { deadlineOf, ORDER_TAB_LABELS } from '@/components/organisms/OrdersList';
import {
  PrintPreviewModal,
  type LabelFormat,
  type PrintPreviewLabel,
} from '@/components/organisms/PrintPreviewModal';
import { DetailPage } from '@/components/templates/DetailPage';
import { useCan } from '@/hooks/useAuth';
import {
  useCancelOrder,
  useCancelReasons,
  useOrder,
  usePrintLabels,
} from '@/hooks/useOrders';
import { ApiError } from '@/lib/api';
import { money } from '@/lib/format';
import { separacaoPath } from '@/lib/separacao';
import type { CancelReasonCode, OrderDetail, OrderStatus } from '@/lib/types';

/** Status em que a loja ainda pode pedir cancelamento (espelho do back). */
const CANCELABLE = new Set<OrderStatus>([
  'UNPAID',
  'READY_TO_SHIP',
  'RETRY_SHIP',
  'INVOICE_PENDING',
  'PROCESSED',
]);

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function formatPaidLine(order: OrderDetail): string {
  const parts: string[] = [];
  if (order.paidAt) {
    const d = new Date(order.paidAt);
    if (!Number.isNaN(d.getTime())) {
      const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      parts.push(`Pago em ${date} às ${time}`);
    }
  } else {
    parts.push('Aguardando pagamento');
  }
  const buyer = order.buyerUsername ?? order.recipientName ?? order.address.name;
  if (buyer) parts.push(buyer);
  const n = order.itemCount;
  parts.push(n === 1 ? '1 peça' : `${n} peças`);
  return parts.join(' · ');
}

function previewLabel(order: OrderDetail): PrintPreviewLabel {
  const first = order.items[0];
  const piece = first
    ? [first.name, first.variation?.replace(',', ' · ')].filter(Boolean).join(' · ')
    : 'Peça';
  return {
    orderSn: order.orderSn,
    to: order.recipientName ?? order.buyerUsername ?? order.address.name ?? '—',
    address: [order.address.city ?? order.city, order.address.state ?? order.state].filter(Boolean).join('/') || '—',
    piece,
    service: order.shippingCarrier ?? 'Xpress',
  };
}

function conversasReady() {
  return NAV_CATALOG.find((e) => e.id === 'conversas')?.ready === true;
}

/**
 * Página Detalhe do pedido (SHP-86): imprimir etiqueta, conversar (quando pronto), cancelar.
 */
export function PedidoDetalhePage() {
  const { orderSn: rawSn } = useParams<{ orderSn: string }>();
  const orderSn = rawSn?.trim().toUpperCase() || null;
  const navigate = useNavigate();

  const showMoney = useCan('financeiro.ver');
  const canPrint = useCan('pedidos.imprimir');
  const canCancel = useCan('pedidos.cancelar');
  const canChat = useCan('conversas.responder');

  const orderQ = useOrder(orderSn);
  const printLabels = usePrintLabels();
  const cancelOrder = useCancelOrder();

  const [printOpen, setPrintOpen] = useState(false);
  const [includeLabels, setIncludeLabels] = useState(true);
  const [includePackingList, setIncludePackingList] = useState(false);
  const [labelFormat, setLabelFormat] = useState<LabelFormat>('a4');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<CancelReasonCode | ''>('');
  const reasonsQ = useCancelReasons(canCancel && cancelOpen);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const order = orderQ.data;
  const cancelable = Boolean(order && canCancel && CANCELABLE.has(order.status));

  const deadline = useMemo(
    () => (order ? deadlineOf(order.shipByDate) : null),
    [order],
  );

  const backLabel = order?.tab ? `Pedidos / ${ORDER_TAB_LABELS[order.tab]}` : 'Pedidos';

  const openPrint = () => {
    if (!order || !canPrint) return;
    setIncludeLabels(true);
    setIncludePackingList(false);
    setLabelFormat('a4');
    setPrintOpen(true);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const onConfirmPrint = async () => {
    if (!order || !includeLabels) {
      toast.message('Marque a opção de etiquetas para gerar o PDF.');
      return;
    }
    try {
      const blob = await printLabels.mutateAsync([order.orderSn]);
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      downloadBlob(blob, `etiquetas-${order.orderSn}.pdf`);
      toast.success('Etiqueta pronta. O PDF foi baixado.');
      void orderQ.refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não deu para gerar a etiqueta.');
    }
  };

  const onChat = () => {
    if (!conversasReady()) {
      toast.message('Conversas em breve', {
        description: 'O chat com a compradora ainda está sendo costurado.',
      });
      return;
    }
    navigate('/conversas');
  };

  const onSeparacao = () => {
    if (!order) return;
    navigate(separacaoPath([order.orderSn]));
  };

  const onCopyTracking = async () => {
    const code = order?.trackingNumber;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Código de rastreio copiado.');
    } catch {
      toast.error('Não deu para copiar o código.');
    }
  };

  const confirmCancel = () => {
    if (!order || !cancelReason) {
      toast.error('Escolha o motivo do cancelamento.');
      return;
    }
    cancelOrder.mutate(
      { orderSn: order.orderSn, reason: cancelReason },
      {
        onSuccess: () => {
          setCancelOpen(false);
          setCancelReason('');
          toast.success('Pedido cancelado. A compradora foi avisada pela Shopee.');
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (!orderSn) {
    return (
      <EmptyState
        align="start"
        title="Pedido não encontrado"
        description="O endereço do pedido está incompleto."
        action={
          <Button variant="outline" onClick={() => navigate('/pedidos')}>
            Voltar aos pedidos
          </Button>
        }
      />
    );
  }

  if (orderQ.isPending && !order) {
    return (
      <div className="flex min-h-[calc(100dvh-9.5rem)] w-full flex-col items-center justify-center px-4 md:min-h-[calc(100dvh-6rem)]">
        <Spinner layout="stack" label="Carregando pedido…" />
      </div>
    );
  }

  if (orderQ.isError || !order) {
    const notFound = orderQ.error instanceof ApiError && orderQ.error.status === 404;
    return (
      <EmptyState
        align="start"
        title={notFound ? 'Pedido não encontrado' : 'Não deu para carregar o pedido'}
        description={
          orderQ.error instanceof Error
            ? orderQ.error.message
            : 'Tente de novo em instantes.'
        }
        action={
          <Button
            variant="outline"
            onClick={() => (notFound ? navigate('/pedidos') : void orderQ.refetch())}
          >
            {notFound ? 'Voltar aos pedidos' : 'Tentar de novo'}
          </Button>
        }
      />
    );
  }

  const buyerName = order.buyerUsername ?? order.recipientName ?? order.address.name ?? 'a compradora';
  const refundValue = order.orderTotal ?? order.escrow?.bruto ?? null;

  return (
    <>
      <DetailPage
        backLabel={backLabel}
        onBack={() => navigate('/pedidos')}
        title={`Pedido #${order.orderSn}`}
        badges={
          deadline ? (
            <Deadline urgency={deadline.urgency} size="lg">
              {deadline.urgency === 'today' && !deadline.label.startsWith('Atrasado')
                ? `Enviar até ${deadline.label.toLowerCase()}`
                : deadline.label}
            </Deadline>
          ) : undefined
        }
        description={formatPaidLine(order)}
        actions={
          <>
            {canPrint ? (
              <Button
                variant="primary"
                size="sm"
                icon={Printer}
                onClick={openPrint}
                loading={printLabels.isPending}
              >
                Imprimir etiqueta
              </Button>
            ) : null}
            {canChat ? (
              <Button variant="outline" size="sm" icon={MessageCircle} onClick={onChat}>
                Conversar com a compradora
              </Button>
            ) : null}
            {cancelable ? (
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                className="text-danger-text hover:bg-danger-soft hover:text-danger-text"
                onClick={() => {
                  setCancelReason('');
                  setCancelOpen(true);
                }}
              >
                Cancelar
              </Button>
            ) : null}
          </>
        }
      >
        <OrderDetailBody
          order={order}
          showMoney={showMoney}
          onChat={canChat ? onChat : undefined}
          onCopyTracking={onCopyTracking}
          itemsAction={
            <Button variant="link" size="sm" icon={ListChecks} onClick={onSeparacao}>
              Lista de separação
            </Button>
          }
        />
      </DetailPage>

      {canPrint ? (
        <PrintPreviewModal
          open={printOpen}
          onOpenChange={setPrintOpen}
          orderCount={1}
          includeLabels={includeLabels}
          onIncludeLabelsChange={setIncludeLabels}
          includePackingList={includePackingList}
          onIncludePackingListChange={setIncludePackingList}
          labelFormat={labelFormat}
          onLabelFormatChange={setLabelFormat}
          previewLabels={[previewLabel(order)]}
          pdfUrl={pdfUrl}
          loading={printLabels.isPending}
          onConfirm={() => void onConfirmPrint()}
        />
      ) : null}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCancelOpen(false);
            setCancelReason('');
          }
        }}
        title="Cancelar este pedido?"
        tone="danger"
        confirmLabel="Sim, cancelar pedido"
        cancelLabel="Voltar, não cancelar"
        loading={cancelOrder.isPending}
        onConfirm={confirmCancel}
        summary={
          <>
            <span>
              {buyerName} recebe o reembolso de <b className="money">{money(refundValue)}</b> pela
              Shopee.
            </span>
            <span className="mt-1 block text-sm text-muted">
              Cancelamentos frequentes podem afetar a avaliação da loja. Não dá para desfazer.
            </span>
          </>
        }
      >
        <FormField label="Motivo" required className="mt-3">
          <Select
            value={cancelReason}
            onValueChange={(v) => setCancelReason(v as CancelReasonCode)}
            placeholder={reasonsQ.isPending ? 'Carregando motivos…' : 'Escolha o motivo'}
            disabled={reasonsQ.isPending || cancelOrder.isPending}
            options={(reasonsQ.data ?? []).map((r) => ({ value: r.code, label: r.label }))}
          />
        </FormField>
      </ConfirmDialog>
    </>
  );
}
