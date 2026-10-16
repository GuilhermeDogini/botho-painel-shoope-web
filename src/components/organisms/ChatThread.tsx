import { AlertTriangle, ArrowLeft, Image as ImageIcon, Info, Package, Pencil, Send, Shirt } from 'lucide-react';
import { useState, type FormEvent, type HTMLAttributes } from 'react';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { Tag } from '@/components/atoms/Tag';
import { Textarea } from '@/components/atoms/Textarea';
import { Avatar } from '@/components/atoms/Avatar';
import { FilterChip, FilterChipList } from '@/components/molecules/FilterChip';
import { InlineAlert } from '@/components/molecules/InlineAlert';
import { Modal } from '@/components/organisms/Modal';
import { money } from '@/lib/format';
import type { ChatKind, ChatThread as ChatThreadData, QuickReplyView } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ChatThreadProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  thread: ChatThreadData;
  replies: QuickReplyView[];
  sending?: boolean;
  savingReplies?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onSend: (body: { kind: ChatKind; text: string; ref?: string }) => void;
  onSaveReplies: (replies: Array<{ label: string; body: string }>) => void;
}

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

/**
 * Conversa aberta: pedido fixado, bolhas e compositor com o limite de 5 (SHP-121).
 */
export function ChatThread({
  thread,
  replies,
  sending = false,
  savingReplies = false,
  showBack = false,
  onBack,
  onSend,
  onSaveReplies,
  className,
  ...rest
}: ChatThreadProps) {
  const { conversation, messages, atLimit, limitLabel, streak } = thread;
  const [draft, setDraft] = useState('');
  const [kind, setKind] = useState<ChatKind>('TEXT');
  const [editing, setEditing] = useState(false);
  const [replyDraft, setReplyDraft] = useState<Array<{ label: string; body: string }>>([]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || atLimit || sending) return;
    const ref = kind === 'ORDER' ? conversation.orderSn ?? undefined : undefined;
    onSend({ kind, text, ref });
    setDraft('');
    setKind('TEXT');
  }

  function openEditor() {
    setReplyDraft(replies.map((reply) => ({ label: reply.label, body: reply.body })));
    setEditing(true);
  }

  const placeholder = atLimit
    ? 'Aguardando resposta da compradora'
    : kind === 'PRODUCT'
      ? 'Nome da peça para enviar'
      : kind === 'ORDER'
        ? 'Recado junto com o pedido'
        : 'Escreva uma mensagem';

  return (
    <section
      {...rest}
      aria-label={`Conversa com ${conversation.buyerName}`}
      className={cn('flex min-h-0 min-w-0 flex-1 flex-col bg-bg', className)}
    >
      <div className="flex shrink-0 items-center gap-2.5 border-b border-line bg-surface px-4 py-3">
        {showBack ? (
          <IconButton className="md:hidden" icon={ArrowLeft} label="Voltar para conversas" onClick={onBack} />
        ) : null}
        <Avatar name={conversation.buyerName} />
        <div className="min-w-0 flex-1">
          <div className="font-bold">{conversation.buyerName}</div>
          {conversation.buyerNote ? <div className="truncate text-xs text-muted">{conversation.buyerNote}</div> : null}
        </div>
        {conversation.orderSn ? (
          <IconButton icon={Package} label="Ver pedido" onClick={() => { window.location.assign(`/pedidos/${conversation.orderSn}`); }} />
        ) : null}
      </div>

      {conversation.orderSn ? (
        <a
          href={`/pedidos/${conversation.orderSn}`}
          className="mx-4 mt-3 flex shrink-0 items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3 text-inherit no-underline"
        >
          <Package size={16} className="shrink-0 text-muted" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{conversation.orderTitle ?? `Pedido #${conversation.orderSn}`}</span>
            <span className="text-xs text-muted">
              Pedido #{conversation.orderSn}
              {conversation.orderAmount != null ? ` · ${money(conversation.orderAmount)}` : ''}
            </span>
          </span>
          {conversation.orderDueLabel ? (
            <Tag icon={AlertTriangle} tone="danger">
              {conversation.orderDueLabel}
            </Tag>
          ) : null}
        </a>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'max-w-[85%] rounded-lg px-3 py-2 text-sm',
              message.direction === 'SELLER' ? 'self-end bg-brand text-brand-ink' : 'self-start bg-surface-2 text-ink',
            )}
          >
            {message.kind !== 'TEXT' ? (
              <span className="mb-0.5 block text-xs font-bold opacity-80">
                {message.kind === 'PHOTO' ? 'Foto' : message.kind === 'PRODUCT' ? 'Peça' : 'Pedido'}
              </span>
            ) : null}
            {message.body}
            <span className="mt-1 block text-right text-[11px] opacity-70">{clock(message.createdAt)}</span>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="flex shrink-0 flex-col gap-2.5 border-t border-line bg-surface px-3 pt-2.5 pb-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={cn('inline-flex items-center gap-1.5', atLimit ? 'font-bold text-danger-text' : streak >= 3 ? 'font-bold text-mostarda-text' : 'text-muted')}>
            {atLimit ? <AlertTriangle size={14} aria-hidden /> : <Info size={14} aria-hidden />}
            {limitLabel}
          </span>
          <Button type="button" variant="link" size="sm" icon={Pencil} onClick={openEditor}>
            Editar respostas
          </Button>
        </div>
        {atLimit ? (
          <InlineAlert tone="warn">
            A Shopee permite até 5 mensagens seguidas sem resposta da compradora. Espere {conversation.buyerName} responder para mandar mais.
          </InlineAlert>
        ) : null}
        <FilterChipList layout="scroll" aria-label="Respostas rápidas">
          {replies.map((reply) => (
            <FilterChip key={reply.id} disabled={atLimit || sending} onClick={() => setDraft(reply.body)}>
              {reply.label}
            </FilterChip>
          ))}
        </FilterChipList>
        <div className="flex min-w-0 items-center gap-1.5">
          <IconButton
            icon={ImageIcon}
            label="Enviar foto"
            bordered
            disabled={atLimit || sending}
            onClick={() => document.getElementById('chat-photo')?.click()}
          />
          <input
            id="chat-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file || atLimit) return;
              onSend({ kind: 'PHOTO', text: file.name, ref: file.name });
            }}
          />
          <IconButton
            icon={Shirt}
            label="Enviar produto"
            bordered
            disabled={atLimit || sending}
            onClick={() => setKind((current) => (current === 'PRODUCT' ? 'TEXT' : 'PRODUCT'))}
          />
          <IconButton
            icon={Package}
            label="Enviar pedido"
            bordered
            disabled={atLimit || sending || !conversation.orderSn}
            onClick={() => {
              if (!conversation.orderSn) return;
              onSend({
                kind: 'ORDER',
                text: conversation.orderTitle ?? `Pedido #${conversation.orderSn}`,
                ref: conversation.orderSn,
              });
            }}
          />
          <input
            className="min-h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-sm"
            value={draft}
            placeholder={placeholder}
            aria-label="Mensagem"
            disabled={atLimit || sending}
            onChange={(event) => setDraft(event.target.value)}
          />
          <IconButton icon={Send} label="Enviar mensagem" disabled={atLimit || sending || !draft.trim()} onClick={() => submit()} className="bg-brand text-brand-ink hover:bg-brand" />
        </div>
      </form>

      <Modal
        open={editing}
        onOpenChange={setEditing}
        title="Respostas rápidas"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={savingReplies}
              onClick={() => {
                onSaveReplies(replyDraft.filter((reply) => reply.label.trim() && reply.body.trim()));
                setEditing(false);
              }}
            >
              Salvar respostas
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {replyDraft.map((reply, index) => (
            <label key={`${reply.label}-${index}`} className="flex flex-col gap-1 text-sm font-bold">
              <input
                className="min-h-10 rounded-md border border-line bg-surface px-3 font-normal"
                aria-label={`Nome da resposta ${index + 1}`}
                value={reply.label}
                onChange={(event) =>
                  setReplyDraft((rows) => rows.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))
                }
              />
              <Textarea
                aria-label={`Texto da resposta ${index + 1}`}
                value={reply.body}
                rows={3}
                onChange={(event) =>
                  setReplyDraft((rows) => rows.map((row, i) => (i === index ? { ...row, body: event.target.value } : row)))
                }
              />
            </label>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setReplyDraft((rows) => [...rows, { label: 'Nova resposta', body: '' }])}
          >
            Nova resposta
          </Button>
        </div>
      </Modal>
    </section>
  );
}
