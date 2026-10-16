import { Bell, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';

const NOTIFY_KEY = 'botho:chat-avisar';

function readNotify(): boolean {
  try {
    return localStorage.getItem(NOTIFY_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Chat ainda sem a permissão da Shopee (SHP-121). Quem pede a liberação é o painel, no console da Shopee.
 */
export function ChatBlocked() {
  const [notify, setNotify] = useState(readNotify);

  function toggleNotify() {
    const next = !notify;
    setNotify(next);
    try {
      localStorage.setItem(NOTIFY_KEY, next ? '1' : '0');
    } catch {
      // Sem armazenamento local o aviso fica só nesta visita.
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-3.5 rounded-lg border border-line bg-surface px-7 py-8 text-center">
      <Tag icon={Clock} tone="info">
        Aguardando liberação
      </Tag>
      <h1 className="font-display text-[26px] leading-tight font-bold">O chat ainda não foi liberado pela Shopee</h1>
      <p className="max-w-[440px] text-ink-2">
        Para responder compradoras por aqui, a Shopee precisa liberar o acesso ao chat para o painel. A gente cuida do
        pedido de permissão. Enquanto isso, as conversas continuam no app da Shopee.
      </p>
      <ol className="m-0 flex w-full max-w-[380px] list-none flex-col gap-2.5 p-0 text-left">
        <li className="flex items-center gap-3">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-ink">
            1
          </span>
          <span>
            <b>Pedir acesso à Shopee</b>
            <span className="block text-sm text-muted">Próximo passo · feito pelo painel</span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold">
            2
          </span>
          <span>
            <b>A Shopee analisa</b>
            <span className="block text-sm text-muted">Costuma levar alguns dias úteis</span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold">
            3
          </span>
          <span>
            <b>Conversas aparecem aqui</b>
            <span className="block text-sm text-muted">Com pedido fixado e respostas rápidas</span>
          </span>
        </li>
      </ol>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="primary"
          icon={ExternalLink}
          onClick={() => window.open('https://seller.shopee.com.br', '_blank', 'noopener,noreferrer')}
        >
          Abrir chat na Shopee
        </Button>
        <Button type="button" variant={notify ? 'soft' : 'outline'} icon={Bell} onClick={toggleNotify}>
          {notify ? 'Vamos te avisar' : 'Me avise quando liberar'}
        </Button>
      </div>
    </div>
  );
}
