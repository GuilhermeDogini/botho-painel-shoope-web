import type { VariationGridRow } from './variationGridShared';

/** Grade do moletom (design Produtos / DesignSystem). */
export const MOLETOM_SIZES = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3'] as const;

export const MOLETOM_ROWS: VariationGridRow[] = [
  {
    color: 'Rosa',
    colorHex: '#E9A6B9',
    cells: [
      { modelId: 1, stock: 4, price: 159.9 },
      { modelId: 2, stock: 2, price: 159.9 },
      { modelId: 3, stock: 6, price: 159.9 },
      { modelId: 4, stock: 3, price: 159.9 },
      { modelId: 5, stock: 2, price: 169.9 },
      { modelId: 6, stock: 1, price: 169.9 },
      { modelId: 7, stock: 0, price: 169.9 },
    ],
  },
  {
    color: 'Cinza mescla',
    colorHex: '#A9A39C',
    cells: [
      { modelId: 11, stock: 5, price: 159.9 },
      { modelId: 12, stock: 4, price: 159.9 },
      { modelId: 13, stock: 6, price: 159.9 },
      { modelId: 14, stock: 2, price: 159.9 },
      { modelId: 15, stock: 2, price: 169.9 },
      { modelId: 16, stock: 1, price: 169.9 },
      { modelId: 17, stock: 1, price: 169.9 },
    ],
  },
  {
    color: 'Azul anil',
    colorHex: '#2F4A9A',
    cells: [
      { modelId: 21, stock: 3, price: 159.9 },
      { modelId: 22, stock: 3, price: 159.9 },
      { modelId: 23, stock: 2, price: 159.9 },
      { modelId: 24, stock: 0, price: 159.9 },
      { modelId: 25, stock: 1, price: 169.9 },
      { modelId: null, stock: null, price: null },
      { modelId: null, stock: null, price: null },
    ],
  },
  {
    color: 'Verde sálvia',
    colorHex: '#8FAE94',
    cells: [
      { modelId: 31, stock: 2, price: 159.9 },
      { modelId: 32, stock: 1, price: 159.9 },
      { modelId: 33, stock: 2, price: 159.9 },
      { modelId: 34, stock: 1, price: 159.9 },
      { modelId: null, stock: null, price: null },
      { modelId: null, stock: null, price: null },
      { modelId: null, stock: null, price: null },
    ],
  },
];
