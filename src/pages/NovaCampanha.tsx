import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  CampaignWizard,
  type CampaignDurationDays,
} from '@/components/organisms/CampaignWizard';
import { useAdsCredit, useCreateCampaign } from '@/hooks/useAds';
import { useProductList } from '@/hooks/useProducts';
import { ApiError } from '@/lib/api';
import { money } from '@/lib/format';

/**
 * Nova campanha — wizard 3 passos (SHP-111 / SHP-112).
 */
export function NovaCampanhaPage() {
  const navigate = useNavigate();
  const productsQ = useProductList();
  const creditQ = useAdsCredit();
  const createM = useCreateCampaign();

  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dailyBudget, setDailyBudget] = useState(15);
  const [durationDays, setDurationDays] = useState<CampaignDurationDays>(14);
  const [acknowledgedCredit, setAcknowledgedCredit] = useState(false);

  const products = useMemo(() => {
    const items = productsQ.data?.pages.flatMap((p) => p.items) ?? [];
    return items
      .filter((i) => i.status !== 'UNLIST')
      .slice(0, 24)
      .map((i) => ({
        itemId: i.itemId,
        name: i.name,
        imageUrl: i.imageUrl ?? null,
      }));
  }, [productsQ.data]);

  function toggleProduct(itemId: number) {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  }

  async function submit() {
    try {
      const result = await createM.mutateAsync({
        itemIds: selectedIds,
        dailyBudget,
        durationDays,
        acknowledgedCredit: true,
      });
      toast.success(`Campanha criada: até ${money(result.dailyBudget)} por dia. Ela começa a rodar em alguns minutos.`);
      void navigate(`/campanhas/${result.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível criar a campanha');
    }
  }

  return (
    <CampaignWizard
      products={products}
      selectedIds={selectedIds}
      onToggleProduct={toggleProduct}
      dailyBudget={dailyBudget}
      onDailyBudgetChange={setDailyBudget}
      durationDays={durationDays}
      onDurationChange={setDurationDays}
      creditAvailable={creditQ.data?.total ?? 0}
      acknowledgedCredit={acknowledgedCredit}
      onAcknowledgedChange={setAcknowledgedCredit}
      step={step}
      onStepChange={setStep}
      onBack={() => void navigate('/campanhas')}
      onSubmit={() => void submit()}
      submitting={createM.isPending}
      productsLoading={productsQ.isLoading}
    />
  );
}
