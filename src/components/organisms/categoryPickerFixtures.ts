import type { CategoryNode } from '@/lib/types';

export const CATEGORY_FIXTURES: CategoryNode[] = [
  {
    id: 1001,
    parentId: 100,
    name: 'Vestidos midi',
    hasChildren: false,
    path: 'Moda Feminina › Vestidos › Vestidos midi',
  },
  {
    id: 1002,
    parentId: 100,
    name: 'Vestidos longos',
    hasChildren: false,
    path: 'Moda Feminina › Vestidos › Vestidos longos',
  },
  {
    id: 2001,
    parentId: 200,
    name: 'Conjuntos',
    hasChildren: false,
    path: 'Moda Feminina › Conjuntos › Conjuntos',
  },
  {
    id: 3001,
    parentId: 300,
    name: 'Pijamas',
    hasChildren: false,
    path: 'Moda Feminina › Lingerie e Sleepwear › Pijamas',
  },
  {
    id: 4001,
    parentId: 400,
    name: 'Calças',
    hasChildren: false,
    path: 'Moda Feminina › Calças › Calças',
  },
];

export const RECENT_CATEGORY_LABELS = ['Conjuntos', 'Pijamas', 'Calças'] as const;
