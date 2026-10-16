import { useEffect, useState } from 'react';

/**
 * Acompanha um `matchMedia`. No SSR / primeiro paint sem `window`, devolve `false`.
 * Usado pelo ConfirmDialog para escolher Modal (desktop) ou BottomSheet (celular).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Celular Botho: abaixo de `md` (768 px). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
