import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { FilterChip, FilterChipList } from './FilterChip';
import { SegmentedControl } from './SegmentedControl';
import { TabItem, TabList } from './TabItem';

const meta = {
  title: 'Molecules/Abas e filtros',
  component: TabList,
  parameters: {
    docs: {
      description: {
        component: `
Abas com contador, chips de filtro e controle segmentado.

## Como deve funcionar
- **TabItem / TabList:** o traço framboesa **desliza** até a aba ativa (300 ms); \`CountBadge\` fica framboesa quando ativa. A fila rola **dentro** do TabList, sem empurrar a página. Com movimento reduzido no SO, o traço pula sem animar.
- **FilterChip / FilterChipList:** pílula; ativa = fundo ink. \`layout="scroll"\` para uma linha no celular.
- **SegmentedControl:** Grade/Lista, períodos etc. (\`role=radiogroup\`).

## Como testar
1. Toolbar **Tema** claro/escuro — chip ativo (ink) e aba ativa legíveis nos dois.
2. Story **Fila estreita (390)**: redimensione o canvas ~390 px e role as abas/chips — a **página** não deve rolar de lado.
3. Teclado: Tab até uma aba/chip/segmento; setas no radiogroup; Enter/Espaço ativa.
4. Contadores: aba ativa com badge framboesa; zero some (exceto se \`showZero\`).
        `,
      },
    },
  },
  args: { 'aria-label': 'Status dos pedidos', bleed: false },
  argTypes: {
    children: { control: false, table: { disable: true } },
    bleed: { control: 'boolean' },
  },
} satisfies Meta<typeof TabList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Abas: Story = {
  render: function TabsDemo(args) {
    const [tab, setTab] = useState('enviar');
    return (
      <TabList {...args}>
        <TabItem active={tab === 'enviar'} count={6} onClick={() => setTab('enviar')}>
          A enviar
        </TabItem>
        <TabItem active={tab === 'coleta'} count={4} onClick={() => setTab('coleta')}>
          Aguardando coleta
        </TabItem>
        <TabItem active={tab === 'enviados'} count={12} onClick={() => setTab('enviados')}>
          Enviados
        </TabItem>
        <TabItem active={tab === 'devolucao'} count={0} showZero onClick={() => setTab('devolucao')}>
          Devoluções
        </TabItem>
      </TabList>
    );
  },
};

export const FiltrosESegmentos: Story = {
  args: { 'aria-label': '—' },
  render: function FiltersDemo() {
    const [chip, setChip] = useState<string | null>('hoje');
    const [view, setView] = useState('grade');
    const [period, setPeriod] = useState('hoje');
    const toggle = (id: string) => setChip((c) => (c === id ? null : id));

    return (
      <div className="flex max-w-xl flex-col gap-4">
        <FilterChipList aria-label="Filtros de pedidos">
          <FilterChip active={chip === 'hoje'} onClick={() => toggle('hoje')}>
            Vence hoje · 2
          </FilterChip>
          <FilterChip active={chip === 'multi'} onClick={() => toggle('multi')}>
            Mais de 1 item
          </FilterChip>
          <FilterChip active={chip === 'atraso'} onClick={() => toggle('atraso')}>
            Em atraso · 1
          </FilterChip>
        </FilterChipList>

        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            aria-label="Visualização"
            value={view}
            onValueChange={setView}
            options={[
              { value: 'grade', label: 'Grade', icon: LayoutGrid },
              { value: 'lista', label: 'Lista', icon: List },
            ]}
          />
          <SegmentedControl
            aria-label="Período"
            value={period}
            onValueChange={setPeriod}
            options={[
              { value: 'hoje', label: 'Hoje' },
              { value: '7d', label: '7 dias' },
              { value: 'mes', label: 'Mês' },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const FilaEstreita390: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Simula o celular: container 390 px. Role abas e chips — o scroll fica no componente (`overflow-x`), não na página.',
      },
    },
  },
  args: { 'aria-label': 'Status', bleed: true },
  render: function NarrowDemo(args) {
    const [tab, setTab] = useState('enviar');
    const [chip, setChip] = useState('hoje');
    return (
      <div className="w-[390px] max-w-full overflow-hidden rounded-md border border-line bg-bg p-4">
        <TabList {...args} className="mb-3">
          <TabItem active={tab === 'enviar'} count={6} onClick={() => setTab('enviar')}>
            A enviar
          </TabItem>
          <TabItem active={tab === 'coleta'} count={4} onClick={() => setTab('coleta')}>
            Aguardando coleta
          </TabItem>
          <TabItem active={tab === 'enviados'} count={12} onClick={() => setTab('enviados')}>
            Enviados
          </TabItem>
          <TabItem active={tab === 'cancelados'} count={3} onClick={() => setTab('cancelados')}>
            Cancelados
          </TabItem>
          <TabItem active={tab === 'devolucao'} count={2} onClick={() => setTab('devolucao')}>
            Devoluções
          </TabItem>
        </TabList>
        <FilterChipList layout="scroll" bleed aria-label="Filtros">
          <FilterChip active={chip === 'hoje'} onClick={() => setChip('hoje')}>
            Vence hoje · 2
          </FilterChip>
          <FilterChip active={chip === 'multi'} onClick={() => setChip('multi')}>
            Mais de 1 item
          </FilterChip>
          <FilterChip active={chip === 'atraso'} onClick={() => setChip('atraso')}>
            Em atraso · 1
          </FilterChip>
          <FilterChip active={chip === 'turbo'} onClick={() => setChip('turbo')}>
            Turbinadas
          </FilterChip>
          <FilterChip active={chip === 'foto'} onClick={() => setChip('foto')}>
            Sem foto
          </FilterChip>
        </FilterChipList>
      </div>
    );
  },
};
