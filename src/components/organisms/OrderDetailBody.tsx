import type { HTMLAttributes, ReactNode } from 'react';
import type { OrderDetail } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BuyerCard } from './BuyerCard';
import { DeliveryCard } from './DeliveryCard';
import { OrderItems } from './OrderItems';
import { defaultOrderTimelineSteps, OrderTimeline } from './OrderTimeline';
import { OrderValues } from './OrderValues';

export interface OrderDetailBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  order: OrderDetail;
  /** Sem financeiro.ver → OrderValues some. */
  showMoney?: boolean;
  onChat?: () => void;
  onCopyTracking?: () => void;
  itemsAction?: ReactNode;
}

/**
 * Composição do detalhe: andamento, itens/valores à esquerda, entrega/compradora à direita.
 * Props-only — a página (SHP-86) busca o pedido e as ações do cabeçalho.
 */
export function OrderDetailBody({
  order,
  showMoney = true,
  onChat,
  onCopyTracking,
  itemsAction,
  className,
  ...rest
}: OrderDetailBodyProps) {
  const steps = defaultOrderTimelineSteps({
    paidAt: order.paidAt,
    labelPrintedAt: order.labelPrintedAt,
    trackingNumber: order.trackingNumber,
    status: order.status,
  });

  const buyerName = order.buyerUsername ?? order.recipientName ?? order.address.name ?? 'Compradora';

  return (
    <div className={cn('flex min-w-0 flex-col gap-5', className)} {...rest}>
      <OrderTimeline steps={steps} />

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <OrderItems
            items={order.items}
            messageToSeller={order.messageToSeller}
            showMoney={showMoney}
            action={itemsAction}
          />
          <OrderValues escrow={order.escrow} showMoney={showMoney} />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <DeliveryCard
            address={order.address}
            shippingCarrier={order.shippingCarrier}
            trackingNumber={order.trackingNumber}
            onCopyTracking={order.trackingNumber ? onCopyTracking : undefined}
          />
          <BuyerCard
            name={buyerName}
            orderCount={order.buyerOrderCount}
            buyerSince={order.buyerSince}
            onChat={onChat}
          />
        </div>
      </div>
    </div>
  );
}
