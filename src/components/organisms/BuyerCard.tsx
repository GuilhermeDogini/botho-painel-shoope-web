import { MessageCircle } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export interface BuyerCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Nome exibido (username ou nome mascarado). */
  name: string;
  /** Quantidade de pedidos dela no banco (inclui o atual). */
  orderCount: number;
  /** ISO da primeira compra. */
  buyerSince: string;
  onChat?: () => void;
}

function ordinal(n: number): string {
  if (n <= 0) return '1ª';
  return `${n}ª`;
}

function sinceLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
}

/**
 * Compradora + “3ª compra na Botho · desde MM/AAAA”.
 */
export function BuyerCard({
  name,
  orderCount,
  buyerSince,
  onChat,
  className,
  ...rest
}: BuyerCardProps) {
  const since = sinceLabel(buyerSince);
  const subtitle = [
    `${ordinal(orderCount)} compra na Botho`,
    since ? `desde ${since}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <section
      {...rest}
      aria-label="Compradora"
      className={cn(
        'flex items-center gap-3 rounded-lg border border-line bg-surface-2 px-4 py-3.5',
        className,
      )}
    >
      <Avatar name={name} size="md" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold text-ink">{name}</div>
        <div className="truncate text-sm text-muted">{subtitle}</div>
      </div>
      {onChat ? (
        <IconButton bordered icon={MessageCircle} label={`Conversar com ${name}`} onClick={onChat} />
      ) : null}
    </section>
  );
}
