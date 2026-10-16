import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export interface DialogChromeProps {
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  showClose?: boolean;
  onClose?: () => void;
  /** Empilha botões em coluna (BottomSheet / Modal estreito). */
  stackFooter?: boolean;
  bodyClassName?: string;
}

/**
 * Cabeçalho + corpo + rodapé compartilhados por Modal e BottomSheet.
 * O corpo rola (`overflow-y-auto`); cabeçalho e rodapé ficam fixos —
 * sem isso o sheet no celular trava (conteúdo longo como PrintPreviewModal).
 */
export function DialogChrome({
  title,
  children,
  footer,
  showClose = true,
  onClose,
  stackFooter = false,
  bodyClassName,
}: DialogChromeProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-3 pb-3 sm:px-6 sm:pt-5">
        <Dialog.Title className="min-w-0 flex-1 font-sans text-h3 font-bold text-ink">{title}</Dialog.Title>
        {showClose ? <IconButton icon={X} label="Fechar" onClick={onClose} className="shrink-0" /> : null}
      </div>
      {children != null ? (
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain px-5 pt-1 pb-5 sm:px-6',
            '[-webkit-overflow-scrolling:touch]',
            bodyClassName,
          )}
        >
          {children}
        </div>
      ) : null}
      {footer != null ? (
        <div
          className={cn(
            'flex shrink-0 gap-2.5 border-t border-line bg-surface-2 px-5 py-4 sm:px-6',
            'pb-[max(1rem,env(safe-area-inset-bottom))]',
            stackFooter ? 'flex-col-reverse [&>*]:w-full' : 'flex-wrap items-center justify-end',
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

/** Caixa de resumo do ConfirmDialog (`.confirm-sum` do design). */
export function ConfirmSummary({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1.5 rounded-md bg-surface-2 p-4 text-sm text-ink-2', className)}>
      {children}
    </div>
  );
}
