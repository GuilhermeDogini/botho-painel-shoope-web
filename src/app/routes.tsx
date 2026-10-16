import { lazy, type ReactNode, Suspense } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { Spinner } from '@/components/legacy/ui';
import type { Permission } from '@/lib/types';
import { BoostPage } from '@/pages/Boost';
import { CampanhaDetalhePage } from '@/pages/CampanhaDetalhe';
import { CampanhasPage } from '@/pages/Campanhas';
import { ConfiguracoesPage } from '@/pages/Configuracoes';
import { ConversasPage } from '@/pages/Conversas';
import { EquipePage } from '@/pages/Equipe';
import { FinanceiroPage } from '@/pages/Financeiro';
import { NovaCampanhaPage } from '@/pages/NovaCampanha';
import { EstoquePage } from '@/pages/Estoque';
import { InicioPage } from '@/pages/Inicio';
import { InvitePage } from '@/pages/Invite';
import { LoginPage } from '@/pages/Login';
import { MorePage } from '@/pages/More';
import { NewProductPage } from '@/pages/NewProduct';
import { PedidoDetalhePage } from '@/pages/PedidoDetalhe';
import { PedidosPage } from '@/pages/Pedidos';
import { ProductsPage } from '@/pages/Products';
import { ResetPasswordPage } from '@/pages/ResetPassword';
import { SeparacaoPage } from '@/pages/Separacao';
import { PublicOnly, RequireAuth, RequirePermission } from './guards';
import { ShellRoute } from './ShellRoute';

// Vitrine só existe em desenvolvimento (o import some do build de produção).
const VitrinePage = import.meta.env.DEV ? lazy(() => import('@/pages/dev/Vitrine').then((m) => ({ default: m.VitrinePage }))) : null;

const guard = (permission: Permission, page: ReactNode) => <RequirePermission permission={permission}>{page}</RequirePermission>;

const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <PublicOnly>
        <LoginPage />
      </PublicOnly>
    ),
  },
  {
    path: '/redefinir-senha',
    element: (
      <PublicOnly>
        <ResetPasswordPage />
      </PublicOnly>
    ),
  },
  {
    path: '/convite',
    element: (
      <PublicOnly>
        <InvitePage />
      </PublicOnly>
    ),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <ShellRoute />,
        children: [
          { index: true, element: <InicioPage /> },
          { path: 'inicio', element: <Navigate to="/" replace /> },
          { path: 'mais', element: <MorePage /> },
          { path: 'pedidos', element: guard('pedidos.ver', <PedidosPage />) },
          { path: 'pedidos/:orderSn', element: guard('pedidos.ver', <PedidoDetalhePage />) },
          { path: 'separacao', element: guard('pedidos.ver', <SeparacaoPage />) },
          { path: 'produtos', element: guard('produtos.ver', <ProductsPage />) },
          { path: 'produtos/nova', element: guard('produtos.editar', <NewProductPage />) },
          { path: 'estoque', element: guard('estoque.repor', <EstoquePage />) },
          { path: 'turbinar', element: guard('turbinar.usar', <BoostPage />) },
          { path: 'campanhas', element: guard('campanhas.ver', <CampanhasPage />) },
          { path: 'campanhas/nova', element: guard('campanhas.editar', <NovaCampanhaPage />) },
          { path: 'campanhas/:id', element: guard('campanhas.ver', <CampanhaDetalhePage />) },
          { path: 'financeiro', element: guard('financeiro.ver', <FinanceiroPage />) },
          { path: 'equipe', element: guard('equipe.gerir', <EquipePage />) },
          { path: 'configuracoes', element: guard('config.gerir', <ConfiguracoesPage />) },
          { path: 'conversas', element: guard('conversas.responder', <ConversasPage />) },
        ],
      },
    ],
  },
  ...(VitrinePage
    ? [
        {
          path: '/vitrine',
          element: (
            <Suspense fallback={<Spinner />}>
              <VitrinePage />
            </Suspense>
          ),
        },
      ]
    : []),
  { path: '*', element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes);
