export { Agulha } from './Agulha';
export { AraraVazia } from './AraraVazia';
export { Cabide } from './Cabide';
export { Carretel } from './Carretel';
export { Tesoura } from './Tesoura';
export type { IllustrationProps } from './types';

export const EMPTY_ILLUSTRATIONS = ['arara', 'cabide', 'carretel', 'tesoura', 'agulha'] as const;
export type EmptyIllustrationKind = (typeof EMPTY_ILLUSTRATIONS)[number];
