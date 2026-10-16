import { ChevronRight, LogOut } from 'lucide-react';
import { Link } from 'react-router';
import { useShellOutlet } from '@/app/ShellRoute';
import { CountBadge } from '@/components/atoms/CountBadge';
import { Button } from '@/components/atoms/Button';

/**
 * Menu “Mais” do celular (MaisCel): lista o que não cabe na barra inferior.
 */
export function MorePage() {
  const { moreItems, onLogout } = useShellOutlet();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <div>
        <h1 className="font-display text-h2 font-bold">Mais</h1>
        <p className="mt-1 text-sm text-ink-2">Atalhos que não cabem na barra de baixo.</p>
      </div>

      {moreItems.length === 0 ? (
        <p className="rounded-md border border-line bg-surface p-4 text-sm text-muted">
          Nada por aqui ainda. Quando novas telas entrarem, aparecem nesta lista.
        </p>
      ) : (
        <ul className="m-0 list-none rounded-lg border border-line bg-surface p-0">
          {moreItems.map((item) => (
            <li key={item.id} className="border-b border-line last:border-b-0">
              <Link
                to={item.to}
                className="flex min-h-[60px] items-center gap-3 px-4 py-3 text-ink no-underline"
              >
                <item.icon
                  size={22}
                  strokeWidth={1.75}
                  className="shrink-0 text-brand-text"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{item.label}</span>
                  {item.moreSub ? (
                    <span className="block text-sm text-muted">{item.moreSub}</span>
                  ) : null}
                </span>
                <CountBadge value={item.count} />
                <ChevronRight size={16} strokeWidth={1.75} className="shrink-0 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Button variant="ghost" icon={LogOut} onClick={onLogout} className="justify-start text-danger-text">
        Sair
      </Button>
    </div>
  );
}
