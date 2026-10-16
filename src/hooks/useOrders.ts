import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CancelReasonCode, OrderQuery } from '@/lib/types';
import { keys } from './keys';

export function useOrders(q: OrderQuery) {
  return useQuery({
    queryKey: keys.orders(q),
    queryFn: () => api.orders(q),
    placeholderData: (prev) => prev,
  });
}

export function useOrder(orderSn: string | null) {
  return useQuery({
    queryKey: keys.order(orderSn ?? ''),
    queryFn: () => api.order(orderSn!),
    enabled: Boolean(orderSn),
  });
}

export function useMarkPacked() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderSns, packed }: { orderSns: string[]; packed: boolean }) =>
      api.markPacked(orderSns, packed),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['orders'] });
      void qc.invalidateQueries({ queryKey: keys.inicio });
    },
  });
}

export function usePrintLabels() {
  return useMutation({
    mutationFn: (orderSns: string[]) => api.printLabels(orderSns),
  });
}

export function usePackingList() {
  return useMutation({
    mutationFn: (orderSns: string[]) => api.packingList(orderSns),
  });
}

export function useCancelReasons(enabled = true) {
  return useQuery({
    queryKey: keys.cancelReasons,
    queryFn: () => api.cancelReasons(),
    enabled,
    staleTime: 60 * 60_000,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderSn, reason }: { orderSn: string; reason: CancelReasonCode }) =>
      api.cancelOrder(orderSn, reason),
    onSuccess: (_data, { orderSn }) => {
      void qc.invalidateQueries({ queryKey: ['orders'] });
      void qc.invalidateQueries({ queryKey: keys.order(orderSn) });
      void qc.invalidateQueries({ queryKey: keys.inicio });
    },
  });
}

/** AAAA-MM-DD local (últimos 7 dias inclusive). */
export function last7DaysRange(now = new Date()): { from: string; to: string } {
  const to = new Date(now);
  const from = new Date(now);
  from.setDate(from.getDate() - 6);
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  return { from: fmt(from), to: fmt(to) };
}
