import { describe, expect, test, vi } from 'vitest';
import {
  inviteStatusLabel,
  mapTeamToListPeople,
  memberStatusLabel,
  roleMetaFor,
} from './team';
import type { TeamInvite, TeamMember } from './types';

const member = (partial: Partial<TeamMember> & Pick<TeamMember, 'id' | 'name' | 'email' | 'role'>): TeamMember => ({
  roleLabel: partial.roleLabel ?? partial.role,
  status: partial.status ?? 'active',
  disabledAt: partial.disabledAt ?? null,
  createdAt: partial.createdAt ?? '2026-10-01T12:00:00.000Z',
  lastSeenAt: partial.lastSeenAt ?? null,
  isYou: partial.isYou ?? false,
  ...partial,
});

const invite = (partial: Partial<TeamInvite> & Pick<TeamInvite, 'id' | 'email' | 'role'>): TeamInvite => ({
  roleLabel: partial.roleLabel ?? partial.role,
  expiresAt: partial.expiresAt ?? '2026-10-17T12:00:00.000Z',
  acceptedAt: partial.acceptedAt ?? null,
  createdAt: partial.createdAt ?? '2026-10-06T12:00:00.000Z',
  status: partial.status ?? 'pending',
  ...partial,
});

describe('roleMetaFor', () => {
  test('mapeia papéis da API para ícone/tom do design', () => {
    expect(roleMetaFor('admin').name).toBe('Admin');
    expect(roleMetaFor('estoque').name).toBe('Cadastro/Estoque');
    expect(roleMetaFor('expedicao').tagTone).toBe('info');
  });
});

describe('memberStatusLabel', () => {
  test('dona da loja quando é você e admin', () => {
    expect(memberStatusLabel(member({ id: '1', name: 'Gisele', email: 'g@x.com', role: 'admin', isYou: true }))).toEqual({
      status: 'Dona da loja',
    });
  });

  test('desativada', () => {
    expect(
      memberStatusLabel(member({ id: '2', name: 'Jéssica', email: 'j@x.com', role: 'expedicao', status: 'disabled' })),
    ).toEqual({ status: 'Desativada', statusTone: 'danger' });
  });
});

describe('inviteStatusLabel', () => {
  test('mostra data do convite', () => {
    const label = inviteStatusLabel(
      invite({ id: 'i1', email: 'm@x.com', role: 'financeiro', createdAt: '2026-10-06T15:00:00.000Z' }),
    );
    expect(label.statusTone).toBe('warn');
    expect(label.status).toMatch(/Convite enviado/);
  });
});

describe('mapTeamToListPeople', () => {
  test('mescla membros e convites pendentes', () => {
    const onResend = vi.fn();
    const onActive = vi.fn();
    const onRole = vi.fn();

    const people = mapTeamToListPeople(
      [
        member({
          id: 'g',
          name: 'Gisele Botho',
          email: 'g@x.com',
          role: 'admin',
          roleLabel: 'Admin',
          isYou: true,
        }),
        member({
          id: 'r',
          name: 'Rafaela',
          email: 'r@x.com',
          role: 'expedicao',
          roleLabel: 'Expedição',
        }),
      ],
      [
        invite({ id: 'inv1', email: 'contato@alves.com', role: 'financeiro', roleLabel: 'Financeiro' }),
        invite({ id: 'inv2', email: 'old@x.com', role: 'estoque', status: 'accepted' }),
      ],
      { onResendInvite: onResend, onActiveChange: onActive, onRoleChange: onRole },
    );

    expect(people).toHaveLength(3);
    expect(people[0]?.isYou).toBe(true);
    expect(people[0]?.showSwitch).toBe(false);
    expect(people[0]?.roleOptions).toBeUndefined();

    expect(people[1]?.showSwitch).toBe(true);
    expect(people[1]?.roleOptions?.map((o) => o.value)).toContain('estoque');
    people[1]?.onRoleChange?.('atendimento');
    expect(onRole).toHaveBeenCalledWith('r', 'atendimento');

    expect(people[2]?.pending).toBe(true);
    expect(people[2]?.id).toBe('invite:inv1');
    people[2]?.onResendInvite?.();
    expect(onResend).toHaveBeenCalledWith('inv1');
  });
});
