import { Rocket } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Spinner } from '@/components/atoms/Spinner';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { SearchField } from '@/components/molecules/SearchField';
import { AutoBoostList } from '@/components/organisms/AutoBoostList';
import { BoostSlots } from '@/components/organisms/BoostSlots';
import { BoostSuggestions } from '@/components/organisms/BoostSuggestions';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Modal } from '@/components/organisms/Modal';
import { ProductLine } from '@/components/molecules/ProductLine';
import { ListPage } from '@/components/templates/ListPage';
import {
  useAddBoostQueue,
  useBoostAuto,
  useBoostDayResult,
  useBoosted,
  useBoostItems,
  useBoostSuggestions,
  useRemoveBoostQueue,
  useSetBoostAuto,
  useSetBoostQueue,
} from '@/hooks/useBoost';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useProductList } from '@/hooks/useProducts';
import { ApiError } from '@/lib/api';
import { duration, fold } from '@/lib/format';
import type { BoostSuggestion, ItemSummary } from '@/lib/types';

/**
 * Turbinar (SHP-105): vagas, modo automático, resultado do dia e sugestões.
 */
export function BoostPage() {
  const mobile = useIsMobile();
  const boosted = useBoosted();
  const autoQ = useBoostAuto();
  const dayQ = useBoostDayResult();
  const suggestionsQ = useBoostSuggestions();
  const products = useProductList();
  const boostItems = useBoostItems();
  const setAuto = useSetBoostAuto();
  const setQueue = useSetBoostQueue();
  const addQueue = useAddBoostQueue();
  const removeQueue = useRemoveBoostQueue();

  const [pickOpen, setPickOpen] = useState(false);
  const [pickMode, setPickMode] = useState<'boost' | 'queue'>('boost');
  const [pickQuery, setPickQuery] = useState('');
  const [picked, setPicked] = useState<number[]>([]);

  const slots = boosted.data?.slots ?? 5;
  const active = boosted.data?.items ?? [];
  const free = Math.max(0, slots - active.length);
  const activeIds = useMemo(() => new Set(active.map((a) => a.itemId)), [active]);
  const queueIds = useMemo(
    () => new Set(autoQ.data?.queue.map((q) => q.itemId) ?? []),
    [autoQ.data?.queue],
  );

  const catalog = useMemo(
    () => products.data?.pages.flatMap((p) => p.items) ?? [],
    [products.data],
  );

  const candidates = useMemo(() => {
    const q = fold(pickQuery);
    return catalog.filter((item) => {
      if (item.status === 'UNLIST') return false;
      if (pickMode === 'boost' && activeIds.has(item.itemId)) return false;
      if (pickMode === 'queue' && queueIds.has(item.itemId)) return false;
      if (!q) return true;
      return fold(item.name).includes(q) || fold(item.sku ?? '').includes(q);
    });
  }, [catalog, pickQuery, pickMode, activeIds, queueIds]);

  const nextInLabel = useMemo(() => {
    const items = boosted.data?.items ?? [];
    if (!items.length) return null;
    const min = Math.min(...items.map((i) => i.cooldownSeconds));
    return min > 0 ? duration(min) : null;
  }, [boosted.data?.items]);

  const openPick = (mode: 'boost' | 'queue') => {
    setPickMode(mode);
    setPicked([]);
    setPickQuery('');
    setPickOpen(true);
    if (products.hasNextPage && !products.isFetchingNextPage) {
      void products.fetchNextPage();
    }
  };

  const togglePick = (item: ItemSummary) => {
    setPicked((prev) => {
      if (prev.includes(item.itemId)) return prev.filter((id) => id !== item.itemId);
      if (pickMode === 'boost' && prev.length >= free) {
        toast.message(free ? `Só há ${free} vaga(s) livre(s)` : 'As 5 vagas estão ocupadas');
        return prev;
      }
      return [...prev, item.itemId];
    });
  };

  const confirmPick = () => {
    if (!picked.length) return;
    if (pickMode === 'boost') {
      boostItems.mutate(picked, {
        onSuccess: (r) => {
          if (r.success.length) toast.success(`${r.success.length} peça(s) turbinada(s) por 4 h`);
          for (const f of r.failed) toast.error(`#${f.itemId}: ${f.reason}`);
          setPickOpen(false);
        },
        onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
      });
      return;
    }
    const next = [...(autoQ.data?.queue.map((q) => q.itemId) ?? []), ...picked];
    setQueue.mutate(next, {
      onSuccess: () => {
        toast.success('Fila atualizada');
        setPickOpen(false);
      },
      onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
    });
  };

  const moveInQueue = (itemId: number, direction: -1 | 1) => {
    const ids = autoQ.data?.queue.map((q) => q.itemId) ?? [];
    const i = ids.indexOf(itemId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= ids.length) return;
    const next = [...ids];
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
    setQueue.mutate(next, {
      onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
    });
  };

  const onAddSuggestion = (s: BoostSuggestion) => {
    addQueue.mutate(
      { itemId: s.itemId, reason: s.reason },
      {
        onSuccess: () => toast.success('Adicionada à fila'),
        onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
      },
    );
  };

  const onBoostSuggestion = (s: BoostSuggestion) => {
    if (free <= 0) {
      toast.message('Sem vaga livre agora');
      return;
    }
    boostItems.mutate([s.itemId], {
      onSuccess: (r) => {
        if (r.success.length) toast.success('Peça turbinada por 4 h');
        for (const f of r.failed) toast.error(f.reason);
      },
      onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
    });
  };

  const usedText = `${active.length} de ${slots} vagas em uso`;
  const pickBusy = boostItems.isPending || setQueue.isPending;

  const pickBody = (
    <div className="flex flex-col gap-3">
      <SearchField
        value={pickQuery}
        onChange={(e) => setPickQuery(e.target.value)}
        placeholder="Buscar peça…"
        aria-label="Buscar peça"
      />
      {products.isPending ? <Spinner label="Carregando peças…" /> : null}
      <ul className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
        {candidates.map((item) => {
          const on = picked.includes(item.itemId);
          return (
            <li key={item.itemId}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${
                  on ? 'border-brand bg-brand-soft/40' : 'border-line'
                }`}
              >
                <Checkbox checked={on} onChange={() => togglePick(item)} aria-label={item.name} />
                <ProductLine name={item.name} imageSrc={item.imageUrl} size="sm" className="min-w-0 flex-1" />
              </label>
            </li>
          );
        })}
      </ul>
      {products.hasNextPage ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          loading={products.isFetchingNextPage}
          onClick={() => void products.fetchNextPage()}
        >
          Carregar mais
        </Button>
      ) : null}
    </div>
  );

  const pickFooter = (
    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={() => setPickOpen(false)} disabled={pickBusy}>
        Cancelar
      </Button>
      <Button
        type="button"
        variant="primary"
        icon={Rocket}
        loading={pickBusy}
        disabled={!picked.length}
        onClick={confirmPick}
      >
        {pickMode === 'boost'
          ? `Turbinar ${picked.length || ''}`.trim()
          : `Adicionar ${picked.length || ''} à fila`.trim()}
      </Button>
    </div>
  );

  return (
    <ListPage
      title="Turbinar"
      description={`Bump grátis · até ${slots} peças · 4 horas · ${usedText}`}
      actions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={Rocket}
          disabled={free <= 0}
          onClick={() => openPick('boost')}
        >
          Turbinar agora
        </Button>
      }
    >
      {boosted.isPending ? <Spinner label="Carregando vagas…" /> : null}
      {boosted.isError ? (
        <InlineAlert tone="danger">
          {boosted.error instanceof Error ? boosted.error.message : 'Erro ao carregar'}
        </InlineAlert>
      ) : null}

      {boosted.data ? (
        <BoostSlots
          slots={slots}
          items={active}
          fetchedAt={boosted.dataUpdatedAt}
          onPickFree={free > 0 ? () => openPick('boost') : undefined}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <AutoBoostList
          enabled={autoQ.data?.enabled ?? false}
          queue={autoQ.data?.queue ?? []}
          nextInLabel={autoQ.data?.enabled ? nextInLabel : null}
          saving={setAuto.isPending || setQueue.isPending || removeQueue.isPending}
          onToggle={(enabled) =>
            setAuto.mutate(enabled, {
              onSuccess: () => toast.success(enabled ? 'Automático ligado' : 'Automático desligado'),
              onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
            })
          }
          onRemove={(itemId) =>
            removeQueue.mutate(itemId, {
              onSuccess: () => toast.success('Removida da fila'),
              onError: (err) => toast.error(err instanceof ApiError ? err.message : err.message),
            })
          }
          onAdd={() => openPick('queue')}
          onMove={moveInQueue}
        />
        <BoostSuggestions
          day={dayQ.data}
          suggestions={suggestionsQ.data ?? []}
          busy={addQueue.isPending || boostItems.isPending}
          onAddToQueue={onAddSuggestion}
          onBoostNow={onBoostSuggestion}
        />
      </div>

      {mobile ? (
        <BottomSheet
          open={pickOpen}
          onOpenChange={setPickOpen}
          title={pickMode === 'boost' ? 'Escolher peças' : 'Adicionar à fila'}
          description={
            pickMode === 'boost'
              ? `Até ${free} vaga(s) livre(s).`
              : 'As peças entram no fim da fila automática.'
          }
          footer={pickFooter}
        >
          {pickBody}
        </BottomSheet>
      ) : (
        <Modal
          open={pickOpen}
          onOpenChange={setPickOpen}
          title={pickMode === 'boost' ? 'Escolher peças' : 'Adicionar à fila'}
          description={
            pickMode === 'boost'
              ? `Até ${free} vaga(s) livre(s).`
              : 'As peças entram no fim da fila automática.'
          }
          wide
          footer={pickFooter}
          stackFooter
        >
          {pickBody}
        </Modal>
      )}
    </ListPage>
  );
}
