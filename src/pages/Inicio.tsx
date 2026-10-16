import { useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Megaphone,
  MessageCircle,
  Package,
  Plus,
  Rocket,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { NAV_CATALOG, type NavId } from '@/app/nav';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ActiveCampaignsCard } from '@/components/organisms/ActiveCampaignsCard';
import { AlertChipButton, AlertStrip } from '@/components/organisms/AlertStrip';
import { ChatsWaitingCard } from '@/components/organisms/ChatsWaitingCard';
import {
  HomeGreeting,
  type HomeGreetingPill,
  type HomeGreetingShortcut,
} from '@/components/organisms/HomeGreeting';
import {
  INICIO_CAMPAIGNS,
  INICIO_CHATS,
  INICIO_CHART,
  INICIO_GOAL,
  INICIO_ORDERS,
} from '@/components/organisms/inicioFixtures';
import { LowStockCard } from '@/components/organisms/LowStockCard';
import { MoneyCard } from '@/components/organisms/MoneyCard';
import { OrdersToShipCard } from '@/components/organisms/OrdersToShipCard';
import { useCan, useMe } from '@/hooks/useAuth';
import { keys } from '@/hooks/keys';
import { useInicio } from '@/hooks/useInicio';
import { ApiError } from '@/lib/api';
import type { InicioAlert } from '@/lib/types';
import {
  alertCta,
  alertTone,
  buildDueLabel,
  buildInicioSubtitle,
  firstName,
  formatInicioDateLabel,
  formatMesLabel,
  greetingForHour,
  isExpedicaoInicio,
  shouldShowMoneyCard,
} from './inicioModel';

const RESULT_MESSAGES: Record<string, [ok: boolean, text: string]> = {
  ok: [true, 'Loja conectada! Agora é só usar.'],
  cancelada: [false, 'A conexão foi cancelada na Shopee.'],
  expirada: [false, 'O link de conexão expirou. Tente de novo.'],
  erro: [false, 'Não foi possível conectar a loja. Tente de novo.'],
};

const ALERT_ICON: Partial<Record<InicioAlert['type'], LucideIcon>> = {
  conexao_caida: Package,
  conexao_vencendo: Package,
  estoque_reposicao: Layers,
  prazo_envio: Package,
  chat_sem_resposta: MessageCircle,
  ads_saldo_baixo: Megaphone,
};

/**
 * Início admin (SHP-74) e Expedição (SHP-75).
 * Uma tela; seções seguem o que GET /inicio devolve (omitidas = sem permissão).
 * Expedição nunca renderiza MoneyCard / R$.
 */
