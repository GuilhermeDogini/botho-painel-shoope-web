import { AlertTriangle, Check, Info, Unplug, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type InlineAlertTone = 'info' | 'warn' | 'danger' | 'ok';

const TONE: Record<InlineAlertTone, string> = {
  info: '[--alert-bg:var(--bt-anil-soft)] [--alert-fg:var(--bt-anil-text)]',
  warn: '[--alert-bg:var(--bt-mostarda-soft)] [--alert-fg:var(--bt-mostarda-text)]',
  danger: '[--alert-bg:var(--bt-danger-soft)] [--alert-fg:var(--bt-danger-text)]',
  ok: '[--alert-bg:var(--bt-salvia-soft)] [--alert-fg:var(--bt-salvia-text)]',
};

const DEFAULT_ICON: Record<InlineAlertTone, LucideIcon> = {
  info: Info,
  warn: AlertTriangle,
  danger: Unplug,
  ok: Check,
};

export interface InlineAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  tone?: InlineAlertTone;
  /** Ícone à esquerda. Padrão conforme o tom. `null` esconde. */
  icon?: LucideIcon | null;
  children: ReactNode;
  /** Ação opcional à direita (link/botão). */
  action?: ReactNode;
}

/**
 * Faixa de aviso no conteúdo (info / atenção / erro / sucesso).
 * Espelha `.banner` do DesignSystem — ícone + texto (nunca só cor).
 */
export function InlineAlert({
  tone = 'info',
  icon,
  children,
  action,
  className,
  role = 'status',
  ...rest
}: InlineAlertProps) {
  const Icon = icon === null ? null : (icon ?? DEFAULT_ICON[tone]);

  return (
    <div
      {...rest}
      role={role}
      className={cn(
        'flex items-center gap-3 rounded-md border px-4 py-3 text-sm',
        'border-[color-mix(in_srgb,var(--alert-fg)_18%,transparent)] bg-[var(--alert-bg)] text-[var(--alert-fg)]',
        TONE[tone],
        className,
      )}
    >
      {Icon ? <Icon size={20} strokeWidth={1.75} aria-hidden className="shrink-0" /> : null}
      <div className="min-w-0 flex-1 font-medium text-ink">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
