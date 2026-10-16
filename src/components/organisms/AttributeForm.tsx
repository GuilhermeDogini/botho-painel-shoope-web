import { type HTMLAttributes, type ReactNode } from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Spinner } from '@/components/atoms/Spinner';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { FormField } from '@/components/molecules/FormField';
import { fold, parseMoney } from '@/lib/format';
import type { Attribute, AttributeValue } from '@/lib/types';
import { cn } from '@/lib/utils';

const NONE = '__none__';

export interface AttributeFormProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  attributes: ReadonlyArray<Attribute>;
  values: Readonly<Record<number, AttributeValue[]>>;
  onChange: (attributeId: number, next: AttributeValue[]) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  /** Título da seção (padrão: Características). */
  title?: ReactNode;
  description?: ReactNode;
}

/** Há valor preenchido (opção ou texto). */
export function hasAttributeValue(v: AttributeValue[] | undefined): boolean {
  return Boolean(v?.some((x) => x.valueId > 0 || x.text?.trim()));
}

/**
 * Campos dinâmicos da Shopee por categoria: dropdown, multi, texto, combo e unidade.
 * Controlado: `values` + `onChange` por atributo.
 */
export function AttributeForm({
  attributes,
  values,
  onChange,
  loading = false,
  error = null,
  disabled = false,
  title = 'Características',
  description = 'A Shopee usa isso nos filtros de busca. As marcadas com * são obrigatórias nesta categoria.',
  className,
  ...rest
}: AttributeFormProps) {
  const required = attributes.filter((a) => a.mandatory);
  const optional = attributes.filter((a) => !a.mandatory);

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-4', className)}>
      <div>
        <div className="font-semibold text-ink">{title}</div>
        {description ? <div className="text-xs text-muted">{description}</div> : null}
      </div>

      {loading ? (
        <Spinner layout="stack" label="Carregando características…" className="w-full py-6" />
      ) : error ? (
        <p className="text-sm text-danger-text" role="alert">
          {error}
        </p>
      ) : !attributes.length ? (
        <p className="text-sm text-muted">Esta categoria não pede características.</p>
      ) : (
        <>
          {required.map((a) => (
            <AttributeField
              key={a.id}
              attribute={a}
              value={values[a.id] ?? []}
              onChange={(v) => onChange(a.id, v)}
              disabled={disabled}
            />
          ))}
          {optional.length > 0 ? (
            <details className="rounded-xl border border-line px-3 py-2">
              <summary className="min-h-9 cursor-pointer content-center text-sm font-medium text-ink-2 select-none">
                Mais detalhes (opcional, ajuda a vender)
              </summary>
              <div className="space-y-4 pt-3 pb-1">
                {optional.map((a) => (
                  <AttributeField
                    key={a.id}
                    attribute={a}
                    value={values[a.id] ?? []}
                    onChange={(v) => onChange(a.id, v)}
                    disabled={disabled}
                  />
                ))}
              </div>
            </details>
          ) : null}
        </>
      )}
    </div>
  );
}

function AttributeField({
  attribute: a,
  value,
  onChange,
  disabled,
}: {
  attribute: Attribute;
  value: AttributeValue[];
  onChange: (v: AttributeValue[]) => void;
  disabled?: boolean;
}) {
  const numeric = a.valueType === 'INT_TYPE' || a.valueType === 'FLOAT_TYPE';
  const first = value[0];

  if (a.input === 'dropdown') {
    const current = first?.valueId ? String(first.valueId) : NONE;
    return (
      <FormField label={a.name} required={a.mandatory}>
        <Select
          value={current}
          disabled={disabled}
          placeholder="Escolha"
          onValueChange={(v) =>
            onChange(v === NONE ? [] : [{ attributeId: a.id, valueId: Number(v) }])
          }
          options={[
            { value: NONE, label: 'Escolha' },
            ...a.options.map((o) => ({ value: String(o.id), label: o.name })),
          ]}
        />
      </FormField>
    );
  }

  if (a.input === 'multi_select' || a.input === 'multi_combo') {
    const ids = new Set(value.map((v) => v.valueId));
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-sm leading-tight font-semibold text-ink">
          {a.name}
          {a.mandatory ? (
            <span className="text-brand" aria-hidden>
              {' '}
              *
            </span>
          ) : null}
        </span>
        <FilterChipList aria-label={a.name}>
          {a.options.map((o) => (
            <FilterChip
              key={o.id}
              active={ids.has(o.id)}
              disabled={disabled}
              onClick={() =>
                onChange(
                  ids.has(o.id)
                    ? value.filter((v) => v.valueId !== o.id)
                    : [...value, { attributeId: a.id, valueId: o.id }],
                )
              }
            >
              {o.name}
            </FilterChip>
          ))}
        </FilterChipList>
        <span className="text-[13px] text-muted">Pode marcar mais de um.</span>
      </div>
    );
  }

  // text e combo: digita; no combo, sugestões em chip (sem datalist — o browser desenhava seta de select).
  const text = first?.text ?? (first ? (a.options.find((o) => o.id === first.valueId)?.name ?? '') : '');
  const unit = first?.unit ?? a.units[0];
  const selectedOptionId = first && first.valueId > 0 ? first.valueId : null;
  const update = (t: string, u = unit) => {
    if (!t.trim()) return onChange([]);
    const match = a.input === 'combo' ? a.options.find((o) => fold(o.name) === fold(t.trim())) : undefined;
    onChange([
      match
        ? { attributeId: a.id, valueId: match.id, unit: a.units.length ? u : undefined }
        : { attributeId: a.id, valueId: 0, text: t, unit: a.units.length ? u : undefined },
    ]);
  };
  const pickOption = (optionId: number) => {
    onChange([{ attributeId: a.id, valueId: optionId, unit: a.units.length ? unit : undefined }]);
  };
  const invalid = numeric && text.trim() !== '' && !Number.isFinite(parseMoney(text));
  const showComboHints = a.input === 'combo' && a.options.length > 0;

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm leading-tight font-semibold text-ink">
        {a.name}
        {a.mandatory ? (
          <span className="text-brand" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </span>
      <div className="flex gap-2">
        <Input
          inputMode={numeric ? 'decimal' : undefined}
          value={text}
          disabled={disabled}
          invalid={invalid}
          aria-label={a.name}
          onChange={(e) => update(e.target.value)}
          className="min-w-0 flex-1"
        />
        {a.units.length > 0 ? (
          <Select
            value={unit}
            disabled={disabled}
            wrapperClassName="w-24 shrink-0"
            onValueChange={(v) => update(text, v)}
            options={a.units.map((u) => ({ value: u, label: u }))}
            aria-label={`Unidade de ${a.name}`}
          />
        ) : null}
      </div>
      {showComboHints ? (
        <FilterChipList aria-label={`Sugestões de ${a.name}`}>
          {a.options.map((o) => (
            <FilterChip
              key={o.id}
              active={selectedOptionId === o.id}
              disabled={disabled}
              onClick={() => pickOption(o.id)}
            >
              {o.name}
            </FilterChip>
          ))}
        </FilterChipList>
      ) : null}
      {invalid ? (
        <span role="alert" className="text-sm text-danger-text">
          digite só o número
        </span>
      ) : showComboHints ? (
        <span className="text-[13px] text-muted">Escolha uma sugestão ou digite.</span>
      ) : null}
    </div>
  );
}
