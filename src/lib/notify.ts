import { toast } from 'sonner';

export interface NotifyOptions {
  id?: string | number;
  description?: string;
  duration?: number;
  /** Botão de ação (ex.: "Desfazer"). */
  action?: { label: string; onClick: () => void };
}

/** Aviso Botho no topo (Sonner + AppToaster). */
export function notify(message: string, opts: NotifyOptions = {}) {
  return toast(message, {
    id: opts.id,
    description: opts.description,
    duration: opts.duration,
    action: opts.action
      ? {
          label: opts.action.label,
          onClick: opts.action.onClick,
        }
      : undefined,
  });
}

export function notifySuccess(message: string, opts: NotifyOptions = {}) {
  return toast.success(message, {
    id: opts.id,
    description: opts.description,
    duration: opts.duration,
    action: opts.action ? { label: opts.action.label, onClick: opts.action.onClick } : undefined,
  });
}

export function notifyError(message: string, opts: NotifyOptions = {}) {
  return toast.error(message, {
    id: opts.id,
    description: opts.description,
    duration: opts.duration ?? 6000,
    action: opts.action ? { label: opts.action.label, onClick: opts.action.onClick } : undefined,
  });
}
