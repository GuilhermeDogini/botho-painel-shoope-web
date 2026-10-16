import { Check, Info, PartyPopper, Plus, Rocket, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Button } from '@/components/atoms/Button';
import { ColorDot } from '@/components/atoms/ColorDot';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Spinner } from '@/components/atoms/Spinner';
import { Tag } from '@/components/atoms/Tag';
import { Textarea } from '@/components/atoms/Textarea';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { FormField } from '@/components/molecules/FormField';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { MoneyField } from '@/components/molecules/MoneyField';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { AttributeForm, hasAttributeValue } from '@/components/organisms/AttributeForm';
import { CategoryPicker } from '@/components/organisms/CategoryPicker';
import {
  PHOTO_UPLOADER_MAX,
  PhotoUploader,
  type PhotoUploadItem,
} from '@/components/organisms/PhotoUploader';
import { WizardPage } from '@/components/templates/WizardPage';
import {
  useAttributes,
  useBrands,
  useCategories,
  useCreateProduct,
  useLogistics,
  useUploadImage,
} from '@/hooks/useProducts';
import { fold, formatMoneyInput, formatMoneyInputBlur, money, parseMoney } from '@/lib/format';
import type { AttributeValue, CategoryNode, NewProduct, NewProductModel } from '@/lib/types';
import { cn } from '@/lib/utils';

const STEPS = ['Fotos', 'Categoria', 'Detalhes', 'Variações', 'Preço e envio', 'Revisar'] as const;
const NAME_MAX = 120;
const DESC_MAX = 5000;

const SIZE_OPTIONS = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'Tamanho único'] as const;

const COLOR_SUGGESTIONS: { name: string; hex: string }[] = [
  { name: 'Rosa', hex: '#E9A6B9' },
  { name: 'Azul anil', hex: '#2F4A9A' },
  { name: 'Framboesa', hex: '#B3134F' },
  { name: 'Cinza mescla', hex: '#A9A39C' },
  { name: 'Verde sálvia', hex: '#8FAE94' },
  { name: 'Preto', hex: '#2B1F1D' },
  { name: 'Cru', hex: '#EFE6D6' },
  { name: 'Mostarda', hex: '#E3AE3A' },
];

type WizardPhoto = PhotoUploadItem & { file?: File };

interface Draft {
  category: CategoryNode | null;
  name: string;
  description: string;
  condition: 'NEW' | 'USED';
  brandId: number | null;
  attrs: Record<number, AttributeValue[]>;
  colors: { name: string; hex: string }[];
  sizes: string[];
  /** Estoque por "cor|tamanho". */
  stockByKey: Record<string, string>;
  /** Preço por "cor|tamanho" (kit 1 / kit 2 com valores diferentes). */
  priceByKey: Record<string, string>;
  /** Atalho para aplicar o mesmo preço em todas as células. */
  priceAll: string;
  weightG: string;
  length: string;
  width: string;
  height: string;
  logisticsIds: number[] | null;
}

const EMPTY: Draft = {
  category: null,
  name: '',
  description: '',
  condition: 'NEW',
  brandId: null,
  attrs: {},
  colors: [],
  sizes: [],
  stockByKey: {},
  priceByKey: {},
  priceAll: '',
  weightG: '350',
  length: '30',
  width: '25',
  height: '4',
  logisticsIds: null,
};

function cellKey(color: string, size: string): string {
  return `${color}|${size}`;
}

