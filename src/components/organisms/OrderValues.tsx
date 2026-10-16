import type { HTMLAttributes, ReactNode } from 'react';
import { KeyValueList, KeyValueRow } from '@/components/molecules/KeyValueRow';
import type { OrderEscrow } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface OrderValuesProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  escrow: OrderEscrow | null | undefined;
  /**
   * Sem financeiro.ver: não renderiza o card (a página omite).
   * Se `false` e ainda assim montar, mostra mensagem.
   */
  showMoney?: boolean;
  title?: ReactNode;
  lockedMessage?: ReactNode;
}

function liberacaoLabel(iso: string | null): string {
  if (!iso) return 'Liberado pela Shopee após a entrega';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Liberado pela Shopee após a entrega';
  return `Liberado pela Shopee após a entrega · previsão ${d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })}`;
}

/**
 * Breakdown financeiro do pedido (escrow).
 * Pronto quando: some para quem não tem financeiro.ver (`showMoney={false}` → null).
 */
export function OrderValues({
  escrow,
  showMoney = true,
  title = 'Valores',
  lockedMessage,
  className,
  ...rest
}: OrderValuesProps) {
  if (!showMoney) {
    if (!lockedMessage) return null;
    return (
      <section
        {...rest}
        aria-labelledby="order-values-title"
        className={cn('rounded-lg border border-line bg-surface p-5 shadow-1', className)}
      >
        <h2 id="order-values-title" className="mb-2 text-h3 font-bold text-ink">
          {title}
        </h2>
        <p className="text-sm text-muted">{lockedMessage}</p>
      </section>
    );
  }

  if (!escrow) {
    return (
      <section
        {...rest}
        aria-labelledby="order-values-title"
        className={cn('rounded-lg border border-line bg-surface p-5 shadow-1', className)}
      >
        <h2 id="order-values-title" className="mb-2 text-h3 font-bold text-ink">
          {title}
        </h2>
        <p className="text-sm text-muted">Valores ainda não sincronizados com a Shopee.</p>
      </section>
    );
  }

  return (
    <section
      {...rest}
      aria-labelledby="order-values-title"
      className={cn('rounded-lg border border-line bg-surface p-5 shadow-1', className)}
    >
      <h2 id="order-values-title" className="mb-3 text-h3 font-bold text-ink">
        {title}
      </h2>
      <KeyValueList aria-label="Valores do pedido">
        <KeyValueRow label="Valor da peça (bruto)" value={escrow.bruto} />
        <KeyValueRow
          label={
            <>
              Comissão Shopee <span className="text-sm font-normal text-muted">(14%)</span>
            </>
          }
          value={escrow.comissao}
          moneyKind="out"
          tone="danger"
        />
        <KeyValueRow label="Taxa por item vendido" value={escrow.taxaItem} moneyKind="out" tone="danger" />
        <KeyValueRow
          label={
            <>
              Frete <span className="text-sm font-normal text-muted">(programa de frete grátis)</span>
            </>
          }
          value={escrow.frete}
          moneyKind="out"
          tone="danger"
        />
        <KeyValueRow
          label="Líquido a receber"
          hint={liberacaoLabel(escrow.liberacaoEm)}
          value={escrow.liquido}
          moneyKind="in"
          tone="ok"
          emphasis
          flush
        />
      </KeyValueList>
    </section>
  );
}
