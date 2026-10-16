import { Button } from '@/components/atoms/Button';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { Toast } from '@/components/molecules/Toast';
import { notify, notifyError, notifySuccess } from '@/lib/notify';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function AlertsSection() {
  return (
    <VitrineSection
      id="avisos"
      task="SHP-51"
      title="Toast e InlineAlert"
      note="Toasts no topo (não cobrem a nav inferior). Faixas info / atenção / erro / sucesso. Dispare os botões para ver o empilhamento ao vivo."
    >
      <VitrineGroup label="InlineAlert">
        <div className="flex max-w-lg flex-col gap-3">
          <InlineAlert tone="warn">Saldo de Ads dá para ~2 dias.</InlineAlert>
          <InlineAlert tone="info">Fotos 3:4 vendem mais.</InlineAlert>
          <InlineAlert tone="danger">A conexão caiu.</InlineAlert>
          <InlineAlert tone="ok">Tudo sincronizado.</InlineAlert>
        </div>
      </VitrineGroup>

      <VitrineGroup label="Toast (visual)">
        <Toast actionLabel="Desfazer" onAction={() => undefined} animate={false}>
          3 etiquetas prontas.
        </Toast>
      </VitrineGroup>

      <VitrineGroup label="Disparar (Sonner no topo)">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              notify('3 etiquetas prontas.', {
                action: { label: 'Desfazer', onClick: () => notify('Desfeito.') },
              })
            }
          >
            Com Desfazer
          </Button>
          <Button variant="soft" size="sm" onClick={() => notifySuccess('Peça publicada')}>
            Sucesso
          </Button>
          <Button variant="outline" size="sm" onClick={() => notifyError('Falha na sincronização')}>
            Erro
          </Button>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
