import { describe, expect, test } from 'vitest';
import { resolveNav } from './nav';
import type { Permission } from '@/lib/types';

const ALL: Permission[] = [
  'pedidos.ver',
  'conversas.responder',
  'produtos.ver',
  'produtos.editar',
  'estoque.repor',
  'turbinar.usar',
  'campanhas.ver',
  'financeiro.ver',
  'equipe.gerir',
  'config.gerir',
];

describe('resolveNav', () => {
  test('admin só vê rotas ready (sem link quebrado)', () => {
    const { side, bottom, more } = resolveNav('admin', ALL);
    expect(side.map((i) => i.id)).toEqual([
      'inicio',
      'pedidos',
      'conversas',
      'produtos',
      'turbinar',
      'estoque',
      'campanhas',
      'financeiro',
      'equipe',
      'config',
    ]);
    expect(bottom.map((i) => i.id)).toEqual(['inicio', 'pedidos', 'conversas', 'produtos', 'mais']);
    expect(more.map((i) => i.id)).toEqual(['turbinar', 'estoque', 'campanhas', 'financeiro', 'equipe', 'config']);
  });

  test('atendimento não vê Produtos no menu', () => {
    const { side } = resolveNav('atendimento', ['produtos.ver', 'conversas.responder', 'pedidos.ver']);
    expect(side.map((i) => i.id)).not.toContain('produtos');
    expect(side.map((i) => i.id)).toEqual(['inicio', 'conversas', 'pedidos']);
  });

  test('sem permissão de turbinar some da lista', () => {
    const { side, more } = resolveNav('admin', ['produtos.ver']);
    expect(side.map((i) => i.id)).toEqual(['inicio', 'produtos']);
    expect(more).toHaveLength(0);
  });
});
