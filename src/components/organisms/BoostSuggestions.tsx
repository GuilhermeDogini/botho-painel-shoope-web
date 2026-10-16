import { Plus, Rocket } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { ProductLine } from '@/components/molecules/ProductLine';
import { StatCard } from '@/components/molecules/StatCard';
import type { BoostDayResult, BoostSuggestion } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface BoostSuggestionsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  day: BoostDayResult | null | undefined;
  suggestions: ReadonlyArray<BoostSuggestion>;
  onAddToQueue?: (item: BoostSuggestion) => void;
  onBoostNow?: (item: BoostSuggestion) => void;
  busy?: boolean;
}

/**
 * Resultado de hoje + sugestões para turbinar (SHP-104). Sem “visitas extras”.
 */
export function BoostSuggestions({
  day,
  suggestions,
  onAddToQueue,
  onBoostNow,
  busy = false,
  className,
  ...rest
}: BoostSuggestionsProps) {
  return (
    <section {...rest} className={cn('flex flex-col gap-4 rounded-lg border border-line p-4', className)}>
      <div>
        <h2 className="font-display text-lg font-bold">Resultado de hoje</h2>
        <p className="text-sm text-muted">Bump é grátis — custo sempre R$ 0,00.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Turbinadas" value={`${day?.boostedCount ?? 0}`} />
        <StatCard label="Vendas no turbo" value={`${day?.salesDuringBoost ?? 0}`} />
        <StatCard label="Custo" value="R$ 0,00" className="col-span-2" />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold">Sugestões para turbinar</h3>
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma sugestão no momento.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <li
                key={s.itemId}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-line px-2.5 py-2"
              >
                <ProductLine
                  name={s.name}
                  imageSrc={s.imageUrl}
                  variant={s.reason}
                  size="sm"
                  className="min-w-0 flex-1"
                  trailing={
                    <Tag
                      icon={Rocket}
                      tone={s.tag === 'parada' ? 'warn' : s.tag === 'vendas' ? 'ok' : 'neutral'}
                    >
                      {s.tag === 'parada' ? 'Parada' : s.tag === 'vendas' ? 'Vendas' : 'Estoque'}
                    </Tag>
                  }
                />
                <div className="flex w-full gap-1.5 sm:w-auto">
                  {onAddToQueue ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      icon={Plus}
                      disabled={busy}
                      onClick={() => onAddToQueue(s)}
                    >
                      Fila
                    </Button>
                  ) : null}
                  {onBoostNow ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="soft"
                      icon={Rocket}
                      disabled={busy}
                      onClick={() => onBoostNow(s)}
                    >
                      Agora
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
