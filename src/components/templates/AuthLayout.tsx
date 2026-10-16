import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MoldeStitch } from './MoldeStitch';

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Conteúdo do cartão-molde (form de login, esqueci senha, convite…). */
  children: ReactNode;
  /**
   * Coluna à esquerda no desktop (copy + logo no tecido).
   * Some no celular.
   */
  aside?: ReactNode;
  /** Rótulo superior esquerdo do molde. */
  moldeLabel?: string;
  /** Rótulo superior direito do molde. */
  cutLabel?: string;
  /** Largura máxima do molde (px). */
  moldeMaxWidth?: number;
  /** Rodapé de confiança (API Shopee). */
  footer?: ReactNode;
}

/**
 * Template de autenticação (SHP-62): fundo estampa Botho + cartão molde com
 * costura animada (agulha + pesponto), como em Login.dc.html.
 */
export function AuthLayout({
  children,
  aside,
  moldeLabel = 'Molde 01 · entrada',
  cutLabel = 'Corte 1×',
  moldeMaxWidth = 420,
  footer,
  className,
  ...rest
}: AuthLayoutProps) {
  return (
    <div
      {...rest}
      className={cn(
        'bt-auth-bg relative flex min-h-dvh items-center justify-center gap-10 overflow-hidden px-5 py-14 md:gap-14 md:px-6',
        className,
      )}
    >
      {aside ? (
        <aside className="relative z-[1] hidden max-w-[420px] flex-col gap-[18px] text-[color:var(--bt-logo-fabric-petal)] md:flex dark:text-ink">
          {aside}
        </aside>
      ) : null}

      <div
        className="bt-molde relative z-[1] w-full shrink-0 rounded-md"
        style={{ maxWidth: moldeMaxWidth }}
      >
        <MoldeStitch />
        <span className="bt-molde-meta absolute top-[22px] left-[26px] z-[2]">{moldeLabel}</span>
        <span className="bt-molde-meta absolute top-[22px] right-[26px] z-[2]">{cutLabel}</span>
        <div className="relative z-[2] flex flex-col gap-[18px] px-[26px] pt-11 pb-7 sm:px-10 sm:pt-11 sm:pb-9">
          {children}
        </div>
      </div>

      {footer !== undefined ? (
        footer
      ) : (
        <p className="pointer-events-none absolute bottom-4 left-0 right-0 z-[1] flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-[12.5px] font-semibold text-ink-2">
            Conectado à sua loja pela API oficial da Shopee
          </span>
        </p>
      )}
    </div>
  );
}
