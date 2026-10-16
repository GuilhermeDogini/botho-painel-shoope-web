import { Megaphone, Rocket } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { ProductLine } from '@/components/molecules/ProductLine';
import type { IdleProduct } from '@/lib/types';
import { cn } from '@/lib/utils';

function formatIdleInfo(item: IdleProduct): string {
  if (item.status === 'UNLIST') {
    return `Pausado · ${item.stock} em estoque`;
  }
  if (!item.lastSaleAt) {
    return `${item.stock} em estoque · sem vendas registradas`;
  }
  const d = new Date(item.lastSaleAt);
  const date = Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return `${item.stock} em estoque · última venda ${date}`;
}

export interface IdleStockListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: ReadonlyArray<IdleProduct>;
  onBoost?: (item: IdleProduct) => void;
  onCampaign?: (item: IdleProduct) => void;
}

/** Peças paradas há 30 dias — atalhos para Turbinar / Campanhas (SHP-100). */
export function IdleStockList({
  items,
  onBoost,
  onCampaign,
  className,
  ...rest
}: IdleStockListProps) {
  return (
    <section {...rest} className={cn('flex flex-col gap-3 rounded-lg border border-line p-4', className)}>
      <div>
        <h2 className="font-display text-lg font-bold">Peças paradas</h2>
        <p className="text-sm text-muted">sem venda há 30 dias</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma peça parada no momento.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.itemId}
              className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2"
            >
              <ProductLine
                name={item.name}
                imageSrc={item.imageUrl}
                variant={formatIdleInfo(item)}
                size="sm"
                className="min-w-0 flex-1"
              />
              <div className="flex shrink-0 items-center">
                {onBoost ? (
                  <IconButton
                    type="button"
                    label={`Turbinar ${item.name}`}
                    icon={Rocket}
                    onClick={() => onBoost(item)}
                  />
                ) : null}
                {onCampaign ? (
                  <IconButton
                    type="button"
                    label={`Criar campanha para ${item.name}`}
                    icon={Megaphone}
                    onClick={() => onCampaign(item)}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
