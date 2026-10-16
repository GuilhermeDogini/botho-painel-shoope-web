import { useState } from 'react';
import { AlertChipButton, AlertStrip } from '@/components/organisms/AlertStrip';
import { GlobalConnectionBanner } from '@/components/organisms/GlobalConnectionBanner';
import { VitrineGroup, VitrineSection } from './VitrineSection';

export function BannersSection() {
  const [reconnected, setReconnected] = useState(false);
  const [lastChip, setLastChip] = useState<string | null>(null);

  return (
    <VitrineSection
      id="banners"
      task="SHP-60"
      title="Faixas de conexão e alertas"
      note="Clique em Reconectar e nos chips — deve responder. Scroll no celular / wrap no desktop; texto nunca cortado."
    >
      <VitrineGroup label="Conexão vencida · globalbar">
        {reconnected ? (
          <div className="rounded-md border border-line bg-surface p-4 text-sm">
            <p className="font-bold text-salvia-text">Conexão renovada (demo).</p>
            <button
              type="button"
              className="mt-2 cursor-pointer text-sm font-semibold text-brand-text underline underline-offset-3"
              onClick={() => setReconnected(false)}
            >
              Mostrar faixa de novo
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line bg-bg">
            <GlobalConnectionBanner
              action={
                <button type="button" onClick={() => setReconnected(true)}>
                  Reconectar agora
                </button>
              }
            >
              A conexão com a Shopee venceu ontem. Pedidos, estoque e chat pararam de atualizar.
            </GlobalConnectionBanner>
            <div className="px-4 py-3 text-xs text-muted">
              Clique em <b className="text-ink">Reconectar agora</b>.
            </div>
          </div>
        )}
      </VitrineGroup>

      <VitrineGroup label="AlertStrip · scroll (celular)">
        <div className="max-w-[390px] rounded-md border border-line bg-surface p-4">
          <AlertStrip layout="scroll" bleed>
            <AlertChipButton
              role="listitem"
              tone="warn"
              cta="Renovar"
              onClick={() => setLastChip('Renovar conexão')}
            >
              Conexão com a Shopee vence em 12 dias
            </AlertChipButton>
            <AlertChipButton
              role="listitem"
              tone="danger"
              cta="Repor"
              onClick={() => setLastChip('Repor estoque')}
            >
              5 variações acabando
            </AlertChipButton>
            <AlertChipButton
              role="listitem"
              tone="brand"
              cta="Responder"
              onClick={() => setLastChip('Abrir chats')}
            >
              3 chats sem resposta
            </AlertChipButton>
            <AlertChipButton
              role="listitem"
              tone="info"
              cta="Ver saldo"
              onClick={() => setLastChip('Ver saldo de Ads')}
            >
              Saldo de Ads dá para ~2 dias
            </AlertChipButton>
          </AlertStrip>
          <p className="mt-2 min-h-5 text-xs text-muted" aria-live="polite">
            {lastChip ? (
              <>
                Clicou: <b className="text-ink">{lastChip}</b>
              </>
            ) : (
              'Clique em um chip.'
            )}
          </p>
        </div>
      </VitrineGroup>

      <VitrineGroup label="AlertStrip · wrap">
        <div className="rounded-md border border-line bg-surface p-3 sm:p-4">
          <AlertStrip layout="wrap">
            <AlertChipButton
              role="listitem"
              tone="warn"
              cta="Renovar"
              onClick={() => setLastChip('Renovar conexão')}
            >
              Conexão com a Shopee vence em 12 dias
            </AlertChipButton>
            <AlertChipButton
              role="listitem"
              tone="danger"
              cta="Repor"
              onClick={() => setLastChip('Repor estoque')}
            >
              5 variações acabando
            </AlertChipButton>
            <AlertChipButton
              role="listitem"
              tone="brand"
              cta="Responder"
              onClick={() => setLastChip('Abrir chats')}
            >
              3 chats sem resposta
            </AlertChipButton>
            <AlertChipButton
              role="listitem"
              tone="info"
              cta="Ver saldo"
              onClick={() => setLastChip('Ver saldo de Ads')}
            >
              Saldo de Ads dá para ~2 dias
            </AlertChipButton>
          </AlertStrip>
        </div>
      </VitrineGroup>
    </VitrineSection>
  );
}
