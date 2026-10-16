import { useState } from 'react';
import { MessageCircle, Shield, Shirt, Truck, Wallet } from 'lucide-react';
import { Heading } from '@/components/atoms/Heading';
import { PermissionMatrix } from '@/components/organisms/PermissionMatrix';
import { buildRoleCardsFromMatrix, RoleCards } from '@/components/organisms/RoleCards';
import { TeamList, type TeamListPerson } from '@/components/organisms/TeamList';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const ROLE_CARDS = buildRoleCardsFromMatrix();

const INITIAL_PEOPLE: TeamListPerson[] = [
  {
    id: 'g',
    name: 'Gisele Botho',
    email: 'gisele@bothobrasil.com.br',
    roleLabel: 'Admin',
    roleIcon: Shield,
    roleTone: 'brand',
    isYou: true,
    status: 'Dona da loja',
  },
  {
    id: 'r',
    name: 'Rafaela Souza',
    email: 'rafaela.souza@gmail.com',
    roleLabel: 'Expedição',
    roleIcon: Truck,
    roleTone: 'info',
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'b',
    name: 'Bruna Lima',
    email: 'brunalima.atende@gmail.com',
    roleLabel: 'Atendimento',
    roleIcon: MessageCircle,
    roleTone: 'ok',
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'c',
    name: 'Camila Rocha',
    email: 'camila.rocha@outlook.com',
    roleLabel: 'Cadastro e estoque',
    roleIcon: Shirt,
    roleTone: 'warn',
    status: 'Ativa · entrou hoje',
    showSwitch: true,
    active: true,
  },
  {
    id: 'mm',
    name: 'Márcio Alves',
    email: 'contato@alvescontabil.com.br',
    roleLabel: 'Financeiro',
    roleIcon: Wallet,
    roleTone: 'neutral',
    status: 'Convite enviado 06/10',
    statusTone: 'warn',
    pending: true,
  },
  {
    id: 'j',
    name: 'Jéssica Nunes',
    email: 'jessica.nunes@gmail.com',
    roleLabel: 'Expedição',
    roleIcon: Truck,
    roleTone: 'info',
    status: 'Desativada',
    statusTone: 'danger',
    showSwitch: true,
    active: false,
  },
];

export function EquipeSection() {
  const [active, setActive] = useState<Record<string, boolean>>({
    r: true,
    b: true,
    c: true,
    j: false,
  });

  const people = INITIAL_PEOPLE.map((p) => {
    if (p.pending) {
      return { ...p, onResendInvite: () => undefined };
    }
    if (!p.showSwitch) return p;
    const on = active[p.id] ?? p.active ?? false;
    return {
      ...p,
      active: on,
      status: on ? 'Ativa · entrou hoje' : 'Desativada',
      statusTone: (on ? 'muted' : 'danger') as TeamListPerson['statusTone'],
      onActiveChange: (next: boolean) => setActive((prev) => ({ ...prev, [p.id]: next })),
    };
  });

  return (
    <VitrineSection
      id="equipe"
      task="SHP-69"
      title="Equipe (lista, matriz, cards)"
      note="Organisms props-only do design Equipe / EquipeCel. Em ~390 px use TeamList + RoleCards; PermissionMatrix fica para desktop (scroll interno se precisar)."
    >
      <VitrineGroup label="TeamList">
        <TeamList people={people} />
      </VitrineGroup>

      <VitrineGroup label="PermissionMatrix (desktop)">
        <PermissionMatrix />
      </VitrineGroup>

      <VitrineGroup label="RoleCards (mobile · derivados da MATRIX)">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <Heading level={3} size="h3" className="text-sm">
            O que cada papel pode fazer
          </Heading>
        </div>
        <div className="mx-auto w-full max-w-[390px]">
          <RoleCards roles={ROLE_CARDS} />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
