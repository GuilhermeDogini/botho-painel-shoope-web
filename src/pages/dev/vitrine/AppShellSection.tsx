import { useMemo, useState } from 'react';
import { resolveNav } from '@/app/nav';
import { GlobalConnectionBanner } from '@/components/organisms/GlobalConnectionBanner';
import { AppShell } from '@/components/templates/AppShell';
import type { Permission, Role } from '@/lib/types';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const PERMS: Permission[] = [
  'pedidos.ver',
  'conversas.responder',
  'produtos.ver',
  'turbinar.usar',
  'config.gerir',
];

export function AppShellSection() {
  const [role, setRole] = useState<Role>('admin');
  const [path, setPath] = useState('/');
  const [bannerOn, setBannerOn] = useState(true);
  const nav = useMemo(() => resolveNav(role, PERMS), [role]);

  return (
    <VitrineSection
      id="appshell"
      task="SHP-61"
      title="AppShell"
      note="Lateral no desktop, TopBar + BottomNav + Mais no celular, faixa global no topo. Troque o papel. Só rotas prontas (sem link quebrado)."
    >
      <VitrineGroup label="Prévia interativa">
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-2 px-3 py-2 text-sm">
            <span className="font-semibold">Papel</span>
            <select
              className="min-h-10 rounded-sm border border-line-2 bg-surface px-2"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="expedicao">Expedição</option>
              <option value="atendimento">Atendimento</option>
              <option value="estoque">Estoque</option>
              <option value="financeiro">Financeiro</option>
            </select>
            <span className="text-xs text-muted">Rota demo: {path}</span>
          </div>
          <div className="max-h-[520px] overflow-auto">
            <AppShell
              previewPath={path}
              onPreviewNavigate={setPath}
              user={{
                name: role === 'admin' ? 'Gisele Botho' : 'Pessoa da equipe',
                roleLabel: role,
              }}
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
              <p className="text-sm text-ink-2">
                Conteúdo · Mais: {nav.more.map((i) => i.label).join(', ') || '—'}.
              </p>
            </AppShell>
          </div>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
