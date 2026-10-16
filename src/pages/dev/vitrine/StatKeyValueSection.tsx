import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { KeyValueList, KeyValueRow } from '@/components/molecules/KeyValueRow';
import { StatCard } from '@/components/molecules/StatCard';
import { MOCK_WALLET } from '@/stories/mocks';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function StatKeyValueSection() {
  return (
    <VitrineSection
      id="stat-keyvalue"
      task="SHP-50"
      title="StatCard e KeyValueRow"
      note="KPIs do Início/Financeiro e linhas de valor do pedido. Confira +, − e valores vazios (—)."
    >
      <VitrineGroup label="KPIs">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Vendido hoje"
            value={649.5}
            delta={{ label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp }}
          />
          <StatCard label="7 dias" value={4218.3} />
          <StatCard
            label="Outubro"
            value={5876.4}
            delta={{ label: '−8% vs. meta', tone: 'danger', icon: TrendingDown }}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatCard label="A receber" value={MOCK_WALLET.in} hint="em liberação pela Shopee" variant="soft" size="sm" />
          <StatCard
            label="Na carteira"
            value={MOCK_WALLET.out}
            hint="disponível para saque"
            variant="soft"
            size="sm"
            icon={Wallet}
          />
          <StatCard label="Sem permissão" value={null} hint="financeiro.ver ausente" variant="soft" size="sm" />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Valores do pedido">
        <KeyValueList aria-label="Valores do pedido" className="max-w-md rounded-md border border-line px-4">
          <KeyValueRow label="Valor da peça (bruto)" value={129.9} />
          <KeyValueRow
            label={
              <>
                Comissão Shopee <span className="text-muted">(14%)</span>
              </>
            }
            value={18.19}
            moneyKind="out"
            tone="danger"
          />
          <KeyValueRow label="Taxa por item vendido" value={4} moneyKind="out" tone="danger" />
          <KeyValueRow label="Frete" value={7.79} moneyKind="out" tone="danger" />
          <KeyValueRow
            label="Líquido a receber"
            hint="Liberado pela Shopee após a entrega · previsão 18/10"
            value={99.92}
            tone="ok"
            emphasis
            flush
          />
        </KeyValueList>
      </VitrineGroup>
    </VitrineSection>
  );
}
