import { MessageCircle } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Avatar, type AvatarTone } from '@/components/atoms/Avatar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { cn } from '@/lib/utils';
import { InicioCard, InicioCardHeader, InicioLinkButton } from './inicioShared';

export interface ChatsWaitingItem {
  id: string;
  name: string;
  /** Prévia da mensagem. */
  message: string;
  /** Tempo esperando (ex.: "42 min"). */
  waitLabel: string;
  avatarTone?: AvatarTone;
  onClick?: () => void;
}

export interface ChatsWaitingCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `InicioSummary.conversas.semResposta` — opcional. */
  waitingCount?: number;
  chats?: ReadonlyArray<ChatsWaitingItem>;
  onOpen?: () => void;
  emptyAction?: ReactNode;
}

/**
 * Card “Esperando resposta”: chats sem resposta da loja.
 */
export function ChatsWaitingCard({
  chats = [],
  onOpen,
  emptyAction,
  className,
  ...rest
}: ChatsWaitingCardProps) {
  const titleId = 'chats-waiting-title';

  return (
    <InicioCard {...rest} aria-labelledby={titleId} className={cn(className)}>
      <InicioCardHeader
        titleId={titleId}
        title="Esperando resposta"
        icon={MessageCircle}
        iconClassName="text-brand-text"
        action={onOpen ? <InicioLinkButton onClick={onOpen}>Abrir</InicioLinkButton> : null}
      />

      {chats.length === 0 ? (
        <EmptyState
          illustration="carretel"
          title="Nada pendente"
          description="Quando uma cliente escrever, a conversa aparece aqui."
          action={emptyAction}
          className="py-3"
        />
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
          {chats.map((c) => {
            const body = (
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={c.name} tone={c.avatarTone} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-ink">{c.name}</span>
                    <span className="shrink-0 text-xs font-bold text-mostarda-text">{c.waitLabel}</span>
                  </div>
                  <div className="truncate text-sm text-muted">{c.message}</div>
                </div>
              </div>
            );

            return (
              <li key={c.id} className="min-w-0 py-1 first:pt-0 last:pb-0">
                {c.onClick ? (
                  <button
                    type="button"
                    onClick={c.onClick}
                    className="w-full min-w-0 rounded-md px-3 py-3 text-left hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--bt-focus)]"
                  >
                    {body}
                  </button>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      )}
    </InicioCard>
  );
}
