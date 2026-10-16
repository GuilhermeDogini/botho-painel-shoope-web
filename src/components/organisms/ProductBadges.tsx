import { AlertTriangle, Clock, PauseCircle, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tag } from '@/components/atoms/Tag';
import { cn } from '@/lib/utils';
import { productBadges, type ProductBadgeKind, type ProductItem } from './productShared';

const BADGE_ICON: Record<ProductBadgeKind, LucideIcon> = {
  paused: PauseCircle,
  boosted: Rocket,
  lowStock: AlertTriangle,
  stalled: Clock,
};

export function ProductBadges({
  item,
  className,
  compact = false,
}: {
  item: ProductItem;
  className?: string;
  /** Na linha da tabela: selos em fila sem quebrar demais. */
  compact?: boolean;
}) {
  const badges = productBadges(item);
  if (!badges.length) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)} data-compact={compact || undefined}>
      {badges.map((b) => (
        <Tag key={b.kind} icon={BADGE_ICON[b.kind]} tone={b.tone}>
          {b.label}
        </Tag>
      ))}
    </div>
  );
}
