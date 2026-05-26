import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { content } from '../../content';
import { useLang } from '../../lib/useLang';
import { site, calcAge } from '../../config/site';
import { MetricCounter } from './MetricCounter';

const portraits = [
  { src: '/images/profile.jpg', treatment: 'color' as const },
  { src: '/images/hero-desert.jpg', treatment: 'desaturated' as const },
  { src: '/images/hero-industrial-2008.jpg', treatment: 'desaturated' as const },
];

export function Hero() {
  const lang = useLang();
  const current = content[lang];
  const t = current.ui;
  const reader = current.reader;
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const age = calcAge();

  const portrait = portraits[idx];
  const portraitAlt = `${site.name} — ${t.hero.portraitLabels[idx]}`;

  return (
    <section id="inicio" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div className="container-x relative">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 14 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-1 lg:order-1"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-glass border border-white/10">
                <div className="doc-photo-label absolute left-4 bottom-4 z-20">
                  <span className="doc-photo-label-eyebrow">{reader.photoLabels.hero[idx].eyebrow}</span>
                  <span className="doc-photo-label-detail">{reader.photoLabels.hero[idx].detail}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={portrait.src}
                    src={portrait.src}
                    alt={portraitAlt}
                    loading="eager"
                    decoding="async"
                    initial={reduce ? {} : { opacity: 0, scale: 1.02 }}
                    animate={reduce ? {} : { opacity: 1, scale: 1 }}
                    exit={reduce ? {} : { opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter:
                        portrait.treatment === 'desaturated'
                          ? 'saturate(0.7) contrast(1.05) brightness(0.95)'
                          : 'none',
                    }}
                  />
                </AnimatePresence>
                {portrait.treatment === 'desaturated' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/45 via-transparent to-navy-900/25" />
                )}
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIdx((idx + 1) % portraits.length)}
                  aria-label={lang === 'es' ? 'Cambiar fotografía' : 'Change photograph'}
                  className="icon-inline hero-portrait-switch inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold-400/70 bg-gold-400/15 hover:bg-gold-400/25 text-gold-400 text-xs font-semibold tracking-wide transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  {lang === 'es' ? 'Cambiar foto' : 'Change photo'}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 18 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="order-2 lg:order-2"
          >
            <span className="hero-availability-pill inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold tracking-[0.18em] uppercase">
              <span className="hero-availability-signal" aria-hidden="true" />
              {t.hero.availability}
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              {site.name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gold-400 font-semibold">
              {t.hero.role}
            </p>
            <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed max-w-2xl">
              {t.hero.industries}
            </p>
            <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed max-w-2xl">
              {t.hero.summary}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#cv" className="btn-primary">
                {t.cta.viewCv}
              </a>
              <a href="#contacto" className="btn-ghost btn-contact-glow">
                {t.cta.contact}
              </a>
              <a href={site.whatsappUrl} target="_blank" rel="noopener" className="btn-outline">
                {t.cta.whatsapp}
              </a>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-3 max-w-[54rem] md:grid-cols-5 md:gap-4">
              {t.hero.metrics.map((m, i) => {
                const isWideMetric = i === 1;
                return (
                  <div
                    key={i}
                    className={`glass rounded-2xl p-4 min-w-0 ${isWideMetric ? 'col-span-2 md:col-span-2' : 'md:col-span-1'}`}
                  >
                    {isWideMetric ? (
                      <div className="flex min-w-0 items-end gap-1.5">
                        <MetricCounter
                          value={m.value}
                          prefix={m.prefix}
                          suffix=""
                          duration={4200}
                          locale={lang === 'es' ? 'es-CL' : 'en-US'}
                          className="block min-w-0 whitespace-nowrap font-bold text-gold-400 leading-none tracking-[-0.035em] text-[1.28rem] sm:text-[1.55rem] md:text-[1.72rem] lg:text-[1.95rem]"
                        />
                        <span className="shrink-0 pb-0.5 text-sm sm:text-base md:text-lg font-semibold text-gold-400/90">
                          km
                        </span>
                      </div>
                    ) : (
                      <MetricCounter
                        value={m.value}
                        prefix={m.prefix}
                        suffix={m.suffix}
                        duration={2100}
                        locale={lang === 'es' ? 'es-CL' : 'en-US'}
                        className="block min-w-0 whitespace-nowrap font-bold text-gold-400 leading-none tracking-tight text-2xl md:text-3xl"
                      />
                    )}
                    <p className="mt-1 text-[11px] md:text-xs text-white/70 leading-snug">
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-[11px] text-white/45 uppercase tracking-[0.18em]">
              {t.labels.based} · {t.labels.born} · {age} {t.labels.yearsOld}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
