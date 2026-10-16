import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DialogChrome } from './dialogShared';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  showClose?: boolean;
  className?: string;
}

/**
 * Folha que sobe de baixo (celular). Mesma API do `Modal` (sem `wide` / `stackFooter`).
 * Foco preso, Esc fecha, scrim clica para fechar. Rodapé empilhado em coluna.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showClose = true,
  className,
}: BottomSheetProps) {
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
            // Altura limitada + cadeia min-h-0: o miolo do DialogChrome rola de verdade no iOS/Android.
            'fixed inset-x-0 bottom-0 z-50 flex min-h-0 w-full flex-col overflow-hidden',
            'h-auto max-h-[min(92dvh,880px)]',
            'rounded-t-[24px] border border-line border-b-0 bg-surface shadow-3 outline-none',
            'data-[state=open]:animate-[bt-sheet-in_.28s_cubic-bezier(.22,1,.36,1)]',
            className,
          )}
        >
          <div className="flex shrink-0 justify-center pt-2.5" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-line-2" />
          </div>
          {description ? <Dialog.Description className="sr-only">{description}</Dialog.Description> : null}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <DialogChrome
              title={title}
              footer={footer}
              showClose={showClose}
              stackFooter
              onClose={() => onOpenChange(false)}
            >
              {children}
            </DialogChrome>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
