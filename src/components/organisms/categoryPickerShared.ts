import { fold } from '@/lib/format';
import type { CategoryNode } from '@/lib/types';

/** Filtra categorias por palavras no path (sem acento). */
export function filterCategories(
  categories: ReadonlyArray<CategoryNode>,
  query: string,
  limit = 60,
): CategoryNode[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  const hits = words.length
    ? categories.filter((c) => words.every((w) => fold(c.path).includes(w)))
    : [...categories];
  return hits.slice(0, limit);
}

/** Último segmento do path (folha) + ancestrais. */
export function splitCategoryPath(path: string): { leaf: string; ancestors: string } {
  const parts = path.split(' › ');
  const leaf = parts.pop() ?? path;
  return { leaf, ancestors: parts.join(' › ') };
}
