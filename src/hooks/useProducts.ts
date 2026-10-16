import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { NewProduct } from '@/lib/types';
import { keys } from './keys';

/** Lista paginada ("carregar mais"). */
export function useProductList() {
  return useInfiniteQuery({
    queryKey: keys.products,
    queryFn: ({ pageParam }) => api.products(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset ?? undefined,
  });
}

export function useProduct(itemId: number | null) {
  return useQuery({
    queryKey: keys.product(itemId),
    queryFn: () => api.product(itemId!),
    enabled: itemId != null,
  });
}

export function useUpdatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      price,
      updates,
    }: {
      itemId: number;
      price?: number;
      updates?: { modelId: number; price: number }[];
    }) => api.updatePrice(itemId, { price, updates }),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: keys.products });
      void qc.invalidateQueries({ queryKey: keys.product(vars.itemId) });
    },
  });
}

export function useUpdateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      stock,
      updates,
    }: {
      itemId: number;
      stock?: number;
      updates?: { modelId: number; stock: number }[];
    }) => api.updateStock(itemId, { stock, updates }),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: keys.products });
      void qc.invalidateQueries({ queryKey: keys.product(vars.itemId) });
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: NewProduct) => api.createProduct(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.products }),
  });
}

/** Pausar ou reativar peças em lote (confirmação fica no modal do front). */
export function useUnlistProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemIds, unlist }: { itemIds: number[]; unlist: boolean }) =>
      api.unlistProducts(itemIds, unlist),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.products });
    },
  });
}

// ---- catálogo da Shopee (usado no cadastro)

export function useCategories() {
  return useQuery({ queryKey: keys.categories, queryFn: api.categories, staleTime: 3_600_000 });
}

export function useAttributes(categoryId: number | null) {
  return useQuery({ queryKey: keys.attributes(categoryId), queryFn: () => api.attributes(categoryId!), enabled: categoryId !== null });
}

export function useBrands(categoryId: number | null) {
  return useQuery({ queryKey: keys.brands(categoryId), queryFn: () => api.brands(categoryId!), enabled: categoryId !== null });
}

export function useLogistics() {
  return useQuery({ queryKey: keys.logistics, queryFn: api.logistics });
}

/** Envio de foto: não é cache, é uma ação por arquivo. */
export function useUploadImage() {
  return useMutation({ mutationFn: (file: File) => api.uploadImage(file) });
}
