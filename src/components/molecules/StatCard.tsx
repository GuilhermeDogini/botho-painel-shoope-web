import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Money } from '@/components/atoms/Money';
import { cn } from '@/lib/utils';

export type StatDeltaTone = 'ok' | 'warn' | 'danger' | 'muted';

const DELTA_TONE: Record<StatDeltaTone, string> = {
  ok: 'text-salvia-text',
  warn: 'text-mostarda-text',
  danger: 'text-danger-text',
  muted: 'text-muted',
};

export interface StatDelta {
  /** Texto da variação ("+12% vs. ontem"). Sempre com texto — nunca só cor. */
  label: ReactNode;
  tone?: StatDeltaTone;
  icon?: LucideIcon;
}

export interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Rótulo pequeno acima do valor ("Vendido hoje"). */
  label: ReactNode;
  /**
   * Valor principal. Número → formata em R$ via `Money`.
   * `null`/`undefined` → "—" (sem `financeiro.ver` ou vazio).
   * ReactNode se quiser texto livre ("6 pedidos").
   */
  value: number | null | undefined | ReactNode;
  /** Variação sob o valor (ícone + texto). */
  delta?: StatDelta;
  /** Linha auxiliar ("em liberação pela Shopee"). */
  hint?: ReactNode;
  /** Ícone decorativo no canto (opcional). */
  icon?: LucideIcon;
  /** `soft`: fundo surface-2 arredondado (blocos A receber / Carteira). */
  variant?: 'plain' | 'soft';
  /** Tamanho do número. */
  size?: 'md' | 'sm';
}

/**
 * KPI do Início / Financeiro: rótulo, valor grande, variação e dica.
 * Espelha `.kpi` + `.delta` do DesignSystem / Inicio.dc.html.
 */
export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  variant = 'plain',
  size = 'md',
  className,
  ...rest
}: StatCardProps) {
  const DeltaIcon = delta?.icon;
  const isMoneyLike = typeof value === 'number' || value == null;

  return (
    <div
      {...rest}
      className={cn(
        'flex min-w-0 flex-col gap-1',
        variant === 'soft' && 'rounded-[12px] bg-surface-2 p-3',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-muted">{label}</span>
        {Icon ? <Icon size={18} strokeWidth={1.75} aria-hidden className="shrink-0 text-muted" /> : null}
      </div>
      <div
        className={cn(
          'font-display font-bold tracking-[-.02em] text-ink tabular-nums',
          size === 'md' ? 'text-[26px] leading-[1.1] max-md:text-[22px]' : 'text-[20px] leading-[1.15]',
        )}
      >
        {isMoneyLike ? (
          <Money
            value={value as number | null | undefined}
            className="text-[length:inherit] leading-[inherit] tracking-[inherit]"
          />
        ) : (
          value
        )}
      </div>
      {delta ? (
        <span className={cn('inline-flex items-center gap-1 text-[13px] font-bold', DELTA_TONE[delta.tone ?? 'muted'])}>
          {DeltaIcon ? <DeltaIcon size={14} strokeWidth={2} aria-hidden className="shrink-0" /> : null}
          {delta.label}
        </span>
      ) : null}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
  );
}
