import { Copy, Layers, Pause, Play, Rocket } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';
import { isProductPaused, type ProductItem } from './productShared';

export interface ProductActionsProps {
  item: ProductItem;
  /** No card: botão "Estoque" + ícones. Na linha: só ícones. */
  layout?: 'card' | 'row';
  onStock?: (item: ProductItem) => void;
  onBoost?: (item: ProductItem) => void;
  onDuplicate?: (item: ProductItem) => void;
  onPause?: (item: ProductItem) => void;
  className?: string;
}

/** Ações compartilhadas pelo ProductCard e ProductRow. */
export function ProductActions({
  item,
  layout = 'card',
  onStock,
  onBoost,
  onDuplicate,
  onPause,
  className,
}: ProductActionsProps) {
  const paused = isProductPaused(item.status);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {layout === 'card' && onStock ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={Layers}
          className="min-w-0 flex-1 justify-start px-2"
          onClick={() => onStock(item)}
        >
          Estoque
        </Button>
      ) : onStock ? (
        <IconButton icon={Layers} label={`Editar estoque de ${item.name}`} onClick={() => onStock(item)} />
      ) : null}
      {onBoost && !paused ? (
        <IconButton icon={Rocket} label={`Turbinar ${item.name}`} onClick={() => onBoost(item)} />
      ) : null}
      {onDuplicate ? (
        <IconButton icon={Copy} label={`Duplicar ${item.name}`} onClick={() => onDuplicate(item)} />
      ) : null}
      {onPause ? (
        <IconButton
          icon={paused ? Play : Pause}
          label={paused ? `Reativar ${item.name}` : `Pausar ${item.name}`}
          onClick={() => onPause(item)}
        />
      ) : null}
    </div>
  );
}
