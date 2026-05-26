import { content } from '../../content';
import { useLang } from '../../lib/useLang';
import { CategoryIcon, accents, toolIcons } from './CategoryIcons';

export function ToolsAccordion() {
  const lang = useLang();
  const groups = content[lang].tools;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {groups.map((g, i) => {
        const a = accents[i % accents.length];
        const icon = toolIcons[i % toolIcons.length];
        return (
          <article
            key={i}
            className={`relative rounded-2xl border ${a.border} bg-navy-900/55 backdrop-blur-md p-5 md:p-6 flex flex-col overflow-hidden`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${a.stripe}`} />
            <div className="flex items-center gap-3 mb-4">
              <span className={`icon-badge inline-flex h-11 w-11 rounded-xl ${a.bg} border ${a.border} ${a.text} items-center justify-center`}>
                <CategoryIcon name={icon} />
              </span>
              <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                {g.category}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-white/85 leading-relaxed">
              {g.items.map((it, j) => (
                <li key={j} className="flex gap-2">
                  <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${a.ring} shrink-0`} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
