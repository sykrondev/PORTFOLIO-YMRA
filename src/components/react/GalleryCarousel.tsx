import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { content } from '../../content';
import { useLang } from '../../lib/useLang';

export function GalleryCarousel() {
  const lang = useLang();
  const items = content[lang].gallery;
  const t = content[lang].ui.gallery;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const step = useCallback(
    (delta: number) => {
      if (items.length === 0) return;
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const active = items[index];
  if (!active) return null;

  const counter = `${index + 1} / ${items.length}`;
  const hint = t.carouselHint.replace('{count}', String(items.length));

  return (
    <div className="gallery-carousel mt-8">
      <p className="gallery-carousel-hint text-sm text-white/55 mb-4">{hint}</p>

      <div className="gallery-carousel-stage relative">
        <figure className="gallery-carousel-figure">
          <div className="gallery-carousel-frame">
            <button
              type="button"
              className="gallery-carousel-nav gallery-carousel-nav-prev"
              onClick={() => step(-1)}
              aria-label={t.prevPhoto}
            >
              ‹
            </button>

            <button
              type="button"
              className="gallery-carousel-zone gallery-carousel-zone-prev"
              onClick={() => step(-1)}
              aria-hidden="true"
              tabIndex={-1}
            />

            <div className="gallery-carousel-media">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={active.id}
                  src={active.src}
                  alt={active.alt}
                  decoding="async"
                  className="gallery-carousel-img"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                />
              </AnimatePresence>
            </div>

            <button
              type="button"
              className="gallery-carousel-zone gallery-carousel-zone-next"
              onClick={() => step(1)}
              aria-hidden="true"
              tabIndex={-1}
            />

            <button
              type="button"
              className="gallery-carousel-nav gallery-carousel-nav-next"
              onClick={() => step(1)}
              aria-label={t.nextPhoto}
            >
              ›
            </button>
          </div>
          <div className="gallery-carousel-meta mt-4">
            <figcaption
              className="gallery-carousel-caption text-sm md:text-base text-white/80 leading-relaxed"
              aria-live="polite"
            >
              {active.caption}
            </figcaption>
            <p className="gallery-carousel-counter" aria-live="off">
              {counter}
            </p>
          </div>
        </figure>
      </div>
      <div className="gallery-carousel-thumbnails mt-5" role="list" aria-label={lang === 'es' ? 'Miniaturas de la galería' : 'Gallery thumbnails'}>
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`gallery-carousel-thumb ${i === index ? 'is-active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={item.alt}
            aria-current={i === index ? 'true' : undefined}
          >
            <img
              src={item.thumbSrc ?? item.src}
              alt=""
              aria-hidden="true"
              decoding="async"
              className="gallery-carousel-thumb-img"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
