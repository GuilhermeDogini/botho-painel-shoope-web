import { AlertTriangle } from 'lucide-react';
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Texto do rótulo (visível). */
  label: ReactNode;
  /** Id do controle. Sem ele, gera um automático. */
  htmlFor?: string;
  /** Texto de ajuda abaixo do campo (some se houver `error`). */
  hint?: ReactNode;
  /** Mensagem de erro (borda vermelha no controle + ícone). */
  error?: ReactNode;
  /** Mostra o * vermelho no rótulo. */
  required?: boolean;
  /** Um único controle (Input, Select, Textarea, MoneyField…). */
  children: ReactElement;
}

type ControlExtras = {
  id?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
};

/**
 * Rótulo + campo + ajuda ou erro. Liga `htmlFor`, `aria-describedby` e `invalid`
 * no filho (átomos Input/Select/Textarea entendem `invalid`).
 */
export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className,
  children,
  ...rest
}: FormFieldProps) {
  const autoId = useId();
  const controlId = htmlFor ?? autoId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const child = Children.only(children);
  if (!isValidElement<ControlExtras>(child)) {
    throw new Error('FormField espera um único elemento React como filho.');
  }

  const control = cloneElement(child, {
    id: child.props.id ?? controlId,
    invalid: error ? true : child.props.invalid,
    'aria-describedby': mergeDescribedBy(child.props['aria-describedby'], describedBy),
    'aria-required': required || child.props['aria-required'] || undefined,
  });

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={control.props.id ?? controlId} className="text-sm leading-tight font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-brand" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </label>
      {control}
      {error ? (
        <span id={errorId} role="alert" className="inline-flex items-start gap-1.5 text-sm text-danger-text">
          <AlertTriangle size={14} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0" />
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="text-[13px] text-muted">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function mergeDescribedBy(existing: string | undefined, next: string | undefined): string | undefined {
  if (!existing) return next;
  if (!next) return existing;
  const parts = new Set(`${existing} ${next}`.split(/\s+/).filter(Boolean));
  return [...parts].join(' ') || undefined;
}
