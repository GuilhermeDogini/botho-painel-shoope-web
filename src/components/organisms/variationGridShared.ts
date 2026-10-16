/** Modo da grade: edita estoque ou preço. */
export type VariationMode = 'stock' | 'price';

export interface VariationGridCell {
  /** null = tamanho que não vende nessa cor (“—”). */
  modelId: number | null;
  stock: number | null;
  price: number | null;
}

export interface VariationGridRow {
  color: string;
  colorHex?: string;
  /** Uma célula por tamanho, na mesma ordem de `sizes`. */
  cells: ReadonlyArray<VariationGridCell>;
}

export interface VariationGridChange {
  modelId: number;
  value: number;
}

/** Chave estável de rascunho: modelId (só células vendáveis). */
export function cellKey(modelId: number): string {
  return String(modelId);
}

export function formatCellDisplay(mode: VariationMode, value: number | null, off: boolean): string {
  if (off || value == null) return '—';
  if (mode === 'stock') return String(value);
  return value.toFixed(2).replace('.', ',');
}

export function cellTone(
  mode: VariationMode,
  value: number | null,
  off: boolean,
  lowStockAt: number,
): 'off' | 'zero' | 'low' | 'ok' {
  if (off || value == null) return 'off';
  if (mode !== 'stock') return 'ok';
  if (value <= 0) return 'zero';
  if (value <= lowStockAt) return 'low';
  return 'ok';
}

/**
 * Monta grade a partir de variações planas (API).
 * Cores = ordem de primeira aparição; tamanhos = `sizeOrder` ou ordem de aparição.
 */
export function buildVariationGrid(
  models: ReadonlyArray<{
    modelId: number;
    color: string | null;
    size: string | null;
    price: number;
    stock: number;
  }>,
  sizeOrder?: ReadonlyArray<string>,
): { sizes: string[]; rows: VariationGridRow[] } {
  const sizes: string[] = sizeOrder ? [...sizeOrder] : [];
  const colors: string[] = [];
  const byColor = new Map<string, Map<string, VariationGridCell>>();

  for (const m of models) {
    const color = (m.color ?? 'Única').trim() || 'Única';
    const size = (m.size ?? 'U').trim() || 'U';
    if (!colors.includes(color)) colors.push(color);
    if (!sizeOrder && !sizes.includes(size)) sizes.push(size);
    let map = byColor.get(color);
    if (!map) {
      map = new Map();
      byColor.set(color, map);
    }
    map.set(size, { modelId: m.modelId, stock: m.stock, price: m.price });
  }

  const rows: VariationGridRow[] = colors.map((color) => {
    const map = byColor.get(color) ?? new Map();
    return {
      color,
      cells: sizes.map((size) => map.get(size) ?? { modelId: null, stock: null, price: null }),
    };
  });

  return { sizes, rows };
}
