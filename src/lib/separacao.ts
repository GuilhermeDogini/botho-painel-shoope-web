import type { PackingGroup, PackingNote } from './types';

/** Máximo alinhado ao back (`PACKING_MAX_BATCH`). */
export const SEPARACAO_MAX_ORDERS = 50;

/** Monta `/separacao?sns=A,B,C` (compartilhável). */
export function separacaoPath(orderSns: ReadonlyArray<string>): string {
  const sns = normalizeOrderSns(orderSns);
  if (!sns.length) return '/separacao';
  return `/separacao?sns=${encodeURIComponent(sns.join(','))}`;
}

export function normalizeOrderSns(raw: ReadonlyArray<string>): string[] {
  return [
    ...new Set(
      raw
        .map((s) => s.trim().toUpperCase())
        .filter((s) => /^[A-Z0-9]{6,32}$/.test(s)),
    ),
  ].slice(0, SEPARACAO_MAX_ORDERS);
}

/** Lê `?sns=` da URL. */
export function parseSeparacaoSns(search: string): string[] {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const raw = params.get('sns');
  if (!raw?.trim()) return [];
  return normalizeOrderSns(raw.split(/[\s,]+/));
}

export interface SeparacaoPrintRow {
  name: string;
  where: string | null;
  color: string;
  size: string;
  qty: number;
  orderSn: string;
  imageUrl: string | null;
}

/** Uma linha por (peça × variação × pedido) — espelha SeparacaoA4.dc.html. */
export function flattenPackingRows(groups: ReadonlyArray<PackingGroup>): SeparacaoPrintRow[] {
  const rows: SeparacaoPrintRow[] = [];
  for (const g of groups) {
    for (const v of g.variants) {
      const color = v.color?.trim() || '—';
      const size = v.size?.trim() || '—';
      for (const line of v.lines) {
        rows.push({
          name: g.name,
          where: g.location,
          color,
          size,
          qty: line.quantity,
          orderSn: line.orderSn,
          imageUrl: g.imageUrl,
        });
      }
    }
  }
  return rows;
}

/** Textos do bloco “Atenção na embalagem”. */
export function packingAttentionLines(notes: ReadonlyArray<PackingNote>): string[] {
  return notes.map((n) => {
    const short = n.orderSn.length > 5 ? n.orderSn.slice(-5) : n.orderSn;
    return `#${short} · ${n.text}`;
  });
}
