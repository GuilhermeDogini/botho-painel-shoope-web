import { useQuery } from '@tanstack/react-query';
import { Check, Printer } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PickingList, shortOrderSn } from '@/components/organisms/PickingList';
import { DetailPage } from '@/components/templates/DetailPage';
import { PrintPage } from '@/components/templates/PrintPage';
import { PrintPreviewFrame } from '@/components/templates/PrintPreviewFrame';
import { useCan, useMe } from '@/hooks/useAuth';
import { useMarkPacked } from '@/hooks/useOrders';
import { api, ApiError } from '@/lib/api';
import {
  flattenPackingRows,
  packingAttentionLines,
  parseSeparacaoSns,
  separacaoPath,
} from '@/lib/separacao';

const PRINT_ROWS_PER_PAGE = 12;

/**
 * Página Separação (SHP-87): lista interativa + impressão A4
 * (Separado por / Conferido por).
 */
export function SeparacaoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const me = useMe();
  const canPack = useCan('pedidos.imprimir');

  const orderSns = useMemo(() => parseSeparacaoSns(params.toString()), [params]);
  const printMode = params.get('print') === '1';

  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const markPacked = useMarkPacked();

  const packingQ = useQuery({
    queryKey: ['orders', 'packing-list', orderSns],
    queryFn: () => api.packingList(orderSns),
    enabled: orderSns.length > 0,
  });

  const data = packingQ.data;
  const printRows = useMemo(
    () => (data ? flattenPackingRows(data.groups) : []),
    [data],
  );
  const attention = useMemo(
    () => (data ? packingAttentionLines(data.notes) : []),
    [data],
  );

  const printPages = useMemo(() => {
    if (!printRows.length) return [[] as typeof printRows];
    const pages: (typeof printRows)[] = [];
    for (let i = 0; i < printRows.length; i += PRINT_ROWS_PER_PAGE) {
      pages.push(printRows.slice(i, i + PRINT_ROWS_PER_PAGE));
    }
    return pages;
  }, [printRows]);

  const subtitle = useMemo(() => {
    if (!data) return undefined;
    const n = data.summary.orderCount;
    const p = data.summary.pieceCount;
    return `${n} ${n === 1 ? 'pedido' : 'pedidos'} · ${p} ${p === 1 ? 'peça' : 'peças'} · agrupado por peça, cor e tamanho`;
  }, [data]);

  const printMeta = useMemo(() => {
    if (!data) return undefined;
    const now = new Date();
    const day = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const who = me.data?.name?.trim().split(/\s+/)[0] ?? 'a equipe';
    const n = data.summary.orderCount;
    const p = data.summary.pieceCount;
    return `${capitalize(day)} · ${n} ${n === 1 ? 'pedido' : 'pedidos'} · ${p} ${p === 1 ? 'peça' : 'peças'} · impresso às ${time} por ${who}`;
  }, [data, me.data?.name]);

  const openPrint = useCallback(() => {
    if (!orderSns.length) return;
    const base = separacaoPath(orderSns);
    navigate(base.includes('?') ? `${base}&print=1` : `${base}?print=1`);
  }, [navigate, orderSns]);

  const closePrint = useCallback(() => {
    navigate(separacaoPath(orderSns));
  }, [navigate, orderSns]);

  const doPrint = () => {
    window.print();
  };

  const onMarkPacked = () => {
    if (!orderSns.length || !canPack) return;
    const sns = [...orderSns];
    markPacked.mutate(
      { orderSns: sns, packed: true },
      {
        onSuccess: () => {
          toast.success(
            sns.length === 1
              ? 'Pedido marcado como embalado'
              : `${sns.length} pedidos marcados como embalados`,
            {
              action: {
                label: 'Desfazer',
                onClick: () => {
                  markPacked.mutate(
                    { orderSns: sns, packed: false },
                    {
                      onSuccess: () => toast.message('Marcação desfeita'),
                      onError: (e) => toast.error(e.message),
                    },
                  );
                },
              },
            },
          );
          void packingQ.refetch();
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (!orderSns.length) {
    return (
      <DetailPage
        backLabel="Pedidos"
        onBack={() => navigate('/pedidos')}
        title="Lista de separação"
        description="Escolha pedidos a enviar e abra a lista de novo."
      >
        <EmptyState
          illustration="cabide"
          title="Nenhum pedido selecionado"
          description="Na lista de Pedidos, selecione os que vão sair e toque em Lista de separação."
          action={
            <Button variant="primary" onClick={() => navigate('/pedidos')}>
              Ir para Pedidos
            </Button>
          }
        />
      </DetailPage>
    );
  }

  if (packingQ.isPending && !data) {
    return (
      <div className="flex min-h-[calc(100dvh-9.5rem)] w-full flex-col items-center justify-center px-4 md:min-h-[calc(100dvh-6rem)]">
        <Spinner layout="stack" label="Montando lista de separação…" />
      </div>
    );
  }

  if (packingQ.isError || !data) {
    return (
      <DetailPage
        backLabel="Pedidos"
        onBack={() => navigate('/pedidos')}
        title="Lista de separação"
      >
        <EmptyState
          align="start"
          title="Não deu para montar a lista"
          description={
            packingQ.error instanceof Error
              ? packingQ.error.message
              : 'Tente de novo em instantes.'
          }
          action={
            <Button variant="outline" onClick={() => void packingQ.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      </DetailPage>
    );
  }

  if (printMode) {
    return (
      <div className="flex flex-col gap-4">
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3 shadow-1">
          <p className="text-sm text-muted">Prévia A4 — confira e imprima.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={closePrint}>
              Voltar à lista
            </Button>
            <Button variant="primary" size="sm" icon={Printer} onClick={doPrint}>
              Imprimir
            </Button>
          </div>
        </div>

        <div className="-mx-1 bg-[#E9E1D6] px-2 py-4 print:bg-white print:p-0 sm:mx-0 sm:rounded-lg sm:px-4 md:px-6">
          <p className="print:hidden mb-3 text-center text-xs text-muted">
            Prévia em tamanho A4 — pinça para ampliar se precisar.
          </p>
          <PrintPreviewFrame>
            {printPages.map((pageRows, pageIndex) => (
              <PrintPage
                key={pageIndex}
                title="Lista de separação"
                meta={printMeta}
                pageLabel={`Página ${pageIndex + 1} de ${printPages.length}`}
              >
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b-[1.5px] border-[#1D1512]">
                      <th className="w-9 px-1.5 py-2 font-semibold">OK</th>
                      <th className="w-16 px-1.5 py-2 font-semibold">Foto</th>
                      <th className="px-1.5 py-2 font-semibold">Peça</th>
                      <th className="px-1.5 py-2 font-semibold">Cor</th>
                      <th className="w-16 px-1.5 py-2 font-semibold">Tam.</th>
                      <th className="w-14 px-1.5 py-2 text-right font-semibold">Qtd.</th>
                      <th className="w-[7.5rem] px-1.5 py-2 font-semibold">Pedido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((r, i) => (
                      <tr
                        key={`${r.orderSn}-${r.name}-${r.color}-${r.size}-${i}`}
                        className="border-b border-[#B9AEA6]"
                      >
                        <td className="px-1.5 py-2">
                          <span className="inline-block size-[18px] rounded-[3px] border-[1.5px] border-[#1D1512]" />
                        </td>
                        <td className="px-1.5 py-1.5">
                          {r.imageUrl ? (
                            <img
                              src={r.imageUrl}
                              alt=""
                              className="block h-14 w-[42px] rounded object-cover"
                            />
                          ) : (
                            <span className="block h-14 w-[42px] rounded bg-[#EFE5D7]" />
                          )}
                        </td>
                        <td className="px-1.5 py-2">
                          <span className="font-bold">{r.name}</span>
                          {r.where ? (
                            <span className="mt-0.5 block text-[11.5px] text-[#4A3C36]">
                              {r.where}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-1.5 py-2">{r.color}</td>
                        <td className="px-1.5 py-2 text-[15px] font-bold">{r.size}</td>
                        <td className="px-1.5 py-2 text-right font-display text-lg font-extrabold tabular-nums">
                          {r.qty}
                        </td>
                        <td className="px-1.5 py-2 tabular-nums">{shortOrderSn(r.orderSn)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pageIndex === printPages.length - 1 ? (
                  <div className="mt-4 flex gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-1 rounded border-[1.5px] border-dashed border-[#1D1512] px-3.5 py-3">
                      <b>Atenção na embalagem</b>
                      {attention.length ? (
                        attention.map((line) => (
                          <span key={line} className="text-[#4A3C36]">
                            {line}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#4A3C36]">
                          Nenhum recado especial nesta leva.
                        </span>
                      )}
                    </div>
                    <div className="flex w-[220px] shrink-0 flex-col gap-1.5 rounded border-[1.5px] border-[#1D1512] px-3.5 py-3">
                      <b>Resumo</b>
                      <div className="flex justify-between gap-2">
                        <span>Peças</span>
                        <b className="tabular-nums">{data.summary.pieceCount}</b>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span>Pedidos</span>
                        <b className="tabular-nums">{data.summary.orderCount}</b>
                      </div>
                    </div>
                  </div>
                ) : null}
              </PrintPage>
            ))}
          </PrintPreviewFrame>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      backLabel="Pedidos"
      onBack={() => navigate('/pedidos')}
      title="Lista de separação"
      description={subtitle}
      actions={
        <>
          <Button variant="primary" size="sm" icon={Printer} onClick={openPrint}>
            Imprimir (A4)
          </Button>
          {canPack ? (
            <Button
              variant="outline"
              size="sm"
              icon={Check}
              onClick={onMarkPacked}
              loading={markPacked.isPending}
            >
              Marcar pedidos como embalados
            </Button>
          ) : null}
        </>
      }
    >
      {packingQ.isFetching && data ? (
        <p className="text-sm text-muted">Atualizando…</p>
      ) : null}
      <PickingList
        groups={data.groups}
        notes={data.notes}
        checkedKeys={checkedKeys}
        onCheckedKeysChange={setCheckedKeys}
        empty={data.groups.length === 0}
      />
      {packingQ.isError ? (
        <p className="text-sm text-danger-text">
          {packingQ.error instanceof ApiError
            ? packingQ.error.message
            : 'Falha ao atualizar a lista.'}
        </p>
      ) : null}
    </DetailPage>
  );
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
