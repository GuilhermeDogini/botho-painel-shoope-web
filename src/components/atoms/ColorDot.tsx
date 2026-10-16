import { cn } from '@/lib/utils';

export interface ColorDotProps {
  /** Cor da variação (qualquer cor CSS, ex.: "#2F4A9A"). */
  color: string;
  /** Nome da cor para leitor de tela. Sem ele a bolinha é decorativa (o nome deve estar escrito ao lado). */
  label?: string;
  size?: 'sm' | 'lg';
  className?: string;
}

/** Bolinha da cor da variação, com contorno fino para cores claras (branco, off-white) não sumirem. */
export function ColorDot({ color, label, size = 'sm', className }: ColorDotProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ backgroundColor: color }}
      className={cn(
        'inline-block shrink-0 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--bt-ink)_18%,transparent)]',
        size === 'lg' ? 'size-[22px]' : 'size-3.5',
        className,
      )}
    />
  );
}
