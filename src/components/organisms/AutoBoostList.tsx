import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { Switch } from '@/components/atoms/Switch';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import type { AutoBoostQueueItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface AutoBoostListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  enabled: boolean;
  queue: ReadonlyArray<AutoBoostQueueItem>;
  nextInLabel?: string | null;
  saving?: boolean;
  onToggle: (enabled: boolean) => void;
  onRemove: (itemId: number) => void;
  onAdd: () => void;
  /** Reordenar: sobe o item um passo (ou desce). */
  onMove?: (itemId: number, direction: -1 | 1) => void;
}

/**
 * Modo automático: liga/desliga, fila ordenada e adicionar (SHP-104).
 */
export function AutoBoostList({
  enabled,
  queue,
  nextInLabel,
  saving = false,
  onToggle,
  onRemove,
  onAdd,
  onMove,
  className,
  ...rest
}: AutoBoostListProps) {
  return (
    <section {...rest} className={cn('flex flex-col gap-3 rounded-lg border border-line p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">Modo automático</h2>
          <p className="text-sm text-muted">Fila fixa — o painel preenche a vaga quando liberar.</p>
        </div>
        <Switch
          label={enabled ? 'Ligado' : 'Desligado'}
          checked={enabled}
          disabled={saving}
          onCheckedChange={onToggle}
        />
      </div>

      {enabled ? (
        <div className="rounded-lg bg-brand-soft/50 px-3 py-2 text-sm text-brand-text">
          {nextInLabel
            ? `Próxima liberação estimada: ${nextInLabel}`
            : queue[0]
              ? `Próxima da fila: ${queue[0].name ?? `#${queue[0].itemId}`}`
              : 'Fila vazia — adicione peças para turbinar sozinho.'}
        </div>
      ) : (
        <div className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
          Automático desligado. Você ainda pode turbinar na mão pelas vagas livres.
        </div>
      )}

      {queue.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma peça na fila.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {queue.map((item, index) => (
            <li
              key={item.itemId}
              className="flex items-center gap-2 rounded-lg border border-line px-2 py-2"
            >
              <span className="flex w-6 shrink-0 items-center justify-center text-xs font-bold text-muted tabular-nums">
                {item.position}
              </span>
              {onMove ? (
                <span className="flex shrink-0 flex-col">
                  <IconButton
                    type="button"
                    label="Subir na fila"
                    icon={GripVertical}
                    disabled={index === 0 || saving}
                    onClick={() => onMove(item.itemId, -1)}
                    className="size-8"
                  />
                </span>
              ) : null}
              <Thumbnail src={item.imageUrl} alt="" size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{item.name ?? `#${item.itemId}`}</div>
                {item.reason ? <div className="truncate text-xs text-muted">{item.reason}</div> : null}
              </div>
              <IconButton
                type="button"
                label={`Remover ${item.name ?? item.itemId} da fila`}
                icon={Trash2}
                disabled={saving}
                onClick={() => onRemove(item.itemId)}
              />
            </li>
          ))}
        </ol>
      )}

      <Button type="button" size="sm" variant="outline" icon={Plus} onClick={onAdd} disabled={saving}>
        Adicionar peça à lista
      </Button>
    </section>
  );
}
