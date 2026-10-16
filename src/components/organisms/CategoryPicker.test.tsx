import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { CategoryPicker } from './CategoryPicker';
import { CATEGORY_FIXTURES, RECENT_CATEGORY_LABELS } from './categoryPickerFixtures';
import { filterCategories, splitCategoryPath } from './categoryPickerShared';

afterEach(cleanup);

describe('categoryPickerShared', () => {
  test('filterCategories filtra por palavras', () => {
    const hits = filterCategories(CATEGORY_FIXTURES, 'vestido midi');
    expect(hits.every((c) => /vestido/i.test(c.path))).toBe(true);
    expect(hits.some((c) => c.id === 1001)).toBe(true);
  });

  test('splitCategoryPath separa folha', () => {
    expect(splitCategoryPath('A › B › C')).toEqual({ leaf: 'C', ancestors: 'A › B' });
  });
});

describe('CategoryPicker', () => {
  test('selecionar chama onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CategoryPicker categories={CATEGORY_FIXTURES} onSelect={onSelect} />);

    await user.click(screen.getByRole('radio', { name: /Vestidos midi/i }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 1001 }));
  });

  test('busca filtra a lista', async () => {
    const user = userEvent.setup();
    render(<CategoryPicker categories={CATEGORY_FIXTURES} onSelect={() => undefined} />);

    await user.type(screen.getByRole('searchbox'), 'pijama');
    expect(screen.getByRole('radio', { name: /Pijamas/i })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: /Vestidos midi/i })).toBeNull();
  });

  test('atalho recente preenche a busca', async () => {
    const user = userEvent.setup();
    render(
      <CategoryPicker
        categories={CATEGORY_FIXTURES}
        onSelect={() => undefined}
        recentLabels={[...RECENT_CATEGORY_LABELS]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Pijamas' }));
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('Pijamas');
  });
});
