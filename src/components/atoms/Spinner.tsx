import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Texto ao lado da linha. Vazio esconde o texto, mas ele continua para o leitor de tela. */
  label?: string;
  hideLabel?: boolean;
  /**
   * `row` (padrão): pesponto à esquerda do texto (listas, cards).
   * `stack`: texto em cima, pesponto embaixo — telas / áreas de carregamento.
   */
  layout?: 'row' | 'stack';
}

/** Carregando: pesponto que corre ("Costurando os dados…"). Com movimento reduzido, a linha fica parada. */
export function Spinner({
  label = 'Costurando os dados…',
  hideLabel = false,
  layout = 'row',
  className,
  ...rest
}: SpinnerProps) {
  const stack = layout === 'stack';
  const stitch = <span aria-hidden className="sew shrink-0" />;
  const text = <span className={cn(hideLabel && 'sr-only')}>{label}</span>;

  return (
    <div
      role="status"
      {...rest}
      className={cn(
        'flex text-sm text-muted',
        stack ? 'flex-col items-center gap-3 text-center' : 'items-center gap-3',
        className,
      )}
    >
      {stack ? (
        <>
          {text}
          {stitch}
        </>
      ) : (
        <>
          {stitch}
          {text}
        </>
      )}
    </div>
  );
}
