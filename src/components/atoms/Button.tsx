import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle, type LucideIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border font-sans font-semibold no-underline',
    'transition-[background-color,border-color,transform] duration-150 active:translate-y-px',
    'disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: 'border-brand bg-brand text-brand-ink hover:border-brand-hover hover:bg-brand-hover',
        soft: 'border-transparent bg-brand-soft text-brand-text hover:bg-[color-mix(in_srgb,var(--bt-brand-soft)_80%,var(--bt-brand)_20%)]',
        outline: 'border-line-2 bg-surface text-ink hover:bg-surface-2',
        ghost: 'border-transparent bg-transparent text-ink-2 hover:bg-surface-2',
        danger: 'border-danger bg-danger text-danger-ink hover:bg-[color-mix(in_srgb,var(--bt-danger)_88%,var(--bt-ink)_12%)]',
        link: 'border-0 bg-transparent text-brand-text underline underline-offset-3 hover:text-brand-hover',
      },
      size: {
        lg: 'min-h-13 rounded-md px-[22px] text-[16px]',
        md: 'min-h-11 rounded-sm px-[18px] text-base',
        // 40 px no visual (Compacto do design); o ::before leva a área de toque a 44 px
        // (3 px a partir de dentro da borda de 1 px = 2 px para fora de cada lado).
        sm: "min-h-10 rounded-sm px-3.5 text-[14px] before:absolute before:inset-x-0 before:-inset-y-[3px] before:content-['']",
      },
      fullWidth: { true: 'w-full' },
    },
    compoundVariants: [
      { variant: 'link', className: 'min-h-11 gap-1.5 px-0 text-[14px] before:hidden' },
    ],
    defaultVariants: { variant: 'outline', size: 'md' },
  },
);

const ICON_SIZE = { lg: 20, md: 20, sm: 16 } as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Ícone à esquerda do texto (lucide). Some enquanto `loading`. */
  icon?: LucideIcon;
  /** Ícone à direita do texto (ex.: seta, abrir fora). */
  iconRight?: LucideIcon;
  /** Mostra o giro, trava o clique e avisa leitores de tela. */
  loading?: boolean;
  /** Renderiza o filho (ex.: `<Link>`) com o estilo do botão. */
  asChild?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  asChild = false,
  disabled,
  className,
  children,
  type,
  ...rest
}: ButtonProps) {
  const iconSize = ICON_SIZE[size ?? 'md'];
  const iconProps = { size: iconSize, strokeWidth: 1.75, 'aria-hidden': true } as const;
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      {...rest}
      {...(asChild
        ? { 'aria-disabled': disabled || loading || undefined }
        : { type: type ?? 'button', disabled: disabled || loading })}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    >
      {loading ? <LoaderCircle {...iconProps} className="animate-spin" /> : Icon && <Icon {...iconProps} />}
      <Slot.Slottable>{children}</Slot.Slottable>
      {IconRight && <IconRight {...iconProps} />}
    </Comp>
  );
}
