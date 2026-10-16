import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { LabelLogo } from '@/components/atoms/LabelLogo';
import { cn } from '@/lib/utils';

export interface HomeGreetingShortcut {
  id: string;
  label: string;
  icon: LucideIcon;
  /** `soft` = destaque (Cadastrar peça). */
  variant?: 'soft' | 'outline';
  onClick?: () => void;
}

export interface HomeGreetingPill {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface HomeGreetingProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow no topo (ex.: "Quinta, 08/10"). */
  dateLabel: string;
  /** Nome da pessoa saudada. */
  name: string;
  /** Prefixo do título (padrão: "Bom dia"). */
  greeting?: string;
  /** Linha de apoio sob o título. */
  subtitle: string;
  /** Atalhos compactos (admin). */
  shortcuts?: ReadonlyArray<HomeGreetingShortcut>;
  /** Pílulas informativas (expedição: coleta, embalados). */
  pills?: ReadonlyArray<HomeGreetingPill>;
  /** Ações do canto (tema, notificações) — desktop. */
  headerActions?: ReactNode;
  /** Mostra painel de estampa + gola no desktop. */
  showEstampa?: boolean;
}

/**
 * Saudação do Início (admin e Expedição): data, título, subtítulo e atalhos/pílulas.
 * Props-only — a página monta o texto e os callbacks.
 */
export function HomeGreeting({
  dateLabel,
  name,
  greeting = 'Bom dia',
  subtitle,
  shortcuts,
  pills,
  headerActions,
  showEstampa = true,
  className,
  ...rest
}: HomeGreetingProps) {
  return (
    <section
      {...rest}
      aria-label="Saudação"
      className={cn(
        'flex min-w-0 flex-wrap overflow-x-hidden rounded-lg border border-line bg-surface shadow-1',
        className,
      )}
    >
      <div className="h-9 w-full border-b border-line bg-surface-2 sm:hidden" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5 sm:basis-[420px] sm:p-7 sm:pb-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-[0.08em] text-muted uppercase">{dateLabel}</span>
          {headerActions ? (
            <div className="hidden items-center gap-1 sm:flex">{headerActions}</div>
          ) : null}
        </div>
        <h1 className="font-display text-[28px] leading-[1.1] font-bold tracking-[-0.025em] text-ink sm:text-[34px]">
          {greeting}, {name}
        </h1>
        <p className="text-[16px] leading-snug text-ink-2 sm:text-[17px]">{subtitle}</p>

        {shortcuts && shortcuts.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {shortcuts.map((s) => (
              <Button
                key={s.id}
                type="button"
                size="sm"
                variant={s.variant === 'soft' ? 'soft' : 'outline'}
                icon={s.icon}
                onClick={s.onClick}
                aria-label={s.label}
                className="size-11 shrink-0 px-0 sm:h-auto sm:w-auto sm:min-h-10 sm:px-3.5"
              >
                {/* Celular: só ícone (aria-label); desktop: rótulo — pedidos cabem acima da dobra. */}
                <span className="hidden sm:inline">{s.label}</span>
              </Button>
            ))}
          </div>
        ) : null}

        {pills && pills.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {pills.map((p) => {
              const Icon = p.icon;
              return (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm font-semibold text-ink-2"
                >
                  <Icon size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
                  {p.label}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>

      {showEstampa ? (
        <div
          className="relative hidden min-h-[180px] w-[300px] shrink-0 border-l border-line bg-surface-2 sm:block"
          aria-hidden
        >
          <div className="absolute right-7 bottom-6">
            <LabelLogo size="sm" tone="brand" word="botho" subtitle="brasil" label="" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
