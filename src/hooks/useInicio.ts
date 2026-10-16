import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { keys } from './keys';

/** Resumo do Início (uma chamada alimenta a tela; seções vêm filtradas pelo papel). */
export function useInicio() {
  return useQuery({
    queryKey: keys.inicio,
    queryFn: api.inicio,
    staleTime: 30_000,
  });
}
