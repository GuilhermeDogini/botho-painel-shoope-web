import { Download, ListChecks, Printer, Tag } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Tag as StatusTag } from '@/components/atoms/Tag';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { BottomSheet } from './BottomSheet';
import { Modal } from './Modal';

export type LabelFormat = 'a4' | 'thermal';

export interface PrintPreviewLabel {
  orderSn: string;
  /** Nome curto do destinatário. */
  to: string;
  /** Endereço resumido. */
  address: string;
  /** Nome da peça (lista de separação na prévia). */
  piece: string;
  /** Serviço / transportadora na etiqueta. */
  service?: string;
}

export interface PrintPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quantidade de pedidos selecionados (título). */
  orderCount: number;
  includeLabels: boolean;
  onIncludeLabelsChange: (value: boolean) => void;
  includePackingList: boolean;
  onIncludePackingListChange: (value: boolean) => void;
  labelFormat: LabelFormat;
  onLabelFormatChange: (value: LabelFormat) => void;
  /** Dados para a prévia em papel (quando ainda não há PDF). */
  previewLabels?: ReadonlyArray<PrintPreviewLabel>;
  /**
   * URL do PDF (blob:). Quando presente, a prévia abre o PDF num iframe.
   * Pronto quando: prévia abre o PDF.
   */
  pdfUrl?: string | null;
  /** Gera / baixa o PDF. */
  onConfirm: () => void;
  loading?: boolean;
  confirmLabel?: string;
  description?: string;
}

function pageEstimate(
  orderCount: number,
  includeLabels: boolean,
  includePackingList: boolean,
  format: LabelFormat,
): string {
  let pages = 0;
  if (includeLabels && orderCount > 0) {
    pages += format === 'a4' ? Math.ceil(orderCount / 4) : orderCount;
  }
  if (includePackingList) pages += 1;
  if (pages === 0) return 'nada selecionado';
  return `${pages} página(s)`;
}

function PaperPreview({
  labels,
  includeLabels,
  includePackingList,
  format,
}: {
  labels: ReadonlyArray<PrintPreviewLabel>;
  includeLabels: boolean;
  includePackingList: boolean;
  format: LabelFormat;
}) {
  const shown = labels.slice(0, format === 'a4' ? 4 : 1);
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <div className="flex min-h-[280px] flex-wrap items-start justify-center gap-3.5 overflow-auto rounded-[14px] bg-surface-3 p-[18px]">
      {includeLabels ? (
        <div
          className={cn(
            'grid shrink-0 gap-2 bg-white p-2.5 text-[#1D1512] shadow-1',
            format === 'a4'
              ? 'aspect-[210/297] w-[min(100%,220px)] grid-cols-2 grid-rows-2'
              : 'aspect-[100/150] w-[min(100%,150px)] grid-cols-1',
          )}
          aria-hidden
        >
          {shown.map((l) => (
            <div
              key={l.orderSn}
              className="flex flex-col gap-0.5 rounded-[3px] border-[1.5px] border-[#1d1512] p-1.5 text-[7px] leading-[1.3]"
            >
              <div className="flex justify-between font-bold">
                <span>ENVIO SHOPEE</span>
                <span>{l.service ?? 'Xpress'}</span>
              </div>
              <div className="h-5 rounded-[2px] bg-[repeating-linear-gradient(90deg,#1d1512_0_2px,transparent_2px_4px)] opacity-80" />
              <div>
                <b>Para:</b> {l.to}
              </div>
              <div className="text-[#555]">{l.address}</div>
              <div className="border-t border-dashed border-[#999] pt-0.5">
                <b>De:</b> Botho Brasil · São Paulo/SP
              </div>
              <div>
                <b>Pedido</b> {l.orderSn}
              </div>
            </div>
          ))}
          {format === 'a4' && shown.length < 4
            ? Array.from({ length: 4 - shown.length }, (_, i) => (
                <div key={`empty-${i}`} className="rounded-[3px] border border-dashed border-[#B9AEA6]" />
              ))
            : null}
        </div>
      ) : null}

      {includePackingList ? (
        <div
          className="flex aspect-[210/297] w-[min(100%,160px)] shrink-0 flex-col gap-1.5 bg-white p-3 text-[7px] text-[#1D1512] shadow-1"
          aria-hidden
        >
          <b className="text-[9px]">Lista de separação · {today}</b>
          <div className="h-px bg-[#ddd]" />
          {labels.slice(0, 6).map((l) => (
            <div key={`pack-${l.orderSn}`} className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 border border-[#333]" />
              <span className="min-w-0 flex-1 truncate">{l.piece}</span>
              <b>1</b>
            </div>
          ))}
        </div>
      ) : null}

      {!includeLabels && !includePackingList ? (
        <p className="py-8 text-center text-sm text-muted">Marque etiquetas ou a lista para ver a prévia.</p>
      ) : null}
    </div>
  );
}

