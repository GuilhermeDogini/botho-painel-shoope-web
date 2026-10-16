import { Divider } from '@/components/atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Spinner } from '@/components/atoms/Spinner';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function FeedbackSection() {
  return (
    <VitrineSection
      id="feedback"
      task="SHP-47"
      title="Carregando e divisores"
      note="Skeleton e a linha costurando. Com movimento reduzido no sistema, nada anima: o skeleton fica liso e a linha, parada."
    >
      <VitrineGroup label="Costurando">
        <div className="flex flex-col gap-3">
          <Spinner />
          <Spinner label="Buscando pedidos na Shopee…" />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Skeleton (linha de peça)">
        <div className="flex max-w-md flex-col gap-3" aria-busy="true">
          {[80, 70].map((w) => (
            <div key={w} className="flex gap-3">
              <Skeleton className="h-16 w-12 shrink-0" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <Skeleton className="h-3.5" style={{ width: `${w}%` }} />
                <Skeleton className="h-3" style={{ width: `${w - 30}%` }} />
              </div>
            </div>
          ))}
          <Skeleton className="h-[130px] rounded-lg" />
        </div>
      </VitrineGroup>

      <VitrineGroup label="Divisores">
        <div className="flex max-w-md flex-col gap-4 text-sm text-muted">
          <span>Linha (padrão)</span>
          <Divider />
          <span>Pesponto</span>
          <Divider variant="stitch" />
          <span>Pesponto framboesa</span>
          <Divider variant="brand" />
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
