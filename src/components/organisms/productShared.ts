import type { TagProps } from '@/components/atoms/Tag';

/** Dados comuns do card e da linha (mesmos campos nos dois formatos). */
export interface ProductItem {
  itemId: number;
  name: string;
  imageUrl?: string | null;
  categoryName?: string | null;
  /** Preço da peça sem variação, ou menor preço da grade. */
  price: number | null;
  /** Maior preço da grade; se igual/ausente, mostra só `price`. */
  priceMax?: number | null;
  /** Estoque somado (ou da peça sem variação). */
  stockTotal: number | null;
  sold30d?: number;
  /** Status cru da Shopee: NORMAL, UNLIST… */
  status: string;
  /** Está numa vaga de Bump. */
  boosted?: boolean;
  /** Quantas variações estão no ponto de reposição (selo “acabando”). */
  lowStockVariations?: number;
  /** Dias sem venda; ≥ 30 → selo “Parada”. */
  stalledDays?: number | null;
  /** Hex das cores para as bolinhas. */
  colorHexes?: ReadonlyArray<string>;
  /** Texto curto: "3 cores · P ao GG". */
  variationSummary?: string | null;
}

export type ProductBadgeKind = 'paused' | 'boosted' | 'lowStock' | 'stalled';

export interface ProductBadge {
  kind: ProductBadgeKind;
  label: string;
  tone: NonNullable<TagProps['tone']>;
}

export function isProductPaused(status: string): boolean {
  return status === 'UNLIST';
}

/** Selos na ordem do design: Pausada → Turbinada → estoque baixo → Parada. */
export function productBadges(item: ProductItem): ProductBadge[] {
  const paused = isProductPaused(item.status);
  const badges: ProductBadge[] = [];

  if (paused) {
    badges.push({ kind: 'paused', label: 'Pausada', tone: 'neutral' });
  } else if (item.boosted) {
    badges.push({ kind: 'boosted', label: 'Turbinada', tone: 'solid' });
  }

  const low = item.lowStockVariations ?? 0;
  if (low > 0) {
    badges.push({
      kind: 'lowStock',
      label: low === 1 ? '1 variação acabando' : `${low} variações acabando`,
      tone: 'warn',
    });
  }

  if ((item.stalledDays ?? 0) >= 30) {
    badges.push({ kind: 'stalled', label: 'Parada há 30 dias', tone: 'info' });
  }

  return badges;
}

export function productPriceBounds(item: ProductItem): { min: number | null; max: number | null } {
  const min = item.price;
  const max = item.priceMax ?? item.price;
  if (min == null && max == null) return { min: null, max: null };
  if (min != null && max != null && max > min) return { min, max };
  return { min: min ?? max, max: null };
}

export type StockTone = 'danger' | 'warn' | 'muted';

export function productStockMeta(
  stockTotal: number | null,
  lowStockVariations = 0,
): { label: string; short: string; tone: StockTone } {
  if (stockTotal == null) {
    return { label: 'Estoque —', short: '—', tone: 'muted' };
  }
  if (stockTotal <= 0) {
    return { label: 'Sem estoque', short: '0', tone: 'danger' };
  }
  if (lowStockVariations > 0) {
    return { label: `${stockTotal} em estoque`, short: String(stockTotal), tone: 'warn' };
  }
  return { label: `${stockTotal} em estoque`, short: String(stockTotal), tone: 'muted' };
}
