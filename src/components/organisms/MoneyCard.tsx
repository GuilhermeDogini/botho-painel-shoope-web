import type { HTMLAttributes, ReactNode } from 'react';
import { StatCard, type StatDelta } from '@/components/molecules/StatCard';
import { TapeProgress } from '@/components/molecules/TapeProgress';
import { cn } from '@/lib/utils';
import { BarChart } from './BarChart';
import { InicioCard, InicioLinkButton } from './inicioShared';

export interface MoneyCardGoal {
  /** Valor atual (ex.: mês). */
  current: number;
  /** Meta do mês. */
  target: number;
  /** Rótulo (ex.: "Meta de outubro"). */
  label: string;
  /** Escala sob a fita. */
  scale?: ReactNode[];
}

export interface MoneyCardChart {
  categories: ReadonlyArray<string>;
  entradas: ReadonlyArray<number>;
  saidas: ReadonlyArray<number>;
  /** Descrição acessível. */
  ariaLabel?: string;
}

export interface MoneyCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * KPIs alinhados a `InicioSummary.dinheiro`.
   * `null`/`undefined` → "—" (sem `financeiro.ver`).
   */
  hoje?: number | null;
  seteDias?: number | null;
  mes?: number | null;
  /** Rótulo do KPI do mês (ex.: "Outubro"). */
  mesLabel?: string;
  aReceber?: number | null;
  carteira?: number | null;
  adsGasto?: number | null;
  /** Variação sob “Vendido hoje”. */
  hojeDelta?: StatDelta;
  goal?: MoneyCardGoal;
  chart?: MoneyCardChart;
  onFinanceiro?: () => void;
  /** Slot se o usuário não tiver permissão financeira. */
  lockedMessage?: ReactNode;
}

function formatGoalHint(current: number, target: number): string {
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  const cur = current.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
  const tgt = target.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
  return `${cur} de ${tgt} · ${pct}%`;
}

/**
 * Card Dinheiro do Início: KPIs, meta, carteira/Ads e barras entradas × saídas.
 */
export function MoneyCard({
  hoje,
  seteDias,
  mes,
  mesLabel = 'Mês',
  aReceber,
  carteira,
  adsGasto,
  hojeDelta,
  goal,
  chart,
  onFinanceiro,
  lockedMessage,
  className,
  ...rest
}: MoneyCardProps) {
  const titleId = 'money-card-title';
  const allRedacted =
    hoje == null &&
    seteDias == null &&
    mes == null &&
    aReceber == null &&
    carteira == null &&
    adsGasto == null;

  return (
    <InicioCard
      {...rest}
      aria-labelledby={titleId}
      className={cn('flex flex-col gap-[18px]', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id={titleId}
          className="font-display text-[20px] leading-tight font-bold tracking-[-0.015em] text-ink sm:text-[22px]"
        >
          Dinheiro
        </h2>
        {onFinanceiro ? <InicioLinkButton onClick={onFinanceiro}>Financeiro</InicioLinkButton> : null}
      </div>

      {allRedacted && lockedMessage ? (
        <div className="flex w-full flex-col items-center justify-center py-2 text-center">
          {lockedMessage}
        </div>
      ) : (
        <>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard label="Vendido hoje" value={hoje} delta={hojeDelta} />
            <StatCard label="7 dias" value={seteDias} />
            <StatCard label={mesLabel} value={mes} className="col-span-2 sm:col-span-1" />
          </div>

          {goal ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-bold text-ink">{goal.label}</span>
                <span className="money text-muted">{formatGoalHint(goal.current, goal.target)}</span>
              </div>
              <TapeProgress
                value={goal.current}
                max={goal.target}
                aria-label={goal.label}
                scale={goal.scale}
              />
            </div>
          ) : null}

          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3">
            <StatCard
              label="A receber"
              value={aReceber}
              hint="em liberação pela Shopee"
              variant="soft"
              size="sm"
            />
            <StatCard
              label="Na carteira"
              value={carteira}
              hint="disponível para saque"
              variant="soft"
              size="sm"
            />
            <StatCard
              label="Ads (7 dias)"
              value={adsGasto}
              hint="gasto com campanhas"
              variant="soft"
              size="sm"
              className="col-span-2 sm:col-span-1"
            />
          </div>

          {chart ? (
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-ink">Entradas × saídas · 7 dias</span>
              </div>
              <BarChart
                aria-label={chart.ariaLabel ?? 'Entradas e saídas dos últimos 7 dias'}
                categories={[...chart.categories]}
                height={140}
                formatValue={(n) =>
                  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                }
                series={[
                  { id: 'in', label: 'Entradas', tone: 'salvia', values: [...chart.entradas] },
                  { id: 'out', label: 'Saídas', tone: 'mostarda', values: [...chart.saidas] },
                ]}
              />
            </div>
          ) : null}
        </>
      )}
    </InicioCard>
  );
}
