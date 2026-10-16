import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { AdsCreditCard } from '@/components/organisms/AdsCreditCard';
import { CampaignTable } from '@/components/organisms/CampaignTable';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { ListPage } from '@/components/templates/ListPage';
import { useAdsCampaigns, useAdsCredit, usePauseCampaign, useResumeCampaign } from '@/hooks/useAds';
import { useMe } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api';
import type { CampaignFilter, CampaignView } from '@/lib/types';

/**
 * Campanhas (Shopee Ads): crédito, lista, pausar/retomar (SHP-110 / SHP-112).
 */
export function CampanhasPage() {
  const navigate = useNavigate();
  const me = useMe();
  const canEdit = me.data?.permissions.includes('campanhas.editar') ?? false;
  const [filter, setFilter] = useState<CampaignFilter>('all');
  const creditQ = useAdsCredit();
  const listQ = useAdsCampaigns(filter, 7);
  const pauseM = usePauseCampaign();
  const resumeM = useResumeCampaign();

  const [resumeTarget, setResumeTarget] = useState<CampaignView | null>(null);

  const togglingId =
    pauseM.isPending && pauseM.variables
      ? pauseM.variables
      : resumeM.isPending && resumeM.variables
        ? resumeM.variables
        : null;

  async function handleToggle(campaign: CampaignView, nextOn: boolean) {
    if (!canEdit) return;
    if (!nextOn) {
      try {
        await pauseM.mutateAsync(campaign.id);
        toast.success(`Campanha “${campaign.name}” pausada`);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : 'Não foi possível pausar');
      }
      return;
    }
    setResumeTarget(campaign);
  }

  async function confirmResume() {
    if (!resumeTarget) return;
    const target = resumeTarget;
    try {
      await resumeM.mutateAsync(target.id);
      toast.success(`Campanha “${target.name}” retomada`);
      setResumeTarget(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível retomar');
    }
  }

  const error = creditQ.error ?? listQ.error;

  return (
    <ListPage
      title="Campanhas"
      description="Anúncios pagos da Shopee (Shopee Ads)"
      actions={
        canEdit ? (
          <Button asChild variant="primary">
            <Link to="/campanhas/nova">
              <Plus size={16} strokeWidth={2} aria-hidden className="mr-1.5" />
              Nova campanha
            </Link>
          </Button>
        ) : null
      }
    >
      {error ? (
        <InlineAlert tone="danger">
          {error instanceof ApiError ? error.message : 'Não foi possível carregar as campanhas.'}
        </InlineAlert>
      ) : null}

      <AdsCreditCard credit={creditQ.data ?? null} loading={creditQ.isLoading} />

      {listQ.isLoading && !listQ.data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <CampaignTable
          campaigns={listQ.data?.campaigns ?? []}
          counts={listQ.data?.counts ?? { all: 0, active: 0, paused: 0 }}
          filter={filter}
          periodDays={listQ.data?.periodDays ?? 7}
          onFilterChange={setFilter}
          onToggle={handleToggle}
          onRowClick={(c) => void navigate(`/campanhas/${c.id}`)}
          togglingId={togglingId}
          loading={listQ.isFetching && !listQ.isLoading}
          canEdit={canEdit}
        />
      )}

      <ConfirmDialog
        open={resumeTarget != null}
        onOpenChange={(open) => {
          if (!open) setResumeTarget(null);
        }}
        title="Retomar campanha?"
        summary={
          resumeTarget
            ? `A campanha “${resumeTarget.name}” volta a gastar até o orçamento diário no crédito de Ads.`
            : undefined
        }
        confirmLabel="Retomar"
        loading={resumeM.isPending}
        onConfirm={() => void confirmResume()}
      />
    </ListPage>
  );
}