export function InicioPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const me = useMe();
  const inicio = useInicio();
  const [params, setParams] = useSearchParams();

  const role = me.data?.role;
  const expedicao = isExpedicaoInicio(role);
  const canEditProducts = useCan('produtos.editar');
  const canBoost = useCan('turbinar.usar');
  const canCampaigns = useCan('campanhas.ver');

  // Volta da Shopee: /?conexao=ok
  const result = params.get('conexao');
  useEffect(() => {
    if (!result) return;
    const msg = RESULT_MESSAGES[result];
    if (msg) (msg[0] ? toast.success : toast.error)(msg[1], { id: 'conexao' });
    setParams({}, { replace: true });
    void qc.invalidateQueries({ queryKey: keys.connection });
    void qc.invalidateQueries({ queryKey: keys.inicio });
  }, [result, qc, setParams]);

  const go = useCallback(
    (id: NavId | 'produtos/nova', missingLabel: string) => {
      if (id === 'produtos/nova') {
        navigate('/produtos/nova');
        return;
      }
      const entry = NAV_CATALOG.find((e) => e.id === id);
      if (entry?.ready) {
        navigate(entry.to);
        return;
      }
      toast.message(`${missingLabel} em breve`, {
        description: 'Essa tela ainda está sendo costurada.',
      });
    },
    [navigate],
  );

  const name = firstName(me.data?.name);
  const summary = inicio.data;
  const loading = me.isPending || inicio.isPending;
  const error = inicio.error;

  const dateLabel = useMemo(() => formatInicioDateLabel(), []);
  const greeting = useMemo(() => greetingForHour(new Date().getHours()), []);
  const mesLabel = useMemo(() => formatMesLabel(), []);

  const subtitle = buildInicioSubtitle({
    expedicao,
    aEnviar: summary?.pedidos?.aEnviar,
    vencendoHoje: summary?.pedidos?.vencendoHoje,
  });

  const shortcuts = useMemo((): HomeGreetingShortcut[] | undefined => {
    if (expedicao) return undefined;
    const list: HomeGreetingShortcut[] = [];
    if (canEditProducts) {
      list.push({
        id: 'cad',
        label: 'Cadastrar peça',
        icon: Plus,
        variant: 'soft',
        onClick: () => go('produtos/nova', 'Cadastro'),
      });
    }
    if (canBoost) {
      list.push({
        id: 'turb',
        label: 'Turbinar',
        icon: Rocket,
        onClick: () => go('turbinar', 'Turbinar'),
      });
    }
    if (canCampaigns) {
      list.push({
        id: 'camp',
        label: 'Nova campanha',
        icon: Megaphone,
        onClick: () => go('campanhas', 'Campanhas'),
      });
    }
    return list.length > 0 ? list : undefined;
  }, [expedicao, canEditProducts, canBoost, canCampaigns, go]);

  const pills = useMemo((): HomeGreetingPill[] | undefined => {
    if (!expedicao || !summary?.pedidos) return undefined;
    const packed = Math.min(4, summary.pedidos.aEnviar);
    return [
      { id: 'coleta', label: 'Coleta hoje, 15h–18h', icon: Truck },
      {
        id: 'emb',
        label: packed === 1 ? '1 já embalado' : `${packed} já embalados`,
        icon: Package,
      },
    ];
  }, [expedicao, summary?.pedidos]);

  const showMoney = shouldShowMoneyCard(role, summary);
  const showPedidos = summary?.pedidos != null;
  const showEstoque = summary?.estoque != null;
  const showCampanhas = summary?.campanhas != null && !expedicao;
  const showConversas = summary?.conversas != null && !expedicao;
  const alerts = summary?.alertas?.length ? summary.alertas : [];

  const stockItems = useMemo(() => {
    const rows = summary?.estoque?.topAcabando ?? [];
    return rows.map((row, i) => ({
      id: row.sku ?? `${row.name}-${row.variacao ?? i}`,
      name: row.name,
      sku: row.sku,
      qty: row.qty,
      variacao: row.variacao,
      qtyTone: (row.qty <= 1 ? 'danger' : 'warn') as 'danger' | 'warn',
      qtyLabel: row.qty <= 0 ? 'Esgotou' : undefined,
    }));
  }, [summary?.estoque]);

  const orderPreview = useMemo(() => {
    if (!showPedidos || !summary?.pedidos) return [];
    const count = summary.pedidos.aEnviar;
    if (count <= 0) return [];
    // Lista ainda não vem do GET /inicio — preview do design até SHP-76+.
    return INICIO_ORDERS.slice(0, Math.min(count, INICIO_ORDERS.length)).map((o) => ({
      ...o,
      total: expedicao ? null : o.total,
      onClick: () => go('pedidos', 'Pedidos'),
    }));
  }, [showPedidos, summary?.pedidos, expedicao, go]);

  const packing =
    expedicao && summary?.pedidos && summary.pedidos.aEnviar > 0
      ? {
          packed: Math.min(4, summary.pedidos.aEnviar),
          total: summary.pedidos.aEnviar,
        }
      : undefined;

  const campaignPreview = useMemo(() => {
    if (!showCampanhas || !summary?.campanhas) return [];
    const n = summary.campanhas.ativas;
    if (n <= 0) return [];
    return INICIO_CAMPAIGNS.slice(0, Math.min(n, INICIO_CAMPAIGNS.length));
  }, [showCampanhas, summary?.campanhas]);

  const chatPreview = useMemo(() => {
    if (!showConversas || !summary?.conversas) return [];
    const n = summary.conversas.semResposta;
    if (n <= 0) return [];
    return INICIO_CHATS.slice(0, Math.min(n, INICIO_CHATS.length)).map((c) => ({
      ...c,
      onClick: () => go('conversas', 'Conversas'),
    }));
  }, [showConversas, summary?.conversas, go]);

  const onAlert = (alert: InicioAlert) => {
    const href = alert.href;
    if (!href) return;
    const entry = NAV_CATALOG.find((e) => e.to === href);
    if (entry?.ready || href === '/mais') {
      navigate(href);
      return;
    }
    toast.message('Em breve', { description: alert.title });
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      {loading ? (
        <div className="flex min-h-[min(50dvh,24rem)] w-full items-center justify-center py-10">
          <Spinner layout="stack" label="Carregando o início…" />
        </div>
      ) : error ? (
        <EmptyState
          align="start"
          illustration={null}
          title="Não deu para carregar o início"
          description={error instanceof ApiError ? error.message : 'Tente de novo em instantes.'}
          action={
            <Button variant="outline" onClick={() => void inicio.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <>
          <HomeGreeting
            dateLabel={dateLabel}
            name={name || 'olá'}
            greeting={greeting}
            subtitle={subtitle}
            shortcuts={shortcuts}
            pills={pills}
          />

          {alerts.length > 0 ? (
            <AlertStrip layout="scroll" bleed>
              {alerts.map((a) => (
                <AlertChipButton
                  key={a.id}
                  role="listitem"
                  tone={alertTone(a.severity, a.type)}
                  icon={ALERT_ICON[a.type] ?? Package}
                  cta={alertCta(a.type)}
                  onClick={() => onAlert(a)}
                >
                  {a.title}
                </AlertChipButton>
              ))}
            </AlertStrip>
          ) : null}

          {/* Mobile: pedidos logo abaixo da saudação. Desktop admin: pedidos | dinheiro. */}
          <div
            className={
              showMoney
                ? 'grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-5'
                : 'flex min-w-0 flex-col gap-4'
            }
          >
            {showPedidos && summary?.pedidos ? (
              <OrdersToShipCard
                count={summary.pedidos.aEnviar}
                dueLabel={buildDueLabel(summary.pedidos.vencendoHoje)}
                orders={orderPreview}
                showTotals={!expedicao}
                packing={packing}
                onViewAll={() => go('pedidos', 'Pedidos')}
                onPrintLabels={() => go('pedidos', 'Impressão de etiquetas')}
                onSeparacao={() => go('separacao', 'Separação')}
              />
            ) : null}

            {showMoney && summary?.dinheiro ? (
              <MoneyCard
                hoje={summary.dinheiro.hoje}
                seteDias={summary.dinheiro.seteDias}
                mes={summary.dinheiro.mes}
                mesLabel={mesLabel}
                aReceber={summary.dinheiro.aReceber}
                carteira={summary.dinheiro.carteira}
                adsGasto={summary.dinheiro.adsGasto}
                goal={{
                  ...INICIO_GOAL,
                  current: summary.dinheiro.mes,
                  label: `Meta de ${mesLabel.toLowerCase()}`,
                }}
                chart={INICIO_CHART}
                onFinanceiro={() => go('financeiro', 'Financeiro')}
              />
            ) : null}
          </div>

          {showEstoque || showCampanhas || showConversas ? (
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {showEstoque ? (
                <LowStockCard items={stockItems} onRepor={() => go('estoque', 'Estoque')} />
              ) : null}
              {showCampanhas && summary?.campanhas ? (
                <ActiveCampaignsCard
                  activeCount={summary.campanhas.ativas}
                  campaigns={campaignPreview}
                  onView={() => go('campanhas', 'Campanhas')}
                />
              ) : null}
              {showConversas && summary?.conversas ? (
                <ChatsWaitingCard
                  waitingCount={summary.conversas.semResposta}
                  chats={chatPreview}
                  onOpen={() => go('conversas', 'Conversas')}
                />
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
