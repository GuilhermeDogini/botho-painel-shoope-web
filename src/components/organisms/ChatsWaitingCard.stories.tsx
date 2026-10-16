import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { ChatsWaitingCard } from './ChatsWaitingCard';
import { INICIO_CHATS } from './inicioFixtures';

const meta = {
  title: 'Organisms/ChatsWaitingCard',
  component: ChatsWaitingCard,
  parameters: {
    docs: {
      description: {
        component: `
Esperando resposta (SHP-73): chats sem resposta da loja.

## Como testar
1. Clique em Abrir e num chat — toast de demo.
2. Tab / foco no item: o contorno não cola no conteúdo.
3. Viewport 390: mensagem truncada, sem scroll horizontal.
        `,
      },
    },
  },
} satisfies Meta<typeof ChatsWaitingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    waitingCount: 3,
    chats: INICIO_CHATS.map((c) => ({
      ...c,
      onClick: () => toast.message(c.name, { description: c.message }),
    })),
    onOpen: () => toast.message('Abrir conversas'),
  },
};

export const Vazio: Story = {
  args: {
    chats: [],
    onOpen: () => toast.message('Abrir conversas'),
  },
};
