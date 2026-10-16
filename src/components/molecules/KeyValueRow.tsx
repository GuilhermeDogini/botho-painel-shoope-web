import type { HTMLAttributes, ReactNode } from 'react';
import { Money, type MoneyProps } from '@/components/atoms/Money';
import { cn } from '@/lib/utils';

export type KeyValueTone = 'ink' | 'ok' | 'danger' | 'muted';

const VALUE_TONE: Record<KeyValueTone, string> = {
  ink: 'text-ink',
  ok: 'text-salvia-text',
  danger: 'text-danger-text',
  muted: 'text-muted',
};

export interface KeyValueRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  /** Texto auxiliar sob o rótulo (ex.: "Liberado após a entrega"). */
  hint?: ReactNode;
  /**
   * Valor à direita. Número/`null` → `Money`.
   * ReactNode para texto livre ("Shopee Xpress").
   */
  value: number | null | undefined | ReactNode;
  /** Tipo do Money quando `value` é número. */
  moneyKind?: MoneyProps['kind'];
  plainMoney?: boolean;
  /** Cor do valor (status nunca só por cor — o sinal do Money ou o texto já ajudam). */
  tone?: KeyValueTone;
  /** Linha de total: rótulo em negrito e valor maior. */
  emphasis?: boolean;
  /** Sem borda inferior (última linha ou grupo). */
  flush?: boolean;
}

/**
 * Linha rótulo ↔ valor (pedido, extrato, rastreio).
 * Espelha o bloco "Valores" de PedidoDetalhe.dc.html.
 */
export function KeyValueRow({
  label,
  hint,
  value,
  moneyKind = 'neutral',
  plainMoney = false,
  tone = 'ink',
  emphasis = false,
  flush = false,
  className,
  ...rest
}: KeyValueRowProps) {
  const isMoneyLike = typeof value === 'number' || value == null;

  return (
    <div
      {...rest}
      role="row"
      className={cn(
        'flex items-start justify-between gap-4 py-2.5 text-sm',
        !flush && 'border-b border-line',
        className,
      )}
    >
      <div role="cell" className={cn('min-w-0', emphasis && 'font-bold')}>
        {label}
        {hint ? <div className="mt-0.5 text-sm font-normal text-muted">{hint}</div> : null}
      </div>
      <div
        role="cell"
        className={cn(
          'shrink-0 text-right font-medium tabular-nums',
          VALUE_TONE[tone],
          emphasis && 'font-display text-[26px] leading-none font-bold tracking-[-.02em]',
        )}
      >
        {isMoneyLike ? (
          <Money value={value as number | null | undefined} kind={moneyKind} plain={plainMoney} />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export interface KeyValueListProps extends HTMLAttributes<HTMLDivElement> {
  'aria-label'?: string;
}

/** Lista de `KeyValueRow` (papel de tabela simples). */
export function KeyValueList({ className, children, ...rest }: KeyValueListProps) {
  return (
    <div {...rest} role="table" className={cn('min-w-0', className)}>
      <div role="rowgroup">{children}</div>
    </div>
  );
}
