import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { resolveNav, type NavId } from '@/app/nav';
import { GlobalConnectionBanner } from '@/components/organisms/GlobalConnectionBanner';
import { AppShell } from './AppShell';
import type { Permission, Role } from '@/lib/types';

const PERMS: Permission[] = [
  'pedidos.ver',
  'conversas.responder',
  'produtos.ver',
  'turbinar.usar',
  'estoque.repor',
  'campanhas.ver',
  'financeiro.ver',
  'equipe.gerir',
  'config.gerir',
];

const ROLES: { id: Role; label: string; name: string }[] = [
  { id: 'admin', label: 'Admin · dona', name: 'Gisele Botho' },
  { id: 'expedicao', label: 'Expedição', name: 'Rafaela Souza' },
  { id: 'atendimento', label: 'Atendimento', name: 'Bruna Lima' },
  { id: 'estoque', label: 'Cadastro e estoque', name: 'Camila Rocha' },
  { id: 'financeiro', label: 'Financeiro', name: 'Márcio Alves' },
];

const meta = {
  title: 'Templates/AppShell',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Moldura das telas logadas (SHP-61).

## Como deve funcionar
- **Desktop:** lateral 252 px (Logo + NavList + avatar/sair).
- **Celular:** TopBar + BottomNav (até 5, com **Mais**).
- **Faixa global** no topo quando a conexão cai.
- Menu filtrado por papel; Atendimento **sem** Produtos; só rotas \`ready\`.

## Como testar
1. Troque o papel no seletor — o menu muda.
2. Viewport ~390: barra de baixo.
3. Clique em Reconectar na faixa (demo).
4. Toolbar Tema.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function ShellDemo({
  role: initialRole = 'admin',
  showBanner = true,
  counts,
}: {
  role?: Role;
  showBanner?: boolean;
  counts?: Partial<Record<NavId, number>>;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const [path, setPath] = useState('/');
  const [bannerOn, setBannerOn] = useState(showBanner);
  const person = ROLES.find((r) => r.id === role) ?? ROLES[0];
  const nav = useMemo(() => resolveNav(role, PERMS, counts), [role, counts]);

  return (
    <div>
      <div className="border-b border-line bg-surface-2 px-4 py-2">
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">Papel:</span>
          <select
            className="min-h-10 rounded-sm border border-line-2 bg-surface px-2"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted">Só rotas prontas (Pedidos/Conversas ainda off).</span>
        </label>
      </div>
      <AppShell
        previewPath={path}
        onPreviewNavigate={setPath}
        user={{ name: person.name, roleLabel: person.label }}
        sideItems={nav.side}
        bottomItems={nav.bottom}
        onLogout={() => undefined}
        banner={
          <GlobalConnectionBanner
            visible={bannerOn}
            action={
              <button type="button" onClick={() => setBannerOn(false)}>
                Reconectar agora
              </button>
            }
          >
            A conexão com a Shopee venceu ontem. Pedidos, estoque e chat pararam de atualizar.
          </GlobalConnectionBanner>
        }
      >
        <div className="rounded-lg border border-line bg-surface p-6">
          <h1 className="font-display text-h2 font-bold">Conteúdo da tela</h1>
          <p className="mt-2 text-sm text-ink-2">
            Rota demo: <b>{path}</b>. Mais: {nav.more.map((i) => i.label).join(', ') || '—'}.
          </p>
        </div>
      </AppShell>
    </div>
  );
}

export const Padrao: Story = {
  name: 'Desktop + faixa',
  render: () => <ShellDemo />,
};

export const ComContadores: Story = {
  name: 'Com contadores (demo)',
  render: () => <ShellDemo counts={{ pedidos: 6, conversas: 3, estoque: 5 }} showBanner={false} />,
};
