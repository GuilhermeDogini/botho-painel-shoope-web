import { LayoutGrid, List, Pause, Play, Plus, Rocket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Spinner } from '@/components/atoms/Spinner';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { FormField } from '@/components/molecules/FormField';
import { SearchField } from '@/components/molecules/SearchField';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { BulkActionBar } from '@/components/organisms/BulkActionBar';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { ConfirmSummary } from '@/components/organisms/dialogShared';
import { Modal } from '@/components/organisms/Modal';
import { ProductCard } from '@/components/organisms/ProductCard';
import { ProductRow } from '@/components/organisms/ProductRow';
import { isProductPaused, type ProductItem } from '@/components/organisms/productShared';
import { VariationGrid, buildVariationGrid, type VariationGridChange } from '@/components/organisms/VariationGrid';
import { ListPage } from '@/components/templates/ListPage';
import { useBoosted, useBoostItems } from '@/hooks/useBoost';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  useProduct,
  useProductList,
  useUnlistProducts,
  useUpdatePrice,
  useUpdateStock,
} from '@/hooks/useProducts';
import { fold, parseMoney } from '@/lib/format';
import type { ItemSummary } from '@/lib/types';

type ProductFilter = 'todas' | 'ativas' | 'pausadas' | 'baixo' | 'turbo';
type ProductView = 'grid' | 'list';

const LOW_STOCK_AT = 5;

const FILTERS: { id: ProductFilter; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'ativas', label: 'Ativas' },
  { id: 'pausadas', label: 'Pausadas' },
  { id: 'baixo', label: 'Estoque baixo' },
  { id: 'turbo', label: 'Turbinadas' },
];

function toProductItem(item: ItemSummary, boostedIds: ReadonlySet<number>): ProductItem {
  const stockTotal = item.hasVariations ? (item.stockTotal ?? null) : (item.stock ?? null);
  const price = item.hasVariations ? (item.priceRange?.min ?? item.price) : item.price;
  const priceMax = item.hasVariations ? (item.priceRange?.max ?? null) : null;
  const low = stockTotal != null && stockTotal > 0 && stockTotal <= LOW_STOCK_AT ? 1 : 0;

  return {
    itemId: item.itemId,
    name: item.name,
    imageUrl: item.imageUrl,
    categoryName: item.categoryName,
    price,
    priceMax: priceMax != null && price != null && priceMax > price ? priceMax : undefined,
    stockTotal,
    sold30d: item.sold30d,
    status: item.status,
    boosted: boostedIds.has(item.itemId),
    lowStockVariations: low,
  };
}

function matchesFilter(item: ProductItem, filter: ProductFilter): boolean {
  switch (filter) {
    case 'todas':
      return true;
    case 'ativas':
      return !isProductPaused(item.status);
    case 'pausadas':
      return isProductPaused(item.status);
    case 'baixo':
      return (item.lowStockVariations ?? 0) > 0 || (item.stockTotal != null && item.stockTotal <= 0);
    case 'turbo':
      return Boolean(item.boosted) && !isProductPaused(item.status);
    default:
      return true;
  }
}

/**
 * Página Produtos (SHP-96): grade/lista, filtros, seleção e ações em lote.
 */
