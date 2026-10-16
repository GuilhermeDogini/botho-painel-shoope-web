import { AlertTriangle, ListChecks, Printer } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { Deadline, type DeadlineUrgency } from '@/components/molecules/Deadline';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ProductLine } from '@/components/molecules/ProductLine';
import { TapeProgress } from '@/components/molecules/TapeProgress';
import { cn } from '@/lib/utils';
import { InicioCard, InicioLinkButton } from './inicioShared';

export interface OrdersToShipOrder {
  id: string;
  name: string;
  /** Ex.: "Azul anil · M". */
  variant?: string;
  buyer?: string;
  imageSrc?: string | null;
  total?: number | null;
  deadlineLabel: string;
  deadlineUrgency?: DeadlineUrgency;
  onClick?: () => void;
}

export interface OrdersToShipCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `InicioSummary.pedidos.aEnviar`. */
  count: number;
  /** Texto de urgência (ex.: "2 vencem hoje às 18h"). */
  dueLabel?: string;
  orders?: ReadonlyArray<OrdersToShipOrder>;
  onViewAll?: () => void;
  onPrintLabels?: () => void;
  onSeparacao?: () => void;
  /** Progresso da separação (Expedição). */
  packing?: { packed: number; total: number };
  /**
   * Mostra o valor (R$) em cada pedido. `false` na Expedição — sem dinheiro na tela.
   * @default true
   */
  showTotals?: boolean;
  emptyAction?: ReactNode;
}

/**
 * Card “pedidos a enviar hoje”: contagem, urgência, imprimir / separação e lista.
 * Reaproveitado no Início admin e Expedição.
 */
export function OrdersToShipCard({
  count,
  dueLabel,
  orders = [],
  onViewAll,
  onPrintLabels,
  onSeparacao,
  packing,
  showTotals = true,
  emptyAction,
  className,
  ...rest
}: OrdersToShipCardProps) {
  const titleId = 'orders-to-ship-title';

  return (
    <InicioCard
      {...rest}
      stitch
      aria-labelledby={titleId}
      className={cn('flex flex-col gap-4', className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-end gap-3 sm:gap-4">
          <span className="font-display text-[56px] leading-none font-extrabold tracking-[-0.04em] text-brand-text tabular-nums sm:text-[64px]">
            {count}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5 pb-1">
            <h2 id={titleId} className="font-display text-[20px] leading-tight font-bold tracking-[-0.015em] text-ink sm:text-[22px]">
              pedidos a enviar hoje
            </h2>
            {dueLabel ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-danger-text">
                <AlertTriangle size={14} strokeWidth={2} aria-hidden className="shrink-0" />
                {dueLabel}
              </span>
            ) : null}
          </div>
        </div>
        {onViewAll ? <InicioLinkButton onClick={onViewAll}>Ver todos</InicioLinkButton> : null}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Button type="button" variant="primary" size="lg" icon={Printer} fullWidth onClick={onPrintLabels}>
          Imprimir etiquetas
        </Button>
        <Button type="button" variant="outline" size="lg" icon={ListChecks} fullWidth onClick={onSeparacao}>
          Lista de separação
        </Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          illustration="cabide"
          title="Nenhum pedido para enviar"
          description="Quando entrarem vendas a enviar, elas aparecem aqui."
          action={emptyAction}
          className="py-4"
        />
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
          {orders.map((o) => {
            const variantLine =
              o.variant && o.buyer ? `${o.variant} · ${o.buyer}` : (o.variant ?? o.buyer);
            const line = (
              <ProductLine
                name={o.name}
                imageSrc={o.imageSrc}
                variant={variantLine}
                trailing={
                  <>
                    <Deadline urgency={o.deadlineUrgency ?? 'date'}>{o.deadlineLabel}</Deadline>
                    {showTotals ? <Money value={o.total} className="text-sm font-bold" /> : null}
                  </>
                }
              />
            );

            return (
              <li key={o.id} className="min-w-0 py-2.5 first:pt-0 last:pb-0">
                {o.onClick ? (
                  <button
                    type="button"
                    onClick={o.onClick}
                    className="w-full min-w-0 rounded-md px-3 py-3 text-left hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--bt-focus)]"
                  >
                    {line}
                  </button>
                ) : (
                  line
                )}
              </li>
            );
          })}
        </ul>
      )}

      {packing ? (
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-bold text-ink">Separação de hoje</span>
            <span className="tabular-nums text-muted">
              {packing.packed} de {packing.total} embalados
            </span>
          </div>
          <TapeProgress
            value={packing.packed}
            max={Math.max(packing.total, 1)}
            tone="ok"
            size="sm"
            aria-label={`Separação: ${packing.packed} de ${packing.total} embalados`}
          />
        </div>
      ) : null}
    </InicioCard>
  );
}
