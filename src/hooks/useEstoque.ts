import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { RestockLine } from '@/lib/types';
import { keys } from './keys';

export function useEstoque() {
  return useQuery({
    queryKey: keys.estoque,
    queryFn: () => api.estoque(),
  });
}

export function useUpdateReorderPoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { itemId: number; modelId: number; reorderPoint: number | null }) =>
      api.updateReorderPoint(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.estoque });
    },
  });
}

export function useUpdateEstoqueSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (defaultReorderPoint: number) => api.updateEstoqueSettings(defaultReorderPoint),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.estoque });
    },
  });
}

export function useRestock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lines: RestockLine[]) => api.restock(lines),
    onSuccess: (_data, lines) => {
      void qc.invalidateQueries({ queryKey: keys.estoque });
      void qc.invalidateQueries({ queryKey: keys.products });
      const itemIds = [...new Set(lines.map((l) => l.itemId))];
      for (const itemId of itemIds) {
        void qc.invalidateQueries({ queryKey: keys.product(itemId) });
      }
    },
  });
}
