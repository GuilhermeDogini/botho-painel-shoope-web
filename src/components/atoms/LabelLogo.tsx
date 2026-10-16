import { cn } from '@/lib/utils';

export interface LabelLogoProps {
  /** `brand`: framboesa com bordado creme (padrão). `cream`: creme com bordado framboesa. */
  tone?: 'brand' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  /** Texto grande (minúsculo). */
  word?: string;
  /** Linha pequena em caixa alta, abaixo. */
  subtitle?: string;
  /** Vazio = decorativo. */
  label?: string;
  className?: string;
}

const SIZES = {
  sm: { box: 'px-5 py-2', word: 'text-[17px]', sub: 'text-[8px]' },
  md: { box: 'px-[30px] py-3', word: 'text-[22px]', sub: 'text-[9.5px]' },
  lg: { box: 'px-10 py-4', word: 'text-[32px]', sub: 'text-[10.5px]' },
} as const;

/**
 * Versão etiqueta: etiqueta bordada de gola (Main.dc.html). Usada no login, no ícone do app e em impressos.
 * As cores são da marca e não mudam no tema escuro.
 */
export function LabelLogo({ tone = 'brand', size = 'md', word = 'botho', subtitle = 'brasil', label = 'Botho Brasil', className }: LabelLogoProps) {
  const s = SIZES[size];
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <span
      {...a11y}
      className={cn(
        'relative inline-flex flex-col items-center justify-center gap-[3px] rounded-[3px] shadow-2',
        "before:pointer-events-none before:absolute before:inset-[5px] before:rounded-[2px] before:border-[1.4px] before:border-dashed before:border-[color-mix(in_srgb,currentColor_70%,transparent)] before:content-['']",
        tone === 'brand' ? 'bg-gola text-gola-ink' : 'bg-gola-cream text-gola',
        s.box,
        className,
      )}
    >
      <span className={cn('font-display leading-none font-extrabold tracking-[.06em] lowercase', s.word)}>{word}</span>
      {subtitle && <span className={cn('leading-none font-semibold tracking-[.16em] uppercase opacity-90', s.sub)}>{subtitle}</span>}
    </span>
  );
}
