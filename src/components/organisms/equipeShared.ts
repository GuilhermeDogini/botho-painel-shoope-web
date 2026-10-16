import type { LucideIcon } from 'lucide-react';
import { MessageCircle, Shield, Shirt, Truck, Wallet } from 'lucide-react';
import type { TagProps } from '@/components/atoms/Tag';

/** Célula da matriz: Pode / Só vê / Não. */
export type MatrixCell = 'pode' | 've' | 'nao';

export const MATRIX_ROLES = [
  'Admin',
  'Expedição',
  'Atendimento',
  'Cadastro/Estoque',
  'Financeiro',
] as const;

export type MatrixRole = (typeof MATRIX_ROLES)[number];

export interface MatrixPermissionRow {
  id: string;
  label: string;
  area: string;
  /** Uma célula por papel, na ordem de `MATRIX_ROLES`. */
  cells: readonly [MatrixCell, MatrixCell, MatrixCell, MatrixCell, MatrixCell];
}

export interface PermissionMatrixData {
  roles: readonly MatrixRole[];
  permissions: readonly MatrixPermissionRow[];
}

/**
 * Matriz de permissões do design (Equipe.dc.html).
 * Y=pode, V=ve, N=nao — na ordem Admin, Expedição, Atendimento, Cadastro/Estoque, Financeiro.
 */
export const MATRIX: PermissionMatrixData = {
  roles: MATRIX_ROLES,
  permissions: [
    { id: 'ver-pedidos', label: 'Ver pedidos', area: 'Pedidos', cells: ['pode', 'pode', 've', 'nao', 've'] },
    {
      id: 'imprimir-etiquetas',
      label: 'Imprimir etiquetas e lista de separação',
      area: 'Pedidos',
      cells: ['pode', 'pode', 'nao', 'nao', 'nao'],
    },
    { id: 'cancelar-pedido', label: 'Cancelar pedido', area: 'Pedidos', cells: ['pode', 'nao', 'nao', 'nao', 'nao'] },
    {
      id: 'responder-conversas',
      label: 'Responder conversas e devoluções',
      area: 'Conversas',
      cells: ['pode', 'nao', 'pode', 'nao', 'nao'],
    },
    {
      id: 'cadastrar-pecas',
      label: 'Cadastrar e editar peças, variações e preços',
      area: 'Produtos',
      cells: ['pode', 'nao', 'nao', 'pode', 'nao'],
    },
    { id: 'repor-estoque', label: 'Repor estoque', area: 'Estoque', cells: ['pode', 'nao', 'nao', 'pode', 'nao'] },
    { id: 'turbinar', label: 'Turbinar peças', area: 'Turbinar', cells: ['pode', 'nao', 'nao', 'pode', 'nao'] },
    {
      id: 'criar-campanha',
      label: 'Criar campanha e mudar orçamento',
      area: 'Campanhas',
      cells: ['pode', 'nao', 'nao', 'nao', 've'],
    },
    {
      id: 'ver-financeiro',
      label: 'Ver valores em R$, extrato e relatórios',
      area: 'Financeiro',
      cells: ['pode', 'nao', 'nao', 'nao', 'pode'],
    },
    {
      id: 'convidar-equipe',
      label: 'Convidar e desativar pessoas',
      area: 'Equipe',
      cells: ['pode', 'nao', 'nao', 'nao', 'nao'],
    },
    {
      id: 'conexao-shopee',
      label: 'Conexão com a Shopee e dados da loja',
      area: 'Configurações',
      cells: ['pode', 'nao', 'nao', 'nao', 'nao'],
    },
  ],
};

export const CELL_LABEL: Record<MatrixCell, string> = {
  pode: 'Pode',
  ve: 'Só vê',
  nao: 'Não',
};

/** Rótulo longo na legenda / listas mobile (“Não acessa”). */
export const CELL_LABEL_LONG: Record<MatrixCell, string> = {
  pode: 'Pode',
  ve: 'Só vê',
  nao: 'Não acessa',
};

export interface RoleMeta {
  name: MatrixRole;
  tagTone: NonNullable<TagProps['tone']>;
  tagIcon: LucideIcon;
  /** Quem ocupa o papel (só texto de apoio no card). */
  peopleLabel?: string;
}

/** Metadados de papel para Tag / RoleCards (design). */
export const ROLE_META: readonly RoleMeta[] = [
  { name: 'Admin', tagTone: 'brand', tagIcon: Shield, peopleLabel: 'Gisele' },
  { name: 'Expedição', tagTone: 'info', tagIcon: Truck, peopleLabel: 'Rafaela, Jéssica' },
  { name: 'Atendimento', tagTone: 'ok', tagIcon: MessageCircle, peopleLabel: 'Bruna' },
  { name: 'Cadastro/Estoque', tagTone: 'warn', tagIcon: Shirt, peopleLabel: 'Camila' },
  { name: 'Financeiro', tagTone: 'neutral', tagIcon: Wallet, peopleLabel: 'Márcio (convite)' },
];

export interface DerivedRoleLists {
  pode: string[];
  ve: string[];
  nao: string[];
}

/** Agrupa labels de permissão por célula para um índice de papel. */
export function deriveRoleLists(
  roleIndex: number,
  matrix: PermissionMatrixData = MATRIX,
): DerivedRoleLists {
  const pode: string[] = [];
  const ve: string[] = [];
  const nao: string[] = [];

  for (const row of matrix.permissions) {
    const cell = row.cells[roleIndex];
    if (cell === 'pode') pode.push(row.label);
    else if (cell === 've') ve.push(row.label);
    else nao.push(row.label);
  }

  return { pode, ve, nao };
}
