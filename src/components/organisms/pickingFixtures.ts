import type { PackingGroup, PackingNote } from '@/lib/types';
import { mockPantalonaSrc, mockVestidoSrc } from '@/stories/mocks';

/** Dados de demo alinhados a Separacao.dc.html (SHP-84). */
export const DEMO_PACKING_GROUPS: PackingGroup[] = [
  {
    itemId: 101,
    name: 'Pijama americano de malha',
    imageUrl: mockVestidoSrc,
    location: 'Arara 2 · prateleira de cima',
    quantity: 2,
    variants: [
      {
        modelId: 1,
        variation: 'Listrado anil,P',
        color: 'Listrado anil',
        size: 'P',
        sku: 'PIJ-ANIL-P',
        quantity: 1,
        lines: [{ orderSn: '251007H8W1R', quantity: 1 }],
      },
      {
        modelId: 2,
        variation: 'Listrado anil,M',
        color: 'Listrado anil',
        size: 'M',
        sku: 'PIJ-ANIL-M',
        quantity: 1,
        lines: [{ orderSn: '251007H8W1R', quantity: 1 }],
      },
    ],
  },
  {
    itemId: 102,
    name: 'Vestido midi estampa floral',
    imageUrl: mockVestidoSrc,
    location: 'Arara 1',
    quantity: 1,
    variants: [
      {
        modelId: 1,
        variation: 'Azul anil,M',
        color: 'Azul anil',
        size: 'M',
        sku: 'VMF-ANIL-M',
        quantity: 1,
        lines: [{ orderSn: '251008K7Q2M', quantity: 1 }],
      },
    ],
  },
  {
    itemId: 103,
    name: 'Conjunto moletom flanelado',
    imageUrl: mockPantalonaSrc,
    location: 'Caixa B (moletons)',
    quantity: 1,
    variants: [
      {
        modelId: 1,
        variation: 'Rosa,G',
        color: 'Rosa',
        size: 'G',
        sku: 'MOL-ROSA-G',
        quantity: 1,
        lines: [{ orderSn: '251008J3T9P', quantity: 1 }],
      },
    ],
  },
  {
    itemId: 104,
    name: 'Camisa de viscose manga longa',
    imageUrl: mockPantalonaSrc,
    location: 'Arara 1',
    quantity: 1,
    variants: [
      {
        modelId: 1,
        variation: 'Mostarda geométrica,GG',
        color: 'Mostarda geométrica',
        size: 'GG',
        sku: 'CAM-MOST-GG',
        quantity: 1,
        lines: [{ orderSn: '251007G2N5X', quantity: 1 }],
      },
    ],
  },
  {
    itemId: 105,
    name: 'Calça pantalona alfaiataria',
    imageUrl: mockPantalonaSrc,
    location: 'Arara 3',
    quantity: 1,
    variants: [
      {
        modelId: 1,
        variation: 'Caramelo,G1',
        color: 'Caramelo',
        size: 'G1',
        sku: 'PAN-CAR-G1',
        quantity: 1,
        lines: [{ orderSn: '251007F6B4D', quantity: 1 }],
      },
    ],
  },
  {
    itemId: 106,
    name: 'Blusa animal print',
    imageUrl: mockVestidoSrc,
    location: 'Arara 2',
    quantity: 1,
    variants: [
      {
        modelId: 1,
        variation: 'Bege onça,M',
        color: 'Bege onça',
        size: 'M',
        sku: 'BLU-ONCA-M',
        quantity: 1,
        lines: [{ orderSn: '251006D1C8V', quantity: 1 }],
      },
    ],
  },
];

export const DEMO_PACKING_NOTES: PackingNote[] = [
  {
    orderSn: '251008K7Q2M',
    kind: 'message',
    text: 'embalar para presente',
  },
  {
    orderSn: '251007H8W1R',
    kind: 'multi_item',
    text: '2 itens no mesmo pacote',
  },
];

export const DEMO_COLOR_HEX: Record<number, string> = {
  101: '#5B74BF',
  102: '#2F4A9A',
  103: '#E9A6B9',
  104: '#E3AE3A',
  105: '#9C6640',
  106: '#D8C2A3',
};
