import { cn } from '@/lib/utils';

const SIZES = {
  // menu lateral (Nav.dc.html)
  sm: { mark: 30, gap: 'gap-2.5', word: 'text-[24px] tracking-[-.04em]', sub: 'mt-[3px] text-[9px] tracking-[.5em]' },
  // cabeçalhos e login
  md: { mark: 44, gap: 'gap-3', word: 'text-[46px] tracking-[-.045em]', sub: 'mt-1 text-[12px] tracking-[.56em]' },
  // marca grande (Main.dc.html)
  lg: { mark: 76, gap: 'gap-[18px]', word: 'text-[86px] tracking-[-.045em]', sub: 'mt-0.5 pl-1 text-[15px] tracking-[.62em]' },
} as const;

export interface LogoProps {
  /** `horizontal`: flor + "botho BRASIL". `mark`: só a flor (ícone, favicon, menu fechado). */
  variant?: 'horizontal' | 'mark';
  size?: keyof typeof SIZES;
  /**
   * `theme` (padrão): pétalas brand / miolo mostarda (seguem o tema).
   * `onFabric`: pétalas creme #FFF4EA + miolo #E2AE45 — sobre o tecido framboesa do login (claro).
   * No escuro do AuthLayout use `theme` (fundo noite).
   */
  tone?: 'theme' | 'onFabric';
  /** Nome acessível. Vazio = decorativo (quando o nome da loja já está escrito perto). */
  label?: string;
  className?: string;
}

/** Flor de quatro pétalas com miolo de botão. */
function FlowerMark({ px, onFabric }: { px: number; onFabric: boolean }) {
  return (
    <svg viewBox="0 0 48 48" width={px} height={px} aria-hidden className="shrink-0">
      <g className={onFabric ? undefined : 'fill-brand'} fill={onFabric ? 'var(--bt-logo-fabric-petal)' : undefined}>
        <ellipse cx="24" cy="11" rx="7.5" ry="10" />
        <ellipse cx="24" cy="37" rx="7.5" ry="10" />
        <ellipse cx="11" cy="24" rx="10" ry="7.5" />
        <ellipse cx="37" cy="24" rx="10" ry="7.5" />
      </g>
      <circle
        cx="24"
        cy="24"
        r="6.5"
        className={onFabric ? undefined : 'fill-mostarda'}
        fill={onFabric ? 'var(--bt-logo-fabric-center)' : undefined}
      />
      <circle
        cx="24"
        cy="24"
        r="4.2"
        fill="none"
        strokeWidth="1.4"
        strokeDasharray="2 1.8"
        className={onFabric ? undefined : 'stroke-bg'}
        stroke={onFabric ? 'var(--bt-auth-fabric)' : undefined}
      />
    </svg>
  );
}

export function Logo({
  variant = 'horizontal',
  size = 'sm',
  tone = 'theme',
  label = 'Botho Brasil',
  className,
}: LogoProps) {
  const s = SIZES[size];
  const onFabric = tone === 'onFabric';
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };

  if (variant === 'mark') {
    return (
      <span {...a11y} className={cn('inline-flex', className)}>
        <FlowerMark px={s.mark} onFabric={onFabric} />
      </span>
    );
  }

  return (
    <span
      {...a11y}
      className={cn(
        'inline-flex items-center',
        onFabric ? 'text-[color:var(--bt-logo-fabric-petal)]' : 'text-ink',
        s.gap,
        className,
      )}
    >
      <FlowerMark px={s.mark} onFabric={onFabric} />
      <span className="flex flex-col">
        <span className={cn('font-display leading-[0.88] font-extrabold', s.word)}>botho</span>
        <span
          className={cn(
            'leading-none font-bold',
            onFabric ? 'text-[color:var(--bt-logo-fabric-petal)] opacity-90' : 'text-brand-text',
            s.sub,
          )}
        >
          BRASIL
        </span>
      </span>
    </span>
  );
}