export function ProductsPage() {
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const listQ = useProductList();
  const boostedQ = useBoosted();
  const unlist = useUnlistProducts();
  const boostItems = useBoostItems();

  const [view, setView] = useState<ProductView>('grid');
  const [filter, setFilter] = useState<ProductFilter>('todas');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pauseIds, setPauseIds] = useState<number[]>([]);
  const [stockItemId, setStockItemId] = useState<number | null>(null);

  const boostedIds = useMemo(
    () => new Set((boostedQ.data?.items ?? []).map((b) => b.itemId)),
    [boostedQ.data],
  );

  const summaries = useMemo(
    () => listQ.data?.pages.flatMap((p) => p.items) ?? [],
    [listQ.data],
  );
  const total = listQ.data?.pages[0]?.total ?? summaries.length;

  const products = useMemo(
    () => summaries.map((s) => toProductItem(s, boostedIds)),
    [summaries, boostedIds],
  );

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const p of products) {
      if (p.categoryName) names.add(p.categoryName);
    }
    return [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  const counts = useMemo(() => {
    const c: Record<ProductFilter, number> = {
      todas: products.length,
      ativas: 0,
      pausadas: 0,
      baixo: 0,
      turbo: 0,
    };
    for (const p of products) {
      if (!isProductPaused(p.status)) c.ativas += 1;
      if (isProductPaused(p.status)) c.pausadas += 1;
      if (matchesFilter(p, 'baixo')) c.baixo += 1;
      if (matchesFilter(p, 'turbo')) c.turbo += 1;
    }
    return c;
  }, [products]);

  const visible = useMemo(() => {
    const q = fold(query);
    return products.filter((p) => {
      if (!matchesFilter(p, filter)) return false;
      if (category && p.categoryName !== category) return false;
      if (q && !fold(`${p.name} ${p.categoryName ?? ''}`).includes(q)) return false;
      return true;
    });
  }, [products, filter, category, query]);

  const byId = useMemo(() => new Map(products.map((p) => [p.itemId, p])), [products]);

  useEffect(() => {
    setSelectedIds([]);
  }, [filter, category, query]);

  const setSelected = (itemId: number, selected: boolean) => {
    setSelectedIds((ids) =>
      selected ? (ids.includes(itemId) ? ids : [...ids, itemId]) : ids.filter((id) => id !== itemId),
    );
  };

  const askPause = (ids: number[]) => {
    if (!ids.length) return;
    setPauseIds(ids);
  };

  const selectedProducts = useMemo(
    () => selectedIds.map((id) => byId.get(id)).filter((p): p is ProductItem => Boolean(p)),
    [selectedIds, byId],
  );
  const selectedPaused = selectedProducts.filter((p) => isProductPaused(p.status));
  const selectedActive = selectedProducts.filter((p) => !isProductPaused(p.status));

  const reactivating =
    pauseIds.length > 0 &&
    pauseIds.every((id) => {
      const p = byId.get(id);
      return Boolean(p && isProductPaused(p.status));
    });

  const confirmPause = () => {
    const ids = [...pauseIds];
    if (!ids.length) return;
    unlist.mutate(
      { itemIds: ids, unlist: !reactivating },
      {
        onSuccess: () => {
          setPauseIds([]);
          setSelectedIds([]);
          toast.success(
            reactivating
              ? ids.length > 1
                ? `${ids.length} peças reativadas.`
                : 'Peça reativada. Já aparece na Shopee.'
              : ids.length > 1
                ? `${ids.length} peças pausadas.`
                : 'Peça pausada.',
          );
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const onBoost = (ids: number[]) => {
    const active = ids.filter((id) => {
      const p = byId.get(id);
      return p && !isProductPaused(p.status);
    });
    if (!active.length) {
      toast.message('Selecione peças ativas para turbinar.');
      return;
    }
    boostItems.mutate(active, {
      onSuccess: () => {
        setSelectedIds([]);
        toast.success(active.length === 1 ? 'Peça turbinada' : `${active.length} peças turbinadas`);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const onDuplicate = (item: ProductItem) => {
    toast.message(`Duplicar “${item.name}” entra no assistente de cadastro (em breve).`);
  };

  if (listQ.isPending && !listQ.data) {
    return (
      <div className="flex min-h-[calc(100dvh-9.5rem)] w-full flex-col items-center justify-center px-4 md:min-h-[calc(100dvh-6rem)]">
        <Spinner layout="stack" label="Buscando produtos na Shopee…" />
      </div>
    );
  }

  return (
    <>
      <ListPage
        title="Produtos"
        description={listQ.data ? `${total} peça(s) na loja` : undefined}
        actions={
          <>
            <SegmentedControl
              aria-label="Visualização"
              value={view}
              onValueChange={(v) => setView(v as ProductView)}
              options={[
                { value: 'grid', label: 'Grade', icon: LayoutGrid },
                { value: 'list', label: 'Lista', icon: List },
              ]}
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/produtos/nova')}
            >
              <span className="sm:hidden">Nova</span>
              <span className="hidden sm:inline">Cadastrar</span>
            </Button>
          </>
        }
        filters={
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <SearchField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery('')}
                placeholder="Buscar peça"
                aria-label="Buscar peça"
                className="sm:max-w-xs"
              />
              <Select
                value={category || '__all__'}
                onValueChange={(v) => setCategory(v === '__all__' ? '' : v)}
                aria-label="Categoria"
                placeholder="Todas as categorias"
                wrapperClassName="sm:max-w-[220px]"
                options={[
                  { value: '__all__', label: 'Todas as categorias' },
                  ...categories.map((c) => ({ value: c, label: c })),
                ]}
              />
            </div>
            <FilterChipList layout="scroll" bleed aria-label="Filtros de produtos">
              {FILTERS.map((f) => (
                <FilterChip
                  key={f.id}
                  active={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label} · {counts[f.id]}
                </FilterChip>
              ))}
            </FilterChipList>
          </div>
        }
      >
        {listQ.isError ? (
          <EmptyState
            align="start"
            illustration={null}
            title="Não deu para carregar os produtos"
            description={listQ.error.message}
            action={
              <Button variant="outline" onClick={() => void listQ.refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : !products.length ? (
          <EmptyState
            illustration="cabide"
            title="Nenhuma peça na loja ainda"
            description="Cadastre a primeira para ela aparecer aqui e na Shopee."
            action={
              <Button icon={Plus} onClick={() => navigate('/produtos/nova')}>
                Cadastrar o primeiro
              </Button>
            }
          />
        ) : !visible.length ? (
          <EmptyState
            illustration="cabide"
            title="Nada neste filtro"
            description="Tente outra busca ou limpe os filtros."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setFilter('todas');
                  setCategory('');
                  setQuery('');
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visible.map((item) => (
              <ProductCard
                key={item.itemId}
                item={item}
                selected={selectedIds.includes(item.itemId)}
                onSelectedChange={(sel) => setSelected(item.itemId, sel)}
                onStock={() => setStockItemId(item.itemId)}
                onBoost={() => onBoost([item.itemId])}
                onDuplicate={() => onDuplicate(item)}
                onPause={() => askPause([item.itemId])}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visible.map((item) => (
              <ProductRow
                key={item.itemId}
                item={item}
                selected={selectedIds.includes(item.itemId)}
                onSelectedChange={(sel) => setSelected(item.itemId, sel)}
                onStock={() => setStockItemId(item.itemId)}
                onBoost={() => onBoost([item.itemId])}
                onDuplicate={() => onDuplicate(item)}
                onPause={() => askPause([item.itemId])}
              />
            ))}
          </div>
        )}

        {listQ.hasNextPage ? (
          <Button
            variant="outline"
            className="w-full"
            loading={listQ.isFetchingNextPage}
            onClick={() => void listQ.fetchNextPage()}
          >
            Carregar mais
          </Button>
        ) : null}
      </ListPage>

      <BulkActionBar
        count={selectedIds.length}
        label={
          selectedIds.length === 1
            ? '1 peça selecionada'
            : `${selectedIds.length} peças selecionadas`
        }
        onClear={() => setSelectedIds([])}
      >
        {selectedActive.length > 0 ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={Rocket}
            loading={boostItems.isPending}
            onClick={() => onBoost(selectedActive.map((p) => p.itemId))}
          >
            Turbinar
          </Button>
        ) : null}
        {selectedActive.length > 0 ? (
          <Button
            type="button"
            size="sm"
            variant="primary"
            icon={Pause}
            onClick={() => askPause(selectedActive.map((p) => p.itemId))}
          >
            {selectedActive.length === 1 ? 'Pausar' : `Pausar ${selectedActive.length}`}
          </Button>
        ) : null}
        {selectedPaused.length > 0 ? (
          <Button
            type="button"
            size="sm"
            variant="primary"
            icon={Play}
            onClick={() => askPause(selectedPaused.map((p) => p.itemId))}
          >
            {selectedPaused.length === 1 ? 'Reativar' : `Reativar ${selectedPaused.length}`}
          </Button>
        ) : null}
      </BulkActionBar>

      <ConfirmDialog
        open={pauseIds.length > 0}
        onOpenChange={(open) => {
          if (!open) setPauseIds([]);
        }}
        title={
          reactivating
            ? pauseIds.length > 1
              ? `Reativar ${pauseIds.length} peças?`
              : 'Reativar esta peça?'
            : pauseIds.length > 1
              ? `Pausar ${pauseIds.length} peças?`
              : 'Pausar esta peça?'
        }
        summary={
          <ConfirmSummary>
            {reactivating
              ? pauseIds.length > 1
                ? 'Elas voltam a aparecer na busca da Shopee com o estoque atual.'
                : 'Ela volta a aparecer na busca da Shopee com o estoque atual.'
              : 'Elas somem da busca da Shopee até você reativar. Pedidos pagos continuam normais. Turbinadas perdem a vaga.'}
          </ConfirmSummary>
        }
        confirmLabel={
          reactivating
            ? pauseIds.length > 1
              ? `Reativar ${pauseIds.length}`
              : 'Reativar'
            : pauseIds.length > 1
              ? `Pausar ${pauseIds.length} peças`
              : 'Pausar peça'
        }
        tone={reactivating ? 'primary' : 'danger'}
        loading={unlist.isPending}
        onConfirm={confirmPause}
      >
        {pauseIds.length <= 3 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
            {pauseIds.map((id) => (
              <li key={id}>{byId.get(id)?.name ?? `#${id}`}</li>
            ))}
          </ul>
        ) : null}
      </ConfirmDialog>

      <StockEditor
        itemId={stockItemId}
        summary={stockItemId != null ? summaries.find((s) => s.itemId === stockItemId) : undefined}
        mobile={mobile}
        onClose={() => setStockItemId(null)}
      />

    </>
  );
}

function StockEditor({
  itemId,
  summary,
  mobile,
  onClose,
}: {
  itemId: number | null;
  summary: ItemSummary | undefined;
  mobile: boolean;
  onClose: () => void;
}) {
  const open = itemId != null;
  const detail = useProduct(itemId);
  const updateStock = useUpdateStock();
  const updatePrice = useUpdatePrice();
  const [simpleStock, setSimpleStock] = useState('');
  const [simplePrice, setSimplePrice] = useState('');

  useEffect(() => {
    if (!summary || summary.hasVariations) return;
    setSimpleStock(summary.stock != null ? String(summary.stock) : '');
    setSimplePrice(summary.price != null ? String(summary.price).replace('.', ',') : '');
  }, [summary]);

  const title = summary?.name ?? 'Estoque e preço';
  const saving = updateStock.isPending || updatePrice.isPending;

  const onSaveGrid = (changes: VariationGridChange[], mode: 'stock' | 'price') => {
    if (itemId == null || !changes.length) return;
    if (mode === 'stock') {
      updateStock.mutate(
        { itemId, updates: changes.map((c) => ({ modelId: c.modelId, stock: c.value })) },
        {
          onSuccess: () => {
            toast.success('Estoque atualizado na Shopee');
            onClose();
          },
          onError: (err) => toast.error(err.message),
        },
      );
    } else {
      updatePrice.mutate(
        { itemId, updates: changes.map((c) => ({ modelId: c.modelId, price: c.value })) },
        {
          onSuccess: () => {
            toast.success('Preço atualizado na Shopee');
            onClose();
          },
          onError: (err) => toast.error(err.message),
        },
      );
    }
  };

  const onSaveSimple = () => {
    if (itemId == null) return;
    const stock = Number(simpleStock.trim());
    const price = parseMoney(simplePrice);
    const jobs: Promise<unknown>[] = [];
    if (Number.isInteger(stock) && stock >= 0 && stock !== summary?.stock) {
      jobs.push(updateStock.mutateAsync({ itemId, stock }));
    }
    if (Number.isFinite(price) && price > 0 && price !== summary?.price) {
      jobs.push(updatePrice.mutateAsync({ itemId, price }));
    }
    if (!jobs.length) {
      onClose();
      return;
    }
    void Promise.all(jobs)
      .then(() => {
        toast.success('Atualizado na Shopee');
        onClose();
      })
      .catch((err: Error) => toast.error(err.message));
  };

  const body = !open ? null : detail.isPending && summary?.hasVariations ? (
    <Spinner layout="stack" label="Carregando variações…" className="py-8" />
  ) : detail.isError && summary?.hasVariations ? (
    <p className="text-sm text-danger-text">{detail.error.message}</p>
  ) : summary?.hasVariations ? (
    (() => {
      const models = detail.data?.variations ?? [];
      const { sizes, rows } = buildVariationGrid(models);
      if (!sizes.length) {
        return <p className="text-sm text-muted">Nenhuma variação sincronizada ainda.</p>;
      }
      return (
        <VariationGrid
          sizes={sizes}
          rows={rows}
          saving={saving}
          onSave={onSaveGrid}
          onCancel={onClose}
        />
      );
    })()
  ) : (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Estoque" required>
        <Input
          inputMode="numeric"
          value={simpleStock}
          onChange={(e) => setSimpleStock(e.target.value.replace(/\D/g, ''))}
        />
      </FormField>
      <FormField label="Preço" required>
        <Input
          inputMode="decimal"
          value={simplePrice}
          onChange={(e) => setSimplePrice(e.target.value)}
        />
      </FormField>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" size="sm" loading={saving} onClick={onSaveSimple}>
          Salvar
        </Button>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <BottomSheet open={open} onOpenChange={(o) => !o && onClose()} title={title}>
        {body}
      </BottomSheet>
    );
  }

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()} title={title} wide>
      {body}
    </Modal>
  );
}
