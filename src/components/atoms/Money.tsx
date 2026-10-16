import type { HTMLAttributes } from 'react';
import { type MoneyKind, moneyText } from '@/lib/format';
import { cn } from '@/lib/utils';

const KIND_TONE: Record<MoneyKind, string> = {
  in: 'text-salvia-text',
  out: 'text-danger-text',
  neutral: '',
};

export interface MoneyProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Valor em reais. `null`/`undefined` mostram "—": é o que chega quando a API tira o valor
   * de quem não tem financeiro.ver (@RedactMoney), ou quando ainda não existe.
   */
  value: number | null | undefined;
  /** Entrada (+, verde), saída (−, vermelho) ou neutro. O sinal sempre aparece em texto, não só na cor. */
  kind?: MoneyKind;
  /** Sem a cor do tipo (ex.: gasto de Ads, que sai do crédito e não da carteira). */
  plain?: boolean;
}

export function Money({ value, kind = 'neutral', plain = false, className, ...rest }: MoneyProps) {
  if (value == null || !Number.isFinite(value)) {
    return (
      <span {...rest} className={cn('money text-muted', className)}>
        <span aria-hidden>—</span>
        <span className="sr-only">sem valor</span>
      </span>
    );
  }
  return (
    <span {...rest} className={cn('money', !plain && KIND_TONE[kind], className)}>
      {moneyText(value, kind)}
    </span>
  );
}
