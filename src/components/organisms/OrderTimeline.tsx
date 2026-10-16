import { Check, Home, Printer, Scissors, Truck, Wallet, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type OrderTimelineStepState = 'done' | 'current' | 'todo';

export interface OrderTimelineStep {
  id: string;
  label: string;
  /** Quando aconteceu / previsão ("08/10, 09:12", "Falta imprimir"). */
  when: string;
  state: OrderTimelineStepState;
  icon?: LucideIcon;
}

export interface OrderTimelineProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  steps: ReadonlyArray<OrderTimelineStep>;
  title?: ReactNode;
}

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  pago: Wallet,
  separado: Scissors,
  etiqueta: Printer,
  coletado: Truck,
  entregue: Home,
};

/**
 * Linha do tempo do pedido (Andamento).
 * Horizontal no desktop; vertical no celular — espelha PedidoDetalhe.dc.html.
 */
export function OrderTimeline({
  steps,
  title = 'Andamento',
  className,
  ...rest
}: OrderTimelineProps) {
  return (
    <section
      {...rest}
      aria-labelledby="order-timeline-title"
      className={cn('rounded-lg border border-line bg-surface p-5 shadow-1', className)}
    >
      <h2 id="order-timeline-title" className="mb-4 text-h3 font-bold text-ink">
        {title}
      </h2>
      <ol
        className={cn(
          'm-0 flex list-none flex-col gap-0 p-0',
          'md:flex-row md:gap-2',
          'border-l-2 border-dashed border-line-2 md:border-l-0',
          'ml-[17px] md:ml-0',
        )}
      >
        {steps.map((step, i) => {
          const Icon = step.state === 'done' ? Check : (step.icon ?? DEFAULT_ICONS[step.id] ?? Truck);
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.id}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col gap-2.5',
                'max-md:-ml-[19px] max-md:flex-row max-md:items-start max-md:gap-3.5',
                !isLast && 'max-md:pb-5',
                !isLast &&
                  step.state === 'done' &&
                  'md:bg-[repeating-linear-gradient(90deg,var(--bt-salvia)_0_6px,transparent_6px_11px)] md:bg-[length:calc(100%-54px)_2px] md:bg-[position:46px_17px] md:bg-no-repeat',
                !isLast &&
                  step.state !== 'done' &&
                  'md:bg-[repeating-linear-gradient(90deg,var(--bt-line-2)_0_6px,transparent_6px_11px)] md:bg-[length:calc(100%-54px)_2px] md:bg-[position:46px_17px] md:bg-no-repeat',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'inline-flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px]',
                  step.state === 'done' && 'border-transparent bg-salvia text-white',
                  step.state === 'current' &&
                    'border-transparent bg-brand text-brand-ink shadow-[0_0_0_4px_var(--bt-brand-soft)]',
                  step.state === 'todo' && 'border-dashed border-line-2 bg-surface text-muted',
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-bold text-ink">{step.label}</span>
                <span className="text-sm text-muted">{step.when}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Monta os 5 passos padrão a partir do status / etiqueta impressa. */
export function defaultOrderTimelineSteps(opts: {
  paidAt: string | null;
  labelPrintedAt?: string | null;
  trackingNumber?: string | null;
  status: string;
}): OrderTimelineStep[] {
  const printed = Boolean(opts.labelPrintedAt || opts.trackingNumber);
  const shipped = ['SHIPPED', 'TO_CONFIRM_RECEIVE', 'COMPLETED', 'TO_RETURN'].includes(opts.status);
  const delivered = ['TO_CONFIRM_RECEIVE', 'COMPLETED'].includes(opts.status);
  const paidLabel = opts.paidAt
    ? new Date(opts.paidAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  let current = 1;
  if (printed) current = 2;
  if (shipped) current = 3;
  if (delivered) current = 4;

  const defs: { id: string; label: string; when: string; icon: LucideIcon }[] = [
    { id: 'pago', label: 'Pago', when: paidLabel, icon: Wallet },
    { id: 'separado', label: 'Separado', when: printed ? 'Feito' : 'Agora', icon: Scissors },
    {
      id: 'etiqueta',
      label: 'Etiqueta',
      when: printed ? 'Impressa' : 'Falta imprimir',
      icon: Printer,
    },
    { id: 'coletado', label: 'Coletado', when: shipped ? 'Em trânsito' : 'Aguardando', icon: Truck },
    { id: 'entregue', label: 'Entregue', when: delivered ? 'Concluído' : 'Previsão', icon: Home },
  ];

  return defs.map((d, i) => ({
    ...d,
    state: (i < current ? 'done' : i === current ? 'current' : 'todo') as OrderTimelineStepState,
  }));
}
