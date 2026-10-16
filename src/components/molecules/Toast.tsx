import { Check, X, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  /** Ação ("Desfazer"). */
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  icon?: LucideIcon;
  /** Liga a animação `toastin` (desligada na Vitrine estática se preferir). */
  animate?: boolean;
}

/**
 * Cartão visual do toast Botho (fundo ink). O empilhamento ao vivo é o Sonner
 * via `AppToaster` — este componente serve na Vitrine/Storybook e como referência.
 */
export function Toast({
  children,
  actionLabel,
  onAction,
  onDismiss,
  icon: Icon = Check,
  animate = true,
  className,
  role = 'status',
  ...rest
}: ToastProps) {
  return (
    <div
      {...rest}
      role={role}
      className={cn(
        'flex min-h-14 max-w-[420px] items-center gap-3 rounded-md bg-ink px-4 py-3.5 text-sm font-semibold text-bg shadow-3',
        animate && 'bt-toast-in motion-reduce:animate-none',
        className,
      )}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden className="shrink-0 text-salvia dark:text-[#3A5C42]" />
      <div className="min-w-0 flex-1 leading-snug">{children}</div>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex min-h-9 shrink-0 cursor-pointer items-center border-0 bg-transparent px-1 text-sm font-semibold text-bg underline underline-offset-3"
        >
          {actionLabel}
        </button>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm text-bg/80 hover:bg-white/10 hover:text-bg"
        >
          <X size={16} strokeWidth={1.75} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
