import { cva, type VariantProps } from 'class-variance-authority';
import { Shirt } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const thumbVariants = cva('relative shrink-0 overflow-hidden bg-surface-2', {
  variants: {
    size: {
      sm: 'rounded-xs',
      md: 'rounded-[8px]',
      lg: 'rounded-sm',
      fluid: 'w-full rounded-sm',
    },
    shape: {
      portrait: '',
      square: '',
    },
  },
  compoundVariants: [
    { size: 'sm', shape: 'portrait', className: 'h-12 w-9' },
    { size: 'md', shape: 'portrait', className: 'h-16 w-12' },
    { size: 'lg', shape: 'portrait', className: 'h-24 w-18' },
    { size: 'fluid', shape: 'portrait', className: 'aspect-[3/4]' },
    { size: 'sm', shape: 'square', className: 'size-10' },
    { size: 'md', shape: 'square', className: 'size-12' },
    { size: 'lg', shape: 'square', className: 'size-18' },
    { size: 'fluid', shape: 'square', className: 'aspect-square' },
  ],
  defaultVariants: { size: 'md', shape: 'portrait' },
});

const FALLBACK_ICON = { sm: 16, md: 20, lg: 28, fluid: 36 } as const;

export interface ThumbnailProps extends VariantProps<typeof thumbVariants> {
  src?: string | null;
  /** Texto da foto. Use "" quando o nome da peça já está escrito ao lado. */
  alt: string;
  className?: string;
}

/** Foto de peça: 3:4 (padrão) ou quadrada, sempre cortada (nunca esticada). Sem foto ou com erro, mostra um cabide. */
export function Thumbnail({ src, alt, size, shape, className }: ThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div className={cn(thumbVariants({ size, shape }), className)}>
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src ?? null)}
          className="size-full object-cover text-transparent"
        />
      ) : (
        <div role={alt ? 'img' : undefined} aria-label={alt ? `${alt} (sem foto)` : undefined} aria-hidden={alt ? undefined : true} className="flex size-full items-center justify-center text-muted">
          <Shirt size={FALLBACK_ICON[size ?? 'md']} strokeWidth={1.5} aria-hidden />
        </div>
      )}
    </div>
  );
}
