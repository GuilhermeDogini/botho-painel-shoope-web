import { X } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export interface BulkActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Quantidade selecionada. `0` ou menos → a barra não renderiza. */
  count: number;
  /** Ações (botões). Use `Button size="sm"`; `primary` fica framboesa, os outros invertidos no fundo ink. */
  children?: ReactNode;
  /** Limpar seleção (X à direita). */
  onClear?: () => void;
  /** Rótulo custom ("2 pedidos", …). Padrão: "N selecionado(s)". */
  label?: ReactNode;
  /**
   * `sticky` (padrão): sobe com a página e assenta acima da nav no celular.
   * `inline`: só o visual, para Vitrine/Storybook sem grudar.
   */
  position?: 'sticky' | 'inline';
}

/**
 * Barra de ações em lote (fundo ink chocolate). Aparece com seleção e some ao zerar.
 * Celular: rótulo + X no topo; botões empilhados em largura total.
 * Desktop: tudo numa faixa (rótulo · ações · X).
 */
export function BulkActionBar({
  count,
  children,
  onClear,
  label,
  position = 'sticky',
  className,
  ...rest
}: BulkActionBarProps) {
  if (count <= 0) return null;

  const countLabel =
    label ?? (count === 1 ? '1 selecionado' : `${count} selecionados`);

  return (
    <div
      {...rest}
      role="region"
      aria-label="Ações em lote"
      className={cn(
        'z-40 flex flex-col gap-2 rounded-lg p-2.5 shadow-3',
        'max-md:mx-3',
        'md:flex-row md:flex-wrap md:items-center md:gap-2 md:pl-[18px]',
        // Ink claro (#2B1F1D) / bg claro (#FAF5EE) — não seguem o invert do .dark
        'bg-[#2B1F1D] text-[#FAF5EE]',
        'animate-[bt-bulk-in_.22s_cubic-bezier(.22,1,.36,1)]',
        position === 'sticky' && 'sticky bottom-4 max-md:bottom-[84px]',
        // Botões outline/ghost no fundo escuro
        '[&_button.border-line-2]:border-[color-mix(in_srgb,#FAF5EE_30%,transparent)]',
        '[&_button.border-line-2]:bg-transparent [&_button.border-line-2]:text-[#FAF5EE]',
        '[&_button.border-line-2:hover]:bg-[color-mix(in_srgb,#FAF5EE_12%,transparent)]',
        '[&_button.border-transparent]:text-[#FAF5EE]',
        '[&_button.border-transparent:hover]:bg-[color-mix(in_srgb,#FAF5EE_12%,transparent)]',
        className,
      )}
    >
      <div className="flex min-h-10 items-center gap-2 px-1.5 md:contents">
        <span className="mr-auto font-bold tabular-nums">{countLabel}</span>
        {onClear ? (
          <IconButton
            icon={X}
            label="Limpar seleção"
            onClick={onClear}
            className="shrink-0 text-[#FAF5EE] hover:bg-[color-mix(in_srgb,#FAF5EE_12%,transparent)] hover:text-[#FAF5EE] md:order-last"
          />
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-2 max-md:[&>button]:w-full md:contents">
        {children}
      </div>
    </div>
  );
}
