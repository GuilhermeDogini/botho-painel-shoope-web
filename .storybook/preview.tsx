import type { Preview, Decorator } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import { AppToaster } from '../src/components/molecules/AppToaster';
import '../src/index.css';

/**
 * Toolbar "Tema": aplica a classe .dark no <html>, igual ao painel (lib/theme.ts).
 * Use nas stories para conferir claro e escuro sem sair do Storybook.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
  const dark = theme === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  document.body.style.background = 'var(--bt-bg)';
  document.body.style.color = 'var(--bt-ink)';
  document.body.style.margin = '0';
  document.body.style.minHeight = '100vh';
  return <Story />;
};

/** Algumas stories usam <Link> (asChild do Button); o MemoryRouter evita erro fora do app. */
const withRouter: Decorator = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

/** Toasts ao vivo nas stories (Sonner no topo — não cobre nav inferior). */
const withToaster: Decorator = (Story) => (
  <>
    <Story />
    <AppToaster />
  </>
);

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme, withRouter, withToaster],
  globalTypes: {
    theme: {
      name: 'Tema',
      description: 'Tema claro ou escuro da Botho (classe .dark no html)',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Claro', icon: 'sun' },
          { value: 'dark', title: 'Escuro', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      // Esconde props HTML/evento que virariam campo de texto sem uso na revisão.
      exclude: /^(className|style|id|key|ref|.*Ref|on[A-Z].*|dangerouslySetInnerHTML|suppress.*)$/,
    },
    options: {
      storySort: {
        order: ['Introdução', 'Atoms', 'Molecules', 'Organisms', 'Templates'],
      },
    },
    a11y: { test: 'todo' },
    backgrounds: { disable: true },
  },
};

export default preview;
