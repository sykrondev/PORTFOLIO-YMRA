import { useEffect, useState } from 'react';
import { content } from '../../content';
import { useLang } from '../../lib/useLang';

export function BackToTop() {
  const lang = useLang();
  const [visible, setVisible] = useState(false);
  const t = content[lang].ui.cta.backToTop;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      id="backToTop"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t}
      title={t}
      className="back-to-top-btn icon-button fixed bottom-6 right-6 z-30 h-11 w-11 rounded-full bg-navy-900 text-gold-400 shadow-glass border border-white/10 hover:bg-navy-800 transition-colors flex items-center justify-center"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
