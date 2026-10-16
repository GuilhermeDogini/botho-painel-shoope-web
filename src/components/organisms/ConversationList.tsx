import { Package } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { SearchField } from '@/components/molecules/SearchField';
import type { ChatFilter, ChatListItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ConversationListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: ChatListItem[];
  unanswered: number;
  filter: ChatFilter;
  query: string;
  selectedId: string | null;
  onFilter: (filter: ChatFilter) => void;
  onQuery: (query: string) => void;
  onSelect: (id: string) => void;
}

function waitLabel(item: ChatListItem): string {
  if (!item.waitingSince) {
    const at = new Date(item.lastMessageAt);
    const days = (Date.now() - at.getTime()) / 86_400_000;
    if (days >= 6) {
      return at.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });
    }
    if (days >= 1) return 'ontem';
    return at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
  }
  const minutes = Math.max(0, Math.round((Date.now() - new Date(item.waitingSince).getTime()) / 60_000));
  if (minutes < 60) return `sem resposta há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `há ${hours}h${String(rest).padStart(2, '0')}` : `há ${hours}h`;
}

/**
 * Fila de conversas. A rolagem dos filtros fica dentro da lista, não na página (SHP-121).
 */
export function ConversationList({
  items,
  unanswered,
  filter,
  query,
  selectedId,
  onFilter,
  onQuery,
  onSelect,
  className,
  ...rest
}: ConversationListProps) {
  return (
    <section
      {...rest}
      aria-label="Lista de conversas"
      className={cn('flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface md:w-[360px] md:shrink-0 md:border-r md:border-line', className)}
    >
      <h1 className="px-[18px] pt-5 pb-2.5 font-display text-[26px] font-bold">Conversas</h1>
      <div className="px-[18px] pb-2.5">
        <SearchField
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          onClear={() => onQuery('')}
          placeholder="Buscar compradora ou pedido"
          aria-label="Buscar conversas"
        />
      </div>
      <FilterChipList layout="scroll" aria-label="Filtrar conversas" className="px-[18px] pb-3">
        <FilterChip active={filter === 'unanswered'} onClick={() => onFilter('unanswered')}>
          Sem resposta · {unanswered}
        </FilterChip>
        <FilterChip active={filter === 'all'} onClick={() => onFilter('all')}>
          Todas
        </FilterChip>
        <FilterChip active={filter === 'order'} onClick={() => onFilter('order')}>
          Com pedido
        </FilterChip>
      </FilterChipList>
      <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-2">
        {items.length === 0 ? (
          <li className="px-2 py-6 text-sm text-muted">Nenhuma conversa neste filtro.</li>
        ) : (
          items.map((item) => {
            const selected = item.id === selectedId;
            const hot = Boolean(item.waitingSince);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  aria-current={selected ? 'true' : undefined}
                  className={cn(
                    'flex w-full min-w-0 cursor-pointer gap-3 rounded-md px-2.5 py-3 text-left',
                    selected ? 'bg-surface-2' : 'hover:bg-surface-2',
                  )}
                >
                  <Avatar name={item.buyerName} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold">{item.buyerName}</span>
                      <span className={cn('shrink-0 text-xs', hot ? 'font-bold text-mostarda-text' : 'text-muted')}>
                        {waitLabel(item)}
                      </span>
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-muted">{item.preview}</span>
                      {item.unread > 0 ? (
                        <span className="inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-brand-ink">
                          {item.unread}
                        </span>
                      ) : null}
                    </span>
                    {item.orderSn ? (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                        <Package size={14} aria-hidden /> Pedido #{item.orderSn}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
