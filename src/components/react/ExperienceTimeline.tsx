import { useState } from 'react';
import { content } from '../../content';
import { getCompanyLogo } from '../../config/companyLogos';
import type { CompanySlug } from '../../config/companyLogos';
import { useLang } from '../../lib/useLang';
import { accents } from './CategoryIcons';
import { LogoPlaque } from './LogoPlaque';

/** Per-index timeline/card accents — index-aligned with `accents` from CategoryIcons. */
const expExtras = [
  {
    badgeBorderClosed: 'border-exec-blue/35',
    dotRing: 'ring-exec-blue/12',
    dotRingOpen: 'ring-exec-blue/28',
    cardHover: 'hover:border-exec-blue/28',
    cardOpenBorder: 'border-exec-blue/45',
    cardOpenShadow: 'shadow-[0_8px_32px_-12px_rgba(31,111,235,0.28)]',
    badgeOpenShadow: 'shadow-[0_0_14px_rgba(31,111,235,0.28)]',
    btnOpen: 'border-exec-blue/50 bg-exec-blue/10 text-exec-blue',
    btnClosed: 'border-exec-blue/40 bg-exec-blue/10 text-exec-blue hover:bg-exec-blue/15',
  },
  {
    badgeBorderClosed: 'border-gold-600/35',
    dotRing: 'ring-gold-600/12',
    dotRingOpen: 'ring-gold-500/28',
    cardHover: 'hover:border-gold-600/28',
    cardOpenBorder: 'border-gold-600/45',
    cardOpenShadow: 'shadow-[0_8px_32px_-12px_rgba(200,155,60,0.35)]',
    badgeOpenShadow: 'shadow-[0_0_14px_rgba(200,155,60,0.28)]',
    btnOpen: 'border-gold-500/50 bg-gold-500/10 text-gold-300',
    btnClosed: 'border-gold-600/40 bg-gold-600/10 text-gold-400 hover:bg-gold-600/15',
  },
  {
    badgeBorderClosed: 'border-exec-green/35',
    dotRing: 'ring-exec-green/12',
    dotRingOpen: 'ring-exec-green/28',
    cardHover: 'hover:border-exec-green/28',
    cardOpenBorder: 'border-exec-green/45',
    cardOpenShadow: 'shadow-[0_8px_32px_-12px_rgba(31,157,85,0.28)]',
    badgeOpenShadow: 'shadow-[0_0_14px_rgba(31,157,85,0.28)]',
    btnOpen: 'border-exec-green/50 bg-exec-green/15 text-exec-green',
    btnClosed: 'border-exec-green/45 bg-exec-green/15 text-exec-green hover:bg-exec-green/20',
  },
  {
    badgeBorderClosed: 'border-[#0ea5b7]/35',
    dotRing: 'ring-[#0ea5b7]/12',
    dotRingOpen: 'ring-[#3bbfd1]/28',
    cardHover: 'hover:border-[#0ea5b7]/35',
    cardOpenBorder: 'border-[#0ea5b7]/45',
    cardOpenShadow: 'shadow-[0_8px_32px_-12px_rgba(14,165,183,0.28)]',
    badgeOpenShadow: 'shadow-[0_0_14px_rgba(59,191,209,0.28)]',
    btnOpen: 'border-[#0ea5b7]/50 bg-[#0ea5b7]/15 text-[#3bbfd1]',
    btnClosed: 'border-[#0ea5b7]/45 bg-[#0ea5b7]/15 text-[#3bbfd1] hover:bg-[#0ea5b7]/20',
  },
  {
    badgeBorderClosed: 'border-[#dd6e3a]/35',
    dotRing: 'ring-[#dd6e3a]/12',
    dotRingOpen: 'ring-[#e08a4f]/28',
    cardHover: 'hover:border-[#dd6e3a]/35',
    cardOpenBorder: 'border-[#dd6e3a]/45',
    cardOpenShadow: 'shadow-[0_8px_32px_-12px_rgba(221,110,58,0.28)]',
    badgeOpenShadow: 'shadow-[0_0_14px_rgba(224,138,79,0.28)]',
    btnOpen: 'border-[#dd6e3a]/50 bg-[#dd6e3a]/15 text-[#e08a4f]',
    btnClosed: 'border-[#dd6e3a]/45 bg-[#dd6e3a]/15 text-[#e08a4f] hover:bg-[#dd6e3a]/20',
  },
] as const;

