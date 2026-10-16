import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlobalConnectionBanner } from './GlobalConnectionBanner';
import { AlertChipButton, AlertStrip } from './AlertStrip';

const meta = {
  title: 'Organisms/Faixas',
  parameters: {
    docs: {
      description: {
        component: `
Faixas globais Botho.

## Como deve funcionar
- **GlobalConnectionBanner:** topo de todas as telas; fundo danger; ação **Reconectar** é clicável.
- **AlertStrip:** cada chip é botão/link; \`scroll\` ou \`wrap\`; texto **nunca** truncado.

## Como testar
1. Clique em **Reconectar agora** — a faixa some e aparece o status.
2. Clique nos chips — o rótulo abaixo muda.
3. Viewport ~390 e toolbar Tema.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ConexaoVencida: Story = {
  name: 'Conexão · vencida',
  render: function ConexaoVencidaStory() {
    const [reconnected, setReconnected] = useState(false);
    if (reconnected) {
      return (
        <div className="rounded-xl border border-line bg-surface p-6 text-sm">
          <p className="font-bold text-salvia-text">Conexão renovada (demo).</p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-brand-text underline underline-offset-3"
            onClick={() => setReconnected(false)}
          >
            Mostrar faixa de novo
          </button>
        </div>
      );
    }
    return (
      <div className="overflow-hidden rounded-xl border border-line bg-bg">
        <GlobalConnectionBanner
          action={
            <button type="button" onClick={() => setReconnected(true)}>
              Reconectar agora
            </button>
          }
        >
          A conexão com a Shopee venceu ontem. Pedidos, estoque e chat pararam de atualizar.
        </GlobalConnectionBanner>
        <div className="px-6 py-4 text-sm text-muted">
          Clique em <b className="text-ink">Reconectar agora</b> — a faixa some (demo).
        </div>
      </div>
    );
  },
};

function AlertasDemo({ layout }: { layout: 'scroll' | 'wrap' }) {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div
      className={cnBox(layout)}
    >
      <p className="mb-3 text-sm font-bold">
        {layout === 'scroll' ? 'Início · 390 px' : 'Início · wrap'}
      </p>
      <AlertStrip layout={layout} bleed={layout === 'scroll'}>
        <AlertChipButton
          role="listitem"
          tone="warn"
          cta="Renovar"
          onClick={() => setLast('Renovar conexão')}
        >
          Conexão com a Shopee vence em 12 dias
        </AlertChipButton>
        <AlertChipButton
          role="listitem"
          tone="danger"
          cta="Repor"
          onClick={() => setLast('Repor estoque')}
        >
          5 variações acabando
        </AlertChipButton>
        <AlertChipButton
          role="listitem"
          tone="brand"
          cta="Responder"
          onClick={() => setLast('Abrir chats')}
        >
          3 chats sem resposta
        </AlertChipButton>
        <AlertChipButton
          role="listitem"
          tone="info"
          cta="Ver saldo"
          onClick={() => setLast('Ver saldo de Ads')}
        >
          Saldo de Ads dá para ~2 dias
        </AlertChipButton>
      </AlertStrip>
      <p className="mt-3 min-h-5 text-xs text-muted" aria-live="polite">
        {last ? (
          <>
            Clicou: <b className="text-ink">{last}</b>
          </>
        ) : (
          'Clique em um chip.'
        )}
      </p>
    </div>
  );
}

function cnBox(layout: 'scroll' | 'wrap') {
  return layout === 'scroll'
    ? 'max-w-[390px] rounded-lg border border-line bg-surface p-4'
    : 'max-w-3xl rounded-lg border border-line bg-surface p-4';
}

export const AlertasScroll: Story = {
  name: 'Alertas · scroll',
  render: () => <AlertasDemo layout="scroll" />,
};

export const AlertasWrap: Story = {
  name: 'Alertas · wrap',
  render: () => <AlertasDemo layout="wrap" />,
};
