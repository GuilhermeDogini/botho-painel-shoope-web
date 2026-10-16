import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PrintPageProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Título do documento (ex.: Lista de separação). */
  title: ReactNode;
  /** Meta sob o título (data, totais, quem imprimiu). */
  meta?: ReactNode;
  /** Conteúdo impresso (tabela, blocos…). */
  children: ReactNode;
  /** Texto de assinatura no rodapé. */
  signatures?: ReactNode;
  /** Indicador de página (ex.: “Página 1 de 1”). */
  pageLabel?: ReactNode;
  /** Nome da marca no canto (padrão botho / BRASIL). */
  brandWord?: string;
  brandSub?: string;
}

/**
 * Folha A4 para impressão (SHP-63): cabeçalho com logo, miolo e rodapé
 * com assinatura / página. Use fora do AppShell; CSS `@media print` esconde o resto.
 */
export function PrintPage({
  title,
  meta,
  children,
  signatures = 'Separado por: ______________________  ·  Conferido por: ______________________',
  pageLabel = 'Página 1 de 1',
  brandWord = 'botho',
  brandSub = 'BRASIL',
  className,
  ...rest
}: PrintPageProps) {
  return (
    <article
      {...rest}
      className={cn(
        'bt-print-page mx-auto flex flex-col gap-[18px] bg-white text-[#1D1512] shadow-2',
        // Largura fixa A4 — a prévia no celular escala via PrintPreviewFrame (não comprimir com max-w).
        'box-border w-[210mm] min-h-[297mm] shrink-0 px-14 pt-14 pb-12 text-[13px]',
        'print:shadow-none',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b-2 border-[#1D1512] pb-3.5">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="font-display text-[28px] leading-none font-extrabold tracking-[-0.03em]">{title}</h1>
          {meta ? <p className="text-[#4A3C36]">{meta}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-display text-xl leading-none font-extrabold tracking-[-0.04em]">{brandWord}</span>
          <span className="text-[8px] font-bold tracking-[0.4em]">{brandSub}</span>
        </div>
      </header>

      <div className="min-w-0 flex-1">{children}</div>

      <footer className="mt-auto flex items-center justify-between gap-3 border-t border-[#B9AEA6] pt-3 text-[11.5px] text-[#4A3C36]">
        <span>{signatures}</span>
        <span className="shrink-0">{pageLabel}</span>
      </footer>
    </article>
  );
}
