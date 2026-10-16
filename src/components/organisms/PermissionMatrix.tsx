import { Check, Eye, Minus } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { cn } from '@/lib/utils';
import {
  CELL_LABEL,
  CELL_LABEL_LONG,
  MATRIX,
  type MatrixCell,
  type MatrixPermissionRow,
  type PermissionMatrixData,
} from './equipeShared';

export interface PermissionMatrixProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** Dados da matriz. Padrão: `MATRIX` do design. */
  data?: PermissionMatrixData;
  /** Título acima da tabela. Passe `null` para omitir. */
  title?: ReactNode | null;
  /** Mostra a legenda Pode / Só vê / Não acessa. */
  showLegend?: boolean;
}

const CELL_ICON = {
  pode: Check,
  ve: Eye,
  nao: Minus,
} as const;

const CELL_TONE: Record<MatrixCell, string> = {
  pode: 'text-salvia-text',
  ve: 'text-anil-text',
  nao: 'text-muted',
};

function CellMark({ cell }: { cell: MatrixCell }) {
  const Icon = CELL_ICON[cell];
  const label = CELL_LABEL[cell];
  return (
    <span
      className={cn('inline-flex items-center justify-center gap-1 font-semibold', CELL_TONE[cell])}
      title={label}
    >
      <Icon size={14} strokeWidth={2} aria-hidden className="shrink-0" />
      <span className="text-xs">{label}</span>
    </span>
  );
}

function Legend() {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-3.5 gap-y-1 p-0 text-[13px] text-ink-2" aria-label="Legenda">
      {(['pode', 've', 'nao'] as const).map((cell) => {
        const Icon = CELL_ICON[cell];
        return (
          <li key={cell} className={cn('inline-flex items-center gap-1', CELL_TONE[cell])}>
            <Icon size={14} strokeWidth={2} aria-hidden className="shrink-0" />
            <span>{CELL_LABEL_LONG[cell]}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Tabela desktop: linhas = permissões, colunas = papéis, células Pode / Só vê / Não.
 * Em telas estreitas o container rola horizontalmente por dentro (a página pode esconder
 * este organismo e usar RoleCards no celular).
 */
export function PermissionMatrix({
  data = MATRIX,
  title = 'O que cada papel pode fazer',
  showLegend = true,
  className,
  ...rest
}: PermissionMatrixProps) {
  const roles = data.roles;
  const permissions: readonly MatrixPermissionRow[] = data.permissions;

  return (
    <section
      {...rest}
      aria-labelledby={title ? 'perm-matrix-title' : undefined}
      className={cn('min-w-0 overflow-hidden rounded-lg border border-line bg-surface shadow-1', className)}
    >
      {(title || showLegend) && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 pt-5 pb-3">
          {title ? (
            <Heading id="perm-matrix-title" level={2} size="h2">
              {title}
            </Heading>
          ) : (
            <span />
          )}
          {showLegend ? <Legend /> : null}
        </div>
      )}

      <div className="overflow-x-auto">
        <div
          role="table"
          aria-label="Matriz de permissões por papel"
          className="min-w-[760px] w-full border-t border-line"
        >
          <div role="rowgroup">
            <div role="row" className="grid border-b border-line bg-surface-2" style={{ gridTemplateColumns: `minmax(200px,1.4fr) repeat(${roles.length}, minmax(100px,1fr))` }}>
              <div role="columnheader" className="px-4 py-2.5 text-left text-xs font-bold tracking-[.06em] text-muted uppercase">
                Permissão
              </div>
              {roles.map((role) => (
                <div
                  key={role}
                  role="columnheader"
                  className="px-2 py-2.5 text-center text-xs font-bold tracking-[.06em] text-muted uppercase"
                >
                  {role}
                </div>
              ))}
            </div>
          </div>

          <div role="rowgroup">
            {permissions.map((row) => (
              <div
                key={row.id}
                role="row"
                className="grid border-b border-line last:border-b-0"
                style={{ gridTemplateColumns: `minmax(200px,1.4fr) repeat(${roles.length}, minmax(100px,1fr))` }}
              >
                <div role="cell" className="min-w-0 px-4 py-3">
                  <div className="text-sm font-bold text-ink">{row.label}</div>
                  <div className="text-xs text-muted">{row.area}</div>
                </div>
                {row.cells.map((cell, i) => (
                  <div key={`${row.id}-${roles[i]}`} role="cell" className="flex items-center justify-center px-2 py-3">
                    <CellMark cell={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
