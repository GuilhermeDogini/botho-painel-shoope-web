import type { HTMLAttributes, ReactNode } from 'react';
import { ColorDot } from '@/components/atoms/ColorDot';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { cn } from '@/lib/utils';

export interface ProductLineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nome da peça. */
  name: string;
  /** Foto (null/erro → cabide). */
  imageSrc?: string | null;
  /** Variação: "Azul anil · M". */
  variant?: string;
  /** Hex da cor (bolinha ao lado da variação). */
  colorHex?: string;
  /** SKU ou código auxiliar. */
  sku?: string;
  /** Linha extra ("+ 1 item: Pijama · M"). */
  extra?: ReactNode;
  /** Tamanho da foto. */
  size?: 'sm' | 'md' | 'lg';
  /** Conteúdo à direita (prazo, preço…). */
  trailing?: ReactNode;
}

/**
 * Linha de peça: foto + nome + cor·tamanho (+ SKU / extra).
 * Serve em pedidos, separação, estoque e campanhas sem adaptação.
 */
export function ProductLine({
  name,
  imageSrc,
  variant,
  colorHex,
  sku,
  extra,
  size = 'md',
  trailing,
  className,
  ...rest
}: ProductLineProps) {
  return (
    <div {...rest} className={cn('flex min-w-0 items-center gap-3', className)}>
      <Thumbnail src={imageSrc} alt="" size={size} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold text-ink">{name}</div>
        {variant || colorHex || sku ? (
          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-muted">
            {colorHex ? <ColorDot color={colorHex} /> : null}
            {variant ? <span className="truncate">{variant}</span> : null}
            {variant && sku ? <span aria-hidden>·</span> : null}
            {sku ? <span className="shrink-0 font-mono text-xs tabular-nums">{sku}</span> : null}
          </div>
        ) : null}
        {extra ? <div className="mt-0.5 text-xs font-bold text-anil-text">{extra}</div> : null}
      </div>
      {trailing ? <div className="flex shrink-0 flex-col items-end gap-1">{trailing}</div> : null}
    </div>
  );
}
