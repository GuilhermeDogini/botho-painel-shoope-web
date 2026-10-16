/**
 * Dados de exemplo da Botho (mesmos nomes do design), para usar nas stories.
 * Não vêm da API: o Storybook não fala com o Nest.
 */

export const MOCK_PRODUCTS = [
  { id: 1, name: 'Vestido midi estampa floral', color: 'Azul anil', size: 'M', price: 129.9, stock: 4 },
  { id: 2, name: 'Pantalona caramelo', color: 'Caramelo', size: 'G1', price: 139.9, stock: 2 },
  { id: 3, name: 'Conjunto moletom flanelado', color: 'Rosa', size: 'P', price: 189.9, stock: 0 },
] as const;

export const MOCK_ORDERS = [
  { id: 'K7Q2M', buyer: 'Ana Paula', total: 119.9, due: 'Hoje, 18h' },
  { id: 'F6B4D', buyer: 'Juliana', total: 139.9, due: '10/10' },
  { id: 'P3X9A', buyer: 'Camila', total: 89.9, due: 'Amanhã' },
] as const;

export const MOCK_TEAM = [
  { name: 'Gisele Botho', role: 'Admin' },
  { name: 'Rafaela Souza', role: 'Expedição' },
  { name: 'Bruna Lima', role: 'Atendimento' },
  { name: 'Camila Rocha', role: 'Cadastro e estoque' },
  { name: 'Márcio Alves', role: 'Financeiro' },
] as const;

export const MOCK_COLORS = [
  { hex: '#E9A6B9', name: 'Rosa' },
  { hex: '#2F4A9A', name: 'Anil' },
  { hex: '#9C6640', name: 'Caramelo' },
  { hex: '#1D1512', name: 'Preto' },
  { hex: '#FFFFFF', name: 'Branco' },
  { hex: '#F3EBDF', name: 'Off-white' },
] as const;

export const MOCK_WALLET = {
  in: 3412.85,
  out: 1286.4,
  commission: 16.79,
  serviceFee: 4,
  shipping: 7.19,
  net: 91.92,
} as const;

/** Foto de exemplo (SVG do design). Use em Thumbnail. */
export { default as mockVestidoSrc } from '@/pages/dev/vitrine/assets/vestido-midi-anil.svg';
export { default as mockPantalonaSrc } from '@/pages/dev/vitrine/assets/pantalona-caramelo.svg';
