import { AlertTriangle, Calendar, Check, Clock, Truck, X, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Tag, type TagProps } from '@/components/atoms/Tag';

export type DeadlineUrgency = 'today' | 'tomorrow' | 'date' | 'collect' | 'done' | 'cancelled';

const URGENCY: Record<
  DeadlineUrgency,
  { tone: NonNullable<TagProps['tone']>; icon: LucideIcon }
> = {
  today: { tone: 'danger', icon: AlertTriangle },
  tomorrow: { tone: 'warn', icon: Clock },
  date: { tone: 'neutral', icon: Calendar },
  collect: { tone: 'info', icon: Truck },
  done: { tone: 'ok', icon: Check },
  cancelled: { tone: 'neutral', icon: X },
};

export interface DeadlineProps {
  /** Urgência do prazo (define tom + ícone — nunca só cor). */
  urgency: DeadlineUrgency;
  /** Texto do prazo ("Hoje, 18h", "Amanhã", "10/10", "Coleta hoje"). */
  children: ReactNode;
  size?: TagProps['size'];
  className?: string;
}

/**
 * Prazo de envio/coleta com urgência visual.
 * Espelha as tags de prazo em Pedidos.dc.html (`h`/`a`/`n`/`c`/`ok`/`x`).
 */
export function Deadline({ urgency, children, size = 'md', className }: DeadlineProps) {
  const { tone, icon } = URGENCY[urgency];
  return (
    <Tag tone={tone} icon={icon} size={size} className={className}>
      {children}
    </Tag>
  );
}
