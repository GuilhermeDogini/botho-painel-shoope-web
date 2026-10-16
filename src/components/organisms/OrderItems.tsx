import { MessageCircle } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Money } from '@/components/atoms/Money';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { ProductLine } from '@/components/molecules/ProductLine';
import { formatVariation } from '@/components/organisms/OrdersList';
import type { OrderItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface OrderItemsProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  items: ReadonlyArray<OrderItem>;
  /** Recado da compradora (message_to_seller). */
  messageToSeller?: string | null;
  /** Mostra preço unitário (some sem financeiro.ver). */
  showMoney?: boolean;
  title?: ReactNode;
  /** Link/botão “Lista de separação”. */
  action?: ReactNode;
}

/**
 * Itens do pedido + recado da compradora.
 */
export function OrderItems({
  items,
  messageToSeller,
  showMoney = true,
  title = 'Itens',
  action,
  className,
  ...rest
}: OrderItemsProps) {
  return (
    <section
      {...rest}
      aria-labelledby="order-items-title"
      className={cn('rounded-lg border border-line bg-surface p-5 shadow-1', className)}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="order-items-title" className="text-h3 font-bold text-ink">
          {title}
        </h2>
        {action}
      </div>

      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {items.map((item, i) => (
          <li key={`${item.itemId}-${item.modelId}-${i}`} className="min-w-0">
            <ProductLine
              name={item.name}
              imageSrc={item.imageUrl}
              variant={formatVariation(item.variation)}
              sku={item.sku ?? undefined}
              size="lg"
              extra={item.quantity > 1 ? `${item.quantity} unidades` : undefined}
              trailing={
                showMoney && item.unitPrice != null ? (
                  <Money value={item.unitPrice} className="text-base font-bold" />
                ) : undefined
              }
            />
          </li>
        ))}
      </ul>

      {messageToSeller?.trim() ? (
        <InlineAlert tone="info" icon={MessageCircle} className="mt-4">
          <span>
            <b>Recado da compradora:</b> “{messageToSeller.trim()}”
          </span>
        </InlineAlert>
      ) : null}
    </section>
  );
}
