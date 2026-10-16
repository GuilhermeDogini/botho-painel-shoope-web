import { Unplug, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface GlobalConnectionBannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Mensagem (ex.: "A conexão com a Shopee venceu ontem…"). */
  children: ReactNode;
  /** Ação (link/botão "Reconectar agora"). */
  action?: ReactNode;
  /** Ícone à esquerda. Padrão: Unplug. `null` esconde. */
  icon?: LucideIcon | null;
  /**
   * `false` esconde a faixa (ex.: conexão ok).
   * Quem monta o AppShell decide quando mostrar — a faixa em si não some ao navegar.
   */
  visible?: boolean;
}

/**
 * Faixa global de conexão (`.globalbar`): fundo danger, topo de todas as telas.
 * Compacta: ícone + texto + ação em fluxo inline; no celular ~2 linhas (ação embaixo).
 */
export function GlobalConnectionBanner({
  children,
  action,
  icon,
  visible = true,
  className,
  role = 'alert',
  ...rest
}: GlobalConnectionBannerProps) {
  if (!visible) return null;

  const Icon = icon === null ? null : (icon ?? Unplug);

  return (
    <div
      {...rest}
      role={role}
      className={cn(
        'w-full bg-danger px-4 py-2.5 text-center text-sm font-semibold leading-snug text-danger-ink',
        '[&_a]:cursor-pointer [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-3',
        '[&_button]:inline [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent',
        '[&_button]:p-0 [&_button]:align-baseline [&_button]:font-semibold [&_button]:text-inherit',
        '[&_button]:underline [&_button]:underline-offset-3',
        className,
      )}
    >
      {Icon ? (
        <Icon
          size={18}
          strokeWidth={1.75}
          aria-hidden
          className="mr-2 inline-block shrink-0 align-[-3px]"
        />
      ) : null}
      <span>{children}</span>
      {action ? (
        <>
          {' '}
          <span className="inline-block whitespace-nowrap">{action}</span>
        </>
      ) : null}
    </div>
  );
}
