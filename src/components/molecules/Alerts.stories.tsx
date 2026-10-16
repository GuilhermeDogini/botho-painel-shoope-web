import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/atoms/Button';
import { notify, notifyError, notifySuccess } from '@/lib/notify';
import { InlineAlert } from './InlineAlert';
import { Toast } from './Toast';

const meta = {
  title: 'Molecules/Avisos',
  component: InlineAlert,
  parameters: {
    docs: {
      description: {
        component: `
Toast (topo) e faixas InlineAlert.

## Como deve funcionar
- **InlineAlert:** tons \`info\`, \`warn\`, \`danger\`, \`ok\` — ícone + texto (nunca só cor).
- **Toast:** cartão ink com ação "Desfazer" e animação \`toastin\`. Ao vivo usa Sonner via \`notify()\` / \`AppToaster\` no **topo** (não cobre a nav inferior do celular).
- Empilhar: vários toasts no topo com gap; no máximo 4 visíveis.

## Como testar
1. Tema claro/escuro — toast ink e ícone sálvia legíveis nos dois.
2. Story **Disparar toasts**: clique nos botões; confira entrada animada e "Desfazer".
3. Redimensione ~390 px: toast largo, ainda no topo (não embaixo da tela).
4. InlineAlert: os quatro tons lado a lado.
        `,
      },
    },
  },
  args: {
    tone: 'warn',
    children: 'Saldo de Ads dá para ~2 dias.',
  },
  argTypes: {
    tone: { control: 'select', options: ['info', 'warn', 'danger', 'ok'] },
    children: { control: 'text' },
    icon: { control: false, table: { disable: true } },
    action: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Faixas: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <InlineAlert tone="warn">Saldo de Ads dá para ~2 dias.</InlineAlert>
      <InlineAlert tone="info">Fotos 3:4 vendem mais.</InlineAlert>
      <InlineAlert tone="danger">A conexão caiu.</InlineAlert>
      <InlineAlert tone="ok">Tudo sincronizado.</InlineAlert>
    </div>
  ),
};

export const ToastEstatico: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Toast actionLabel="Desfazer" onAction={() => undefined} animate={false}>
        3 etiquetas prontas.
      </Toast>
      <Toast onDismiss={() => undefined} animate={false}>
        Pedido #K7Q2M atualizado.
      </Toast>
    </div>
  ),
};

export const DispararToasts: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Button
        variant="primary"
        onClick={() =>
          notify('3 etiquetas prontas.', {
            action: { label: 'Desfazer', onClick: () => notify('Desfeito.') },
          })
        }
      >
        Toast com Desfazer
      </Button>
      <Button variant="soft" onClick={() => notifySuccess('Peça publicada na Shopee')}>
        Sucesso
      </Button>
      <Button variant="outline" onClick={() => notifyError('Não deu para renovar o token')}>
        Erro
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          notify('Primeiro aviso');
          notify('Segundo aviso');
          notify('Terceiro aviso');
        }}
      >
        Empilhar 3
      </Button>
      <p className="text-sm text-muted">Os toasts aparecem no topo da janela (não embaixo, onde fica a nav do celular).</p>
    </div>
  ),
};
