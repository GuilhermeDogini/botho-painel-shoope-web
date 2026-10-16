import { type InputHTMLAttributes, type ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto ao lado. Sem ele, passe `aria-label` (ex.: "Selecionar pedido #K7Q2M"). */
  label?: ReactNode;
  /** Meio marcado: "selecionar todos" quando só parte da lista está marcada. */
  indeterminate?: boolean;
}

/** Caixa nativa na cor da marca, com área de toque de 44 px em volta. */
export function Checkbox({ label, indeterminate = false, className, disabled, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  // indeterminate só existe como propriedade do DOM, não como atributo HTML.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={cn(
        'inline-flex min-h-11 items-center text-sm text-ink',
        disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
        className,
      )}
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center">
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="m-0 size-[22px] cursor-[inherit] accent-brand"
        />
      </span>
      {label}
    </label>
  );
}
