import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { countText } from '@/lib/format';
import { cn } from '@/lib/utils';

const iconButtonVariants = cva(
  [
    'relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border text-ink-2',
    'transition-colors duration-150 hover:bg-surface-2 hover:text-ink',
    'disabled:cursor-not-allowed disabled:opacity-45',
  ],
  {
    variants: {
      bordered: {
        true: 'border-line-2 bg-surface',
        false: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: { bordered: false },
  },
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'>,
    VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon;
  /** Obrigatório: é o que o leitor de tela fala, já que não há texto visível. */
  label: string;
  /** Número no canto (ex.: notificações). 0 ou vazio esconde; acima de 99 vira "99+". */
  badge?: number;
}

export function IconButton({ icon: Icon, label, badge, bordered, className, type, ...rest }: IconButtonProps) {
  const count = countText(badge);
  return (
    <button
      {...rest}
      type={type ?? 'button'}
      aria-label={count ? `${label} (${count})` : label}
      className={cn(iconButtonVariants({ bordered }), className)}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden />
      {count && (
        <span
          aria-hidden
          className="absolute top-1.5 left-5 h-[18px] min-w-[18px] rounded-[9px] border-2 border-surface bg-brand px-[5px] text-center text-[11px] leading-[14px] font-bold text-brand-ink tabular-nums"
        >
          {count}
        </span>
      )}
    </button>
  );
}
