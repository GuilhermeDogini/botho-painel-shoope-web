import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { StepIndicator, type StepIndicatorStep } from '@/components/molecules/StepIndicator';
import { cn } from '@/lib/utils';

export interface WizardPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Status do rascunho (ex.: “Rascunho salvo às 10:48”). */
  draftStatus?: ReactNode;
  backLabel?: ReactNode;
  onBack?: () => void;
  steps: ReadonlyArray<string | StepIndicatorStep>;
  /** Passo atual (1-based). */
  currentStep: number;
  onStepClick?: (step: number) => void;
  /** Conteúdo do passo (card interno). */
  children: ReactNode;
  /** Desabilita Voltar no primeiro passo. */
  disableBack?: boolean;
  /** Rótulo do botão principal (Continuar / Publicar…). */
  primaryLabel?: ReactNode;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  /** Mostra seta à direita no Continuar (some se `primaryIcon` for false). */
  primaryShowChevron?: boolean;
  onSaveDraft?: () => void;
  onPrevious?: () => void;
  /** Conteúdo extra à esquerda do rodapé (além de Voltar). */
  footerStart?: ReactNode;
}

/**
 * Assistente em passos (SHP-63): crumbs, StepIndicator, miolo e rodapé
 * com Voltar / Salvar rascunho / Continuar.
 */
export function WizardPage({
  title,
  draftStatus,
  backLabel = 'Voltar',
  onBack,
  steps,
  currentStep,
  onStepClick,
  children,
  disableBack = false,
  primaryLabel = 'Continuar',
  onPrimary,
  primaryLoading = false,
  primaryShowChevron = true,
  onSaveDraft,
  onPrevious,
  footerStart,
  className,
  ...rest
}: WizardPageProps) {
  return (
    <div {...rest} className={cn('mx-auto flex w-full max-w-[1040px] flex-col gap-6', className)}>
      <header className="flex flex-col gap-1.5">
        {onBack ? (
          <nav aria-label="Caminho">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-11 items-center gap-1 border-0 bg-transparent px-0 text-sm text-muted hover:text-ink"
            >
              <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
              {backLabel}
            </button>
          </nav>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <h1 className="font-display text-h1 font-bold tracking-[-0.025em]">{title}</h1>
          {draftStatus ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <Check size={16} strokeWidth={1.75} className="text-salvia-text" aria-hidden />
              {draftStatus}
            </span>
          ) : null}
        </div>
      </header>

      <StepIndicator steps={steps} current={currentStep} onStepClick={onStepClick} />

      <section className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-5 shadow-1 sm:p-6">
        {children}

        <footer className="flex flex-wrap items-center justify-between gap-2.5 border-t border-line pt-[18px]">
          <div className="flex flex-wrap items-center gap-2">
            {footerStart}
            {onPrevious ? (
              <Button
                type="button"
                variant="ghost"
                icon={ChevronLeft}
                disabled={disableBack}
                onClick={onPrevious}
              >
                Voltar
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onSaveDraft ? (
              <Button type="button" variant="outline" className="hidden sm:inline-flex" onClick={onSaveDraft}>
                Salvar rascunho
              </Button>
            ) : null}
            {onPrimary ? (
              <Button
                type="button"
                variant="primary"
                loading={primaryLoading}
                iconRight={primaryShowChevron && !primaryLoading ? ChevronRight : undefined}
                onClick={onPrimary}
              >
                {primaryLabel}
              </Button>
            ) : null}
          </div>
        </footer>
      </section>
    </div>
  );
}
