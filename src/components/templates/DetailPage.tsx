import { ChevronLeft } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DetailPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Link/botão de voltar (ex.: “Pedidos”). Sem `onBack`, some. */
  backLabel?: ReactNode;
  onBack?: () => void;
  /** Título principal (ex.: Pedido #…). */
  title: ReactNode;
  /** Tags / status ao lado do título. */
  badges?: ReactNode;
  /** Linha de apoio sob o título. */
  description?: ReactNode;
  /** Ações à direita (imprimir, conversar…). */
  actions?: ReactNode;
  /** Conteúdo principal (coluna esquerda no desktop). */
  children: ReactNode;
  /** Coluna lateral (entrega, rastreio…). Empilha no celular. */
  sidebar?: ReactNode;
}

/**
 * Esqueleto de detalhe (SHP-63): voltar, cabeçalho e duas colunas.
 */
export function DetailPage({
  backLabel = 'Voltar',
  onBack,
  title,
  badges,
  description,
  actions,
  children,
  sidebar,
  className,
  ...rest
}: DetailPageProps) {
  return (
    <div {...rest} className={cn('flex flex-col gap-6', className)}>
      <header className="flex flex-col gap-2.5">
        {onBack ? (
          <nav aria-label="Caminho">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-11 items-center gap-1 border-0 bg-transparent px-0 text-sm text-muted hover:text-ink"
            >
              <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
              {backLabel}
            </button>
          </nav>
        ) : null}

        <div className="flex flex-wrap items-end justify-between gap-3.5">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-h1 font-bold tracking-[-0.025em] tabular-nums">{title}</h1>
              {badges}
            </div>
            {description ? <p className="text-sm text-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      </header>

      {sidebar ? (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">{children}</div>
          <aside className="flex min-w-0 flex-col gap-5">{sidebar}</aside>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-5">{children}</div>
      )}
    </div>
  );
}
