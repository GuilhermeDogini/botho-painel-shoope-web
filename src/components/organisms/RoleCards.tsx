import type { LucideIcon } from 'lucide-react';
import { Check, Eye, Minus } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';
import {
  CELL_LABEL_LONG,
  MATRIX,
  ROLE_META,
  deriveRoleLists,
  type MatrixCell,
  type PermissionMatrixData,
  type RoleMeta,
} from './equipeShared';

export interface RoleCardItem {
  id: string;
  name: string;
  tagIcon: LucideIcon;
  tagTone?: NonNullable<TagProps['tone']>;
  /** Texto à direita do Tag (ex.: nomes das pessoas). */
  peopleLabel?: string;
  pode: readonly string[];
  ve: readonly string[];
  nao: readonly string[];
}

export interface RoleCardsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  roles: ReadonlyArray<RoleCardItem>;
  'aria-label'?: string;
}

const SECTION_ICON = {
  pode: Check,
  ve: Eye,
  nao: Minus,
} as const;

const SECTION_TONE: Record<MatrixCell, string> = {
  pode: 'text-salvia-text',
  ve: 'text-anil-text',
  nao: 'text-muted',
};

function PermissionGroup({
  kind,
  items,
  mutedList,
}: {
  kind: MatrixCell;
  items: readonly string[];
  mutedList?: boolean;
}) {
  if (items.length === 0) return null;
  const Icon = SECTION_ICON[kind];
  return (
    <div className="flex flex-col gap-1.5">
      <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', SECTION_TONE[kind])}>
        <Icon size={14} strokeWidth={2} aria-hidden className="shrink-0" />
        {CELL_LABEL_LONG[kind]}
      </span>
      <ul
        className={cn(
          'm-0 flex list-disc flex-col gap-1 py-0 pl-[22px] text-sm',
          mutedList ? 'text-muted' : 'text-ink',
        )}
      >
        {items.map((label) => (
          <li key={label} className="min-w-0 break-words">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Cards mobile: um por papel, com listas Pode / Só vê / Não acessa.
 * Em ~390 px não força scroll horizontal da página.
 */
export function RoleCards({
  roles,
  className,
  'aria-label': ariaLabel = 'Permissões por papel',
  ...rest
}: RoleCardsProps) {
  return (
    <section
      {...rest}
      aria-label={ariaLabel}
      className={cn('flex min-w-0 flex-col gap-3 overflow-x-hidden', className)}
    >
      {roles.map((role) => (
        <article
          key={role.id}
          className="flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface-2 p-4"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <Tag tone={role.tagTone ?? 'neutral'} icon={role.tagIcon} size="lg" className="shrink-0">
              {role.name}
            </Tag>
            {role.peopleLabel ? (
              <Text as="span" size="xs" tone="muted" className="min-w-0 grow text-right">
                {role.peopleLabel}
              </Text>
            ) : null}
          </div>

          <PermissionGroup kind="pode" items={role.pode} />
          <PermissionGroup kind="ve" items={role.ve} />
          <PermissionGroup kind="nao" items={role.nao} mutedList />
        </article>
      ))}
    </section>
  );
}

/**
 * Monta cards a partir da MATRIX (+ meta de Tag / pessoas).
 * Útil em stories, Vitrine e na página Equipe (SHP-70).
 */
export function buildRoleCardsFromMatrix(
  matrix: PermissionMatrixData = MATRIX,
  meta: readonly RoleMeta[] = ROLE_META,
): RoleCardItem[] {
  return matrix.roles.map((name, index) => {
    const roleMeta = meta.find((m) => m.name === name) ?? meta[index];
    const lists = deriveRoleLists(index, matrix);
    return {
      id: name.toLowerCase().replace(/[/\s]+/g, '-'),
      name,
      tagIcon: roleMeta?.tagIcon ?? ROLE_META[0].tagIcon,
      tagTone: roleMeta?.tagTone ?? 'neutral',
      peopleLabel: roleMeta?.peopleLabel,
      ...lists,
    };
  });
}
