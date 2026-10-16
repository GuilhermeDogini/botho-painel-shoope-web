import { Check, Megaphone } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Money } from '@/components/atoms/Money';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { MoneyField } from '@/components/molecules/MoneyField';
import { WizardPage } from '@/components/templates/WizardPage';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';

export const CAMPAIGN_WIZARD_STEPS = ['Escolher peças', 'Orçamento e duração', 'Revisar'] as const;

export type CampaignDurationDays = 0 | 7 | 14 | 30;

export interface CampaignWizardProduct {
  itemId: number;
  name: string;
  imageUrl: string | null;
}

export interface CampaignWizardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  products: ReadonlyArray<CampaignWizardProduct>;
  selectedIds: ReadonlyArray<number>;
  onToggleProduct: (itemId: number) => void;
  dailyBudget: number;
  onDailyBudgetChange: (value: number) => void;
  durationDays: CampaignDurationDays;
  onDurationChange: (value: CampaignDurationDays) => void;
  creditAvailable: number;
  acknowledgedCredit: boolean;
  onAcknowledgedChange: (value: boolean) => void;
  step: number;
  onStepChange: (step: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  productsLoading?: boolean;
}

const BUDGET_PRESETS = [10, 15, 25] as const;
const DURATION_OPTIONS: { value: CampaignDurationDays; label: string }[] = [
  { value: 7, label: '7 dias' },
  { value: 14, label: '14 dias' },
  { value: 30, label: '30 dias' },
  { value: 0, label: 'Sem data fim' },
];

function totalCap(dailyBudget: number, durationDays: CampaignDurationDays): number | null {
  return durationDays > 0 ? Math.round(dailyBudget * durationDays * 100) / 100 : null;
}

function durationLabel(durationDays: CampaignDurationDays): string {
  if (durationDays === 0) return 'Sem data fim';
  return `${durationDays} dias`;
}

/**
 * Wizard de nova campanha em 3 passos (SHP-111). Usa WizardPage.
 */
