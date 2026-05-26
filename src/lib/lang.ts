import type { Lang } from '../content/types';

export const LANG_EVENT = 'lang:change';

export function getLang(): Lang {
  if (typeof document === 'undefined') return 'es';
  return ((document.documentElement.dataset.lang as Lang) || 'es') as Lang;
}

export function setLang(lang: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.dataset.lang = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch {}
  window.dispatchEvent(new CustomEvent<Lang>(LANG_EVENT, { detail: lang }));
}

export function onLangChange(cb: (l: Lang) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<Lang>).detail);
  window.addEventListener(LANG_EVENT, handler);
  return () => window.removeEventListener(LANG_EVENT, handler);
}
