import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Avatar, type AvatarTone } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Switch } from '@/components/atoms/Switch';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';

export type TeamListStatusTone = 'muted' | 'warn' | 'danger' | 'ok';

export interface TeamListRoleOption {
  value: string;
  label: string;
}

export interface TeamListPerson {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  roleIcon: LucideIcon;
  roleTone?: NonNullable<TagProps['tone']>;
  /** Mostra “(você)” ao lado do nome. */
  isYou?: boolean;
  status: string;
  statusTone?: TeamListStatusTone;
  avatarTone?: AvatarTone;
  /** Convite pendente: botão “Reenviar convite”. */
  pending?: boolean;
  onResendInvite?: () => void;
  /** Switch ativo/desativado. Sem `showSwitch`, o switch não aparece. */
  showSwitch?: boolean;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  /** Desabilita o switch (ex.: dona da loja). */
  switchDisabled?: boolean;
  /** Select de papel (PATCH). Sem opções, mostra só o Tag. */
  roleOptions?: ReadonlyArray<TeamListRoleOption>;
  roleValue?: string;
  onRoleChange?: (role: string) => void;
}

export interface TeamListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  people: ReadonlyArray<TeamListPerson>;
  'aria-label'?: string;
}

const STATUS_TONE: Record<TeamListStatusTone, string> = {
  muted: 'text-muted',
  warn: 'font-bold text-mostarda-text',
  danger: 'font-bold text-danger-text',
  ok: 'font-bold text-salvia-text',
};

/**
 * Lista de pessoas da equipe: avatar, nome, e-mail, papel, status,
 * convite pendente e switch de acesso. Em ~390 px quebra linha (sem scroll horizontal).
 */
export function TeamList({
  people,
  className,
  'aria-label': ariaLabel = 'Pessoas',
  ...rest
}: TeamListProps) {
  return (
    <section
      {...rest}
      aria-label={ariaLabel}
      className={cn('min-w-0 overflow-x-hidden rounded-lg border border-line bg-surface px-4 shadow-1 sm:px-5', className)}
    >
      <ul className="m-0 list-none divide-y divide-line p-0">
        {people.map((person) => (
          <li
            key={person.id}
            className="flex min-w-0 flex-wrap items-center gap-x-3.5 gap-y-2.5 py-3.5"
          >
            <Avatar name={person.name} tone={person.avatarTone} size="md" />

            <div className="min-w-0 grow basis-[160px]">
              <div className="truncate font-bold text-ink">
                {person.name}
                {person.isYou ? (
                  <span className="ml-1 text-sm font-medium text-muted">(você)</span>
                ) : null}
              </div>
              <Text as="div" size="small" tone="muted" className="truncate">
                {person.email}
              </Text>
            </div>

            {person.roleOptions && person.roleOptions.length > 0 ? (
              <Select
                aria-label={`Papel de ${person.name}`}
                value={person.roleValue ?? person.roleOptions[0]?.value}
                onValueChange={person.onRoleChange}
                options={[...person.roleOptions]}
                wrapperClassName="w-[11.5rem] shrink-0"
                className="min-h-10 py-1.5 text-sm"
              />
            ) : (
              <Tag tone={person.roleTone ?? 'neutral'} icon={person.roleIcon} className="shrink-0">
                {person.roleLabel}
              </Tag>
            )}

            <Text
              as="span"
              size="small"
              className={cn('min-w-[7.5rem] shrink-0', STATUS_TONE[person.statusTone ?? 'muted'])}
            >
              {person.status}
            </Text>

            {person.pending ? (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={person.onResendInvite}
                className="shrink-0"
              >
                Reenviar convite
              </Button>
            ) : null}

            {person.showSwitch ? (
              <Switch
                checked={person.active ?? false}
                disabled={person.switchDisabled}
                onCheckedChange={person.onActiveChange}
                aria-label={`Acesso de ${person.name}`}
                className="shrink-0"
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
