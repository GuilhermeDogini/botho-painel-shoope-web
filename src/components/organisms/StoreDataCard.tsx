import { Pencil } from 'lucide-react';
import { useEffect, useState, type HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import type { ShopProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface StoreDataCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  profile: ShopProfile | null;
  saving?: boolean;
  onSave?: (next: Omit<ShopProfile, 'shopName' | 'region'>) => void | Promise<void>;
}

const FIELDS = [
  { key: 'shopeeUsername', label: 'Usuário na Shopee' },
  { key: 'contactEmail', label: 'E-mail de contato' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'pickupAddress', label: 'Endereço de coleta' },
  { key: 'pickupHours', label: 'Horário de coleta' },
] as const;

/**
 * Dados da loja: nome vem da Shopee; o resto é editável no painel (SHP-125).
 */
export function StoreDataCard({ profile, saving = false, onSave, className, ...rest }: StoreDataCardProps) {
  const titleId = 'store-data-title';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    shopeeUsername: '',
    contactEmail: '',
    whatsapp: '',
    pickupAddress: '',
    pickupHours: '',
  });

  useEffect(() => {
    if (!profile || editing) return;
    setDraft({
      shopeeUsername: profile.shopeeUsername ?? '',
      contactEmail: profile.contactEmail ?? '',
      whatsapp: profile.whatsapp ?? '',
      pickupAddress: profile.pickupAddress ?? '',
      pickupHours: profile.pickupHours ?? '',
    });
  }, [profile, editing]);

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cn('rounded-lg border border-line bg-surface p-5', className)}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id={titleId} className="font-display text-h2 font-bold">
          Dados da loja
        </h2>
        {editing ? (
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={saving || !onSave}
              onClick={() => {
                void (async () => {
                  try {
                    await onSave?.(draft);
                    setEditing(false);
                  } catch {
                    // O pai mostra o erro; o rascunho fica aberto.
                  }
                })();
              }}
            >
              Salvar
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" size="sm" icon={Pencil} onClick={() => setEditing(true)}>
            Editar
          </Button>
        )}
      </div>
      <dl className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-6">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted">Nome da loja</dt>
          <dd className="font-bold">{profile?.shopName ?? '—'}</dd>
        </div>
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted">{field.label}</dt>
            {editing ? (
              <dd>
                <input
                  className="min-h-10 w-full rounded-md border border-line bg-surface px-3 text-sm"
                  value={draft[field.key]}
                  aria-label={field.label}
                  onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                />
              </dd>
            ) : (
              <dd className="font-bold">{draft[field.key] || '—'}</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
