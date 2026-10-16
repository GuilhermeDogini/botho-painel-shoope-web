import { Check, ChevronRight } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes } from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { SearchField } from '@/components/molecules/SearchField';
import type { CategoryNode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { filterCategories, splitCategoryPath } from './categoryPickerShared';

export interface CategoryPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  categories: ReadonlyArray<CategoryNode>;
  selected?: CategoryNode | null;
  onSelect: (category: CategoryNode) => void;
  loading?: boolean;
  error?: string | null;
  /** Atalhos (“Usadas por você”) — ao clicar, preenche a busca. */
  recentLabels?: ReadonlyArray<string>;
  /** Limite de resultados (padrão 60). */
  limit?: number;
  disabled?: boolean;
}

/**
 * Busca e lista de categorias da Shopee (passo Categoria do cadastro).
 * Controlado: o pai traz `categories` (ex.: useCategories) e reage a `onSelect`.
 */
export function CategoryPicker({
  categories,
  selected = null,
  onSelect,
  loading = false,
  error = null,
  recentLabels,
  limit = 60,
  disabled = false,
  className,
  ...rest
}: CategoryPickerProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => filterCategories(categories, query, limit),
    [categories, query, limit],
  );

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-3', className)}>
      <p className="text-sm text-ink-2">
        Escolha onde a peça aparece na Shopee. Isso define as características pedidas no próximo passo.
      </p>

      <SearchField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery('')}
        placeholder="Ex.: vestido midi, pijama"
        aria-label="Buscar categoria"
        disabled={disabled || loading}
        autoFocus
      />

      {recentLabels && recentLabels.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Usadas por você:</span>
          <FilterChipList aria-label="Categorias recentes">
            {recentLabels.map((label) => (
              <FilterChip
                key={label}
                type="button"
                disabled={disabled || loading}
                onClick={() => setQuery(label)}
              >
                {label}
              </FilterChip>
            ))}
          </FilterChipList>
        </div>
      ) : null}

      {loading ? (
        <Spinner layout="stack" label="Carregando categorias da Shopee…" className="w-full py-8" />
      ) : error ? (
        <p className="py-4 text-sm text-danger-text" role="alert">
          {error}
        </p>
      ) : !results.length ? (
        <p className="py-6 text-center text-sm text-muted">
          {query.trim()
            ? `Nenhuma categoria com “${query.trim()}”. Tente uma palavra mais simples.`
            : 'Nenhuma categoria disponível.'}
        </p>
      ) : (
        <div
          className="-mx-1 max-h-[55vh] overflow-y-auto"
          role="radiogroup"
          aria-label="Categorias encontradas"
        >
          {results.map((c) => {
            const { leaf, ancestors } = splitCategoryPath(c.path);
            const on = selected?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={disabled}
                onClick={() => onSelect(c)}
                className={cn(
                  'flex min-h-12 w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors',
                  on ? 'bg-brand-soft' : 'hover:bg-surface-2',
                  disabled && 'cursor-not-allowed opacity-45',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{leaf}</span>
                  {ancestors ? (
                    <span className="block truncate text-xs text-muted">{ancestors}</span>
                  ) : null}
                </span>
                {on ? (
                  <Check size={20} className="shrink-0 text-brand-text" aria-hidden />
                ) : (
                  <ChevronRight size={16} className="shrink-0 text-muted" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
