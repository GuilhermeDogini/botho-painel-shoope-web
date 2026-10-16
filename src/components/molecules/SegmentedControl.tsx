import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SegmentedItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  /** Selecionado (o `SegmentedControl` define isso). */
  active?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
}

/** Um segmento. Preferir via `items` do `SegmentedControl`; exportado se precisar customizar. */
export function SegmentedItem({
  active = false,
  icon: Icon,
  className,
  type = 'button',
  children,
  ...rest
}: SegmentedItemProps) {
  return (
    <button
      {...rest}
      type={type}
      role="radio"
      aria-checked={active}
      className={cn(
        'inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border-0 px-3.5 text-sm font-semibold whitespace-nowrap transition-colors',
        active ? 'bg-surface text-ink shadow-1' : 'bg-transparent text-ink-2 hover:text-ink',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
    >
      {Icon ? <Icon size={16} strokeWidth={1.75} aria-hidden className="shrink-0" /> : null}
      {children}
    </button>
  );
}

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Valor selecionado (controlado). */
  value: string;
  onValueChange: (value: string) => void;
  /** Opções (preferido). Alternativa: filhos `SegmentedItem`. */
  options?: SegmentedOption[];
  children?: ReactNode;
  disabled?: boolean;
  size?: 'md' | 'sm';
  'aria-label': string;
}

/**
 * Grupo de opções mutuamente exclusivas (Grade/Lista, Hoje/7 dias/Mês).
 * `role=radiogroup`; setas e Espaço/Enter pelo teclado nativo dos radios em botões.
 */
export function SegmentedControl({
  value,
  onValueChange,
  options,
  children,
  disabled = false,
  className,
  'aria-label': ariaLabel,
  id,
  ...rest
}: SegmentedControlProps) {
  const autoId = useId();
  const groupId = id ?? autoId;

  const fromOptions =
    options?.map((opt) => (
      <SegmentedItem
        key={opt.value}
        value={opt.value}
        active={opt.value === value}
        icon={opt.icon}
        disabled={disabled || opt.disabled}
        onClick={() => onValueChange(opt.value)}
      >
        {opt.label}
      </SegmentedItem>
    )) ?? null;

  const fromChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<SegmentedItemProps>;
    if (el.type !== SegmentedItem) return child;
    return cloneElement(el, {
      active: el.props.value === value,
      disabled: disabled || el.props.disabled,
      onClick: (e) => {
        el.props.onClick?.(e);
        if (!e.defaultPrevented) onValueChange(el.props.value);
      },
    });
  });

  return (
    <div
      {...rest}
      id={groupId}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn(
        'inline-flex max-w-full min-w-0 gap-0.5 overflow-x-auto overscroll-x-contain rounded-[12px] border border-line bg-surface-2 p-[3px]',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        disabled && 'opacity-45',
        className,
      )}
    >
      {fromOptions ?? fromChildren}
    </div>
  );
}
