import { GripVertical, Info, RotateCcw, Star, Trash2, Upload } from 'lucide-react';
import {
  useId,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Tag } from '@/components/atoms/Tag';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { cn } from '@/lib/utils';

export const PHOTO_UPLOADER_MAX = 9;
export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';

export type PhotoUploadStatus = 'uploading' | 'done' | 'error';

export interface PhotoUploadItem {
  id: string;
  previewUrl: string;
  status: PhotoUploadStatus;
  /** 0–100 enquanto envia (opcional). */
  progress?: number;
  imageId?: string;
  error?: string;
}

export interface PhotoUploaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  photos: ReadonlyArray<PhotoUploadItem>;
  /** Nova ordem / remoção / capa (pai controla a lista). */
  onChange: (next: PhotoUploadItem[]) => void;
  /** Arquivos escolhidos ou soltos; o pai sobe e atualiza `photos`. */
  onAddFiles: (files: File[]) => void;
  /** Tentar de novo uma foto com erro. */
  onRetry?: (id: string) => void;
  max?: number;
  /** Dica 3:4 (padrão: ligada). */
  showTips?: boolean;
  disabled?: boolean;
}

function reorder<T>(list: ReadonlyArray<T>, from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return [...list];
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

/**
 * Até 9 fotos, capa = primeira, arrastar para ordenar (mouse e toque),
 * área de soltar com pesponto, progresso e tentar de novo.
 */
export function PhotoUploader({
  photos,
  onChange,
  onAddFiles,
  onRetry,
  max = PHOTO_UPLOADER_MAX,
  showTips = true,
  disabled = false,
  className,
  ...rest
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const pointerDrag = useRef<{ id: string; startY: number; startX: number } | null>(null);

  const left = Math.max(0, max - photos.length);
  const canAdd = left > 0 && !disabled;

  const pickFiles = (list: FileList | File[] | null) => {
    if (!list || !canAdd) return;
    const files = [...list].filter((f) => /^image\/(jpeg|png|webp)$/i.test(f.type));
    if (!files.length) return;
    onAddFiles(files.slice(0, left));
  };

  const remove = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  const makeCover = (id: string) => {
    const i = photos.findIndex((p) => p.id === id);
    if (i <= 0) return;
    onChange(reorder(photos, i, 0));
  };

  const moveTo = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const from = photos.findIndex((p) => p.id === fromId);
    const to = photos.findIndex((p) => p.id === toId);
    if (from < 0 || to < 0) return;
    onChange(reorder(photos, from, to));
  };

  // --- HTML5 drag (desktop)
  const onDragStart = (e: DragEvent, id: string) => {
    if (disabled) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
  };

  const onDragOverTile = (e: DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverId(id);
  };

  const onDropTile = (e: DragEvent, id: string) => {
    e.preventDefault();
    const from = e.dataTransfer.getData('text/plain') || draggingId;
    if (from) moveTo(from, id);
    setDraggingId(null);
    setOverId(null);
  };

  // --- Pointer (mobile + desktop grip)
  const onPointerDownGrip = (e: ReactPointerEvent, id: string) => {
    if (disabled) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerDrag.current = { id, startX: e.clientX, startY: e.clientY };
    setDraggingId(id);
  };

  const onPointerMoveGrip = (e: ReactPointerEvent) => {
    const drag = pointerDrag.current;
    if (!drag) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const tile = el?.closest<HTMLElement>('[data-photo-id]');
    const toId = tile?.dataset.photoId;
    if (toId && toId !== drag.id) {
      setOverId(toId);
      moveTo(drag.id, toId);
      // Mantém o id da foto arrastada (não troca pelo alvo).
    }
  };

  const onPointerUpGrip = (e: ReactPointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    pointerDrag.current = null;
    setDraggingId(null);
    setOverId(null);
  };

  return (
    <div {...rest} className={cn('flex min-w-0 flex-col gap-4', className)}>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-2.5">
        {photos.map((photo, index) => {
          const isCover = index === 0;
          const isDragging = draggingId === photo.id;
          const isOver = overId === photo.id && draggingId !== photo.id;

          return (
            <div
              key={photo.id}
              data-photo-id={photo.id}
              draggable={!disabled}
              onDragStart={(e) => onDragStart(e, photo.id)}
              onDragOver={(e) => onDragOverTile(e, photo.id)}
              onDrop={(e) => onDropTile(e, photo.id)}
              onDragEnd={() => {
                setDraggingId(null);
                setOverId(null);
              }}
              className={cn(
                'relative overflow-hidden rounded-xl border border-line bg-surface-2',
                isCover && 'stitch',
                isDragging && 'opacity-60',
                isOver && 'ring-2 ring-brand/50',
              )}
            >
              <img
                src={photo.previewUrl}
                alt=""
                draggable={false}
                className={cn(
                  'block aspect-[3/4] w-full object-cover',
                  photo.status !== 'done' && 'opacity-55',
                )}
              />

              {isCover ? (
                <Tag icon={Star} tone="solid" className="absolute top-2 left-2">
                  Capa
                </Tag>
              ) : null}

              {photo.status === 'uploading' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/25 px-2">
                  <div className="h-1.5 w-[70%] overflow-hidden rounded-full bg-surface/80">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-200"
                      style={{ width: `${Math.min(100, Math.max(8, photo.progress ?? 35))}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-brand-ink">Enviando…</span>
                </div>
              ) : null}

              {photo.status === 'error' ? (
                <button
                  type="button"
                  onClick={() => onRetry?.(photo.id)}
                  title={photo.error}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-danger-soft/90 px-2 text-xs font-semibold text-danger-text"
                >
                  <RotateCcw size={18} aria-hidden />
                  Tentar de novo
                </button>
              ) : null}

              <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  aria-label={`Arrastar foto ${index + 1}`}
                  className="inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg bg-surface/95 text-ink-2 shadow-1 active:cursor-grabbing touch-none sm:size-9"
                  onPointerDown={(e) => onPointerDownGrip(e, photo.id)}
                  onPointerMove={onPointerMoveGrip}
                  onPointerUp={onPointerUpGrip}
                  onPointerCancel={onPointerUpGrip}
                  disabled={disabled}
                >
                  <GripVertical size={16} aria-hidden />
                </button>
                <div className="flex shrink-0 gap-1">
                  {!isCover && photo.status === 'done' ? (
                    <button
                      type="button"
                      onClick={() => makeCover(photo.id)}
                      aria-label="Tornar capa"
                      title="Tornar capa"
                      className="inline-flex size-8 items-center justify-center rounded-lg bg-surface/95 text-ink shadow-1 sm:size-9"
                    >
                      <Star size={16} aria-hidden />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Remover foto ${index + 1}`}
                    onClick={() => remove(photo.id)}
                    disabled={disabled}
                    className="inline-flex size-8 items-center justify-center rounded-lg bg-surface/95 text-danger-text shadow-1 sm:size-9"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {canAdd ? (
          <label
            htmlFor={inputId}
            onDragEnter={(e) => {
              e.preventDefault();
              setDropActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDropActive(true);
            }}
            onDragLeave={() => setDropActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDropActive(false);
              pickFiles(e.dataTransfer.files);
            }}
            className={cn(
              'flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-line-2 bg-surface-2 px-2.5 text-center text-ink-2 transition-colors',
              'hover:border-brand hover:bg-brand-soft hover:text-brand-text',
              dropActive && 'border-brand bg-brand-soft text-brand-text stitch',
            )}
          >
            <Upload size={28} strokeWidth={1.75} aria-hidden />
            <span className="text-sm font-bold">{photos.length ? 'Adicionar foto' : 'Adicionar fotos'}</span>
            <span className="text-xs text-muted">{left} de {max} livres</span>
          </label>
        ) : null}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={PHOTO_ACCEPT}
        multiple
        hidden
        disabled={!canAdd}
        onChange={(e) => {
          pickFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {showTips ? (
        <InlineAlert tone="info" icon={Info}>
          Fotos em retrato (3:4) ou quadradas, no mínimo 500 × 500 px. Peça inteira, fundo claro e uma foto de detalhe
          do tecido ajudam a vender.
        </InlineAlert>
      ) : null}
    </div>
  );
}
