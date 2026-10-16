import { Clock, Layers, Link2, MessageCircle, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Switch } from '@/components/atoms/Switch';
import type { NotificationKind, NotificationPrefView } from '@/lib/types';
import { cn } from '@/lib/utils';

const ICONS: Record<NotificationKind, { icon: LucideIcon; className: string }> = {
  STOCK_LOW: { icon: Layers, className: 'text-mostarda-text' },
  CHAT_UNANSWERED: { icon: MessageCircle, className: 'text-brand-text' },
  SHIP_DEADLINE: { icon: Clock, className: 'text-danger-text' },
  CONNECTION: { icon: Link2, className: 'text-anil-text' },
};

export interface NotificationSettingsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: ReadonlyArray<NotificationPrefView>;
  disabled?: boolean;
  onChange: (next: NotificationPrefView) => void;
}

/**
 * Notificações por tipo × canal (celular e e-mail). SHP-125.
 */
export function NotificationSettings({
  items,
  disabled = false,
  onChange,
  className,
  ...rest
}: NotificationSettingsProps) {
  const titleId = 'notification-settings-title';

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn('rounded-lg border border-line bg-surface px-5 py-5', className)}
    >
      <h2 id={titleId} className="font-display text-h2 font-bold">
        Notificações
      </h2>
      <p className="mb-2 text-sm text-muted">Escolha o que te avisa e por onde.</p>
      <ul className="m-0 list-none p-0">
        {items.map((item) => {
          const visual = ICONS[item.kind];
          const Icon = visual.icon;
          return (
            <li
              key={item.kind}
              className="flex flex-wrap items-center gap-3.5 border-b border-line py-3.5 last:border-b-0"
            >
              <Icon size={18} className={cn('shrink-0', visual.className)} aria-hidden />
              <div className="min-w-[180px] flex-1">
                <div className="font-bold">{item.label}</div>
                <div className="text-sm text-muted">{item.description}</div>
              </div>
              <Switch
                label="Celular"
                checked={item.push}
                disabled={disabled}
                onCheckedChange={(push) => onChange({ ...item, push })}
              />
              <Switch
                label="E-mail"
                checked={item.email}
                disabled={disabled}
                onCheckedChange={(email) => onChange({ ...item, email })}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
