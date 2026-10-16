/** Mascara o local do e-mail para a tela “link enviado” (ex.: gi•••••@loja.com). */
export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 0) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const keep = Math.min(2, local.length);
  return `${local.slice(0, keep)}•••••@${domain}`;
}
