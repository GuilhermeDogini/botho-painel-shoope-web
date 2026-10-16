import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { keys } from './keys';

function invalidateBoost(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: keys.boost });
  void qc.invalidateQueries({ queryKey: keys.boostAuto });
  void qc.invalidateQueries({ queryKey: keys.boostDay });
  void qc.invalidateQueries({ queryKey: keys.boostSuggestions });
}

export function useBoosted() {
  return useQuery({
    queryKey: keys.boost,
    queryFn: () => api.boosted(),
    refetchInterval: 30_000,
  });
}

export function useBoostItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: number[]) => api.boost(itemIds),
    onSuccess: () => invalidateBoost(qc),
  });
}

export function useBoostAuto() {
  return useQuery({ queryKey: keys.boostAuto, queryFn: () => api.boostAuto() });
}

export function useSetBoostAuto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => api.setBoostAuto(enabled),
    onSuccess: () => invalidateBoost(qc),
  });
}

export function useSetBoostQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: number[]) => api.setBoostQueue(itemIds),
    onSuccess: () => invalidateBoost(qc),
  });
}

export function useAddBoostQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, reason }: { itemId: number; reason?: string }) =>
      api.addBoostQueue(itemId, reason),
    onSuccess: () => invalidateBoost(qc),
  });
}

export function useRemoveBoostQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => api.removeBoostQueue(itemId),
    onSuccess: () => invalidateBoost(qc),
  });
}

export function useBoostDayResult() {
  return useQuery({ queryKey: keys.boostDay, queryFn: () => api.boostDayResult() });
}

export function useBoostSuggestions() {
  return useQuery({ queryKey: keys.boostSuggestions, queryFn: () => api.boostSuggestions() });
}
