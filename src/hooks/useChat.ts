import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ChatFilter, ChatKind, QuickReplyView } from '@/lib/types';
import { keys } from './keys';

export function useChatList(filter: ChatFilter, q: string) {
  return useQuery({
    queryKey: keys.chat(filter, q),
    queryFn: () => api.chatList(filter, q),
  });
}

export function useChatThread(id: string | null) {
  return useQuery({
    queryKey: keys.chatThread(id),
    queryFn: () => api.chatThread(id!),
    enabled: Boolean(id),
  });
}

export function useSendChatMessage(id: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { kind: ChatKind; text: string; ref?: string }) => {
      if (!id) throw new Error('escolha uma conversa');
      return api.sendChatMessage(id, body);
    },
    onSuccess: (thread) => {
      qc.setQueryData(keys.chatThread(id), thread);
      void qc.invalidateQueries({ queryKey: ['chat'] });
    },
  });
}

export function useChatReplies(enabled: boolean) {
  return useQuery({
    queryKey: keys.chatReplies,
    queryFn: api.chatReplies,
    enabled,
  });
}

export function useReplaceChatReplies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (replies: Array<Pick<QuickReplyView, 'label' | 'body'> & { id?: string }>) =>
      api.replaceChatReplies(replies),
    onSuccess: (rows) => qc.setQueryData(keys.chatReplies, rows),
  });
}
