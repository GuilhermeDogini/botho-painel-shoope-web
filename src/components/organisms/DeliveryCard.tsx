import { Copy, Lock, Truck } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

export interface DeliveryAddress {
  name: string | null;
  phone?: string | null;
  line: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
}

export interface DeliveryCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  address: DeliveryAddress;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  title?: ReactNode;
  trackingTitle?: ReactNode;
  onCopyTracking?: () => void;
}

/**
 * Endereço mascarado + nota de privacidade; bloco de rastreio quando houver código.
 */
export function DeliveryCard({
  address,
  shippingCarrier,
  trackingNumber,
  title = 'Entrega',
  trackingTitle = 'Rastreio',
  onCopyTracking,
  className,
  ...rest
}: DeliveryCardProps) {
  const cityState = [address.city, address.state].filter(Boolean).join('/');
  const line2 = [address.district, cityState].filter(Boolean).join(' · ');

  return (
    <div className={cn('flex flex-col gap-5', className)} {...rest}>
      <section
        aria-labelledby="order-delivery-title"
        className="rounded-lg border border-line bg-surface p-5 shadow-1"
      >
        <h2 id="order-delivery-title" className="mb-3 text-h3 font-bold text-ink">
          {title}
        </h2>
        <div className="flex flex-col gap-1 text-[15px] text-ink">
          {address.name ? <span className="font-bold">{address.name}</span> : null}
          {address.line ? <span>{address.line}</span> : null}
          {line2 ? <span>{line2}</span> : null}
          {address.zipcode ? <span className="tabular-nums">CEP {address.zipcode}</span> : null}
        </div>
        <div className="mt-3.5 flex gap-2 rounded-md bg-surface-2 p-3 text-sm text-muted">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden strokeWidth={1.75} />
          <span>
            A Shopee mostra só parte do endereço para proteger a compradora. A etiqueta sai com o
            endereço completo.
          </span>
        </div>
      </section>

      <section
        aria-labelledby="order-tracking-title"
        className="rounded-lg border border-line bg-surface p-5 shadow-1"
      >
        <h2 id="order-tracking-title" className="mb-3 text-h3 font-bold text-ink">
          {trackingTitle}
        </h2>
        {trackingNumber ? (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted">Código</span>
              <span className="font-bold tabular-nums">{trackingNumber}</span>
            </div>
            {shippingCarrier ? (
              <div className="flex justify-between gap-2">
                <span className="text-muted">Transportadora</span>
                <span className="font-bold">{shippingCarrier}</span>
              </div>
            ) : null}
            {onCopyTracking ? (
              <Button type="button" variant="outline" size="sm" icon={Copy} className="mt-1 self-start" onClick={onCopyTracking}>
                Copiar código
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="flex gap-3">
            <Truck className="size-9 shrink-0 text-muted" aria-hidden strokeWidth={1.5} />
            <p className="text-sm text-muted">
              O código de rastreio aparece aqui assim que a etiqueta for gerada.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
