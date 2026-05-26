import { useEffect, useState } from 'react';
import { getTheme, onThemeChange } from './theme';
import type { Theme } from './theme';

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const theme = document.documentElement.dataset.theme;
    if (theme === 'light' || theme === 'dark') return theme;
  }
  return 'dark';
}

export function useTheme(): Theme {
  const [t, setT] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    setT(getTheme());
    return onThemeChange(setT);
  }, []);
  return t;
}
