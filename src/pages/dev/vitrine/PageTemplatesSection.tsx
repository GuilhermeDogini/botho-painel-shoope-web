import { useMemo, useState } from 'react';
import { AlertTriangle, Layers, Printer, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { Tag } from '@/components/atoms/Tag';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { TabItem, TabList } from '@/components/molecules/TabItem';
import { DetailPage } from '@/components/templates/DetailPage';
import { ListPage } from '@/components/templates/ListPage';
import { PrintPage } from '@/components/templates/PrintPage';
import { WizardPage } from '@/components/templates/WizardPage';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const WIZ_STEPS = ['Fotos', 'Categoria', 'Detalhes', 'Variações', 'Preço', 'Revisar'];

type TabId = 'enviar' | 'enviados';

const LIST_ROWS: { id: string; item: string; tab: TabId; venceHoje: boolean; multi: boolean }[] = [
  { id: 'K7Q2M', item: 'Vestido midi floral', tab: 'enviar', venceHoje: true, multi: false },
  { id: 'D1C8V', item: 'Blusa animal print', tab: 'enviar', venceHoje: true, multi: true },
  { id: 'H8W1R', item: 'Pijama flanelado', tab: 'enviar', venceHoje: false, multi: true },
  { id: 'A3B9C', item: 'Calça wide leg', tab: 'enviar', venceHoje: false, multi: false },
  { id: 'T1U2V', item: 'Vestido envelope', tab: 'enviados', venceHoje: false, multi: false },
  { id: 'W3X4Y', item: 'Cropped linho', tab: 'enviados', venceHoje: false, multi: true },
];

function ListPageDemo() {
  const [tab, setTab] = useState<TabId>('enviar');
  const [venceHoje, setVenceHoje] = useState(false);
  const [multi, setMulti] = useState(false);

  const counts = useMemo(() => {
    const map: Record<TabId, number> = { enviar: 0, enviados: 0 };
    for (const r of LIST_ROWS) map[r.tab] += 1;
    return map;
  }, []);

  const rows = LIST_ROWS.filter((r) => {
    if (r.tab !== tab) return false;
    if (venceHoje && !r.venceHoje) return false;
    if (multi && !r.multi) return false;
    return true;
  });

  return (
    <ListPage
      title="Pedidos"
      description="Demo interativa · abas e filtros mudam a lista"
      actions={<IconButton icon={Search} label="Buscar" bordered />}
      tabs={
        <TabList aria-label="Status">
          <TabItem
            active={tab === 'enviar'}
            count={counts.enviar}
            onClick={() => {
              setTab('enviar');
              setVenceHoje(false);
              setMulti(false);
            }}
          >
            A enviar
          </TabItem>
          <TabItem
            active={tab === 'enviados'}
            count={counts.enviados}
            onClick={() => {
              setTab('enviados');
              setVenceHoje(false);
              setMulti(false);
            }}
          >
            Enviados
          </TabItem>
        </TabList>
      }
      filters={
        <FilterChipList aria-label="Filtros">
          <FilterChip active={venceHoje} onClick={() => setVenceHoje((v) => !v)}>
            <AlertTriangle size={16} strokeWidth={1.75} aria-hidden />
            Vence hoje
          </FilterChip>
          <FilterChip active={multi} onClick={() => setMulti((v) => !v)}>
            <Layers size={16} strokeWidth={1.75} aria-hidden />
            Mais de 1 item
          </FilterChip>
        </FilterChipList>
      }
      footer={<span>Mostrando {rows.length} pedido(s)</span>}
    >
      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-line-2 p-4 text-sm text-muted">
          Nenhum pedido com esses filtros.
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line bg-surface text-sm">
          {rows.map((r) => (
            <li key={r.id} className="flex justify-between gap-2 px-3 py-2.5">
              <span className="font-semibold">{r.item}</span>
              <span className="tabular-nums text-muted">#{r.id}</span>
            </li>
          ))}
        </ul>
      )}
    </ListPage>
  );
}

export function PageTemplatesSection() {
  const [step, setStep] = useState(1);

  return (
    <VitrineSection
      id="page-templates"
      task="SHP-63"
      title="Templates de página"
      note="ListPage, DetailPage, WizardPage e PrintPage. Troque abas e chips na ListPage — a lista muda."
    >
      <VitrineGroup label="ListPage (interativa)">
        <div className="rounded-lg border border-line bg-bg p-4 md:p-6">
          <ListPageDemo />
        </div>
      </VitrineGroup>

      <VitrineGroup label="DetailPage">
        <div className="rounded-lg border border-line bg-bg p-4 md:p-6">
          <DetailPage
            backLabel="Pedidos"
            onBack={() => undefined}
            title="Pedido #251008K7Q2M"
            badges={
              <Tag tone="danger" icon={AlertTriangle}>
                Enviar até hoje
              </Tag>
            }
            description="Pago em 08/10 · Ana Paula"
            actions={
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={Printer}
                onClick={() => undefined}
                title="PDF real = SHP-79/84; aqui só o casco do detalhe"
              >
                Imprimir
              </Button>
            }
            sidebar={<div className="rounded-md border border-line bg-surface p-4 text-sm">Lateral</div>}
          >
            <div className="rounded-md border border-line bg-surface p-4 text-sm">Principal</div>
          </DetailPage>
        </div>
      </VitrineGroup>

      <VitrineGroup label="WizardPage">
        <div className="rounded-lg border border-line bg-bg p-4 md:p-6">
          <WizardPage
            title="Cadastrar peça"
            draftStatus="Rascunho salvo às 10:48"
            steps={WIZ_STEPS}
            currentStep={step}
            onStepClick={setStep}
            disableBack={step <= 1}
            onPrevious={() => setStep((s) => Math.max(1, s - 1))}
            onSaveDraft={() => undefined}
            onPrimary={() => setStep((s) => Math.min(WIZ_STEPS.length, s + 1))}
            primaryLabel={step >= WIZ_STEPS.length ? 'Publicar' : 'Continuar'}
            primaryShowChevron={step < WIZ_STEPS.length}
          >
            <p className="text-sm text-muted">
              Passo {step}: {WIZ_STEPS[step - 1]}
            </p>
          </WizardPage>
        </div>
      </VitrineGroup>

      <VitrineGroup label="PrintPage (A4)">
        <div className="overflow-auto rounded-lg border border-line bg-[#E9E1D6] p-4">
          <PrintPage
            className="origin-top scale-[0.55] sm:scale-75"
            title="Lista de separação"
            meta="08/10/2026 · 6 pedidos · 7 peças"
            pageLabel="Página 1 de 1"
          >
            <p className="text-sm">Linhas da separação (demo).</p>
          </PrintPage>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
