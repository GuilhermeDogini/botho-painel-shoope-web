import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';
import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { fieldControl } from './fieldStyles';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  /** Controlado. */
  value?: string;
  /** Não controlado. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  /** Texto quando nada está selecionado. */
  placeholder?: string;
  className?: string;
  /** Classe do contêiner (largura). */
  wrapperClassName?: string;
  /**
   * Opções: use `<option value="…">Rótulo</option>` (mesma API de antes)
   * ou passe `options={[…]}`.
   */
  children?: ReactNode;
  options?: SelectOption[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean | 'true' | 'false';
}

type OptionElProps = { value?: string | number; disabled?: boolean; children?: ReactNode };

function optionsFromChildren(children: ReactNode): SelectOption[] {
  const out: SelectOption[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type !== 'option') return;
    const props = (child as ReactElement<OptionElProps>).props;
    out.push({
      value: String(props.value ?? ''),
      label: props.children,
      disabled: Boolean(props.disabled),
    });
  });
  return out;
}

/**
 * Lista estilizada Botho (Radix). A caixa fechada igual aos outros campos;
 * a lista aberta usa superfície, sombra e item selecionado em framboesa suave —
 * não o menu azul nativo do navegador.
 */
export function Select({
  id,
  name,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  invalid = false,
  placeholder = 'Escolha…',
  className,
  wrapperClassName,
  children,
  options: optionsProp,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
}: SelectProps) {
  const options = useMemo(
    () => (optionsProp?.length ? optionsProp : optionsFromChildren(children)),
    [optionsProp, children],
  );

  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = controlled ? (value ?? '') : inner;

  const handleChange = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn('relative min-w-0', wrapperClassName)}>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <SelectPrimitive.Root value={current || undefined} onValueChange={handleChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-required={ariaRequired}
          className={cn(
            fieldControl,
            'flex min-h-[46px] cursor-pointer items-center justify-between gap-2 pr-10 text-left',
            'data-placeholder:text-muted data-placeholder:font-normal',
            'disabled:cursor-not-allowed',
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
            asChild
          >
            <ChevronDown size={18} strokeWidth={1.75} aria-hidden />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className={cn(
              'z-50 overflow-hidden rounded-sm border border-line bg-surface text-ink shadow-2',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
            )}
            style={{ minWidth: 'var(--radix-select-trigger-width)' }}
          >
            <SelectPrimitive.Viewport className="max-h-[min(280px,var(--radix-select-content-available-height))] p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    'relative flex min-h-10 cursor-pointer items-center rounded-[6px] py-2 pr-3 pl-9 text-sm font-medium outline-none select-none',
                    'data-highlighted:bg-brand-soft data-highlighted:text-brand-text',
                    'data-[state=checked]:font-semibold',
                    'data-disabled:pointer-events-none data-disabled:opacity-45',
                  )}
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-2.5 inline-flex text-brand-text">
                    <Check size={16} strokeWidth={2} aria-hidden />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
