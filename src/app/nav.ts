import {
  Home,
  Layers,
  ListChecks,
  Megaphone,
  Menu,
  MessageCircle,
  Package,
  Rocket,
  Settings,
  Shirt,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { Permission, Role } from '@/lib/types';

/** Identificador estável do item (filtro por papel + “Mais”). */
export type NavId =
  | 'inicio'
  | 'pedidos'
  | 'separacao'
  | 'conversas'
  | 'produtos'
  | 'turbinar'
  | 'estoque'
  | 'campanhas'
  | 'financeiro'
  | 'equipe'
  | 'config'
  | 'mais';

export interface NavEntry {
  id: NavId;
  to: string;
  label: string;
  icon: LucideIcon;
  /** Texto de apoio no menu Mais (celular). */
  moreSub?: string;
  permission?: Permission;
  /**
   * Papéis que **não** veem o item no menu, mesmo com a permissão
   * (ex.: Atendimento tem produtos.ver no back, mas o menu some Produtos — SHP-61).
   */
  hideForRoles?: ReadonlyArray<Role>;
  /**
   * `false` = tela ainda não existe: não entra no menu (evita link quebrado).
   * Quando a rota for criada, ligue para `true`.
   */
  ready: boolean;
  /** Separador visual acima (só na lateral). */
  sepBefore?: boolean;
}

/**
 * Catálogo do menu (design Nav.dc.html).
 * Só itens `ready` aparecem; o resto entra quando a tela existir.
 */
export const NAV_CATALOG: ReadonlyArray<NavEntry> = [
  /** Landing: admin e Expedição usam a mesma rota; a página ramifica pelo papel (SHP-74/75). */
  { id: 'inicio', to: '/', label: 'Início', icon: Home, ready: true },
  {
    id: 'pedidos',
    to: '/pedidos',
    label: 'Pedidos',
    icon: Package,
    permission: 'pedidos.ver',
    ready: true,
  },
  {
    id: 'separacao',
    to: '/separacao',
    label: 'Separação',
    icon: ListChecks,
    permission: 'pedidos.ver',
    ready: true,
  },
  {
    id: 'conversas',
    to: '/conversas',
    label: 'Conversas',
    icon: MessageCircle,
    permission: 'conversas.responder',
    ready: true,
  },
  {
    id: 'produtos',
    to: '/produtos',
    label: 'Produtos',
    icon: Shirt,
    permission: 'produtos.ver',
    /** Menu do Atendimento: Início, Pedidos, Conversas — sem Produtos (SHP-61). */
    hideForRoles: ['atendimento'],
    ready: true,
  },
  {
    id: 'turbinar',
    to: '/turbinar',
    label: 'Turbinar',
    icon: Rocket,
    permission: 'turbinar.usar',
    moreSub: 'Bump das peças',
    ready: true,
  },
  {
    id: 'estoque',
    to: '/estoque',
    label: 'Estoque',
    icon: Layers,
    permission: 'estoque.repor',
    moreSub: 'Variações acabando',
    ready: true,
  },
  {
    id: 'campanhas',
    to: '/campanhas',
    label: 'Campanhas',
    icon: Megaphone,
    permission: 'campanhas.ver',
    moreSub: 'Shopee Ads',
    ready: true,
  },
  {
    id: 'financeiro',
    to: '/financeiro',
    label: 'Financeiro',
    icon: Wallet,
    permission: 'financeiro.ver',
    moreSub: 'Carteira e extrato',
    ready: true,
  },
  {
    id: 'equipe',
    to: '/equipe',
    label: 'Equipe',
    icon: Users,
    permission: 'equipe.gerir',
    moreSub: 'Pessoas e permissões',
    sepBefore: true,
    ready: true,
  },
  {
    id: 'config',
    to: '/configuracoes',
    label: 'Configurações',
    icon: Settings,
    permission: 'config.gerir',
    moreSub: 'Conexão e loja',
    ready: true,
  },
];

/** Ordem da barra inferior por papel (sem o “Mais”; ele entra se sobrar item). */
const BOTTOM_BY_ROLE: Record<Role, ReadonlyArray<NavId>> = {
  admin: ['inicio', 'pedidos', 'conversas', 'produtos'],
  expedicao: ['inicio', 'pedidos', 'separacao'],
  atendimento: ['inicio', 'conversas', 'pedidos'],
  estoque: ['inicio', 'produtos', 'estoque'],
  financeiro: ['inicio', 'financeiro', 'campanhas'],
};

/** Ordem da lateral por papel (design). */
const SIDE_BY_ROLE: Record<Role, ReadonlyArray<NavId>> = {
  admin: [
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
  ],
  expedicao: ['inicio', 'pedidos', 'separacao', 'config'],
  atendimento: ['inicio', 'conversas', 'pedidos', 'config'],
  estoque: ['inicio', 'produtos', 'estoque', 'turbinar', 'config'],
  financeiro: ['inicio', 'financeiro', 'campanhas', 'config'],
};

export interface ResolvedNavItem {
  id: NavId;
  to: string;
  label: string;
  icon: LucideIcon;
  moreSub?: string;
  count?: number | null;
  sepBefore?: boolean;
}

export const MAIS_ITEM: ResolvedNavItem = {
  id: 'mais',
  to: '/mais',
  label: 'Mais',
  icon: Menu,
};

function canSee(
  entry: NavEntry,
  role: Role,
  permissions: ReadonlyArray<Permission>,
): boolean {
  if (!entry.ready) return false;
  if (entry.hideForRoles?.includes(role)) return false;
  if (entry.permission && !permissions.includes(entry.permission)) return false;
  return true;
}

function byIds(
  ids: ReadonlyArray<NavId>,
  role: Role,
  permissions: ReadonlyArray<Permission>,
  counts?: Partial<Record<NavId, number>>,
): ResolvedNavItem[] {
  const out: ResolvedNavItem[] = [];
  for (const id of ids) {
    const entry = NAV_CATALOG.find((e) => e.id === id);
    if (!entry || !canSee(entry, role, permissions)) continue;
    out.push({
      id: entry.id,
      to: entry.to,
      label: entry.label,
      icon: entry.icon,
      moreSub: entry.moreSub,
      sepBefore: entry.sepBefore,
      count: counts?.[entry.id] ?? null,
    });
  }
  return out;
}

/**
 * Monta lateral + abas de baixo + itens do “Mais”.
 * Só rotas prontas; sem link quebrado (SHP-61).
 */
export function resolveNav(
  role: Role,
  permissions: ReadonlyArray<Permission>,
  counts?: Partial<Record<NavId, number>>,
): {
  side: ResolvedNavItem[];
  bottom: ResolvedNavItem[];
  more: ResolvedNavItem[];
} {
  const side = byIds(SIDE_BY_ROLE[role] ?? SIDE_BY_ROLE.admin, role, permissions, counts);
  const preferredBottom = byIds(
    BOTTOM_BY_ROLE[role] ?? BOTTOM_BY_ROLE.admin,
    role,
    permissions,
    counts,
  );
  const bottomIds = new Set(preferredBottom.map((i) => i.id));
  const more = side.filter((i) => !bottomIds.has(i.id));

  let bottom = preferredBottom.slice(0, 5);
  if (more.length > 0) {
    bottom = [...preferredBottom.slice(0, 4), { ...MAIS_ITEM }];
  }

  return { side, bottom, more };
}
