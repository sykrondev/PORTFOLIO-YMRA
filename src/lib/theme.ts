export type Theme = 'dark' | 'light';
export const THEME_EVENT = 'theme:change';

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return ((document.documentElement.dataset.theme as Theme) || 'dark') as Theme;
}

export function setTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {}
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

export function onThemeChange(cb: (t: Theme) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<Theme>).detail);
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}