function ExperienceLogoRail({ slugs }: { slugs: CompanySlug[] }) {
  const hasLogos = slugs.length > 0;

  return (
    <aside
      className={`experience-logo-rail order-1 sm:order-2 ${hasLogos ? 'flex' : 'hidden sm:flex'} flex-row flex-wrap sm:flex-col items-center sm:items-center justify-center sm:justify-center gap-3 sm:gap-3.5 shrink-0 w-full sm:w-[6.75rem] md:w-[7.5rem] sm:self-stretch sm:pt-8 md:pt-10`}
      aria-hidden={hasLogos ? undefined : true}
      aria-label={hasLogos ? 'Company logos' : undefined}
    >
      {slugs.map((slug) => {
        const logo = getCompanyLogo(slug);
        if (logo.textOnly || !logo.src) {
          return (
            <span key={slug} className="company-name-chip company-name-chip-experience">
              {logo.label}
            </span>
          );
        }
        return (
          <LogoPlaque
            key={slug}
            src={logo.src}
            srcDark={logo.srcDark}
            alt={logo.label}
            className={`logo-plaque-experience ${logo.wide ? 'logo-plaque-experience-wide' : ''}`}
          />
        );
      })}
    </aside>
  );
}

function primaryYear(period: string): string {
  return period.match(/\d{4}/)?.[0] ?? '';
}

export function ExperienceTimeline() {
  const lang = useLang();
  const items = content[lang].experience;
  const t = content[lang].ui;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ol className="relative border-l border-white/15 pl-14 md:pl-16 space-y-6">
      {items.map((exp, i) => {
        const isOpen = open === i;
        const hasExtended = !!(exp.extended && exp.extended.length > 0);
        const year = exp.timelineMark ?? primaryYear(exp.period);
        const accentIdx = i % accents.length;
        const a = accents[accentIdx];
        const x = expExtras[accentIdx];
        const secondary = accents[(accentIdx + 2) % accents.length];

        return (
          <li key={i} className="relative">
            <span
              className={`timeline-year-mark absolute -left-[52px] md:-left-[58px] top-1 inline-flex items-center gap-1.5 transition-all ${
                isOpen ? 'timeline-year-mark-active' : ''
              }`}
            >
              <span
                className={`min-w-[2.5rem] px-1.5 py-0.5 rounded-md text-[10px] md:text-xs font-bold text-center border ${
                  isOpen
                    ? `${a.border} ${a.bg} ${a.text} ${x.badgeOpenShadow}`
                    : `${x.badgeBorderClosed} bg-navy-900/70 ${a.text}`
                }`}
              >
                {year}
              </span>
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${
                  isOpen
                    ? `${a.ring} ${x.dotRingOpen} scale-110`
                    : `${a.ring} ${x.dotRing}`
                }`}
              />
            </span>
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 md:gap-5">
              <article
                className={`order-2 sm:order-1 flex-1 min-w-0 rounded-2xl border backdrop-blur-md p-5 md:p-6 transition-all ${
                  isOpen
                    ? `${x.cardOpenBorder} bg-navy-900/75 ${x.cardOpenShadow}`
                    : `border-white/10 bg-navy-900/50 ${x.cardHover}`
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className={`text-xs uppercase tracking-[0.22em] font-semibold ${a.text}`}>
                    {exp.period}
                  </p>
                  <p className="text-xs text-white/55">{exp.location}</p>
                </div>
                <h3 className="mt-1 text-lg md:text-xl font-bold text-white">{exp.role}</h3>
                <p className={`mt-2 text-sm font-semibold ${a.text}`}>{exp.company}</p>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">{exp.scope}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-white/85">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2">
                      <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${a.ring} shrink-0`} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {hasExtended && (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 border transition-colors ${
                        isOpen ? x.btnOpen : x.btnClosed
                      }`}
                    >
                      {isOpen ? t.cta.seeLess : t.cta.seeMore}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform .2s',
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isOpen && (
                      <ul className="mt-4 space-y-1.5 text-sm text-white/80 border-t border-white/10 pt-4">
                        {exp.extended!.map((d, k) => (
                          <li key={k} className="flex gap-2">
                            <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${secondary.ring} shrink-0`} />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </article>
              <ExperienceLogoRail slugs={exp.logos ?? []} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
