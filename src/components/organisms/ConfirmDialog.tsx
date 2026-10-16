import type { ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { BottomSheet } from './BottomSheet';
import { ConfirmSummary } from './dialogShared';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Caixa de consequência / valor ("Elas somem da busca…", "R$ 129,90"). */
  summary?: ReactNode;
  /** Conteúdo extra abaixo do resumo. */
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** `danger` = botão destrutivo (vermelho), distinto do cancelar. */
  tone?: 'primary' | 'danger';
  loading?: boolean;
  description?: string;
}

/**
 * Confirmação para ações com dinheiro ou irreversíveis.
 * Mesma API no celular (BottomSheet) e no desktop (Modal).
 * Esc fecha; botão destrutivo usa `variant="danger"`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  summary,
  children,
  confirmLabel,
  cancelLabel = 'Voltar',
  onConfirm,
  tone = 'primary',
  loading = false,
  description,
}: ConfirmDialogProps) {
  const mobile = useIsMobile();

  const footer = (
    <>
      <Button variant="outline" size="sm" disabled={loading} onClick={() => onOpenChange(false)}>
        {cancelLabel}
      </Button>
      <Button
        variant={tone === 'danger' ? 'danger' : 'primary'}
        size="sm"
        loading={loading}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
    </>
  );

  const body = (
    <>
      {summary != null ? <ConfirmSummary>{summary}</ConfirmSummary> : null}
      {children}
    </>
  );

  if (mobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        footer={footer}
      >
        {body}
      </BottomSheet>
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description} footer={footer}>
      {body}
    </Modal>
  );
}