function newPhotoId(): string {
  return `ph-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Cadastro em 6 passos (SHP-97): Fotos → Categoria → Detalhes → Variações → Preço e envio → Revisar.
 */
export function NewProductPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<WizardPhoto[]>([]);
  const [d, setD] = useState<Draft>(EMPTY);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [customColor, setCustomColor] = useState('');
  const [gridMode, setGridMode] = useState<'stock' | 'price'>('price');

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));

  const cats = useCategories();
  const categoryId = d.category?.id ?? null;
  const attributes = useAttributes(categoryId);
  const brands = useBrands(categoryId);
  const logistics = useLogistics();
  const uploadImage = useUploadImage();
  const createProduct = useCreateProduct();

  useEffect(() => {
    if (logistics.data && d.logisticsIds === null) {
      set('logisticsIds', logistics.data.filter((l) => l.enabled).map((l) => l.id));
    }
  }, [logistics.data, d.logisticsIds]);

  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.previewUrl.startsWith('blob:')) URL.revokeObjectURL(p.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só no unmount
  }, []);

  const donePhotos = photos.filter((p) => p.status === 'done' && p.imageId);
  const uploading = photos.some((p) => p.status === 'uploading');
  const missingAttrs = (attributes.data ?? []).filter((a) => a.mandatory && !hasAttributeValue(d.attrs[a.id]));
  const brandMissing = Boolean(brands.data?.mandatory) && !d.brandId;
  const weightKg = parseMoney(d.weightG) / 1000;
  const comboCount = d.colors.length * d.sizes.length;

  const cellPrice = (color: string, size: string): number => {
    const raw = d.priceByKey[cellKey(color, size)];
    if (raw != null && raw.trim() !== '') return parseMoney(raw);
    return parseMoney(d.priceAll);
  };

  const models: NewProductModel[] = useMemo(() => {
    if (!d.colors.length || !d.sizes.length) return [];
    const out: NewProductModel[] = [];
    for (const c of d.colors) {
      for (const size of d.sizes) {
        const price = cellPrice(c.name, size);
        if (!(price > 0)) continue;
        const raw = d.stockByKey[cellKey(c.name, size)] ?? '0';
        const stock = Number(raw);
        out.push({
          color: c.name,
          size,
          price: Math.round(price * 100) / 100,
          stock: Number.isInteger(stock) && stock >= 0 ? stock : 0,
        });
      }
    }
    return out;
    // cellPrice lê priceByKey/priceAll do draft
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.colors, d.sizes, d.stockByKey, d.priceByKey, d.priceAll]);

  const priceBounds = useMemo(() => {
    if (!models.length) return { min: 0, max: 0 };
    const prices = models.map((m) => m.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [models]);

  const missingCellPrice = useMemo(() => {
    if (!d.colors.length || !d.sizes.length) return false;
    return d.colors.some((c) =>
      d.sizes.some((size) => !(cellPrice(c.name, size) > 0)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.colors, d.sizes, d.priceByKey, d.priceAll]);

  const problem = ((): string | null => {
    if (step === 1) {
      if (uploading) return 'espere as fotos terminarem de enviar';
      if (!donePhotos.length) return 'adicione pelo menos uma foto';
      return null;
    }
    if (step === 2) return d.category ? null : 'escolha a categoria';
    if (step === 3) {
      if (d.name.trim().length < 10) return 'o nome precisa ter pelo menos 10 letras';
      if (d.description.trim().length < 20) return 'a descrição precisa ter pelo menos 20 letras';
      if (attributes.isPending || brands.isPending) return 'carregando os campos da categoria…';
      if (brandMissing) return 'escolha a marca';
      if (missingAttrs.length) return `preencha: ${missingAttrs.map((a) => a.name).join(', ')}`;
      return null;
    }
    if (step === 4) {
      if (!d.colors.length) return 'adicione pelo menos uma cor';
      if (!d.sizes.length) return 'escolha pelo menos um tamanho';
      return null;
    }
    if (step === 5) {
      if (missingCellPrice) return 'informe o preço de cada variação (ou aplique em todas)';
      if (models.length !== comboCount) return 'preencha o preço de todas as variações';
      if (!(weightKg > 0)) return 'informe o peso do pacote';
      if (!d.logisticsIds?.length) return 'escolha pelo menos uma forma de envio';
      return null;
    }
    return null;
  })();

  const upload = (photo: WizardPhoto) => {
    if (!photo.file) return;
    uploadImage
      .mutateAsync(photo.file)
      .then((img) =>
        setPhotos((ps) =>
          ps.map((p) =>
            p.id === photo.id ? { ...p, status: 'done', progress: 100, imageId: img.imageId } : p,
          ),
        ),
      )
      .catch((err: Error) =>
        setPhotos((ps) =>
          ps.map((p) => (p.id === photo.id ? { ...p, status: 'error', error: err.message } : p)),
        ),
      );
  };

  const onAddFiles = (files: File[]) => {
    const room = PHOTO_UPLOADER_MAX - photos.length;
    const list = files.filter((f) => /^image\/(jpeg|png|webp)$/i.test(f.type));
    if (list.length < files.length) toast.error('Só fotos JPG, PNG ou WEBP');
    if (list.length > room) toast.message(`Cabem só mais ${room} foto(s)`);
    const added: WizardPhoto[] = list.slice(0, room).map((file) => ({
      id: newPhotoId(),
      previewUrl: URL.createObjectURL(file),
      status: 'uploading' as const,
      progress: 15,
      file,
    }));
    setPhotos((ps) => [...ps, ...added]);
    added.forEach(upload);
  };

  const payload = (): NewProduct => {
    const dims = [d.length, d.width, d.height].map((s) => parseMoney(s));
    const brand = d.brandId
      ? (brands.data?.brands.find((b) => b.id === d.brandId) ?? null)
      : null;
    const totalStock = models.reduce((s, m) => s + m.stock, 0);
    return {
      name: d.name.trim(),
      description: d.description.trim(),
      categoryId: d.category!.id,
      price: Math.round((priceBounds.min || 0) * 100) / 100,
      stock: models.length ? totalStock : 0,
      weight: Math.round(weightKg * 1000) / 1000,
      dimension: dims.every((n) => n > 0)
        ? { length: dims[0]!, width: dims[1]!, height: dims[2]! }
        : undefined,
      imageIds: donePhotos.map((p) => p.imageId!),
      attributes: Object.values(d.attrs)
        .flat()
        .filter((v) => v.valueId > 0 || v.text?.trim())
        .map((v) => {
          const a = attributes.data?.find((x) => x.id === v.attributeId);
          const numeric = a?.valueType === 'INT_TYPE' || a?.valueType === 'FLOAT_TYPE';
          return numeric && v.text ? { ...v, text: String(parseMoney(v.text)) } : { ...v, text: v.text?.trim() || undefined };
        }),
      brand: brand ? { id: brand.id, name: brand.name } : null,
      logisticsIds: d.logisticsIds ?? [],
      condition: d.condition,
      models: models.length ? models : undefined,
    };
  };

  const publish = () => {
    createProduct.mutate(payload(), {
      onSuccess: (r) => setCreatedId(r.itemId),
      onError: (err) => toast.error(err.message),
    });
  };

  const reset = () => {
    photos.forEach((p) => {
      if (p.previewUrl.startsWith('blob:')) URL.revokeObjectURL(p.previewUrl);
    });
    setPhotos([]);
    setD({
      ...EMPTY,
      logisticsIds: logistics.data?.filter((l) => l.enabled).map((l) => l.id) ?? null,
    });
    setCreatedId(null);
    createProduct.reset();
    setStep(1);
  };

  const addColor = (name: string, hex: string) => {
    const n = name.trim();
    if (!n) return;
    if (d.colors.some((c) => fold(c.name) === fold(n))) {
      toast.message('Essa cor já está na lista');
      return;
    }
    setD((prev) => ({ ...prev, colors: [...prev.colors, { name: n, hex }] }));
    setCustomColor('');
  };

  const clearKeysFor = (
    map: Record<string, string>,
    pred: (key: string) => boolean,
  ): Record<string, string> => {
    const next = { ...map };
    for (const key of Object.keys(next)) {
      if (pred(key)) delete next[key];
    }
    return next;
  };

  const removeColor = (name: string) => {
    setD((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.name !== name),
      stockByKey: clearKeysFor(prev.stockByKey, (k) => k.startsWith(`${name}|`)),
      priceByKey: clearKeysFor(prev.priceByKey, (k) => k.startsWith(`${name}|`)),
    }));
  };

  const toggleSize = (size: string) => {
    setD((prev) => {
      const on = prev.sizes.includes(size);
      const sizes = on ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      if (!on) return { ...prev, sizes };
      return {
        ...prev,
        sizes,
        stockByKey: clearKeysFor(prev.stockByKey, (k) => k.endsWith(`|${size}`)),
        priceByKey: clearKeysFor(prev.priceByKey, (k) => k.endsWith(`|${size}`)),
      };
    });
  };

  const applyPriceToAll = () => {
    const formatted = d.priceAll.trim();
    if (!(parseMoney(formatted) > 0)) {
      toast.message('Digite um preço válido para aplicar em todas');
      return;
    }
    const priceByKey: Record<string, string> = { ...d.priceByKey };
    for (const c of d.colors) {
      for (const size of d.sizes) {
        priceByKey[cellKey(c.name, size)] = formatted;
      }
    }
    set('priceByKey', priceByKey);
    toast.success('Preço aplicado em todas as variações');
  };

  if (createdId !== null) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-lg border border-line bg-surface p-8 text-center shadow-1">
        <div className="grid size-16 place-items-center rounded-2xl bg-salvia-soft text-salvia-text">
          <PartyPopper className="size-8" aria-hidden />
        </div>
        <h1 className="font-display text-h2 font-bold">A peça já está na Shopee</h1>
        <p className="text-sm text-muted">
          “{d.name.trim()}” · {models.length || 1} variação(ões) publicada(s). Pode levar alguns minutos
          para aparecer nas buscas.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Button icon={Rocket} onClick={() => navigate('/turbinar')}>
            Turbinar agora
          </Button>
          <Button variant="outline" onClick={() => navigate('/produtos')}>
            Ver nos produtos
          </Button>
        </div>
        <button type="button" className="text-sm font-semibold text-brand-text hover:underline" onClick={reset}>
          Cadastrar outra peça
        </button>
      </div>
    );
  }

  const goNext = () => {
    if (problem) {
      toast.message(`Falta: ${problem}`);
      return;
    }
    if (step < 6) setStep(step + 1);
    else publish();
  };

  return (
    <WizardPage
      title="Cadastrar peça"
      backLabel="Produtos"
      onBack={() => navigate('/produtos')}
      steps={[...STEPS]}
      currentStep={step}
      onStepClick={(s) => {
        if (s < step) setStep(s);
      }}
      onPrevious={step > 1 ? () => setStep(step - 1) : undefined}
      disableBack={step <= 1}
      primaryLabel={step === 6 ? 'Publicar na Shopee' : 'Continuar'}
      primaryShowChevron={step < 6}
      onPrimary={goNext}
      primaryLoading={createProduct.isPending}
      onSaveDraft={() => toast.message('Rascunho ainda não grava no servidor — em breve.')}
    >
      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-h2 font-bold">Fotos da peça</h2>
            <p className="text-sm text-muted">Até 9 fotos. A primeira é a capa. Arraste para mudar a ordem.</p>
          </div>
          <PhotoUploader
            photos={photos}
            onChange={setPhotos}
            onAddFiles={onAddFiles}
            onRetry={(id) => {
              const photo = photos.find((p) => p.id === id);
              if (!photo?.file) return;
              setPhotos((ps) =>
                ps.map((p) => (p.id === id ? { ...p, status: 'uploading', progress: 20, error: undefined } : p)),
              );
              upload({ ...photo, status: 'uploading' });
            }}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-h2 font-bold">Categoria</h2>
          </div>
          <CategoryPicker
            categories={cats.data ?? []}
            selected={d.category}
            loading={cats.isPending}
            error={cats.isError ? cats.error.message : null}
            recentLabels={['Conjuntos', 'Pijamas', 'Calças']}
            onSelect={(c) => {
              if (c.id !== d.category?.id) {
                setD((prev) => ({ ...prev, category: c, attrs: {}, brandId: null }));
              } else {
                set('category', c);
              }
              setStep(3);
            }}
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-display text-h2 font-bold">Detalhes</h2>
            <p className="text-sm text-muted">{d.category?.path}</p>
          </div>
          <FormField
            label="Nome da peça"
            required
            hint={`${d.name.length}/${NAME_MAX} · Comece pelo que é, depois o diferencial`}
          >
            <Input
              value={d.name}
              maxLength={NAME_MAX}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex.: Vestido midi estampa floral manga curta"
            />
          </FormField>
          <FormField label="Descrição" required hint="Tecido, caimento, medidas e como lavar.">
            <Textarea
              value={d.description}
              maxLength={DESC_MAX}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Conte o que o comprador precisa saber."
              className="min-h-[150px]"
            />
          </FormField>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Condição</span>
            <FilterChipList>
              <FilterChip active={d.condition === 'NEW'} onClick={() => set('condition', 'NEW')}>
                Novo
              </FilterChip>
              <FilterChip active={d.condition === 'USED'} onClick={() => set('condition', 'USED')}>
                Usado
              </FilterChip>
            </FilterChipList>
          </div>
          {brands.data ? (
            <FormField label="Marca" required={brands.data.mandatory}>
              <Select
                value={d.brandId == null ? '__none__' : String(d.brandId)}
                onValueChange={(v) => set('brandId', v === '__none__' ? null : Number(v))}
                options={[
                  {
                    value: '__none__',
                    label: brands.data.mandatory ? 'Escolha a marca' : 'Sem marca',
                  },
                  ...brands.data.brands.map((b) => ({ value: String(b.id), label: b.name })),
                ]}
              />
            </FormField>
          ) : null}
          <AttributeForm
            attributes={attributes.data ?? []}
            values={d.attrs}
            onChange={(id, next) => set('attrs', { ...d.attrs, [id]: next })}
            loading={attributes.isPending}
            error={attributes.error?.message ?? null}
          />
        </div>
      ) : null}

      {step === 4 ? (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-display text-h2 font-bold">Variações</h2>
            <p className="text-sm text-muted">Escolha as cores e os tamanhos. A grade é montada sozinha.</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-semibold">Cores</span>
            <div className="flex flex-wrap gap-2">
              {d.colors.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line-2 bg-surface py-0 pr-1 pl-3"
                >
                  <ColorDot color={c.hex} size="lg" label={c.name} />
                  <span className="text-sm font-semibold">{c.name}</span>
                  <button
                    type="button"
                    aria-label={`Remover ${c.name}`}
                    className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                    onClick={() => removeColor(c.name)}
                  >
                    <X size={16} aria-hidden />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Sugestões:</span>
              {COLOR_SUGGESTIONS.filter((s) => !d.colors.some((c) => fold(c.name) === fold(s.name))).map(
                (s) => (
                  <button
                    key={s.name}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2 hover:text-brand-text"
                    onClick={() => addColor(s.name, s.hex)}
                  >
                    <ColorDot color={s.hex} />
                    {s.name}
                  </button>
                ),
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="Outra cor"
                aria-label="Nome da cor"
                className="max-w-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => addColor(customColor, '#A9A39C')}
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-semibold">Tamanhos</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Tamanhos">
              {SIZE_OPTIONS.map((size) => {
                const on = d.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      'inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-semibold',
                      on
                        ? 'border-ink bg-ink text-bg'
                        : 'border-line-2 bg-surface text-ink-2 hover:bg-surface-2',
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted">G1, G2 e G3 são plus size. Use “Tamanho único” para grade livre.</p>
          </div>

          {comboCount > 0 ? (
            <div className="rounded-lg border border-line bg-surface-2 p-4">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="font-bold">
                  {d.colors.length} cor{d.colors.length > 1 ? 'es' : ''} · {d.sizes.length} tamanho
                  {d.sizes.length > 1 ? 's' : ''} · {comboCount} variações
                </span>
                <Tag icon={Check} tone="ok">
                  Grade pronta
                </Tag>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {d.colors.flatMap((c) =>
                  d.sizes.map((size) => (
                    <span
                      key={cellKey(c.name, size)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold"
                    >
                      <ColorDot color={c.hex} />
                      {c.name} · {size}
                    </span>
                  )),
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 5 ? (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-display text-h2 font-bold">Preço, estoque e envio</h2>
            <p className="text-sm text-muted">
              Cada variação pode ter preço próprio (ex.: Kit 1, Kit 2). Use “Aplicar em todas” se for o mesmo valor.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <SegmentedControl
                aria-label="Editar grade"
                value={gridMode}
                onValueChange={(v) => setGridMode(v as 'stock' | 'price')}
                options={[
                  { value: 'price', label: 'Preço' },
                  { value: 'stock', label: 'Estoque' },
                ]}
              />
              {gridMode === 'price' ? (
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-xs sm:items-stretch">
                  <MoneyField
                    label="Preço para todas"
                    value={d.priceAll}
                    onChange={(e) => set('priceAll', e.target.value)}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={applyPriceToAll} className="w-full">
                    Aplicar em todas
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-max min-w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-[13px] text-muted">
                    <th className="px-3 py-2.5 font-bold">Cor</th>
                    {d.sizes.map((size) => (
                      <th key={size} className="px-2 py-2.5 text-center font-bold">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.colors.map((c) => (
                    <tr key={c.name} className="border-b border-line last:border-0">
                      <th className="px-3 py-2 text-left font-semibold">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <ColorDot color={c.hex} size="lg" label={c.name} />
                          {c.name}
                        </span>
                      </th>
                      {d.sizes.map((size) => {
                        const key = cellKey(c.name, size);
                        if (gridMode === 'price') {
                          return (
                            <td key={key} className="p-1.5">
                              <div className="relative min-w-[5.5rem]">
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-[11px] text-muted"
                                >
                                  R$
                                </span>
                                <Input
                                  inputMode="decimal"
                                  aria-label={`Preço ${c.name} ${size}`}
                                  value={d.priceByKey[key] ?? ''}
                                  placeholder={d.priceAll.trim() || '0,00'}
                                  onChange={(e) =>
                                    set('priceByKey', {
                                      ...d.priceByKey,
                                      [key]: formatMoneyInput(e.target.value),
                                    })
                                  }
                                  onBlur={(e) => {
                                    const next = formatMoneyInputBlur(e.target.value);
                                    if (next === (d.priceByKey[key] ?? '')) return;
                                    set('priceByKey', { ...d.priceByKey, [key]: next });
                                  }}
                                  className="h-11 min-w-[5.5rem] pl-7 pr-2 text-right tabular-nums"
                                />
                              </div>
                            </td>
                          );
                        }
                        return (
                          <td key={key} className="p-1.5">
                            <Input
                              inputMode="numeric"
                              aria-label={`Estoque ${c.name} ${size}`}
                              value={d.stockByKey[key] ?? ''}
                              placeholder="0"
                              onChange={(e) =>
                                set('stockByKey', {
                                  ...d.stockByKey,
                                  [key]: e.target.value.replace(/\D/g, ''),
                                })
                              }
                              className="h-11 min-w-14 px-2 text-center"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {gridMode === 'price' && missingCellPrice ? (
              <p className="text-xs text-mostarda-text">Falta preço em alguma variação.</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Pacote para envio</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FormField label="Peso" required hint="gramas">
                <Input
                  inputMode="numeric"
                  value={d.weightG}
                  onChange={(e) => set('weightG', e.target.value.replace(/\D/g, ''))}
                />
              </FormField>
              <FormField label="Comprimento" hint="cm">
                <Input
                  inputMode="decimal"
                  value={d.length}
                  onChange={(e) => set('length', e.target.value)}
                />
              </FormField>
              <FormField label="Largura" hint="cm">
                <Input
                  inputMode="decimal"
                  value={d.width}
                  onChange={(e) => set('width', e.target.value)}
                />
              </FormField>
              <FormField label="Altura" hint="cm">
                <Input
                  inputMode="decimal"
                  value={d.height}
                  onChange={(e) => set('height', e.target.value)}
                />
              </FormField>
            </div>
            <InlineAlert tone="info" icon={Info}>
              Medidas do pacote fechado, não da peça. Elas definem o frete.
            </InlineAlert>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Formas de envio</span>
            {logistics.isPending ? (
              <Spinner label="Carregando envios…" />
            ) : logistics.isError ? (
              <p className="text-sm text-danger-text">{logistics.error.message}</p>
            ) : (
              <FilterChipList>
                {(logistics.data ?? []).map((ch) => {
                  const on = (d.logisticsIds ?? []).includes(ch.id);
                  return (
                    <FilterChip
                      key={ch.id}
                      active={on}
                      disabled={!ch.enabled}
                      onClick={() => {
                        const ids = new Set(d.logisticsIds ?? []);
                        if (ids.has(ch.id)) ids.delete(ch.id);
                        else ids.add(ch.id);
                        set('logisticsIds', [...ids]);
                      }}
                    >
                      {ch.name}
                    </FilterChip>
                  );
                })}
              </FilterChipList>
            )}
          </div>
        </div>
      ) : null}

      {step === 6 ? (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-display text-h2 font-bold">Revisar e publicar</h2>
            <p className="text-sm text-muted">É assim que a peça vai aparecer. Confira antes de mandar.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            <div className="overflow-hidden rounded-lg border border-line">
              {donePhotos[0] ? (
                <img
                  src={donePhotos[0].previewUrl}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[3/4] place-items-center bg-surface-2 text-muted">
                  <Upload size={28} aria-hidden />
                </div>
              )}
              <div className="flex flex-col gap-0.5 p-3">
                <span className="text-sm font-bold">{d.name.trim() || '—'}</span>
                <span className="font-bold text-brand-text tabular-nums">
                  {priceBounds.min === priceBounds.max
                    ? money(priceBounds.min || 0)
                    : `${money(priceBounds.min)} – ${money(priceBounds.max)}`}
                </span>
                <span className="text-xs text-muted">
                  {d.colors.length} cores · {d.sizes[0] ?? '—'}
                  {d.sizes.length > 1 ? ` ao ${d.sizes[d.sizes.length - 1]}` : ''}
                </span>
              </div>
            </div>
            <ul className="flex flex-col gap-2.5">
              {(
                [
                  { text: `Fotos: ${donePhotos.length}`, go: 1 },
                  { text: `Categoria: ${d.category?.path ?? '—'}`, go: 2 },
                  {
                    text: `Nome, descrição e características`,
                    go: 3,
                  },
                  {
                    text: `${comboCount} variações (${d.colors.length}×${d.sizes.length})`,
                    go: 4,
                  },
                  {
                    text:
                      priceBounds.min === priceBounds.max
                        ? `Preço ${money(priceBounds.min || 0)} · pacote ${d.weightG} g`
                        : `Preço ${money(priceBounds.min)} – ${money(priceBounds.max)} · pacote ${d.weightG} g`,
                    go: 5,
                  },
                ] as const
              ).map((row) => (
                <li key={row.go} className="flex min-h-10 items-center gap-2.5">
                  <Check size={18} className="shrink-0 text-salvia-text" aria-hidden />
                  <span className="min-w-0 flex-1 text-sm">{row.text}</span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand-text hover:underline"
                    onClick={() => setStep(row.go)}
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {createProduct.isError ? (
            <InlineAlert tone="danger">{createProduct.error.message}</InlineAlert>
          ) : null}
        </div>
      ) : null}

      {problem && step !== 2 ? (
        <p className="text-center text-xs text-muted">Falta: {problem}</p>
      ) : null}
    </WizardPage>
  );
}
