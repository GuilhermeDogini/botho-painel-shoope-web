import type { HTMLAttributes } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
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

export interface ProductRowProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onPause'> {
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
 * Linha da lista de produtos (mesmos dados que `ProductCard`).
 * Em viewport estreita empilha; no desktop fica em colunas.
 */
export function ProductRow({
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
}: ProductRowProps) {
  const paused = isProductPaused(item.status);
  const { min, max } = productPriceBounds(item);
  const stock = productStockMeta(item.stockTotal, item.lowStockVariations);
  const sold = item.sold30d ?? 0;

  return (
    <article
      {...rest}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-line bg-surface p-3 shadow-1 sm:flex-row sm:items-center sm:gap-4 sm:px-3.5',
        selected && 'ring-2 ring-brand/50',
        className,
      )}
      data-item-id={item.itemId}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onSelectedChange ? (
          <Checkbox
            checked={selected}
            onChange={(e) => onSelectedChange(e.target.checked)}
            aria-label={`Selecionar ${item.name}`}
            className="shrink-0"
          />
        ) : null}
        {onOpen ? (
          <button
            type="button"
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
            onClick={() => onOpen(item)}
            aria-label={`Abrir ${item.name}`}
          >
            <Thumbnail
              src={item.imageUrl}
              alt=""
              size="md"
              shape="portrait"
              className={cn(paused && 'opacity-70 grayscale-[0.85]')}
            />
            <div className="min-w-0">
              <div className="truncate font-bold text-ink">{item.name}</div>
              {item.variationSummary ? (
                <div className="mt-0.5 truncate text-xs text-muted">{item.variationSummary}</div>
              ) : null}
            </div>
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Thumbnail
              src={item.imageUrl}
              alt=""
              size="md"
              shape="portrait"
              className={cn(paused && 'opacity-70 grayscale-[0.85]')}
            />
            <div className="min-w-0">
              <div className="truncate font-bold text-ink">{item.name}</div>
              {item.variationSummary ? (
                <div className="mt-0.5 truncate text-xs text-muted">{item.variationSummary}</div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-1 sm:items-center sm:justify-end sm:gap-6">
        <div className="min-w-0 sm:w-28">
          <div className="text-xs text-muted sm:hidden">Categoria</div>
          <div className="truncate">{item.categoryName ?? '—'}</div>
        </div>
        <div className="sm:w-28 sm:text-right">
          <div className="text-xs text-muted sm:hidden">Preço</div>
          <div className="font-bold tabular-nums">
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
          </div>
        </div>
        <div className="sm:w-16 sm:text-right">
          <div className="text-xs text-muted sm:hidden">Estoque</div>
          <span
            className={cn(
              'font-bold tabular-nums',
              stock.tone === 'danger' && 'text-danger-text',
              stock.tone === 'warn' && 'text-mostarda-text',
              stock.tone === 'muted' && 'text-ink font-normal',
            )}
          >
            {stock.short}
          </span>
        </div>
        <div className="sm:w-20 sm:text-right">
          <div className="text-xs text-muted sm:hidden">Vendidas 30d</div>
          <span className="tabular-nums">{sold}</span>
        </div>
        <div className="col-span-2 min-w-0 sm:col-span-1 sm:w-40">
          <ProductBadges item={item} compact />
        </div>
      </div>

      <ProductActions
        item={item}
        layout="row"
        onStock={onStock}
        onBoost={onBoost}
        onDuplicate={onDuplicate}
        onPause={onPause}
        className="shrink-0 justify-end border-t border-line pt-2 sm:border-0 sm:pt-0"
      />
    </article>
  );
}
