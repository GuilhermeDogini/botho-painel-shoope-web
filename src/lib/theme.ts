// Tema por pessoa: claro, escuro ou automático (segue o sistema). Guardado só neste navegador.
// O index.html aplica a mesma regra antes da primeira pintura.

export type ThemePreference = 'light' | 'dark' | 'auto';

const KEY = 'botho:tema';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

export function readThemePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

export function saveThemePreference(pref: ThemePreference): void {
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // navegador sem armazenamento: o tema vale só até recarregar
  }
}

export function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  return pref === 'auto' ? (media().matches ? 'dark' : 'light') : pref;
}

export function applyTheme(pref: ThemePreference): void {
  const dark = resolveTheme(pref) === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

/** Avisa quando o sistema troca de tema (só importa no modo automático). */
export function onSystemThemeChange(cb: () => void): () => void {
  const m = media();
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}
