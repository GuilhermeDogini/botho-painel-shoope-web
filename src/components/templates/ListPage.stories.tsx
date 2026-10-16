import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Calendar, Filter, Layers, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { Input } from '@/components/atoms/Input';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { TabItem, TabList } from '@/components/molecules/TabItem';
import { ListPage } from './ListPage';

const meta = {
  title: 'Templates/ListPage',
  component: ListPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Lista (SHP-63): título, ações, abas, filtros e conteúdo — como Pedidos.dc.html.

## Como testar
1. Troque as abas — o miolo e a contagem mudam.
2. Clique nos chips de filtro — ligam/desligam e filtram a lista.
3. Digite na busca — filtra por texto.
4. Viewport ~390: busca vira ícone; abas e chips rolam na horizontal.
        `,
      },
    },
  },
} satisfies Meta<typeof ListPage>;

export default meta;
type Story = StoryObj<typeof ListPage>;

type TabId = 'enviar' | 'coleta' | 'enviados' | 'entregues';

type PedidoDemo = {
  id: string;
  item: string;
  buyer: string;
  tab: TabId;
  venceHoje: boolean;
  multiItem: boolean;
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'enviar', label: 'A enviar' },
  { id: 'coleta', label: 'Coleta' },
  { id: 'enviados', label: 'Enviados' },
  { id: 'entregues', label: 'Entregues' },
];

const PEDIDOS: PedidoDemo[] = [
  { id: 'K7Q2M', item: 'Vestido midi floral', buyer: 'Ana Paula', tab: 'enviar', venceHoje: true, multiItem: false },
  { id: 'D1C8V', item: 'Blusa animal print', buyer: 'Mariana', tab: 'enviar', venceHoje: true, multiItem: true },
  { id: 'H8W1R', item: 'Pijama flanelado', buyer: 'Bruna', tab: 'enviar', venceHoje: false, multiItem: true },
  { id: 'A3B9C', item: 'Calça wide leg', buyer: 'Camila', tab: 'enviar', venceHoje: false, multiItem: false },
  { id: 'F2G4H', item: 'Conjunto linho', buyer: 'Débora', tab: 'enviar', venceHoje: false, multiItem: false },
  { id: 'J5K6L', item: 'Saia midi', buyer: 'Elena', tab: 'enviar', venceHoje: false, multiItem: false },
  { id: 'M7N8P', item: 'Blazer cropped', buyer: 'Fernanda', tab: 'coleta', venceHoje: false, multiItem: false },
  { id: 'Q9R0S', item: 'Regata ribana', buyer: 'Gisele', tab: 'coleta', venceHoje: false, multiItem: true },
  { id: 'T1U2V', item: 'Vestido envelope', buyer: 'Helena', tab: 'enviados', venceHoje: false, multiItem: false },
  { id: 'W3X4Y', item: 'Cropped linho', buyer: 'Iris', tab: 'enviados', venceHoje: false, multiItem: false },
  { id: 'Z5A6B', item: 'Macacão', buyer: 'Julia', tab: 'enviados', venceHoje: false, multiItem: true },
  { id: 'C7D8E', item: 'Blusa off-shoulder', buyer: 'Karen', tab: 'entregues', venceHoje: false, multiItem: false },
];

function PedidosDemo() {
  const [tab, setTab] = useState<TabId>('enviar');
  const [query, setQuery] = useState('');
  const [venceHoje, setVenceHoje] = useState(false);
  const [multiItem, setMultiItem] = useState(false);

  const counts = useMemo(() => {
    const map: Record<TabId, number> = { enviar: 0, coleta: 0, enviados: 0, entregues: 0 };
    for (const p of PEDIDOS) map[p.tab] += 1;
    return map;
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PEDIDOS.filter((p) => {
      if (p.tab !== tab) return false;
      if (venceHoje && !p.venceHoje) return false;
      if (multiItem && !p.multiItem) return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        p.item.toLowerCase().includes(q) ||
        p.buyer.toLowerCase().includes(q)
      );
    });
  }, [tab, query, venceHoje, multiItem]);

  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? tab;
  const venceCount = PEDIDOS.filter((p) => p.tab === tab && p.venceHoje).length;

  return (
    <ListPage
      title="Pedidos"
      description="Atualizado agora · sincronizado com a Shopee"
      actions={
        <>
          <div className="hidden min-w-[260px] sm:block">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <Input
                className="pl-10"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar nº, compradora ou peça"
                aria-label="Buscar pedidos"
              />
            </div>
          </div>
          <IconButton icon={Search} label="Buscar" className="sm:hidden" bordered />
        </>
      }
      tabs={
        <TabList aria-label="Status do pedido">
          {TABS.map((t) => (
            <TabItem
              key={t.id}
              active={tab === t.id}
              count={counts[t.id]}
              onClick={() => {
                setTab(t.id);
                setVenceHoje(false);
                setMultiItem(false);
              }}
            >
              {t.label}
            </TabItem>
          ))}
        </TabList>
      }
      filters={
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <FilterChipList aria-label="Filtros" layout="scroll">
            <FilterChip active={venceHoje} onClick={() => setVenceHoje((v) => !v)}>
              <AlertTriangle size={16} strokeWidth={1.75} aria-hidden />
              Vence hoje{venceCount > 0 ? ` · ${venceCount}` : ''}
            </FilterChip>
            <FilterChip active={multiItem} onClick={() => setMultiItem((v) => !v)}>
              <Layers size={16} strokeWidth={1.75} aria-hidden />
              Mais de 1 item
            </FilterChip>
            <FilterChip type="button" disabled title="Demo — filtros avançados nas telas de pedidos">
              <Calendar size={16} strokeWidth={1.75} aria-hidden />
              Últimos 7 dias
            </FilterChip>
            <FilterChip type="button" disabled title="Demo — filtros avançados nas telas de pedidos">
              <Filter size={16} strokeWidth={1.75} aria-hidden />
              Mais filtros
            </FilterChip>
          </FilterChipList>
        </div>
      }
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <span>
            Mostrando {rows.length} de {counts[tab]} em {tabLabel}
            {venceHoje || multiItem || query ? ' (filtrado)' : ''}
          </span>
          <span>
            20 por página · <b className="text-ink-2">Página 1</b>
          </span>
        </div>
      }
    >
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line-2 bg-surface p-8 text-center text-sm text-muted">
          Nenhum pedido nesta aba
          {venceHoje || multiItem || query ? ' com os filtros atuais' : ''}.
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div className="min-w-0">
                <div className="font-bold">{p.item}</div>
                <div className="text-muted">
                  {p.buyer} · <span className="tabular-nums">#{p.id}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.venceHoje ? (
                  <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-bold text-danger-text">
                    Vence hoje
                  </span>
                ) : null}
                {p.multiItem ? (
                  <span className="rounded-full bg-anil-soft px-2 py-0.5 text-xs font-bold text-anil-text">
                    +1 item
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </ListPage>
  );
}

export const Pedidos: Story = {
  name: 'Pedidos (demo)',
  render: () => <PedidosDemo />,
};