/**
 * Modal de impressão (SHP-84): escolher etiquetas + lista, formato, prévia do PDF.
 * Desktop = Modal wide; celular = BottomSheet.
 */
export function PrintPreviewModal({
  open,
  onOpenChange,
  orderCount,
  includeLabels,
  onIncludeLabelsChange,
  includePackingList,
  onIncludePackingListChange,
  labelFormat,
  onLabelFormatChange,
  previewLabels = [],
  pdfUrl = null,
  onConfirm,
  loading = false,
  confirmLabel = 'Baixar PDF e imprimir',
  description = 'O PDF é gerado com as etiquetas oficiais da Shopee.',
}: PrintPreviewModalProps) {
  const mobile = useIsMobile();
  const pages = useMemo(
    () => pageEstimate(orderCount, includeLabels, includePackingList, labelFormat),
    [orderCount, includeLabels, includePackingList, labelFormat],
  );

  const canConfirm = (includeLabels || includePackingList) && orderCount > 0 && !loading;

  const title: ReactNode = (
    <span className="flex min-w-0 flex-col gap-1">
      <span>Imprimir {orderCount} pedido{orderCount === 1 ? '' : 's'}</span>
      <span className="text-sm font-normal text-muted">{description}</span>
    </span>
  );

  const footer = (
    <>
      <Button variant="outline" size="sm" disabled={loading} onClick={() => onOpenChange(false)}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        size="sm"
        icon={Download}
        loading={loading}
        disabled={!canConfirm}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
    </>
  );

  /** Esquerda = opções; direita = prévia (protótipo Pedidos.dc.html). */
  const body = (
    <div
      className={cn('grid items-start gap-[18px]', mobile ? 'grid-cols-1' : 'grid-cols-2')}
      style={mobile ? undefined : { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)' }}
    >
      <div className="flex min-w-0 flex-col gap-3.5">
        <Eyebrow>O que imprimir</Eyebrow>

        <Checkbox
          checked={includeLabels}
          onChange={(e) => onIncludeLabelsChange(e.target.checked)}
          className={cn(
            'w-full gap-1.5 rounded-md border border-dashed border-line bg-surface-2 px-3 py-3',
            includeLabels && 'border-brand bg-brand-soft',
          )}
          label={
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink">Etiquetas de envio</span>
                <span className="block text-sm text-muted">
                  {orderCount} etiqueta{orderCount === 1 ? '' : 's'}, uma por pedido
                </span>
              </span>
              <Tag size={18} strokeWidth={1.75} aria-hidden className="shrink-0 text-brand-text" />
            </span>
          }
        />

        <Checkbox
          checked={includePackingList}
          onChange={(e) => onIncludePackingListChange(e.target.checked)}
          className={cn(
            'w-full gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-3',
            includePackingList && 'border-dashed border-brand bg-brand-soft',
          )}
          label={
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink">Lista de separação</span>
                <span className="block text-sm text-muted">
                  Agrupada por peça, cor e tamanho · 1 página
                </span>
              </span>
              <ListChecks size={18} strokeWidth={1.75} aria-hidden className="shrink-0 text-brand-text" />
            </span>
          }
        />

        <Eyebrow className="mt-1.5">Formato da etiqueta</Eyebrow>
        <SegmentedControl
          aria-label="Formato da etiqueta"
          value={labelFormat}
          onValueChange={(v) => onLabelFormatChange(v as LabelFormat)}
          disabled={!includeLabels}
          className="w-full max-w-full [&>button]:flex-1"
          options={[
            { value: 'a4', label: 'A4 · 4 por folha' },
            { value: 'thermal', label: 'Térmica 10×15' },
          ]}
        />

        <p className="text-sm text-muted">
          Depois de imprimir, os pedidos ficam com o status{' '}
          <StatusTag icon={Printer} tone="info">
            Etiqueta impressa
          </StatusTag>
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <Eyebrow>Prévia do PDF</Eyebrow>
          <span className="text-sm text-muted">{pages}</span>
        </div>

        {pdfUrl ? (
          <iframe
            title="Prévia do PDF"
            src={pdfUrl}
            className="h-[min(52dvh,420px)] w-full rounded-[14px] border border-line bg-surface-3"
          />
        ) : (
          <PaperPreview
            labels={previewLabels}
            includeLabels={includeLabels}
            includePackingList={includePackingList}
            format={labelFormat}
          />
        )}
      </div>
    </div>
  );

  if (mobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        footer={footer}
      >
        {body}
      </BottomSheet>
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={footer}
      wide
      stackFooter={false}
      className="max-w-[960px]"
    >
      {body}
    </Modal>
  );
}
