import { Search, X } from 'lucide-react';
import {
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

type SearchControlProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  invalid?: boolean;
  onClear?: () => void;
};

function SearchControl({
  className,
  invalid,
  value,
  defaultValue,
  onChange,
  onClear,
  disabled,
  ...rest
}: SearchControlProps) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const text = controlled ? String(value ?? '') : inner;
  const hasText = text.length > 0;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };

  const clear = () => {
    if (!controlled) setInner('');
    onClear?.();
    onChange?.({
      target: { value: '' },
      currentTarget: { value: '' },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="relative flex min-w-0 items-center">
      <Search size={18} strokeWidth={1.75} aria-hidden className="pointer-events-none absolute left-3.5 text-muted" />
      <Input
        {...rest}
        type="search"
        role="searchbox"
        disabled={disabled}
        value={text}
        onChange={handleChange}
        invalid={invalid}
        className={cn(
          'pl-[42px] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
          hasText && 'pr-11',
          className,
        )}
      />
      {hasText && !disabled ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpar busca"
          className="absolute right-1.5 inline-flex size-9 items-center justify-center rounded-sm text-muted hover:bg-surface-2 hover:text-ink"
        >
          <X size={16} strokeWidth={1.75} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Com rótulo, usa FormField. Sem rótulo, serve na barra (só o campo). */
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Em modo controlado, o pai deve zerar `value` aqui (ou em `onChange`). */
  onClear?: () => void;
  fieldClassName?: string;
}

/**
 * Busca com ícone à esquerda e botão limpar quando há texto.
 * Espelha DesignSystem.dc.html · "Busca".
 */
export function SearchField({
  label,
  hint,
  error,
  required,
  id,
  onClear,
  placeholder = 'Buscar',
  className,
  fieldClassName,
  ...rest
}: SearchFieldProps) {
  const autoId = useId();
  const controlId = id ?? autoId;

  const control = (
    <SearchControl
      {...rest}
      id={controlId}
      placeholder={placeholder}
      onClear={onClear}
      className={className}
    />
  );

  if (label == null) {
    return <div className={cn('min-w-0', fieldClassName)}>{control}</div>;
  }

  return (
    <FormField label={label} htmlFor={controlId} hint={hint} error={error} required={required} className={fieldClassName}>
      {control}
    </FormField>
  );
}
