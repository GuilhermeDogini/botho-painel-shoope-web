import type { AvatarTone } from '@/components/atoms/Avatar';
import type { TeamListPerson, TeamListStatusTone } from '@/components/organisms/TeamList';
import { ROLE_META, type RoleMeta } from '@/components/organisms/equipeShared';
import type { InviteRole, Role, TeamInvite, TeamMember } from '@/lib/types';

const AVATAR_TONES: AvatarTone[] = ['mostarda', 'anil', 'salvia', 'brand'];

/** Papéis convidáveis (API não aceita admin no POST /team/invites). */
export const INVITE_ROLE_OPTIONS: ReadonlyArray<{
  value: InviteRole;
  label: string;
  description: string;
}> = [
  {
    value: 'expedicao',
    label: 'Expedição',
    description: 'Pedidos, etiquetas e separação. Não vê dinheiro.',
  },
  {
    value: 'atendimento',
    label: 'Atendimento',
    description: 'Conversas, devoluções e leitura de pedidos.',
  },
  {
    value: 'estoque',
    label: 'Cadastro e estoque',
    description: 'Produtos, variações, estoque e turbinar.',
  },
  {
    value: 'financeiro',
    label: 'Financeiro',
    description: 'Financeiro, relatórios e campanhas em leitura.',
  },
];

/** Opções do select de papel (PATCH membro, inclui admin). */
export const MEMBER_ROLE_OPTIONS: ReadonlyArray<{ value: Role; label: string }> = [
  { value: 'admin', label: 'Admin' },
  { value: 'expedicao', label: 'Expedição' },
  { value: 'atendimento', label: 'Atendimento' },
  { value: 'estoque', label: 'Cadastro e estoque' },
  { value: 'financeiro', label: 'Financeiro' },
];

export function roleMetaFor(role: Role): RoleMeta {
  const byApi: Record<Role, RoleMeta['name']> = {
    admin: 'Admin',
    expedicao: 'Expedição',
    atendimento: 'Atendimento',
    estoque: 'Cadastro/Estoque',
    financeiro: 'Financeiro',
  };
  return ROLE_META.find((m) => m.name === byApi[role]) ?? ROLE_META[0];
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function memberStatusLabel(member: TeamMember): { status: string; statusTone?: TeamListStatusTone } {
  if (member.status === 'disabled') {
    return { status: 'Desativada', statusTone: 'danger' };
  }
  if (member.isYou && member.role === 'admin') {
    return { status: 'Dona da loja' };
  }
  return { status: 'Ativa' };
}

export function inviteStatusLabel(invite: TeamInvite): { status: string; statusTone: TeamListStatusTone } {
  const day = formatShortDate(invite.createdAt);
  return {
    status: day ? `Convite enviado ${day}` : 'Convite pendente',
    statusTone: 'warn',
  };
}

export type TeamListHandlers = {
  onResendInvite?: (inviteId: string) => void;
  onActiveChange?: (memberId: string, active: boolean) => void;
  onRoleChange?: (memberId: string, role: Role) => void;
};

/**
 * Junta membros + convites pendentes no formato do TeamList.
 * Convites vêm depois dos membros; avatar cicla tom pelo índice.
 */
export function mapTeamToListPeople(
  members: ReadonlyArray<TeamMember>,
  invites: ReadonlyArray<TeamInvite>,
  handlers: TeamListHandlers = {},
): TeamListPerson[] {
  const pending = invites.filter((i) => i.status === 'pending');
  const people: TeamListPerson[] = [];

  members.forEach((member, index) => {
    const meta = roleMetaFor(member.role);
    const { status, statusTone } = memberStatusLabel(member);
    const locked = member.isYou;
    const canEditRole = !member.isYou;

    people.push({
      id: member.id,
      name: member.name,
      email: member.email,
      roleLabel: member.roleLabel,
      roleIcon: meta.tagIcon,
      roleTone: meta.tagTone,
      isYou: member.isYou,
      status,
      statusTone,
      avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
      showSwitch: !locked,
      active: member.status === 'active',
      switchDisabled: locked,
      onActiveChange: locked
        ? undefined
        : (active) => handlers.onActiveChange?.(member.id, active),
      roleValue: canEditRole ? member.role : undefined,
      roleOptions: canEditRole ? MEMBER_ROLE_OPTIONS : undefined,
      onRoleChange: canEditRole
        ? (value) => handlers.onRoleChange?.(member.id, value as Role)
        : undefined,
    });
  });

  pending.forEach((invite, index) => {
    const meta = roleMetaFor(invite.role);
    const { status, statusTone } = inviteStatusLabel(invite);
    people.push({
      id: `invite:${invite.id}`,
      name: invite.email.split('@')[0] || invite.email,
      email: invite.email,
      roleLabel: invite.roleLabel,
      roleIcon: meta.tagIcon,
      roleTone: meta.tagTone,
      status,
      statusTone,
      avatarTone: AVATAR_TONES[(members.length + index) % AVATAR_TONES.length],
      pending: true,
      onResendInvite: () => handlers.onResendInvite?.(invite.id),
    });
  });

  return people;
}
