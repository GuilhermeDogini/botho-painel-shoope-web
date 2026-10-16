import { TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ActiveCampaignsCard } from '@/components/organisms/ActiveCampaignsCard';
import { ChatsWaitingCard } from '@/components/organisms/ChatsWaitingCard';
import { HomeGreeting } from '@/components/organisms/HomeGreeting';
import {
  INICIO_ADMIN_SHORTCUTS,
  INICIO_CAMPAIGNS,
  INICIO_CHART,
  INICIO_CHATS,
  INICIO_EXP_PILLS,
  INICIO_GOAL,
  INICIO_ORDERS,
  INICIO_STOCK,
} from '@/components/organisms/inicioFixtures';
import { LowStockCard } from '@/components/organisms/LowStockCard';
import { MoneyCard } from '@/components/organisms/MoneyCard';
import { OrdersToShipCard } from '@/components/organisms/OrdersToShipCard';
import { VitrineGroup, VitrineSection } from './VitrineSection';

const demoNav = (label: string) => () => toast.message(label, { description: 'Navegação real nas páginas SHP-74+.' });

/**
 * Blocos do Início (SHP-73) — mesmos organismos do admin e da Expedição.
 */
export function InicioSection() {
  return (
    <VitrineSection
      id="inicio"
      task="SHP-73"
      title="Blocos do Início"
      note="HomeGreeting, pedidos a enviar, dinheiro, estoque, campanhas e chats. Props-only; páginas SHP-74/75 ligam os dados."
    >
      <VitrineGroup label="Saudação · admin">
        <HomeGreeting
          dateLabel="Quinta, 08/10"
          name="Gisele"
          subtitle="Você tem 6 pedidos para enviar hoje. Os 2 primeiros vencem às 18h."
          shortcuts={INICIO_ADMIN_SHORTCUTS}
        />
      </VitrineGroup>

      <VitrineGroup label="Saudação · expedição">
        <HomeGreeting
          dateLabel="Quinta, 08/10"
          name="Rafaela"
          subtitle="Hoje tem 6 pedidos para separar e embalar. Comece pelos 2 que vencem às 18h."
          pills={INICIO_EXP_PILLS}
        />
      </VitrineGroup>

      <VitrineGroup label="Pedidos a enviar (+ separação)">
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <OrdersToShipCard
            count={6}
            dueLabel="2 vencem hoje às 18h"
            orders={INICIO_ORDERS}
            onViewAll={demoNav('Ver todos os pedidos')}
            onPrintLabels={demoNav('Imprimir etiquetas')}
            onSeparacao={demoNav('Lista de separação')}
          />
          <OrdersToShipCard
            count={6}
            dueLabel="2 vencem hoje às 18h"
            orders={INICIO_ORDERS.slice(0, 3)}
            packing={{ packed: 4, total: 6 }}
            onViewAll={demoNav('Ver todos os pedidos')}
            onPrintLabels={demoNav('Imprimir etiquetas')}
            onSeparacao={demoNav('Lista de separação')}
          />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Dinheiro">
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <MoneyCard
            hoje={649.5}
            seteDias={4218.3}
            mes={5876.4}
            mesLabel="Outubro"
            aReceber={3412.85}
            carteira={1286.4}
            adsGasto={186.2}
            hojeDelta={{ label: '+12% vs. ontem', tone: 'ok', icon: TrendingUp }}
            goal={INICIO_GOAL}
            chart={INICIO_CHART}
            onFinanceiro={demoNav('Financeiro')}
          />
          <MoneyCard
            lockedMessage={
              <EmptyState
                illustration="carretel"
                align="center"
                title="Sem acesso ao financeiro"
                description="Peça o papel financeiro.ver para ver os números."
                className="w-full py-2"
              />
            }
          />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Estoque · campanhas · chats">
        <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LowStockCard items={INICIO_STOCK} onRepor={demoNav('Repor estoque')} />
          <ActiveCampaignsCard campaigns={INICIO_CAMPAIGNS} onView={demoNav('Campanhas')} />
          <ChatsWaitingCard
            chats={INICIO_CHATS.map((c) => ({
              ...c,
              onClick: demoNav(`Chat · ${c.name}`),
            }))}
            onOpen={demoNav('Abrir conversas')}
          />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
