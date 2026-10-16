/**
 * Visual comum de Input, Textarea e Select (DesignSystem.dc.html · "Botões e campos"):
 * borda 1,5 px, foco com borda framboesa e anel suave, erro em vermelho (via aria-invalid).
 */
export const fieldControl = [
  'w-full min-w-0 rounded-sm border-[1.5px] border-line-2 bg-surface px-3.5 text-base font-medium text-ink',
  'outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted placeholder:font-normal',
  'focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--bt-brand)_18%,transparent)]',
  'aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--bt-danger)_18%,transparent)]',
  'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted',
].join(' ');
