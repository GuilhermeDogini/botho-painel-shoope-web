import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { keys } from './keys';

export function useConnection() {
  return useQuery({ queryKey: keys.connection, queryFn: api.connection });
}

/** Pede a URL de autorização e manda a pessoa para a Shopee (ela volta sozinha depois). */
export function useStartConnection() {
  return useMutation({
    mutationFn: api.startConnection,
    onSuccess: ({ url }) => window.location.assign(url),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDisconnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.disconnect,
    onSuccess: () => {
      toast.success('Loja desconectada deste painel.');
      void qc.invalidateQueries();
    },
  });
}

/** "Atualizado às 10:50" e erros de sincronização. */
export function useSyncStatus() {
  return useQuery({ queryKey: keys.sync, queryFn: api.syncStatus, refetchInterval: 60_000 });
}
