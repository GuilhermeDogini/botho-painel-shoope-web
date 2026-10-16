import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { TabItem, TabList } from '@/components/molecules/TabItem';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function TabsFiltersSection() {
  const [tab, setTab] = useState('enviar');
  const [chip, setChip] = useState<string | null>('hoje');
  const [view, setView] = useState('grade');
  const [period, setPeriod] = useState('hoje');

  return (
    <VitrineSection
      id="abas-filtros"
      task="SHP-49"
      title="Abas, filtros e segmentos"
      note="O traço framboesa desliza entre as abas. TabList e FilterChipList (scroll) rolam só por dentro — a 390 px a página não rola de lado."
    >
      <VitrineGroup label="Abas">
        <TabList aria-label="Status dos pedidos" bleed>
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
      </VitrineGroup>

      <VitrineGroup label="Filtros e segmentos">
        <div className="flex flex-col gap-3">
          <FilterChipList layout="scroll" bleed aria-label="Filtros de pedidos">
            <FilterChip active={chip === 'hoje'} onClick={() => setChip(chip === 'hoje' ? null : 'hoje')}>
              Vence hoje · 2
            </FilterChip>
            <FilterChip active={chip === 'multi'} onClick={() => setChip(chip === 'multi' ? null : 'multi')}>
              Mais de 1 item
            </FilterChip>
            <FilterChip active={chip === 'atraso'} onClick={() => setChip(chip === 'atraso' ? null : 'atraso')}>
              Em atraso · 1
            </FilterChip>
            <FilterChip active={chip === 'turbo'} onClick={() => setChip(chip === 'turbo' ? null : 'turbo')}>
              Turbinadas
            </FilterChip>
          </FilterChipList>
          <div className="flex flex-wrap gap-3">
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
      </VitrineGroup>
    </VitrineSection>
  );
}
