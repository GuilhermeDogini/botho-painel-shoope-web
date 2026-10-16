import { AlertTriangle, ArrowDown, ArrowUp, Megaphone } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Money } from '@/components/atoms/Money';
import { Tag, type TagProps } from '@/components/atoms/Tag';
import { EmptyState } from '@/components/molecules/EmptyState';
import { cn } from '@/lib/utils';
import { InicioCard, InicioCardHeader, InicioLinkButton } from './inicioShared';

export type CampaignHealth = 'bom' | 'atencao' | 'ruim';

const HEALTH: Record<
  CampaignHealth,
  { tone: NonNullable<TagProps['tone']>; icon: typeof ArrowUp; label: string }
> = {
  bom: { tone: 'ok', icon: ArrowUp, label: 'Bom' },
  atencao: { tone: 'warn', icon: AlertTriangle, label: 'Atenção' },
  ruim: { tone: 'danger', icon: ArrowDown, label: 'Ruim' },
};

export interface ActiveCampaignItem {
  id: string;
  name: string;
  gasto: number | null;
  vendas: number | null;
  /** Ex.: "6,2×". */
  roasLabel: string;
  health: CampaignHealth;
}

export interface ActiveCampaignsCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `InicioSummary.campanhas.ativas` — opcional, só informativo. */
  activeCount?: number;
  campaigns?: ReadonlyArray<ActiveCampaignItem>;
  onView?: () => void;
  emptyAction?: ReactNode;
}

/**
 * Card “Campanhas ativas”: gasto, vendas e retorno por campanha.
 */
export function ActiveCampaignsCard({
  campaigns = [],
  onView,
  emptyAction,
  className,
  ...rest
}: ActiveCampaignsCardProps) {
  const titleId = 'active-campaigns-title';

  return (
    <InicioCard {...rest} aria-labelledby={titleId} className={cn(className)}>
      <InicioCardHeader
        titleId={titleId}
        title="Campanhas ativas"
        icon={Megaphone}
        iconClassName="text-anil-text"
        action={onView ? <InicioLinkButton onClick={onView}>Ver</InicioLinkButton> : null}
      />

      {campaigns.length === 0 ? (
        <EmptyState
          illustration="carretel"
          title="Nenhuma campanha ativa"
          description="Quando rodar Ads, o retorno aparece aqui."
          action={emptyAction}
          className="py-3"
        />
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
          {campaigns.map((c) => {
            const h = HEALTH[c.health];
            return (
              <li key={c.id} className="flex min-w-0 flex-col gap-2 py-2.5 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-ink">{c.name}</span>
                  <Tag icon={h.icon} tone={h.tone}>
                    {h.label}
                  </Tag>
                </div>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    Gasto <Money value={c.gasto} className="font-semibold text-ink-2" />
                  </span>
                  <span className="inline-flex items-center gap-1">
                    Vendas <Money value={c.vendas} className="font-semibold text-ink-2" />
                  </span>
                  <span className="font-bold text-ink-2">Retorno {c.roasLabel}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </InicioCard>
  );
}
