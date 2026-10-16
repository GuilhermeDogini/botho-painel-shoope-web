const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const money = (n: number | null): string => (n === null ? '—' : brl.format(n));

/** Entrada (+), saída (−) ou neutro. Em entrada e saída o sinal vem do tipo, não do número. */
export type MoneyKind = 'in' | 'out' | 'neutral';

const MINUS = '−';

/** "+ R$ 119,90" · "− R$ 16,79" · "R$ 3.412,85". Neutro negativo também ganha o "−" na frente. */
export function moneyText(value: number, kind: MoneyKind = 'neutral'): string {
  const abs = brl.format(Math.abs(value));
  if (kind === 'in') return `+ ${abs}`;
  if (kind === 'out') return `${MINUS} ${abs}`;
  return value < 0 ? `${MINUS} ${abs}` : abs;
}

/** Texto de contador: vazio para 0, nulo ou inválido; "99+" acima de 99. */
export function countText(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n) || n < 1) return null;
  const whole = Math.floor(n);
  return whole > 99 ? '99+' : String(whole);
}

export const day = (iso: string | null): string => (iso ? date.format(new Date(iso)) : '—');

/** 3h12 · 45 min · menos de 1 min */
export function duration(seconds: number): string {
  if (seconds < 60) return 'menos de 1 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (!h) return `${m} min`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

/**
 * "29,90" / "1.202.022,00" → reais; "29.90" (um ponto + 1–2 decimais) também.
 * Pontos com vírgula (ou vários pontos sem vírgula) são milhar pt-BR.
 */
export function parseMoney(text: string): number {
  const clean = text.replace(/[^\d,.-]/g, '');
  if (!clean) return NaN;
  if (clean.includes(',')) {
    return Number(clean.replace(/\./g, '').replace(',', '.'));
  }
  // Decimal estilo 29.90 — senão o ponto é milhar (1.202.022).
  if (/^\d+\.\d{1,2}$/.test(clean)) return Number(clean);
  const asInt = Number(clean.replace(/\./g, ''));
  return clean.replace(/\./g, '') ? asInt : NaN;
}

/** Número → "1.202.022,00" (sem R$; para o MoneyField). */
export function formatMoneyAmount(value: number): string {
  if (!Number.isFinite(value)) return '';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Máscara ao digitar: só dígitos e uma vírgula; milhar com ponto.
 * "1202022" → "1.202.022" · "129,9" → "129,9" · "1.202.022,50" → "1.202.022,50".
 */
export function formatMoneyInput(text: string): string {
  const cleaned = text.replace(/[^\d,]/g, '');
  if (!cleaned) return '';

  const commaAt = cleaned.indexOf(',');
  const rawInt = (commaAt === -1 ? cleaned : cleaned.slice(0, commaAt)).replace(/\D/g, '');
  const rawDec = commaAt === -1 ? null : cleaned.slice(commaAt + 1).replace(/\D/g, '').slice(0, 2);

  const intPart = rawInt.replace(/^0+(?=\d)/, '') || (rawDec != null ? '0' : '');
  if (!intPart && rawDec == null) return '';

  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (rawDec == null && commaAt === -1) return withDots;
  return `${withDots || '0'},${rawDec ?? ''}`;
}

/** Ao sair do campo: completa centavos ("1.202.022" → "1.202.022,00"). */
export function formatMoneyInputBlur(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const n = parseMoney(trimmed);
  if (!Number.isFinite(n)) return trimmed;
  return formatMoneyAmount(n);
}

/** Sem acento e minúsculo, para a busca achar "decoracao" em "Decoração". */
export const fold = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
