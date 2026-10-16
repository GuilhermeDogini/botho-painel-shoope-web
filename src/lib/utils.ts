import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Sem isto, o tailwind-merge acha que text-h1/text-big são cores e descarta o tamanho ao lado de text-ink.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['h1', 'h2', 'h3', 'big'],
      shadow: ['1', '2', '3'],
    },
  },
});

/** Junta classes do Tailwind resolvendo conflitos (padrão do shadcn), conhecendo a escala da Botho. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