export function CampaignWizard({
  products,
  selectedIds,
  onToggleProduct,
  dailyBudget,
  onDailyBudgetChange,
  durationDays,
  onDurationChange,
  creditAvailable,
  acknowledgedCredit,
  onAcknowledgedChange,
  step,
  onStepChange,
  onBack,
  onSubmit,
  submitting = false,
  productsLoading = false,
  className,
  ...rest
}: CampaignWizardProps) {
  const selected = new Set(selectedIds);
  const selectedProducts = products.filter((p) => selected.has(p.itemId));
  const daysCovered =
    dailyBudget > 0 ? Math.floor(creditAvailable / dailyBudget) : 0;
  const cap = totalCap(dailyBudget, durationDays);
  const totalLabel =
    cap != null ? money(cap) : `${money(Math.round(dailyBudget * 30 * 100) / 100)} por mês`;

  const canContinueStep1 = selectedIds.length > 0;
  const canContinueStep2 = dailyBudget >= 1;
  const canCreate = canContinueStep1 && canContinueStep2 && acknowledgedCredit;

  function goNext() {
    if (step === 1) {
      if (!canContinueStep1) return;
      onStepChange(2);
      return;
    }
    if (step === 2) {
      if (!canContinueStep2) return;
      onStepChange(3);
      return;
    }
    if (canCreate) onSubmit();
  }

  return (
    <WizardPage
      {...rest}
      className={className}
      title="Nova campanha"
      backLabel="Campanhas"
      onBack={onBack}
      steps={[...CAMPAIGN_WIZARD_STEPS]}
      currentStep={step}
      onStepClick={(s) => {
        if (s < step) onStepChange(s);
      }}
      onPrevious={step > 1 ? () => onStepChange(step - 1) : undefined}
      disableBack={step <= 1}
      primaryLabel={
        step < 3 ? (
          'Continuar'
        ) : (
          <>
            <Megaphone size={16} strokeWidth={2} aria-hidden className="mr-1.5" />
            Criar campanha de {money(dailyBudget)}/dia
          </>
        )
      }
      primaryShowChevron={step < 3}
      primaryLoading={submitting}
      onPrimary={goNext}
    >
      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-2">
            Escolha as peças que vão aparecer no anúncio. Peças com estoque e boas fotos funcionam
            melhor.
          </p>
          {productsLoading ? (
            <p className="text-sm text-muted">Carregando peças…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma peça no catálogo.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {products.map((p) => {
                const on = selected.has(p.itemId);
                return (
                  <button
                    key={p.itemId}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onToggleProduct(p.itemId)}
                    className={cn(
                      'relative overflow-hidden rounded-lg border text-left transition-colors',
                      on ? 'border-brand ring-2 ring-brand/30' : 'border-line hover:border-line-2',
                    )}
                  >
                    <Thumbnail src={p.imageUrl} alt="" size="fluid" shape="portrait" />
                    <span
                      className={cn(
                        'absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full',
                        on ? 'bg-brand text-brand-ink' : 'bg-surface/90 text-muted',
                      )}
                    >
                      <Check size={14} strokeWidth={2.5} aria-hidden />
                    </span>
                    <span className="block px-2.5 py-2 text-sm font-bold leading-snug">{p.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink">Quanto você quer gastar por dia, no máximo?</span>
            <div className="flex flex-wrap items-center gap-2">
              {BUDGET_PRESETS.map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={dailyBudget === v ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onDailyBudgetChange(v)}
                >
                  {money(v)}
                </Button>
              ))}
              <MoneyField
                label={<span className="sr-only">Outro valor</span>}
                aria-label="Outro valor"
                value={dailyBudget > 0 ? dailyBudget.toFixed(2).replace('.', ',') : ''}
                onValueChange={(n) => {
                  if (n != null && n > 0) onDailyBudgetChange(n);
                }}
                fieldClassName="w-[140px] gap-0"
                className="min-h-10 px-3 py-0 text-[14px] font-semibold"
              />
            </div>
            <p className="text-xs text-muted">
              A Shopee cobra por clique. Num dia fraco o gasto fica abaixo desse limite.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink">Por quanto tempo?</span>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <Button
                  key={d.value}
                  type="button"
                  variant={durationDays === d.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onDurationChange(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <InlineAlert tone="warn">
            Seu crédito atual ({money(creditAvailable)}) cobre ~{daysCovered} dia
            {daysCovered === 1 ? '' : 's'} deste orçamento. Sem recarga, a campanha pausa sozinha.
          </InlineAlert>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-transparent bg-brand-soft p-5">
            <p className="font-display text-2xl font-bold leading-snug tracking-tight">
              Você vai gastar até <span className="text-brand-text">{money(dailyBudget)}</span> por
              dia, até <span className="text-brand-text">{totalLabel}</span>
              {cap == null ? '' : ' no total'}.
            </p>
            <p className="mt-2 text-sm text-ink-2">
              {durationLabel(durationDays)} · {selectedProducts.length} peça
              {selectedProducts.length === 1 ? '' : 's'} · começa em alguns minutos
            </p>
          </div>

          <ul className="m-0 flex list-none flex-col divide-y divide-line rounded-lg border border-line p-0">
            <li className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <span className="text-muted">Peças</span>
              <span className="max-w-[60%] truncate text-right font-bold">
                {selectedProducts.map((p) => p.name).join(', ') || '—'}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <span className="text-muted">Sai do crédito de Ads</span>
              <Money value={creditAvailable} className="font-bold" />
            </li>
            <li className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <span className="text-muted">Dá para pausar quando quiser</span>
              <span className="font-bold">sem multa</span>
            </li>
          </ul>

          <Checkbox
            checked={acknowledgedCredit}
            onChange={(e) => onAcknowledgedChange(e.target.checked)}
            label="Entendi que esse valor sai do meu crédito de Ads da Shopee."
          />
        </div>
      ) : null}
    </WizardPage>
  );
}
