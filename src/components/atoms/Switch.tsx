import { Switch as SwitchPrimitive } from 'radix-ui';
import { type ComponentProps, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<ComponentProps<typeof SwitchPrimitive.Root>, 'children'> {
  /** Texto ao lado (clicável). Sem ele, passe `aria-label`. */
  label?: ReactNode;
  className?: string;
}

/** Liga/desliga (Radix: role=switch, Espaço e Enter alternam). Ligado = sálvia e bolinha à direita. */
export function Switch({ label, className, id, disabled, ...rest }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  return (
    <span className={cn('inline-flex min-h-11 items-center gap-3', disabled && 'opacity-45', className)}>
      <SwitchPrimitive.Root
        {...rest}
        id={switchId}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer items-center rounded-[15px] bg-line-2 p-0 transition-colors duration-200',
          'data-[state=checked]:bg-salvia disabled:cursor-not-allowed',
        )}
      >
        {/* A bolinha é branca nos dois temas, como no design. */}
        <SwitchPrimitive.Thumb className="block size-6 translate-x-[3px] rounded-full bg-white shadow-1 transition-transform duration-200 data-[state=checked]:translate-x-[25px]" />
      </SwitchPrimitive.Root>
      {label && (
        <label htmlFor={switchId} className={cn('text-sm text-ink', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
          {label}
        </label>
      )}
    </span>
  );
}
