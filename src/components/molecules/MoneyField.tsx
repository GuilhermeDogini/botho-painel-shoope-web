import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Input } from '@/components/atoms/Input';
import { formatMoneyInput, formatMoneyInputBlur, parseMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

type MoneyControlProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode'> & {
  invalid?: boolean;
};

/** Controle só (prefixo R$). Aceita `id`/`invalid` do FormField. */
function MoneyControl({ className, invalid, ...rest }: MoneyControlProps) {
  return (
    <div className="relative flex min-w-0 items-center">
      <span aria-hidden className="pointer-events-none absolute left-3.5 text-sm text-muted">
        R$
      </span>
      <Input
        {...rest}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        invalid={invalid}
        className={cn('money pl-11 text-right', className)}
      />
    </div>
  );
}

function emitChange(base: ChangeEvent<HTMLInputElement>, next: string): ChangeEvent<HTMLInputElement> {
  return {
    ...base,
    target: { ...base.target, value: next },
    currentTarget: { ...base.currentTarget, value: next },
  };
}

export interface MoneyFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode' | 'prefix'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Valor exibido (ex.: "129,90" ou "1.202.022,00"). */
  value?: string;
  defaultValue?: string;
  /** Número parseado após cada mudança (`null` se vazio ou inválido). */
  onValueChange?: (value: number | null) => void;
  fieldClassName?: string;
}

/**
 * Campo de valor em R$: prefixo fixo, alinhado à direita, máscara pt-BR
 * (milhar com ponto, centavos com vírgula). Ao sair, completa `,00`.
 */
export function MoneyField({
  label,
  hint,
  error,
  required,
  id,
  value,
  defaultValue,
  onChange,
  onValueChange,
  onBlur,
  placeholder = '0,00',
  disabled,
  className,
  fieldClassName,
  name,
  ...rest
}: MoneyFieldProps) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => {
    const raw = String(defaultValue ?? '').trim();
    if (!raw) return '';
    const n = parseMoney(raw);
    return Number.isFinite(n) ? formatMoneyInputBlur(raw) : formatMoneyInput(raw);
  });
  const display = controlled ? formatMoneyInput(String(value ?? '')) : inner;

  const notifyValue = (formatted: string) => {
    if (!onValueChange) return;
    if (!formatted.trim()) {
      onValueChange(null);
      return;
    }
    const n = parseMoney(formatted);
    onValueChange(Number.isFinite(n) ? n : null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoneyInput(e.target.value);
    if (!controlled) setInner(formatted);
    notifyValue(formatted);
    onChange?.(emitChange(e, formatted));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatMoneyInputBlur(e.target.value);
    if (formatted !== e.target.value) {
      if (!controlled) setInner(formatted);
      notifyValue(formatted);
      onChange?.(emitChange(e as unknown as ChangeEvent<HTMLInputElement>, formatted));
    }
    onBlur?.(e);
  };

  return (
    <FormField label={label} htmlFor={controlId} hint={hint} error={error} required={required} className={fieldClassName}>
      <MoneyControl
        {...rest}
        id={controlId}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
      />
    </FormField>
  );
}
