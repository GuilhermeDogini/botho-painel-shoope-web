import { Mail, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Input } from '@/components/atoms/Input';
import { Spinner } from '@/components/atoms/Spinner';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FormField } from '@/components/molecules/FormField';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { Modal } from '@/components/organisms/Modal';
import { PermissionMatrix } from '@/components/organisms/PermissionMatrix';
import { buildRoleCardsFromMatrix, RoleCards } from '@/components/organisms/RoleCards';
import { TeamList } from '@/components/organisms/TeamList';
import { ListPage } from '@/components/templates/ListPage';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  useCreateInvite,
  useDeactivateMember,
  useReactivateMember,
  useResendInvite,
  useTeamInvites,
  useTeamMembers,
  useUpdateMemberRole,
} from '@/hooks/useTeam';
import { ApiError } from '@/lib/api';
import { INVITE_ROLE_OPTIONS, mapTeamToListPeople, roleMetaFor } from '@/lib/team';
import type { InviteRole, Role, TeamMember } from '@/lib/types';
import { cn } from '@/lib/utils';

const ROLE_CARDS = buildRoleCardsFromMatrix();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EquipePage() {
  const mobile = useIsMobile();
  const membersQ = useTeamMembers();
  const invitesQ = useTeamInvites();
  const updateRole = useUpdateMemberRole();
  const deactivate = useDeactivateMember();
  const reactivate = useReactivateMember();
  const createInvite = useCreateInvite();
  const resendInvite = useResendInvite();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [pendingOff, setPendingOff] = useState<TeamMember | null>(null);

  const members = membersQ.data ?? [];
  const invites = invitesQ.data ?? [];
  const loading = membersQ.isPending || invitesQ.isPending;
  const error = membersQ.error ?? invitesQ.error;

  const people = useMemo(
    () =>
      mapTeamToListPeople(members, invites, {
        onResendInvite: (inviteId) => {
          resendInvite.mutate(inviteId, {
            onSuccess: () => toast.success('Convite reenviado'),
            onError: (err) => toast.error(err.message),
          });
        },
        onActiveChange: (memberId, active) => {
          if (active) {
            reactivate.mutate(memberId, {
              onSuccess: (m) => toast.success(`${firstName(m.name)} tem acesso de novo.`),
              onError: (err) => toast.error(err.message),
            });
            return;
          }
          const member = members.find((m) => m.id === memberId);
          if (member) setPendingOff(member);
        },
        onRoleChange: (memberId, role) => {
          updateRole.mutate(
            { id: memberId, role },
            {
              onSuccess: (m) => toast.success(`Papel de ${firstName(m.name)} atualizado para ${m.roleLabel}.`),
              onError: (err) => toast.error(err.message),
            },
          );
        },
      }),
    [members, invites, resendInvite, reactivate, updateRole],
  );

  const confirmDeactivate = () => {
    if (!pendingOff) return;
    const target = pendingOff;
    deactivate.mutate(target.id, {
      onSuccess: () => {
        toast.success(`${firstName(target.name)} não tem mais acesso.`);
        setPendingOff(null);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <>
      <ListPage
        title="Equipe e permissões"
        description="Cada pessoa vê só o que o papel dela permite."
        actions={
          <Button variant="primary" icon={Mail} onClick={() => setInviteOpen(true)}>
            Convidar pessoa
          </Button>
        }
      >
        {loading ? (
          <div className="flex min-h-[min(50dvh,24rem)] w-full items-center justify-center py-10">
            <Spinner layout="stack" label="Carregando a equipe…" />
          </div>
        ) : error ? (
          <EmptyState
            align="start"
            illustration={null}
            title="Não deu para carregar a equipe"
            description={error instanceof ApiError ? error.message : 'Tente de novo em instantes.'}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  void membersQ.refetch();
                  void invitesQ.refetch();
                }}
              >
                Tentar de novo
              </Button>
            }
          />
        ) : people.length === 0 ? (
          <EmptyState
            illustration="arara"
            title="Ninguém na equipe ainda"
            description="Convide a primeira pessoa para ajudar na loja."
            action={
              <Button variant="primary" icon={Mail} onClick={() => setInviteOpen(true)}>
                Convidar pessoa
              </Button>
            }
          />
        ) : (
          <TeamList people={people} />
        )}

        {mobile ? (
          <section className="flex flex-col gap-3" aria-labelledby="equipe-papeis-m">
            <Heading id="equipe-papeis-m" level={2} size="h2">
              O que cada papel pode fazer
            </Heading>
            <RoleCards roles={ROLE_CARDS} />
          </section>
        ) : (
          <PermissionMatrix />
        )}
      </ListPage>

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        loading={createInvite.isPending}
        onSubmit={(email, role) => {
          createInvite.mutate(
            { email, role },
            {
              onSuccess: () => {
                toast.success(`Convite enviado para ${email}.`);
                setInviteOpen(false);
              },
              onError: (err) => toast.error(err.message),
            },
          );
        }}
      />

      <ConfirmDialog
        open={pendingOff != null}
        onOpenChange={(open) => {
          if (!open) setPendingOff(null);
        }}
        title={`Desativar ${pendingOff ? firstName(pendingOff.name) : ''}?`}
        tone="danger"
        confirmLabel="Desativar acesso"
        loading={deactivate.isPending}
        onConfirm={confirmDeactivate}
        summary={
          <>
            <span>
              {pendingOff ? firstName(pendingOff.name) : 'Ela'} perde o acesso ao painel na hora.
            </span>
            <span className="mt-1 block text-sm text-muted">
              Nada do que ela fez é apagado. Dá para reativar quando quiser.
            </span>
          </>
        }
      />
    </>
  );
}

function firstName(full: string): string {
  const part = full.trim().split(/\s+/)[0];
  return part || full;
}

function InviteModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string, role: InviteRole) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InviteRole>('expedicao');
  const [emailError, setEmailError] = useState<string | undefined>();

  useEffect(() => {
    if (!open) {
      setEmail('');
      setRole('expedicao');
      setEmailError(undefined);
    }
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const submit = () => {
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('Informe um e-mail válido');
      return;
    }
    setEmailError(undefined);
    onSubmit(trimmed, role);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Convidar pessoa"
      description="Envie um convite por e-mail com o papel da pessoa."
      wide
      footer={
        <>
          <Button variant="outline" disabled={loading} onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="primary" icon={Send} loading={loading} onClick={submit}>
            Enviar convite
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="E-mail"
          hint="A pessoa recebe um link para criar a senha. Vale por 7 dias."
          error={emailError}
          required
        >
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
            placeholder="nome@email.com"
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Text as="span" size="small" className="font-semibold text-ink">
            Papel
          </Text>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Papel">
            {INVITE_ROLE_OPTIONS.map((opt) => {
              const selected = opt.value === role;
              const meta = roleMetaFor(opt.value as Role);
              const Icon = meta.tagIcon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setRole(opt.value)}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-md border px-3.5 py-3 text-left font-sans transition-colors',
                    selected
                      ? 'border-brand bg-brand-soft'
                      : 'border-line bg-surface hover:bg-surface-2',
                  )}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.75}
                    className={cn('mt-0.5 shrink-0', selected ? 'text-brand-text' : 'text-muted')}
                    aria-hidden
                  />
                  <span className="min-w-0 grow">
                    <span className="block font-bold text-ink">{opt.label}</span>
                    <span className="mt-0.5 block text-sm text-muted">{opt.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
