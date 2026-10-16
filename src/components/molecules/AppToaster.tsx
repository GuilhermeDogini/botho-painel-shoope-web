import { Toaster } from 'sonner';

/**
 * Toaster Botho (Sonner): no **topo**, empilha sem cobrir a navegação inferior do celular.
 * Offset abaixo da safe-area; z-index acima do shell (nav z-20).
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      offset={{ top: 'max(12px, env(safe-area-inset-top, 0px))' }}
      mobileOffset={{ top: 'max(12px, env(safe-area-inset-top, 0px))' }}
      gap={10}
      visibleToasts={4}
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: [
            'group/toast flex min-h-14 w-[min(100vw-32px,420px)] items-center gap-3 rounded-md bg-ink px-4 py-3.5',
            'text-sm font-semibold text-bg shadow-3 bt-toast-in motion-reduce:animate-none',
          ].join(' '),
          title: 'min-w-0 flex-1 leading-snug',
          description: 'text-bg/80 text-xs font-medium',
          actionButton:
            'inline-flex min-h-9 shrink-0 cursor-pointer items-center border-0 bg-transparent px-1 text-sm font-semibold text-bg underline underline-offset-3',
          cancelButton:
            'inline-flex min-h-9 shrink-0 cursor-pointer items-center border-0 bg-transparent px-1 text-sm font-semibold text-bg/80',
          closeButton:
            'absolute top-2 right-2 inline-flex size-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-bg/70 hover:bg-white/10 hover:text-bg',
          success: '[&_svg]:text-salvia dark:[&_svg]:text-[#3A5C42]',
          error: '[&_svg]:text-danger',
          info: '[&_svg]:text-anil',
          warning: '[&_svg]:text-mostarda',
        },
      }}
    />
  );
}
