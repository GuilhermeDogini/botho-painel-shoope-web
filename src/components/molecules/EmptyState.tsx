import type { HTMLAttributes, ReactNode } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import {
  Agulha,
  AraraVazia,
  Cabide,
  Carretel,
  EMPTY_ILLUSTRATIONS,
  Tesoura,
  type EmptyIllustrationKind,
} from '@/components/illustrations';
import { cn } from '@/lib/utils';

const ILLUSTRATIONS: Record<EmptyIllustrationKind, (animated: boolean) => ReactNode> = {
  arara: (animated) => <AraraVazia animated={animated} />,
  cabide: (animated) => <Cabide animated={animated} />,
  carretel: (animated) => <Carretel animated={animated} />,
  tesoura: (animated) => <Tesoura animated={animated} />,
  agulha: (animated) => <Agulha animated={animated} />,
};

function isEmptyIllustration(value: unknown): value is EmptyIllustrationKind {
  return typeof value === 'string' && (EMPTY_ILLUSTRATIONS as readonly string[]).includes(value);
}

export type { EmptyIllustrationKind };

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Ilustração nomeada ou nó custom. `null` esconde. */
  illustration?: EmptyIllustrationKind | ReactNode | null;
  /** Anima a ilustração nomeada (padrão: sim). */
  animated?: boolean;
  title: ReactNode;
  description?: ReactNode;
  /** Botão / link de ação (opcional). */
  action?: ReactNode;
  /** Centralizado (listas) ou à esquerda (erro / sem permissão). */
  align?: 'center' | 'start';
}

/**
 * Estado vazio com ilustração de costura, título, texto e ação.
 * Mesmo bloco em Pedidos, Produtos e Conversas — só mudam props.
 */
export function EmptyState({
  illustration = 'arara',
  animated = true,
  title,
  description,
  action,
  align = 'center',
  className,
  ...rest
}: EmptyStateProps) {
  const art =
    illustration == null
      ? null
      : isEmptyIllustration(illustration)
        ? ILLUSTRATIONS[illustration](animated)
        : illustration;

  return (
    <section
      {...rest}
      className={cn(
        'flex flex-col gap-2.5 rounded-lg px-5 py-9',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {art}
      <Heading level={3} size="h3" className="max-w-sm font-display text-[20px] tracking-[-.015em]">
        {title}
      </Heading>
      {description ? (
        <Text size="small" tone="muted" className="max-w-[340px]">
          {description}
        </Text>
      ) : null}
      {action ? <div className={cn('mt-1', align === 'center' && 'flex justify-center')}>{action}</div> : null}
    </section>
  );
}
