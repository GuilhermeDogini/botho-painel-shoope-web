import type { Meta, StoryObj } from '@storybook/react-vite';
import { MOCK_COLORS, MOCK_TEAM, mockPantalonaSrc, mockVestidoSrc } from '@/stories/mocks';
import { Avatar } from './Avatar';
import { ColorDot } from './ColorDot';
import { LabelLogo } from './LabelLogo';
import { Logo } from './Logo';
import { Thumbnail } from './Thumbnail';

const meta = {
  title: 'Atoms/Mídia e marca',
  component: Thumbnail,
  parameters: {
    docs: {
      description: {
        component: `
Foto de peça, bolinha de cor, avatar, logo e etiqueta de gola.

## Como deve funcionar
- **Thumbnail:** 3:4 (padrão) ou quadrada; \`object-cover\` (nunca estica). Sem foto ou com erro → cabide.
- **ColorDot:** contorno fino (branco/off-white não somem).
- **Avatar:** inicial estável + cor por nome (ou \`tone\` fixo).
- **Logo:** flor + "botho BRASIL" (cores do tema). **LabelLogo:** etiqueta bordada (cores fixas nos dois temas).

## Como testar
1. Tema claro/escuro — o Logo deve mudar as pétalas; a LabelLogo **não** muda (framboesa fixa).
2. Thumbnail **Sem foto** e **Foto quebrada**: ambos mostram o cabide.
3. ColorDot branco e off-white: o círculo continua visível no fundo claro.
4. Avatars: mesmo nome = mesma cor ao recarregar a story.
        `,
      },
    },
  },
  args: { src: mockVestidoSrc, alt: 'Vestido midi azul anil', size: 'lg', shape: 'portrait' },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'fluid'] },
    shape: { control: 'select', options: ['portrait', 'square'] },
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComFoto: Story = {};

export const Quadrada: Story = {
  args: { src: mockPantalonaSrc, alt: 'Pantalona caramelo', shape: 'square' },
};

export const SemFoto: Story = {
  args: { src: null, alt: 'Conjunto moletom flanelado' },
};

export const FotoQuebrada: Story = {
  args: { src: '/nao-existe.jpg', alt: 'Foto que falhou' },
};

export const Tamanhos: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Thumbnail src={mockVestidoSrc} alt="Vestido" size="sm" />
      <Thumbnail src={mockVestidoSrc} alt="Vestido" size="md" />
      <Thumbnail src={mockVestidoSrc} alt="Vestido" size="lg" />
      <Thumbnail src={null} alt="Sem foto" size="lg" />
      <div className="w-28">
        <Thumbnail src={mockPantalonaSrc} alt="Pantalona" size="fluid" />
      </div>
    </div>
  ),
};

export const Cores: StoryObj<typeof ColorDot> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {MOCK_COLORS.map((c) => (
        <span key={c.name} className="inline-flex items-center gap-2">
          <ColorDot color={c.hex} size="lg" />
          {c.name}
        </span>
      ))}
    </div>
  ),
};

export const Equipe: StoryObj<typeof Avatar> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {MOCK_TEAM.map((p) => (
        <span key={p.name} className="inline-flex items-center gap-2">
          <Avatar name={p.name} />
          <span>
            {p.name}
            <span className="block text-xs text-muted">{p.role}</span>
          </span>
        </span>
      ))}
    </div>
  ),
};

export const Marca: StoryObj<typeof Logo> = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-8">
        <Logo size="sm" />
        <Logo variant="mark" size="md" />
        <Logo size="md" />
      </div>
      <div className="bt-auth-bg flex flex-wrap items-center gap-8 rounded-md p-6">
        <Logo size="md" tone="onFabric" />
        <span className="text-xs font-semibold text-[color:var(--bt-logo-fabric-petal)]">
          tone=onFabric (login claro)
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-6 rounded-md bg-surface-2 p-6">
        <LabelLogo size="lg" word="botho brasil" subtitle="feito com carinho no Brasil" />
        <LabelLogo size="sm" />
        <LabelLogo size="sm" tone="cream" />
      </div>
    </div>
  ),
};
