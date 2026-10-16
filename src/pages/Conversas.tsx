import { useState } from 'react';
import { toast } from 'sonner';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { ChatBlocked } from '@/components/organisms/ChatBlocked';
import { ChatThread } from '@/components/organisms/ChatThread';
import { ConversationList } from '@/components/organisms/ConversationList';
import { useChatList, useChatReplies, useChatThread, useReplaceChatReplies, useSendChatMessage } from '@/hooks/useChat';
import { ApiError } from '@/lib/api';
import type { ChatFilter } from '@/lib/types';

/**
 * Conversas: lista e fio no desktop; no celular, uma tela por vez (SHP-122).
 * Sem a permissão da Shopee, mostra o estado bloqueado.
 */
export function ConversasPage() {
  const [filter, setFilter] = useState<ChatFilter>('unanswered');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = useChatList(filter, query);
  const enabled = list.data?.enabled ?? true;
  const thread = useChatThread(enabled ? selectedId : null);
  const replies = useChatReplies(enabled);
  const send = useSendChatMessage(selectedId);
  const saveReplies = useReplaceChatReplies();

  const error = list.error ?? thread.error;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {error ? (
        <InlineAlert tone="danger">
          {error instanceof ApiError ? error.message : 'Não foi possível carregar as conversas.'}
        </InlineAlert>
      ) : null}

      {!enabled ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <ChatBlocked />
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
          <ConversationList
            className={selectedId ? 'hidden md:flex' : 'flex min-h-0 flex-1 md:flex-none'}
            items={list.data?.items ?? []}
            unanswered={list.data?.unanswered ?? 0}
            filter={filter}
            query={query}
            selectedId={selectedId}
            onFilter={setFilter}
            onQuery={setQuery}
            onSelect={setSelectedId}
          />
          {selectedId && thread.data ? (
            <ChatThread
              className="min-h-0 flex-1"
              thread={thread.data}
              replies={replies.data ?? []}
              sending={send.isPending}
              savingReplies={saveReplies.isPending}
              showBack
              onBack={() => setSelectedId(null)}
              onSend={(body) => {
                send.mutate(body, {
                  onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Não foi possível enviar'),
                });
              }}
              onSaveReplies={(next) => {
                saveReplies.mutate(next, {
                  onSuccess: () => toast.success('Respostas salvas'),
                  onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Não foi possível salvar'),
                });
              }}
            />
          ) : (
            <div className="hidden min-h-0 flex-1 items-center justify-center p-8 text-sm text-muted md:flex">
              Escolha uma conversa para responder.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
