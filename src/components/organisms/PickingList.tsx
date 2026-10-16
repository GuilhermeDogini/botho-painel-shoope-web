import { MapPin } from 'lucide-react';
import { useMemo, type HTMLAttributes } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ColorDot } from '@/components/atoms/ColorDot';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { EmptyState } from '@/components/molecules/EmptyState';
import { TapeProgress } from '@/components/molecules/TapeProgress';
import type { PackingGroup, PackingNote } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Chave estável de uma variante na lista (riscar / progresso). */
export function packingLineKey(itemId: number, modelId: number, variation: string | null | undefined): string {
  return `${itemId}:${modelId}:${variation ?? ''}`;
}

/** Pedido curto como no design (#H8W1R). */
export function shortOrderSn(orderSn: string): string {
  const sn = orderSn.trim().toUpperCase();
  if (sn.length <= 5) return `#${sn}`;
  return `#${sn.slice(-5)}`;
}

function variantLabel(color: string | null, size: string | null, variation: string | null): string {
  if (color && size) return `${color} · ${size}`;
  if (color) return color;
  if (size) return size;
  if (variation?.trim()) {
    const i = variation.lastIndexOf(',');
    if (i >= 0) {
      const c = variation.slice(0, i).trim();
      const s = variation.slice(i + 1).trim();
      if (c && s) return `${c} · ${s}`;
    }
    return variation.trim();
  }
  return 'Sem variação';
}

function orderHint(orderSn: string, notes: ReadonlyArray<PackingNote> | undefined): string {
  const short = shortOrderSn(orderSn);
  const msg = notes?.find((n) => n.orderSn === orderSn && n.kind === 'message');
  if (msg?.text) {
    const clipped = msg.text.length > 48 ? `${msg.text.slice(0, 45)}…` : msg.text;
    return `${short} · ${clipped}`;
  }
  const multi = notes?.find((n) => n.orderSn === orderSn && n.kind === 'multi_item');
  if (multi?.text) return `${short} · ${multi.text}`;
  return short;
}

export interface PickingListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  groups: ReadonlyArray<PackingGroup>;
  notes?: ReadonlyArray<PackingNote>;
  /** Chaves riscadas (`packingLineKey`). Persistidas pela página enquanto a lista estiver aberta. */
  checkedKeys: ReadonlyArray<string>;
  onCheckedKeysChange: (keys: string[]) => void;
  /** Hex opcional por itemId (bolinha da cor). Sem isso a bolinha some. */
  colorHexByItemId?: Readonly<Record<number, string>>;
  empty?: boolean;
}

/**
 * Lista de separação (SHP-84): grupos por peça com linhas riscáveis e progresso “3 de 7 peças”.
 * Props-only — o estado de riscar fica na página (persiste enquanto a tela estiver montada).
 */
export function PickingList({
  groups,
  notes,
  checkedKeys,
  onCheckedKeysChange,
  colorHexByItemId,
  empty,
  className,
  ...rest
}: PickingListProps) {
  const checked = useMemo(() => new Set(checkedKeys), [checkedKeys]);

  const { totalPieces, donePieces } = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const g of groups) {
      for (const v of g.variants) {
        const key = packingLineKey(g.itemId, v.modelId, v.variation);
        total += v.quantity;
        if (checked.has(key)) done += v.quantity;
      }
    }
    return { totalPieces: total, donePieces: done };
  }, [groups, checked]);

  function toggle(key: string) {
    const next = new Set(checked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onCheckedKeysChange([...next]);
  }

  if (empty || groups.length === 0) {
    return (
      <div {...rest} className={cn(className)}>
        <EmptyState
          illustration="cabide"
          title="Nenhuma peça para separar"
          description="Escolha pedidos a enviar e abra a lista de separação de novo."
        />
      </div>
    );
  }

  return (
    <div {...rest} className={cn('flex flex-col gap-4', className)}>
      <div className="rounded-lg border border-line bg-surface px-5 py-4 shadow-1">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-bold text-ink tabular-nums">
            {donePieces} de {totalPieces} {totalPieces === 1 ? 'peça separada' : 'peças separadas'}
          </span>
          <span className="text-muted">Toque na linha para riscar</span>
        </div>
        <TapeProgress
          value={donePieces}
          max={Math.max(totalPieces, 1)}
          tone="ok"
          aria-label={`Separação: ${donePieces} de ${totalPieces} peças`}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        {groups.map((g) => {
          const hex = colorHexByItemId?.[g.itemId];
          return (
            <section
              key={g.itemId}
              className="flex gap-4 rounded-lg border border-line bg-surface p-4 shadow-1"
            >
              <Thumbnail src={g.imageUrl} alt="" size="lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[17px] leading-[1.25] font-bold text-ink">{g.name}</h2>
                  <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold tabular-nums text-ink-2">
                    {g.quantity} un.
                  </span>
                </div>
                {g.location ? (
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <MapPin size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
                    <span className="truncate">{g.location}</span>
                  </p>
                ) : null}

                <ul className="mt-1 flex flex-col divide-y divide-line">
                  {g.variants.map((v) => {
                    const key = packingLineKey(g.itemId, v.modelId, v.variation);
                    const done = checked.has(key);
                    const label = variantLabel(v.color, v.size, v.variation);
                    const orders = v.lines.map((l) => orderHint(l.orderSn, notes)).join(' · ');
                    return (
                      <li key={key}>
                        <Checkbox
                          checked={done}
                          onChange={() => toggle(key)}
                          className={cn(
                            'flex w-full min-h-[60px] items-center gap-3 py-2',
                            done && 'opacity-55',
                          )}
                          aria-label={`Separar ${label}, ${v.quantity} unidade${v.quantity === 1 ? '' : 's'}`}
                          label={
                            <span className="flex min-w-0 flex-1 items-center gap-3">
                              {hex ? <ColorDot color={hex} size="lg" /> : null}
                              <span className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    'block font-bold text-ink',
                                    done && 'line-through decoration-brand decoration-2',
                                  )}
                                >
                                  {label}
                                </span>
                                <span
                                  className={cn(
                                    'block text-xs text-muted',
                                    done && 'line-through decoration-brand decoration-2',
                                  )}
                                >
                                  {orders}
                                </span>
                              </span>
                              <span
                                className={cn(
                                  'shrink-0 font-display text-lg font-bold tabular-nums text-ink',
                                  done && 'line-through decoration-brand decoration-2',
                                )}
                              >
                                ×{v.quantity}
                              </span>
                            </span>
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
