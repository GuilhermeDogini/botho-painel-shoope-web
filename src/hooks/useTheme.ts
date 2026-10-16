import { useCallback, useEffect, useState } from 'react';
import { applyTheme, onSystemThemeChange, readThemePreference, resolveTheme, saveThemePreference, type ThemePreference } from '@/lib/theme';

/** Preferência de tema (claro, escuro, automático) e o tema que está valendo agora. */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference);
  const [, rerender] = useState(0);

  useEffect(() => {
    applyTheme(preference);
    if (preference !== 'auto') return;
    return onSystemThemeChange(() => {
      applyTheme('auto');
      rerender((n) => n + 1);
    });
  }, [preference]);

  const set = useCallback((pref: ThemePreference) => {
    saveThemePreference(pref);
    setPreference(pref);
  }, []);

  return { preference, resolved: resolveTheme(preference), setPreference: set };
}
