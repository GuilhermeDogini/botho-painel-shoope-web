import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { InviteRole, Role } from '@/lib/types';
import { keys } from './keys';

function invalidateTeam(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: keys.teamMembers });
  void qc.invalidateQueries({ queryKey: keys.teamInvites });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: keys.teamMembers,
    queryFn: api.teamMembers,
  });
}

export function useTeamInvites() {
  return useQuery({
    queryKey: keys.teamInvites,
    queryFn: api.teamInvites,
  });
}

export function useUpdateMemberRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => api.updateMemberRole(id, role),
    onSuccess: () => invalidateTeam(qc),
  });
}

export function useDeactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deactivateMember(id),
    onSuccess: () => invalidateTeam(qc),
  });
}

export function useReactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.reactivateMember(id),
    onSuccess: () => invalidateTeam(qc),
  });
}

export function useCreateInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: InviteRole }) => api.createInvite(email, role),
    onSuccess: () => invalidateTeam(qc),
  });
}

export function useResendInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.resendInvite(id),
    onSuccess: () => invalidateTeam(qc),
  });
}

export function useCancelInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.cancelInvite(id),
    onSuccess: () => invalidateTeam(qc),
  });
}
