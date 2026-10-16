import type { InicioAlert, InicioSummary, Role } from '@/lib/types';

/** Expedição: só pedidos + separação — nunca dinheiro. */
export function isExpedicaoInicio(role: Role | undefined | null): boolean {
  return role === 'expedicao';
}

/** MoneyCard só quando a API trouxe a seção e o papel não é Expedição. */
export function shouldShowMoneyCard(
  role: Role | undefined | null,
  summary: InicioSummary | undefined,
): boolean {
  return !isExpedicaoInicio(role) && summary?.dinheiro != null;
}

export function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Ex.: "Sábado, 10/10". */
export function formatInicioDateLabel(date: Date = new Date()): string {
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayMonth = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${cap}, ${dayMonth}`;
}

/** Ex.: "Outubro". */
export function formatMesLabel(date: Date = new Date()): string {
  const raw = date.toLocaleDateString('pt-BR', { month: 'long' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function firstName(full: string | undefined | null): string {
  if (!full) return '';
  const part = full.trim().split(/\s+/)[0];
  return part || full;
}

export function buildInicioSubtitle(opts: {
  expedicao: boolean;
  aEnviar?: number;
  vencendoHoje?: number;
}): string {
  const { expedicao, aEnviar, vencendoHoje } = opts;
  if (aEnviar == null) {
    return expedicao
      ? 'Quando entrarem pedidos para separar, eles aparecem aqui.'
      : 'O que vamos fazer na loja hoje?';
  }
  if (aEnviar === 0) {
    return expedicao
      ? 'Nenhum pedido para separar agora. Bom momento para organizar a mesa.'
      : 'Nenhum pedido pendente de envio. Bom momento para turbinar ou cadastrar.';
  }
  if (expedicao) {
    const start =
      vencendoHoje && vencendoHoje > 0
        ? vencendoHoje === 1
          ? ' Comece pelo que vence às 18h.'
          : ` Comece pelos ${vencendoHoje} que vencem às 18h.`
        : '';
    return `Hoje tem ${aEnviar} pedido${aEnviar === 1 ? '' : 's'} para separar e embalar.${start}`;
  }
  const due =
    vencendoHoje && vencendoHoje > 0
      ? vencendoHoje === 1
        ? ' O primeiro vence às 18h.'
        : ` Os ${vencendoHoje} primeiros vencem às 18h.`
      : '';
  return `Você tem ${aEnviar} pedido${aEnviar === 1 ? '' : 's'} para enviar hoje.${due}`;
}

export function buildDueLabel(vencendoHoje: number | undefined): string | undefined {
  if (vencendoHoje == null || vencendoHoje < 1) return undefined;
  return vencendoHoje === 1
    ? '1 vence hoje às 18h'
    : `${vencendoHoje} vencem hoje às 18h`;
}

export type AlertChipTone = 'warn' | 'danger' | 'info' | 'brand';

export function alertTone(severity: InicioAlert['severity'], type: InicioAlert['type']): AlertChipTone {
  if (type === 'chat_sem_resposta') return 'brand';
  if (severity === 'danger') return 'danger';
  if (severity === 'warn') return 'warn';
  return 'info';
}

export function alertCta(type: InicioAlert['type']): string {
  switch (type) {
    case 'conexao_caida':
    case 'conexao_vencendo':
      return 'Renovar';
    case 'estoque_reposicao':
      return 'Repor';
    case 'prazo_envio':
      return 'Ver';
    case 'chat_sem_resposta':
      return 'Responder';
    case 'ads_saldo_baixo':
      return 'Ver saldo';
    default:
      return 'Abrir';
  }
}
