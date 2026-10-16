import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CampaignDetailPeriod, CampaignFilter } from '@/lib/types';
import { keys } from './keys';

function invalidateAds(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: keys.adsCredit });
  void qc.invalidateQueries({ queryKey: ['ads', 'campaigns'] });
  void qc.invalidateQueries({ queryKey: ['ads', 'campaign'] });
}

export function useAdsCredit() {
  return useQuery({ queryKey: keys.adsCredit, queryFn: () => api.adsCredit() });
}

export function useAdsCampaigns(filter: CampaignFilter = 'all', periodDays = 7) {
  return useQuery({
    queryKey: keys.adsCampaigns(filter, periodDays),
    queryFn: () => api.adsCampaigns({ status: filter, periodDays }),
  });
}

export function useAdsCampaignDetail(id: string, periodDays: CampaignDetailPeriod = 30) {
  return useQuery({
    queryKey: keys.adsCampaign(id, periodDays),
    queryFn: () => api.adsCampaignDetail(id, periodDays),
    enabled: Boolean(id),
  });
}

export function usePauseCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.pauseCampaign(id),
    onSuccess: () => invalidateAds(qc),
  });
}

export function useResumeCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.resumeCampaign(id),
    onSuccess: () => invalidateAds(qc),
  });
}

export function useUpdateCampaignBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dailyBudget }: { id: string; dailyBudget: number }) =>
      api.updateCampaignBudget(id, dailyBudget),
    onSuccess: () => invalidateAds(qc),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      itemIds: number[];
      dailyBudget: number;
      durationDays: number;
      acknowledgedCredit: true;
    }) => api.createCampaign(body),
    onSuccess: () => invalidateAds(qc),
  });
}
