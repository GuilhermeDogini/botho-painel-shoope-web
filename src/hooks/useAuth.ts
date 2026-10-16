import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import type { Me, Permission } from '@/lib/types';
import { keys } from './keys';

/** Quem está logado. Erro 401 = ninguém (a rota protegida manda para o login). */
export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: api.me,
    staleTime: 5 * 60_000,
    retry: (count, err) => !(err instanceof ApiError && err.status === 401) && count < 2,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => api.login(email, password),
    onSuccess: (me) => qc.setQueryData<Me>(keys.me, me),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => api.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      api.resetPassword(token, password),
  });
}

export function useAcceptInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ token, name, password }: { token: string; name: string; password: string }) =>
      api.acceptInvite(token, name, password),
    onSuccess: (me) => qc.setQueryData<Me>(keys.me, me),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.logout().catch(() => undefined),
    // Zera o cache inteiro e busca o "me" de novo: volta 401 e a rota protegida leva ao login.
    onSettled: () => qc.resetQueries(),
  });
}

/** A pessoa logada tem todas estas permissões? Sem dados ainda = não. */
export function useCan(...required: Permission[]): boolean {
  const { data } = useMe();
  return Boolean(data) && required.every((p) => data!.permissions.includes(p));
}
