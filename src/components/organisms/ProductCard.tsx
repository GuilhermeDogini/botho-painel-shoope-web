import type { HTMLAttributes } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ColorDot } from '@/components/atoms/ColorDot';
import { Money } from '@/components/atoms/Money';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { cn } from '@/lib/utils';
import { ProductActions } from './ProductActions';
import { ProductBadges } from './ProductBadges';
import {
  isProductPaused,
  productPriceBounds,
  productStockMeta,
  type ProductItem,
} from './productShared';

export interface ProductCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onPause'> {
  item: ProductItem;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onStock?: (item: ProductItem) => void;
  onBoost?: (item: ProductItem) => void;
  onDuplicate?: (item: ProductItem) => void;
  onPause?: (item: ProductItem) => void;
  onOpen?: (item: ProductItem) => void;
}

/**
 * Card da grade de produtos (foto 3:4, preço, vendidas 30d, cores, estoque, selos).
 * Mesmos dados que `ProductRow`.
 */
export function ProductCard({
  item,
  selected = false,
  onSelectedChange,
  onStock,
  onBoost,
  onDuplicate,
  onPause,
  onOpen,
  className,
  ...rest
}: ProductCardProps) {
  const paused = isProductPaused(item.status);
  const { min, max } = productPriceBounds(item);
  const stock = productStockMeta(item.stockTotal, item.lowStockVariations);
  const sold = item.sold30d ?? 0;

  return (
    <article
      {...rest}
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-0 shadow-1',
        selected && 'ring-2 ring-brand/50',
        className,
      )}
      data-item-id={item.itemId}
    >
      <div className="relative">
        {onOpen ? (
          <button type="button" className="block w-full cursor-pointer text-left" onClick={() => onOpen(item)} aria-label={`Abrir ${item.name}`}>
            <Thumbnail
              src={item.imageUrl}
              alt=""
              size="fluid"
              shape="portrait"
              className={cn(paused && 'opacity-70 grayscale-[0.85]')}
            />
          </button>
        ) : (
          <Thumbnail
            src={item.imageUrl}
            alt=""
            size="fluid"
            shape="portrait"
            className={cn(paused && 'opacity-70 grayscale-[0.85]')}
          />
        )}
        <div className="pointer-events-none absolute top-2 left-2 flex max-w-[calc(100%-3.5rem)] flex-col items-start gap-1">
          <ProductBadges item={item} />
        </div>
        {onSelectedChange ? (
          <div className="absolute top-1 right-1 rounded-xl bg-surface/95">
            <Checkbox
              checked={selected}
              onChange={(e) => onSelectedChange(e.target.checked)}
              aria-label={`Selecionar ${item.name}`}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 pt-3 pb-1.5">
        <h2 className="line-clamp-2 text-[15px] leading-snug font-bold text-ink">{item.name}</h2>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-bold tabular-nums">
            {min == null ? (
              <Money value={null} />
            ) : max != null ? (
              <>
                <Money value={min} />
                <span className="text-muted"> – </span>
                <Money value={max} />
              </>
            ) : (
              <Money value={min} />
            )}
          </span>
          <span className="shrink-0 text-xs text-muted tabular-nums">
            {sold} vendidas · 30d
          </span>
        </div>
        {(item.colorHexes?.length || item.variationSummary) && (
          <div className="flex min-w-0 items-center gap-1">
            {item.colorHexes?.slice(0, 6).map((hex, i) => (
              <ColorDot key={`${hex}-${i}`} color={hex} />
            ))}
            {item.variationSummary ? (
              <span className="ml-1 truncate text-xs text-muted">{item.variationSummary}</span>
            ) : null}
          </div>
        )}
        <span
          className={cn(
            'text-sm font-bold',
            stock.tone === 'danger' && 'text-danger-text',
            stock.tone === 'warn' && 'text-mostarda-text',
            stock.tone === 'muted' && 'text-muted font-normal',
          )}
        >
          {stock.label}
        </span>
      </div>

      <ProductActions
        item={item}
        layout="card"
        onStock={onStock}
        onBoost={onBoost}
        onDuplicate={onDuplicate}
        onPause={onPause}
        className="mt-1.5 border-t border-line px-1.5 py-2"
      />
    </article>
  );
}
