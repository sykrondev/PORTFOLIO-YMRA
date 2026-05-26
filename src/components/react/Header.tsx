import { useState } from 'react';
import { content } from '../../content';
import { site } from '../../config/site';
import { useLang } from '../../lib/useLang';
import { setLang } from '../../lib/lang';
import { useTheme } from '../../lib/useTheme';
import { setTheme } from '../../lib/theme';

const navItems = [
  { id: 'inicio', key: 'home' as const },
  { id: 'perfil', key: 'profile' as const },
  { id: 'propuestas', key: 'propositions' as const },
  { id: 'resultados', key: 'results' as const },
  { id: 'experiencia', key: 'experience' as const },
  { id: 'galeria', key: 'gallery' as const },
  { id: 'formacion', key: 'education' as const },
  { id: 'licencias', key: 'licenses' as const },
  { id: 'certificaciones', key: 'certs' as const },
  { id: 'herramientas', key: 'tools' as const },
  { id: 'cv', key: 'cv' as const },
  { id: 'contacto', key: 'contact' as const },
];

type NavKey = (typeof navItems)[number]['key'];

export function Header() {
  const lang = useLang();
  const theme = useTheme();
  const t = content[lang].ui;
  const [open, setOpen] = useState(false);

  const navLabelFull = (k: NavKey) =>
    k === 'cv' ? 'CV' : (t.nav as Record<string, string>)[k];

  const navLabelShort = (k: NavKey) =>
    k === 'cv' ? 'CV' : (t.navShort as Record<string, string>)[k];

  const toggleLang = () => setLang(lang === 'es' ? 'en' : 'es');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const langState = lang === 'es' ? 'Español' : 'English';
  const themeState =
    theme === 'dark'
      ? lang === 'es'
        ? 'Oscuro'
        : 'Dark'
      : lang === 'es'
        ? 'Claro'
        : 'Light';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-3 md:pt-4">
      <div className="container-x flex flex-col gap-2">
        <div className="glass rounded-full pl-2 pr-2 py-1.5 flex items-center gap-1.5 shadow-glass">
          <a href="#inicio" className="flex items-center gap-2 pl-1 pr-1.5 py-0.5 shrink-0">
            <span className="inline-flex h-7 w-7 rounded-md bg-gold-600 text-navy-950 items-center justify-center font-bold text-[11px]">
              YR
            </span>
            <span className="font-semibold tracking-tight hidden lg:inline text-sm">
              {site.shortName}
            </span>
          </a>

          <nav className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-0.5 overflow-x-auto px-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                title={navLabelFull(item.key)}
                className="px-2 py-1 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {navLabelShort(item.key)}
              </a>
            ))}
          </nav>

          <button
            className="icon-button xl:hidden inline-flex items-center justify-center h-7 w-7 rounded-full hover:bg-white/10 ml-auto"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={toggleLang}
            aria-label={lang === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
            title={lang === 'es' ? 'English' : 'Español'}
            className="glass px-4 py-1.5 rounded-full border border-white/15 text-xs font-semibold shadow-glass hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14M12 4v4" />
              <path d="M14 19l4-10 4 10M15.5 16h5" />
              <path d="M9 8c0 4-2 7-5 8M4 12c1.5 2 3 3 5 4" />
            </svg>
            <span>{langState}</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label={lang === 'es' ? 'Cambiar tema' : 'Toggle theme'}
            title={themeState}
            className="glass px-4 py-1.5 rounded-full border border-white/15 text-xs font-semibold shadow-glass hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
          >
            {theme === 'dark' ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span>{themeState}</span>
          </button>
        </div>

        {open && (
          <div className="xl:hidden mt-2 glass rounded-2xl p-3 shadow-glass">
            <nav className="grid grid-cols-2 gap-1 text-sm">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {navLabelFull(item.key)}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
