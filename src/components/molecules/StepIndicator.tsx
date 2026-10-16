import { Check } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface StepIndicatorStep {
  /** Rótulo do passo ("Fotos", "Categoria"…). */
  label: string;
  /** Chave estável (opcional). */
  key?: string;
}

export interface StepIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  steps: ReadonlyArray<string | StepIndicatorStep>;
  /** Passo atual (1-based). */
  current: number;
  /** Clique num passo (número 1-based). Sem isso, os passos não são botões. */
  onStepClick?: (step: number) => void;
  /**
   * No celular: esconde rótulos dos passos inativos e mostra
   * "Passo X de N · nome" abaixo (como em Cadastrar.dc.html).
   */
  mobileSummary?: boolean;
  /** Rótulo acessível da lista. */
  'aria-label'?: string;
}

function normalize(steps: StepIndicatorProps['steps']): StepIndicatorStep[] {
  return steps.map((s, i) =>
    typeof s === 'string' ? { label: s, key: String(i + 1) } : { key: s.key ?? String(i + 1), label: s.label },
  );
}

/**
 * Passos do assistente no estilo fita (número / ✓ + rótulo + linha pontilhada).
 * Espelha `.steps` / `.step` do DesignSystem e Cadastrar.
 */
export function StepIndicator({
  steps: rawSteps,
  current,
  onStepClick,
  mobileSummary = true,
  className,
  'aria-label': ariaLabel = 'Passos',
  ...rest
}: StepIndicatorProps) {
  const steps = normalize(rawSteps);
  const total = steps.length;
  const safeCurrent = Math.min(Math.max(1, current), Math.max(1, total));
  const currentLabel = steps[safeCurrent - 1]?.label ?? '';

  return (
    <div className={cn('min-w-0', className)} {...rest}>
      <div
        role="list"
        aria-label={ariaLabel}
        className={cn(
          'flex max-w-full items-center gap-1.5 overflow-x-auto overscroll-x-contain',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {steps.map((step, i) => {
          const n = i + 1;
          const active = n === safeCurrent;
          const done = n < safeCurrent;
          const clickable = Boolean(onStepClick);

          const badge: ReactNode = done ? (
            <Check size={14} strokeWidth={2.25} aria-hidden />
          ) : (
            n
          );

          const body = (
            <>
              <span
                aria-hidden
                className={cn(
                  'inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold',
                  'transition-colors duration-300',
                  active && 'animate-[bt-nav-pop_.42s_cubic-bezier(.22,1,.36,1)] border-0 bg-brand text-brand-ink',
                  done && !active && 'border-0 bg-salvia text-white',
                  !active && !done && 'border-[1.5px] border-dashed border-line-2 text-muted',
                )}
              >
                {badge}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap',
                  // No celular, só o passo atual mostra o nome (o resumo abaixo cobre o resto).
                  mobileSummary && !active && 'max-md:hidden',
                )}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <div key={step.key} className="flex shrink-0 items-center gap-1.5">
              {i > 0 ? (
                <span aria-hidden className="h-0 w-[18px] shrink-0 border-t-[1.5px] border-dashed border-line-2" />
              ) : null}
              {clickable ? (
                <button
                  type="button"
                  role="listitem"
                  aria-current={active ? 'step' : undefined}
                  onClick={() => onStepClick?.(n)}
                  className={cn(
                    'inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent pr-3 pl-1.5',
                    'text-sm font-semibold whitespace-nowrap transition-colors duration-300',
                    active ? 'bg-brand-soft text-ink' : 'text-muted',
                  )}
                >
                  {body}
                </button>
              ) : (
                <div
                  role="listitem"
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'inline-flex min-h-10 items-center gap-2 rounded-full pr-3 pl-1.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300',
                    active ? 'bg-brand-soft text-ink' : 'text-muted',
                  )}
                >
                  {body}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mobileSummary && total > 0 ? (
        <p className="mt-1 text-sm font-bold text-ink md:hidden">
          Passo {safeCurrent} de {total}
          {currentLabel ? ` · ${currentLabel}` : null}
        </p>
      ) : null}
    </div>
  );
}
