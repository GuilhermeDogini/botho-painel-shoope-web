import { AlertTriangle, Layers, Package } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ProductLine } from '@/components/molecules/ProductLine';
import { cn } from '@/lib/utils';
import { InicioCard, InicioCardHeader, InicioLinkButton } from './inicioShared';

export interface LowStockItem {
  /** Chave estável (sku ou nome+variação). */
  id: string;
  /** `InicioSummary.estoque.topAcabando[].name`. */
  name: string;
  sku?: string;
  /** `InicioSummary.estoque.topAcabando[].qty`. */
  qty: number;
  /** `InicioSummary.estoque.topAcabando[].variacao`. */
  variacao?: string;
  imageSrc?: string | null;
  /** Texto sob a quantidade (ex.: "acaba em ~2 dias"). */
  hint?: string;
  /** Tom da etiqueta de quantidade. */
  qtyTone?: NonNullable<TagProps['tone']>;
  /** Rótulo custom da quantidade (ex.: "Esgotou"). Sem isso: `${qty} un.`. */
  qtyLabel?: string;
}

export interface LowStockCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items?: ReadonlyArray<LowStockItem>;
  onRepor?: () => void;
  emptyAction?: ReactNode;
}

/**
 * Card “Estoque acabando”: top variações com pouco estoque.
 * Itens alinhados a `InicioSummary.estoque.topAcabando`.
 */
export function LowStockCard({
  items = [],
  onRepor,
  emptyAction,
  className,
  ...rest
}: LowStockCardProps) {
  const titleId = 'low-stock-title';

  return (
    <InicioCard {...rest} aria-labelledby={titleId} className={cn(className)}>
      <InicioCardHeader
        titleId={titleId}
        title="Estoque acabando"
        icon={Layers}
        iconClassName="text-mostarda-text"
        action={onRepor ? <InicioLinkButton onClick={onRepor}>Repor</InicioLinkButton> : null}
      />

      {items.length === 0 ? (
        <EmptyState
          illustration="cabide"
          title="Estoque em dia"
          description="Nenhuma variação acabando no momento."
          action={emptyAction}
          className="py-3"
        />
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
          {items.map((item) => {
            const tone = item.qtyTone ?? (item.qty <= 1 ? 'danger' : 'warn');
            const Icon = tone === 'danger' ? AlertTriangle : Package;
            const label = item.qtyLabel ?? (item.qty <= 0 ? 'Esgotou' : `${item.qty} un.`);
            return (
              <li key={item.id} className="min-w-0 py-2 first:pt-0 last:pb-0">
                <ProductLine
                  name={item.name}
                  imageSrc={item.imageSrc}
                  variant={item.variacao}
                  sku={item.sku}
                  size="sm"
                  trailing={
                    <>
                      <Tag icon={Icon} tone={tone}>
                        {label}
                      </Tag>
                      {item.hint ? <span className="text-xs text-muted">{item.hint}</span> : null}
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </InicioCard>
  );
}
