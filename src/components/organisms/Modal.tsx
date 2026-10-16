import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DialogChrome } from './dialogShared';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Descrição acessível (leitores de tela). Opcional. */
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** max-width 920 px (padrão 560). */
  wide?: boolean;
  showClose?: boolean;
  /** Empilha o rodapé (útil em telas estreitas). */
  stackFooter?: boolean;
  className?: string;
}

/**
 * Modal centralizado (desktop). Foco preso, Esc fecha, scrim clica para fechar.
 * No celular prefira `BottomSheet` — ou use `ConfirmDialog`, que escolhe sozinho.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  wide = false,
  showClose = true,
  stackFooter = false,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-[var(--bt-scrim)] backdrop-blur-[6px]',
            'data-[state=open]:animate-[bt-scrim-in_.2s_ease-out]',
          )}
        />
        <Dialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            // Centro por inset + margin (sem translate): a animação de entrada pode usar transform sem pular.
            'fixed inset-0 z-50 m-auto flex h-fit max-h-[min(90dvh,880px)] w-[calc(100%-2rem)] flex-col overflow-hidden',
            'rounded-xl border border-line bg-surface shadow-3 outline-none',
            'data-[state=open]:animate-[bt-modal-in_.22s_cubic-bezier(.22,1,.36,1)]',
            wide ? 'max-w-[920px]' : 'max-w-[560px]',
            className,
          )}
        >
          {description ? <Dialog.Description className="sr-only">{description}</Dialog.Description> : null}
          <DialogChrome
            title={title}
            footer={footer}
            showClose={showClose}
            stackFooter={stackFooter}
            onClose={() => onOpenChange(false)}
          >
            {children}
          </DialogChrome>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
