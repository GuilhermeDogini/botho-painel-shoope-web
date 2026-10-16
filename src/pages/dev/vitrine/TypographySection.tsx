import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Heading } from '@/components/atoms/Heading';
import { Money } from '@/components/atoms/Money';
import { Text } from '@/components/atoms/Text';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const SCALE = [
  ['xl · 64 / 800', <Heading key="xl" level={2} size="xl">R$ 1.234</Heading>],
  ['big · 44', <Heading key="big" level={2} size="big">6 pedidos</Heading>],
  ['h1 · 30', <Heading key="h1" level={1}>Pedidos</Heading>],
  ['h2 · 22', <Heading key="h2" level={2}>Lista de separação</Heading>],
  ['h3 · 17 (interface)', <Heading key="h3" level={3}>Estoque acabando</Heading>],
  ['corpo · 15', <Text key="body">Você tem 6 pedidos para enviar hoje.</Text>],
  ['small · 13', <Text key="small" size="small" tone="muted">Pago em 08/10 às 09:12</Text>],
  ['eyebrow · 12', <Eyebrow key="eyebrow">Crédito de Ads</Eyebrow>],
] as const;

const STATEMENT = [
  { label: 'Venda #K7Q2M', value: 119.9, kind: 'in' },
  { label: 'Comissão da Shopee', value: 16.79, kind: 'out' },
  { label: 'Taxa de serviço', value: 4, kind: 'out' },
  { label: 'Frete (parte da loja)', value: 7.19, kind: 'out' },
  { label: 'Gasto com Ads (crédito)', value: 1286.4, kind: 'out', plain: true },
] as const;

export function TypographySection() {
  return (
    <VitrineSection
      id="tipografia"
      task="SHP-45"
      title="Tipografia e dinheiro"
      note="Heading (xl, big, h1, h2, h3), Eyebrow e Text. Money: números tabulares, sem quebra, sinal em texto e cor por tipo."
    >
      <VitrineGroup label="Escala">
        <div className="divide-y divide-line">
          {SCALE.map(([label, node]) => (
            <div key={label} className="flex items-baseline gap-4 py-3 first:pt-0">
              <span className="w-28 shrink-0 font-mono text-xs text-muted">{label}</span>
              <div className="min-w-0 overflow-hidden">{node}</div>
            </div>
          ))}
        </div>
      </VitrineGroup>

      <VitrineGroup label="Tons de texto">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <Text as="span" tone="soft">Apoio</Text>
          <Text as="span" tone="muted">Legenda</Text>
          <Text as="span" tone="brand" weight="bold">Destaque</Text>
          <Text as="span" tone="ok" weight="bold">Tudo certo</Text>
          <Text as="span" tone="warn" weight="bold">Atenção</Text>
          <Text as="span" tone="info" weight="bold">Informação</Text>
          <Text as="span" tone="danger" weight="bold">Urgente</Text>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Dinheiro em coluna (extrato)">
        <div className="max-w-md rounded-md border border-line">
          {STATEMENT.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 text-sm last:border-0">
              <span className="min-w-0 truncate">{row.label}</span>
              <Money value={row.value} kind={row.kind} plain={'plain' in row} className="font-bold" />
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 bg-surface-2 px-4 py-2.5 text-sm">
            <span className="font-bold">Ficou com a loja</span>
            <Money value={91.92} className="font-bold" />
          </div>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Valor grande e valor escondido">
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col gap-1">
            <Eyebrow>Entrou no período</Eyebrow>
            <Money value={3412.85} kind="in" className="font-display text-[32px] leading-none font-bold tracking-[-.02em]" />
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow>Saldo negativo</Eyebrow>
            <Money value={-42.5} className="font-display text-[32px] leading-none font-bold tracking-[-.02em]" />
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow>Sem financeiro.ver</Eyebrow>
            <Money value={undefined} className="font-display text-[32px] leading-none font-bold" />
          </div>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
