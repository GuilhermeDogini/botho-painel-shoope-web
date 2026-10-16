import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { ColorDot } from '@/components/atoms/ColorDot';
import { Input } from '@/components/atoms/Input';
import { Spinner } from '@/components/atoms/Spinner';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Modal } from '@/components/organisms/Modal';
import type { ItemDetail, ItemModel } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Abaixo disso a célula fica amarela (acabando); 0 = vermelho (esgotou). */
const LOW_STOCK_AT = 3;

function cellKey(color: string, size: string): string {
  return `${color}|${size}`;
}

function cellTone(stock: number): 'out' | 'low' | 'ok' {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_AT) return 'low';
  return 'ok';
}

function buildGrid(models: ReadonlyArray<ItemModel>): {
  sizes: string[];
  colors: { name: string; hex?: string }[];
  stockOf: Record<string, { modelId: number; stock: number }>;
} {
  const sizeSet = new Set<string>();
  const colorMap = new Map<string, string | undefined>();
  const stockOf: Record<string, { modelId: number; stock: number }> = {};

  for (const m of models) {
    const color = (m.color ?? m.name ?? 'Única').trim() || 'Única';
    const size = (m.size ?? 'Único').trim() || 'Único';
    sizeSet.add(size);
    if (!colorMap.has(color)) colorMap.set(color, undefined);
    stockOf[cellKey(color, size)] = { modelId: m.modelId, stock: m.stock };
  }

  return {
    sizes: [...sizeSet],
    colors: [...colorMap.entries()].map(([name, hex]) => ({ name, hex })),
    stockOf,
  };
}

export interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mobile: boolean;
  /** Detalhe da peça (grade). null enquanto carrega. */
  product: ItemDetail | null | undefined;
  loading?: boolean;
  saving?: boolean;
  onChangeItem?: () => void;
  onConfirm: (lines: { modelId: number; quantity: number }[]) => void;
}

/**
 * Digitar quanto chegou por variação (delta) e confirmar (SHP-101).
 * Desktop = Modal; celular = BottomSheet.
 */
export function RestockModal({
  open,
  onOpenChange,
  mobile,
  product,
  loading = false,
  saving = false,
  onChangeItem,
  onConfirm,
}: RestockModalProps) {
  const [deltas, setDeltas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) setDeltas({});
  }, [open, product?.itemId]);

  const grid = useMemo(() => {
    if (!product) return null;
    if (product.hasVariations && product.variations?.length) return buildGrid(product.variations);
    return {
      sizes: ['Único'],
      colors: [{ name: 'Peça' }],
      stockOf: {
        [cellKey('Peça', 'Único')]: { modelId: 0, stock: product.stock ?? 0 },
      },
    };
  }, [product]);

  const parsed = useMemo(() => {
    if (!grid) return { total: 0, changed: 0, lines: [] as { modelId: number; quantity: number }[] };
    const lines: { modelId: number; quantity: number }[] = [];
    let total = 0;
    for (const [key, raw] of Object.entries(deltas)) {
      const n = Number(raw);
      if (!Number.isInteger(n) || n <= 0) continue;
      const cell = grid.stockOf[key];
      if (!cell) continue;
      lines.push({ modelId: cell.modelId, quantity: n });
      total += n;
    }
    return { total, changed: lines.length, lines };
  }, [deltas, grid]);

  const body = (
    <div className="flex flex-col gap-4">
      {loading || !product || !grid ? (
        <Spinner label="Carregando grade…" />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <Thumbnail src={product.imageUrl} alt="" size="md" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{product.name}</div>
              <div className="text-xs text-muted">
                {product.hasVariations
                  ? `${product.variations?.length ?? 0} variações`
                  : `${product.stock ?? 0} un. hoje`}
              </div>
            </div>
            {onChangeItem ? (
              <Button type="button" size="sm" variant="ghost" onClick={onChangeItem}>
                Trocar peça
              </Button>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-max min-w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[13px] text-muted">
                  <th className="px-3 py-2.5 font-bold">Chegou</th>
                  {grid.sizes.map((size) => (
                    <th key={size} className="px-2 py-2.5 text-center font-bold">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.colors.map((c) => (
                  <tr key={c.name} className="border-b border-line last:border-0">
                    <th className="px-3 py-2 text-left font-semibold">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        {c.hex ? <ColorDot color={c.hex} size="lg" label={c.name} /> : null}
                        {c.name}
                      </span>
                    </th>
                    {grid.sizes.map((size) => {
                      const key = cellKey(c.name, size);
                      const cell = grid.stockOf[key];
                      if (!cell) {
                        return (
                          <td key={key} className="p-1.5 text-center text-muted">
                            —
                          </td>
                        );
                      }
                      const raw = deltas[key] ?? '';
                      const delta = Number(raw);
                      const tone = cellTone(cell.stock);
                      const hint =
                        Number.isInteger(delta) && delta > 0
                          ? `${cell.stock} → ${cell.stock + delta}`
                          : tone === 'out'
                            ? 'esgotou'
                            : `agora ${cell.stock}`;
                      return (
                        <td key={key} className="p-1.5">
                          <div className="flex min-w-[4.5rem] flex-col gap-0.5">
                            <Input
                              inputMode="numeric"
                              aria-label={`Chegou ${c.name} ${size}${tone === 'out' ? ' (esgotou)' : ''}`}
                              value={raw}
                              placeholder="+"
                              onChange={(e) =>
                                setDeltas((d) => ({
                                  ...d,
                                  [key]: e.target.value.replace(/\D/g, ''),
                                }))
                              }
                              className="h-11 px-2 text-center tabular-nums"
                            />
                            <span
                              className={cn(
                                'inline-flex items-center justify-center gap-1 text-center text-[11px]',
                                tone === 'out' && 'text-danger-text',
                                tone === 'low' && 'text-mostarda-text',
                                tone === 'ok' && 'text-muted',
                              )}
                            >
                              {tone !== 'ok' ? (
                                <span
                                  aria-hidden
                                  className={cn(
                                    'size-1.5 shrink-0 rounded-full',
                                    tone === 'out' && 'bg-danger',
                                    tone === 'low' && 'bg-mostarda',
                                  )}
                                />
                              ) : null}
                              {hint}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-danger" />
              Esgotou
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-mostarda" />
              {LOW_STOCK_AT} ou menos
            </span>
          </div>

          <div
            className={cn(
              'flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-surface-2 px-3 py-2.5',
            )}
          >
            <div>
              <div className="text-xs text-muted">Total que chegou</div>
              <div className="text-lg font-bold tabular-nums">{parsed.total} peças</div>
            </div>
            <p className="max-w-xs text-sm text-muted">
              {parsed.changed > 0
                ? `${parsed.changed} ${parsed.changed === 1 ? 'variação vai' : 'variações vão'} ser atualizadas na Shopee de uma vez.`
                : 'Digite quanto chegou em pelo menos uma célula.'}
            </p>
          </div>
        </>
      )}
    </div>
  );

  const footer = (
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
        Cancelar
      </Button>
      <Button
        type="button"
        variant="primary"
        loading={saving}
        disabled={parsed.total <= 0 || loading || !product}
        onClick={() => onConfirm(parsed.lines)}
      >
        {parsed.total > 0 ? `Atualizar ${parsed.total} peças` : 'Atualizar estoque'}
      </Button>
    </div>
  );

  const title = 'Repor estoque';
  const description = 'Digite quanto chegou. A gente soma com o que já tem.';

  if (mobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        footer={footer}
      >
        {body}
      </BottomSheet>
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      wide
      footer={footer}
      stackFooter
    >
      {body}
    </Modal>
  );
}
