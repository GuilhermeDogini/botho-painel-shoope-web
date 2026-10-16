import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Money } from '@/components/atoms/Money';
import { BottomSheet } from './BottomSheet';
import { ConfirmDialog } from './ConfirmDialog';
import { Modal } from './Modal';

const meta = {
  title: 'Organisms/Modal e ConfirmDialog',
  component: Modal,
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Título',
  },
  parameters: {
    docs: {
      description: {
        component: `
Modal (desktop), BottomSheet (celular) e ConfirmDialog (escolhe sozinho).

## Como deve funcionar
- **Modal:** centralizado, max 560 (ou \`wide\` 920). Foco preso, Esc / scrim / X fecham.
- **BottomSheet:** sobe de baixo, puxador, rodapé empilhado (ação principal em cima, como no design).
- **ConfirmDialog:** no celular usa BottomSheet; no desktop, Modal. \`tone="danger"\` = botão vermelho.
- \`summary\`: caixa de consequência / valor (ex.: "Pausar 3 peças?").

## Como testar
1. Story **Confirmar pausa**: abra, Tab cicla só dentro do diálogo, Esc fecha.
2. Story **Excluir (danger)**: botão vermelho distinto do "Voltar".
3. Story **BottomSheet**: force viewport ~390 px ou abra direto — sobe de baixo.
4. Tema claro/escuro; alvos ≥ 44 px nos botões.
        `,
      },
    },
    layout: 'padded',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmarPausa: Story = {
  render: function ConfirmPause() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Pausar 3 peças
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Pausar 3 peças?"
          summary="Elas somem da busca até você reativar."
          confirmLabel="Pausar 3 peças"
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const ExcluirDanger: Story = {
  render: function ConfirmDelete() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Excluir peça
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
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
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const ModalAberto: Story = {
  render: function ModalDemo() {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir modal
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Detalhes do envio"
          footer={
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Entendi
            </Button>
          }
        >
          <p className="text-sm text-ink-2">
            O modal prende o foco, fecha com Esc e com o X. No celular, use BottomSheet ou ConfirmDialog.
          </p>
        </Modal>
      </div>
    );
  },
};

export const BottomSheetDemo: Story = {
  name: 'BottomSheet',
  render: function SheetDemo() {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir folha
        </Button>
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title="Filtros"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Limpar
              </Button>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                Aplicar
              </Button>
            </>
          }
        >
          <p className="text-sm text-ink-2">Folha de baixo — mesma API do Modal, layout de celular.</p>
        </BottomSheet>
      </div>
    );
  },
};
