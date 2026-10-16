import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Casca comum dos cards do Início (surface + borda + sombra). */
export function InicioCard({
  stitch = false,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & { stitch?: boolean }) {
  return (
    <section
      {...rest}
      className={cn(
        'min-w-0 overflow-x-hidden rounded-lg border border-line bg-surface p-4 shadow-1 sm:p-5',
        stitch && 'stitch',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function InicioCardHeader({
  titleId,
  title,
  icon: Icon,
  iconClassName,
  action,
  className,
}: {
  titleId: string;
  title: ReactNode;
  icon?: LucideIcon;
  iconClassName?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-3.5 flex min-w-0 items-center justify-between gap-3', className)}>
      <h3 id={titleId} className="flex min-w-0 items-center gap-2 text-[17px] leading-snug font-bold text-ink">
        {Icon ? <Icon size={20} strokeWidth={1.75} aria-hidden className={cn('shrink-0', iconClassName)} /> : null}
        <span className="truncate">{title}</span>
      </h3>
      {action}
    </div>
  );
}

/** Link-botão “Ver / Abrir / Repor” do design. */
export function InicioLinkButton({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-text hover:text-brand-hover',
        className,
      )}
    >
      {children}
      <ChevronRight size={16} strokeWidth={2} aria-hidden className="shrink-0" />
    </button>
  );
}
