import { useEffect, useState } from 'react';
import { getLang, onLangChange } from './lang';
import type { Lang } from '../content/types';

export function useLang(): Lang {
  const [lang, setLangState] = useState<Lang>('es');
  useEffect(() => {
    setLangState(getLang());
    return onLangChange(setLangState);
  }, []);
  return lang;
}
