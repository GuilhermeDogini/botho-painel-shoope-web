import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ExtratoQuery, FinancePeriodPreset } from '@/lib/types';
import { keys } from './keys';

export function useFinanceiroResumo(period: FinancePeriodPreset = 'mes', from?: string, to?: string) {
  return useQuery({
    queryKey: keys.financeiroResumo(period, from, to),
    queryFn: () => api.financeiroResumo(period, from, to),
  });
}

export function useFinanceiroAReceber() {
  return useQuery({
    queryKey: keys.financeiroAReceber,
    queryFn: () => api.financeiroAReceber(),
  });
}

export function useFinanceiroExtrato(q: ExtratoQuery) {
  return useQuery({
    queryKey: keys.financeiroExtrato(q),
    queryFn: () => api.financeiroExtrato(q),
  });
}
