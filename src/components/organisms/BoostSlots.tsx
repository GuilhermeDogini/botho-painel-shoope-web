import { Clock, Plus } from 'lucide-react';
import { useEffect, useState, type HTMLAttributes } from 'react';
import { Tag } from '@/components/atoms/Tag';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { duration } from '@/lib/format';
import type { BoostedItem } from '@/lib/types';
import { cn } from '@/lib/utils';

function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export interface BoostSlotsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  slots: number;
  items: ReadonlyArray<BoostedItem>;
  /** Timestamp do fetch (para countdown). */
  fetchedAt: number;
  onPickFree?: () => void;
}

/**
 * Grade das 5 vagas do Turbinar com contagem regressiva (SHP-104).
 */
export function BoostSlots({
  slots,
  items,
  fetchedAt,
  onPickFree,
  className,
  ...rest
}: BoostSlotsProps) {
  const now = useNow();
  const active = items
    .map((b) => ({
      ...b,
      left: b.cooldownSeconds - Math.floor((now - fetchedAt) / 1000),
    }))
    .filter((b) => b.left > 0)
    .slice(0, slots);

  return (
    <div
      {...rest}
      className={cn(
        'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5',
        className,
      )}
    >
      {Array.from({ length: slots }, (_, i) => {
        const a = active[i];
        const n = i + 1;
        if (!a) {
          return (
            <button
              key={`free-${n}`}
              type="button"
              onClick={onPickFree}
              disabled={!onPickFree}
              className={cn(
                'flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-2 bg-surface-2/40 px-2 py-3 text-center text-sm text-muted',
                onPickFree && 'cursor-pointer hover:border-brand hover:text-brand-text',
                !onPickFree && 'cursor-default opacity-70',
              )}
            >
              <Plus size={20} aria-hidden />
              <span className="font-semibold">Vaga {n} livre</span>
            </button>
          );
        }
        const bar = Math.max(0, Math.min(100, (a.left / Math.max(1, a.cooldownSeconds)) * 100));
        return (
          <div
            key={a.itemId}
            className="flex flex-col overflow-hidden rounded-lg border border-brand/35 bg-surface"
          >
            <Thumbnail src={a.imageUrl} alt="" size="fluid" className="rounded-none" />
            <div className="flex flex-1 flex-col gap-1.5 p-2.5">
              <div className="flex flex-wrap gap-1">
                <Tag icon={Clock} tone="brand" size="md">
                  Vaga {n}
                </Tag>
                {a.auto ? (
                  <Tag icon={Clock} tone="info" size="md">
                    Automático
                  </Tag>
                ) : null}
              </div>
              <div className="line-clamp-2 text-sm font-bold leading-snug">{a.name ?? `#${a.itemId}`}</div>
              <div className="mt-auto text-xs font-semibold tabular-nums text-brand-text">
                {duration(a.left)}
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brand" style={{ width: `${bar}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
