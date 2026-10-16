import { BarChart } from '@/components/organisms/BarChart';
import { LineChart } from '@/components/organisms/LineChart';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const DAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
const MONTHS = ['mai', 'jun', 'jul', 'ago', 'set', 'out'];
const CAMP_DAYS = Array.from({ length: 14 }, (_, i) => `${i + 1}`);
const SALES = [180, 220, 90, 260, 200, 310, 150, 280, 190, 240, 120, 300, 270, 210];
const SPEND = [45, 80, 60, 140, 110, 190, 95, 220, 160, 250, 130, 280, 200, 170];

export function ChartsSection() {
  return (
    <VitrineSection
      id="charts"
      task="SHP-59"
      title="Gráficos"
      note="Barras e linha (SVG). Passe o mouse nas barras/pontos — o tooltip mostra o que aquele valor significa. Claro/escuro e 390 px."
    >
      <VitrineGroup label="Entradas × saídas · 7 dias">
        <div className="rounded-md border border-line bg-surface p-3 sm:p-4">
          <BarChart
            aria-label="Entradas e saídas dos últimos 7 dias"
            categories={DAYS}
            height={140}
            series={[
              { id: 'in', label: 'Entradas', tone: 'salvia', values: [520, 610, 480, 702, 640, 590, 550] },
              { id: 'out', label: 'Saídas', tone: 'mostarda', values: [140, 160, 118, 171, 150, 130, 145] },
            ]}
          />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Mês a mês">
        <div className="rounded-md border border-line bg-surface p-3 sm:p-4">
          <BarChart
            aria-label="Entradas, saídas e resultado de maio a outubro"
            categories={MONTHS}
            height={180}
            series={[
              { id: 'in', label: 'Entradas', tone: 'salvia', values: [6100, 8200, 10100, 12400, 16900, 5900] },
              { id: 'out', label: 'Saídas', tone: 'mostarda', values: [3200, 4100, 4500, 5200, 6100, 2800] },
              { id: 'net', label: 'Resultado', tone: 'brand', values: [2900, 4100, 5600, 7200, 10800, 3100] },
            ]}
          />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Gasto × vendas (campanha)">
        <div className="rounded-md border border-line bg-surface p-3 sm:p-4">
          <LineChart
            aria-label="Vendas geradas pelo anúncio e gasto diário"
            categories={CAMP_DAYS}
            height={200}
            yLabels={['R$ 300', 'R$ 200', 'R$ 100', 'R$ 0']}
            formatValue={(n) =>
              n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            }
            bars={{ id: 'sales', label: 'Vendas geradas pelo anúncio', tone: 'salvia', values: SALES }}
            series={[{ id: 'spend', label: 'Gasto por dia', tone: 'mostarda', values: SPEND }]}
          />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
