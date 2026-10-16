import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { Modal } from '@/components/organisms/Modal';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function DialogsSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <VitrineSection
      id="dialogs"
      task="SHP-56"
      title="Modal, BottomSheet e ConfirmDialog"
      note="ConfirmDialog escolhe BottomSheet no celular e Modal no desktop. Esc / scrim / X fecham; foco fica preso. Botão destrutivo é vermelho."
    >
      <VitrineGroup label="Abrir">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => setConfirmOpen(true)}>
            Confirmar pausa
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDangerOpen(true)}>
            Excluir (danger)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
            Modal
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
            BottomSheet
          </Button>
        </div>
      </VitrineGroup>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Pausar 3 peças?"
        summary="Elas somem da busca até você reativar."
        confirmLabel="Pausar 3 peças"
        onConfirm={() => setConfirmOpen(false)}
      />

      <ConfirmDialog
        open={dangerOpen}
        onOpenChange={setDangerOpen}
        title="Excluir esta peça?"
        summary={
          <>
            A ação não tem volta. Estoque e anúncio na Shopee também somem.
            <span className="mt-1 block font-bold text-ink">
              Vestido midi · <Money value={129.9} />
            </span>
          </>
        }
        confirmLabel="Excluir peça"
        tone="danger"
        onConfirm={() => setDangerOpen(false)}
      />

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Detalhes do envio"
        footer={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
            Entendi
          </Button>
        }
      >
        <p className="text-sm text-ink-2">Modal centralizado — use no desktop ou quando o conteúdo for curto.</p>
      </Modal>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Filtros"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSheetOpen(false)}>
              Limpar
            </Button>
            <Button variant="primary" size="sm" onClick={() => setSheetOpen(false)}>
              Aplicar
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-2">Folha de baixo — padrão no celular (ConfirmDialog já troca sozinho).</p>
      </BottomSheet>
    </VitrineSection>
  );
}
