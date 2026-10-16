import { expect, test } from 'vitest';
import { cn } from './utils';

test('cn mantém o tamanho do tema ao lado de uma cor de texto', () => {
  expect(cn('text-h1', 'text-ink')).toBe('text-h1 text-ink');
  expect(cn('text-big', 'text-brand-text')).toBe('text-big text-brand-text');
});

test('cn ainda resolve conflitos de verdade', () => {
  expect(cn('text-h1', 'text-h2')).toBe('text-h2');
  expect(cn('text-ink', 'text-muted')).toBe('text-muted');
  expect(cn('shadow-1', 'shadow-3')).toBe('shadow-3');
});
