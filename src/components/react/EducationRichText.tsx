import type { ReactNode } from 'react';

type Lang = 'es' | 'en';

interface Rule {
  phrase: string;
  className: string;
}

const RULES: Record<Lang, Rule[]> = {
  es: [
    { phrase: 'Magna Cum Laude', className: 'glow-magna-subtle' },
    { phrase: 'Facultad de Educación y Ciencias Sociales', className: 'glow-faculty' },
    { phrase: 'Facultad de Ciencias Empresariales', className: 'glow-faculty' },
    { phrase: 'Escuela de Ingeniería y Construcción', className: 'glow-faculty' },
    { phrase: 'Facultad de Ingeniería', className: 'glow-faculty' },
    { phrase: 'máxima distinción', className: 'glow-academic' },
  ],
  en: [
    { phrase: 'Magna Cum Laude', className: 'glow-magna-subtle' },
    { phrase: 'Faculty of Education and Social Sciences', className: 'glow-faculty' },
    { phrase: 'Faculty of Business Sciences', className: 'glow-faculty' },
    { phrase: 'School of Engineering and Construction', className: 'glow-faculty' },
    { phrase: 'Faculty of Engineering', className: 'glow-faculty' },
    { phrase: 'highest distinction', className: 'glow-academic' },
  ],
};

function renderRichText(text: string, rules: Rule[], keyPrefix = ''): ReactNode {
  if (!text) return null;

  let best: { index: number; rule: Rule } | null = null;
  for (const rule of rules) {
    const index = text.indexOf(rule.phrase);
    if (index === -1) continue;
    if (
      !best ||
      index < best.index ||
      (index === best.index && rule.phrase.length > best.rule.phrase.length)
    ) {
      best = { index, rule };
    }
  }

  if (!best) return text;

  const { index, rule } = best;
  const before = text.slice(0, index);
  const after = text.slice(index + rule.phrase.length);

  return (
    <>
      {renderRichText(before, rules, `${keyPrefix}b`)}
      <span className={rule.className}>{rule.phrase}</span>
      {renderRichText(after, rules, `${keyPrefix}a`)}
    </>
  );
}

interface Props {
  text: string;
  lang: Lang;
}

export function EducationRichText({ text, lang }: Props) {
  return <>{renderRichText(text, RULES[lang])}</>;
}
