import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ListPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título da tela (ex.: Pedidos). */
  title: ReactNode;
  /** Linha de apoio sob o título. */
  description?: ReactNode;
  /** Ações à direita do título (busca, botões…). */
  actions?: ReactNode;
  /** Abas (Tabs) sob o cabeçalho. */
  tabs?: ReactNode;
  /** Faixa de filtros / chips. */
  filters?: ReactNode;
  /** Conteúdo principal (tabela, cards, empty…). */
  children: ReactNode;
  /** Rodapé da lista (paginação, “mostrando X de Y”…). */
  footer?: ReactNode;
}

/**
 * Esqueleto de tela de lista (SHP-63): título, ações, abas, filtros e conteúdo.
 * Encaixa no `AppShell` — não inclui navegação.
 */
export function ListPage({
  title,
  description,
  actions,
  tabs,
  filters,
  children,
  footer,
  className,
  ...rest
}: ListPageProps) {
  return (
    <div {...rest} className={cn('flex flex-col gap-6', className)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-display text-h1 font-bold tracking-[-0.025em]">{title}</h1>
          {description ? <p className="text-sm text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-1.5">{actions}</div> : null}
      </header>

      {tabs ? <div className="min-w-0">{tabs}</div> : null}
      {filters ? <div className="min-w-0">{filters}</div> : null}

      <div className="min-w-0 flex flex-col gap-4">{children}</div>

      {footer ? <div className="text-sm text-muted">{footer}</div> : null}
    </div>
  );
}
