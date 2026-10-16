import type { Attribute, AttributeValue } from '@/lib/types';

export const ATTRIBUTE_FIXTURES: Attribute[] = [
  {
    id: 1,
    name: 'Tecido',
    mandatory: true,
    input: 'dropdown',
    valueType: null,
    units: [],
    options: [
      { id: 11, name: 'Viscose' },
      { id: 12, name: 'Malha' },
      { id: 13, name: 'Algodão' },
    ],
  },
  {
    id: 2,
    name: 'Ocasião',
    mandatory: true,
    input: 'multi_select',
    valueType: null,
    units: [],
    options: [
      { id: 21, name: 'Casual' },
      { id: 22, name: 'Festa' },
      { id: 23, name: 'Trabalho' },
    ],
  },
  {
    id: 3,
    name: 'Composição',
    mandatory: false,
    input: 'text',
    valueType: null,
    units: [],
    options: [],
  },
  {
    id: 4,
    name: 'Gramatura',
    mandatory: false,
    input: 'combo',
    valueType: 'FLOAT_TYPE',
    units: ['g/m²', 'oz'],
    options: [
      { id: 41, name: '180' },
      { id: 42, name: '220' },
    ],
  },
];

export const ATTRIBUTE_VALUES_SAMPLE: Record<number, AttributeValue[]> = {
  1: [{ attributeId: 1, valueId: 11 }],
  2: [
    { attributeId: 2, valueId: 21 },
    { attributeId: 2, valueId: 22 },
  ],
};
