import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { NotificationKind, ShopProfile } from '@/lib/types';
import { keys } from './keys';

export function useShopProfile() {
  return useQuery({ queryKey: keys.shopProfile, queryFn: api.shopProfile });
}

export function useUpdateShopProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Omit<ShopProfile, 'shopName' | 'region'>>) => api.updateShopProfile(body),
    onSuccess: (data) => qc.setQueryData(keys.shopProfile, data),
  });
}

export function useNotificationPrefs() {
  return useQuery({ queryKey: keys.notificationPrefs, queryFn: api.notificationPrefs });
}

export function useUpdateNotificationPref() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { kind: NotificationKind; push: boolean; email: boolean }) =>
      api.updateNotificationPref(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.notificationPrefs }),
  });
}
