import { AlertTriangle, Calendar, Check, Clock, PauseCircle, Rocket, Scissors, TrendingUp, Truck } from 'lucide-react';
import { CountBadge } from '@/components/atoms/CountBadge';
import { Tag } from '@/components/atoms/Tag';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function TagsSection() {
  return (
    <VitrineSection
      id="etiquetas"
      task="SHP-44"
      title="Etiquetas e contadores"
      note="Etiqueta de roupa com furinho. Sempre texto + ícone, nunca só cor. Contador some quando é zero (ou mostra 0, se pedir)."
    >
      <VitrineGroup label="Tons">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="danger" icon={AlertTriangle}>
            Vence hoje
          </Tag>
          <Tag tone="warn" icon={Clock}>
            Amanhã
          </Tag>
          <Tag tone="ok" icon={Check}>
            Entregue
          </Tag>
          <Tag tone="info" icon={Truck}>
            Em trânsito
          </Tag>
          <Tag tone="brand" icon={Scissors}>
            A separar
          </Tag>
          <Tag tone="solid" icon={Rocket}>
            Turbinada
          </Tag>
          <Tag icon={PauseCircle}>Pausada</Tag>
          <Tag icon={Calendar}>10/10</Tag>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Grande">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="ok" size="lg" icon={TrendingUp}>
            Retorno 6,2× · Bom
          </Tag>
          <Tag tone="warn" size="lg" icon={Clock}>
            Saldo de Ads para ~2 dias
          </Tag>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Contadores">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2">
            A enviar <CountBadge value={6} active />
          </span>
          <span className="inline-flex items-center gap-2">
            Aguardando coleta <CountBadge value={4} />
          </span>
          <span className="inline-flex items-center gap-2">
            Enviados <CountBadge value={0} showZero />
          </span>
          <span className="inline-flex items-center gap-2">
            Devoluções <CountBadge value={0} /> <span className="text-muted">(zero some)</span>
          </span>
          <span className="inline-flex items-center gap-2">
            Conversas <CountBadge value={134} />
          </span>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
