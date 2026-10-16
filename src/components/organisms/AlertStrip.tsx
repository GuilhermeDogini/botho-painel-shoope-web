import {
  AlertTriangle,
  Link2,
  MessageCircle,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type AlertChipTone = 'warn' | 'danger' | 'info' | 'brand' | 'ok';

const TONE: Record<AlertChipTone, string> = {
  warn: '[--chip-bg:var(--bt-mostarda-soft)] [--chip-fg:var(--bt-mostarda-text)]',
  danger: '[--chip-bg:var(--bt-danger-soft)] [--chip-fg:var(--bt-danger-text)]',
  info: '[--chip-bg:var(--bt-anil-soft)] [--chip-fg:var(--bt-anil-text)]',
  brand: '[--chip-bg:var(--bt-brand-soft)] [--chip-fg:var(--bt-brand-text)]',
  ok: '[--chip-bg:var(--bt-salvia-soft)] [--chip-fg:var(--bt-salvia-text)]',
};

const DEFAULT_ICON: Record<AlertChipTone, LucideIcon> = {
  warn: Link2,
  danger: AlertTriangle,
  info: Wallet,
  brand: MessageCircle,
  ok: AlertTriangle,
};

type SharedChipProps = {
  tone?: AlertChipTone;
  /** Ícone. Padrão conforme o tom. `null` esconde. */
  icon?: LucideIcon | null;
  /** Texto do aviso — nunca truncar (pode quebrar linha). */
  children: ReactNode;
  /** CTA à direita (ex.: "Renovar"). Fica sem quebra. */
  cta?: ReactNode;
  className?: string;
};

const chipClass = (tone: AlertChipTone, className?: string) =>
  cn(
    'inline-flex min-h-12 max-w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-md border px-3.5 py-2',
    'border-[color-mix(in_srgb,var(--chip-fg)_20%,transparent)] bg-[var(--chip-bg)] text-[var(--chip-fg)]',
    'text-sm font-semibold leading-snug no-underline',
    'transition-colors hover:brightness-[0.98] dark:hover:brightness-110',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
    TONE[tone],
    className,
  );

function ChipBody({
  tone,
  icon,
  children,
  cta,
}: Required<Pick<SharedChipProps, 'tone' | 'children'>> &
  Pick<SharedChipProps, 'icon' | 'cta'>) {
  const Icon = icon === null ? null : (icon ?? DEFAULT_ICON[tone]);
  return (
    <>
      {Icon ? <Icon size={18} strokeWidth={1.75} aria-hidden className="shrink-0" /> : null}
      {/* Texto em ink: legível; tom só no fundo/ícone/CTA — nunca só cor */}
      <span className="min-w-0 text-ink">{children}</span>
      {cta != null && cta !== false ? (
        <b className="shrink-0 whitespace-nowrap font-bold">{cta}</b>
      ) : null}
    </>
  );
}

export type AlertChipButtonProps = SharedChipProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'>;

/** Chip de alerta clicável (botão). */
export function AlertChipButton({
  tone = 'warn',
  icon,
  children,
  cta,
  className,
  type = 'button',
  ...rest
}: AlertChipButtonProps) {
  return (
    <button {...rest} type={type} className={chipClass(tone, className)}>
      <ChipBody tone={tone} icon={icon} cta={cta}>
        {children}
      </ChipBody>
    </button>
  );
}

export type AlertChipLinkProps = SharedChipProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'color'>;

/** Chip de alerta como link (`href`). */
export function AlertChipLink({
  tone = 'warn',
  icon,
  children,
  cta,
  className,
  ...rest
}: AlertChipLinkProps) {
  return (
    <a {...rest} className={chipClass(tone, cn('cursor-pointer', className))}>
      <ChipBody tone={tone} icon={icon} cta={cta}>
        {children}
      </ChipBody>
    </a>
  );
}

export interface AlertStripProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `scroll` (padrão): uma linha com rolagem horizontal — tipicamente no celular.
   * `wrap`: quebra linha (desktop / quando cabe).
   * Em ambos o texto do chip **não** é cortado com reticências.
   */
  layout?: 'scroll' | 'wrap';
  /** Com `scroll`, estica até a borda no celular (como `.alerts` no InicioCel). */
  bleed?: boolean;
  'aria-label'?: string;
}

/**
 * Faixa de chips de alerta do Início (`.alerts` + `.alert-chip`).
 * Pronto quando: nenhum texto cortado a 390 px.
 */
export function AlertStrip({
  layout = 'scroll',
  bleed = false,
  className,
  children,
  role = 'list',
  'aria-label': ariaLabel = 'Avisos',
  ...rest
}: AlertStripProps) {
  const scroll = layout === 'scroll';
  return (
    <div
      {...rest}
      role={role}
      aria-label={ariaLabel}
      className={cn(
        'flex max-w-full min-w-0 gap-2.5',
        scroll
          ? cn(
              'flex-nowrap overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              bleed && '-mx-4 px-4 sm:mx-0 sm:px-0',
            )
          : 'flex-wrap',
        className,
      )}
    >
      {children}
    </div>
  );
}
