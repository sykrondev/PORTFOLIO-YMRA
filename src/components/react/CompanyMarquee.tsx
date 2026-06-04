import { useEffect, useRef } from 'react';
import { content } from '../../content';
import { getCompanyLogo } from '../../config/companyLogos';
import { useLang } from '../../lib/useLang';
import { useTheme } from '../../lib/useTheme';
import { LogoPlaque } from './LogoPlaque';

const BASE_LOOP_SECONDS = 50;
const VELOCITY_DECAY = 7;
const MAX_BOOST_MULTIPLIER = 4.5;
const DRAG_VELOCITY_SMOOTHING = 0.4;

function wrapOffset(offset: number, loopWidth: number): number {
  if (loopWidth <= 0) return offset;
  let wrapped = offset % loopWidth;
  if (wrapped > 0) wrapped -= loopWidth;
  if (wrapped <= -loopWidth) wrapped += loopWidth;
  return wrapped;
}

function renderMarqueeItems(
  items: typeof content.es.companies,
  keyPrefix: string,
  variant: 'default' | 'band',
  theme: 'dark' | 'light',
  ariaHidden = false,
) {
  return items.map((company) => {
    const logo = getCompanyLogo(company.slug);
    if (company.textOnly || logo.textOnly || !logo.src) {
      return (
        <span
          key={`${keyPrefix}-${company.slug}`}
          className={`company-name-chip shrink-0 ${variant === 'band' ? 'company-name-chip-marquee-band' : ''}`}
          title={ariaHidden ? undefined : company.name}
          aria-hidden={ariaHidden || undefined}
        >
          {company.name}
        </span>
      );
    }
    const bandSrc =
      variant === 'band' && theme === 'dark' && logo.srcBandDark ? logo.srcBandDark : logo.src;
    return (
      <LogoPlaque
        key={`${keyPrefix}-${company.slug}`}
        src={bandSrc}
        srcDark={variant === 'band' ? undefined : logo.srcDark}
        variant={variant}
        assetTheme={variant === 'band' ? 'light' : 'auto'}
        alt={ariaHidden ? '' : company.name}
        title={ariaHidden ? undefined : company.name}
        aria-hidden={ariaHidden || undefined}
        className={`logo-plaque-marquee shrink-0 ${variant === 'band' ? 'logo-plaque-marquee-band' : ''} ${logo.wide ? 'logo-plaque-marquee-wide' : ''} ${logo.marqueeLarge ? 'logo-plaque-marquee-large' : ''} ${logo.marqueeExtraLarge ? 'logo-plaque-marquee-extra-large' : ''}`}
        imgClassName="pointer-events-none"
      />
    );
  });
}

export function CompanyMarquee({ variant = 'default' }: { variant?: 'default' | 'band' }) {
  const lang = useLang();
  const theme = useTheme();
  const items = content[lang].companies;

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const stateRef = useRef({
    offset: 0,
    loopWidth: 0,
    baseSpeed: 90,
    boostVelocity: 0,
    dragging: false,
    pointerId: -1,
    lastPointerX: 0,
    lastMoveTime: 0,
    dragVelocity: 0,
    ready: false,
  });

  useEffect(() => {
    let measureTimer = 0;

    const applyLoopWidth = (nextWidth: number) => {
      const s = stateRef.current;
      if (nextWidth <= 0) return;

      const prevWidth = s.loopWidth;
      if (prevWidth > 0 && Math.abs(nextWidth - prevWidth) > 0.5) {
        s.offset = wrapOffset((s.offset / prevWidth) * nextWidth, nextWidth);
      } else if (prevWidth <= 0) {
        s.offset = wrapOffset(s.offset, nextWidth);
      }

      s.loopWidth = nextWidth;
      s.baseSpeed = nextWidth / BASE_LOOP_SECONDS;
      s.ready = true;
    };

    const measure = () => {
      const segment = segmentRef.current;
      if (!segment) return;
      const nextWidth = segment.getBoundingClientRect().width;
      if (nextWidth > 0) applyLoopWidth(nextWidth);
    };

    const scheduleMeasure = () => {
      window.clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measure, 80);
    };

    measure();
    scheduleMeasure();

    const segment = segmentRef.current;
    const track = trackRef.current;
    const ro = new ResizeObserver(scheduleMeasure);
    if (segment) ro.observe(segment);
    if (track) ro.observe(track);

    const onLoad = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement && track?.contains(target)) scheduleMeasure();
    };
    track?.addEventListener('load', onLoad, true);

    let lastTs = 0;
    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      const s = stateRef.current;
      const el = trackRef.current;

      if (s.loopWidth <= 0) {
        measure();
      }

      if (el && s.ready && !s.dragging && s.loopWidth > 0) {
        s.boostVelocity *= Math.exp(-VELOCITY_DECAY * dt);
        if (Math.abs(s.boostVelocity) < 1) s.boostVelocity = 0;

        const maxBoost = s.baseSpeed * MAX_BOOST_MULTIPLIER;
        s.boostVelocity = Math.max(-maxBoost, Math.min(maxBoost, s.boostVelocity));

        s.offset -= (s.baseSpeed + s.boostVelocity) * dt;
      }

      if (s.loopWidth > 0) {
        s.offset = wrapOffset(s.offset, s.loopWidth);
      }

      if (el) {
        const x = Math.round(s.offset * 100) / 100;
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(measureTimer);
      ro.disconnect();
      track?.removeEventListener('load', onLoad, true);
    };
  }, [lang]);

  const endDrag = (pointerId: number) => {
    const s = stateRef.current;
    if (!s.dragging || s.pointerId !== pointerId) return;

    s.dragging = false;
    s.pointerId = -1;
    rootRef.current?.classList.remove('marquee-grabbing');

    const maxBoost = s.baseSpeed * MAX_BOOST_MULTIPLIER;
    s.boostVelocity = Math.max(-maxBoost, Math.min(maxBoost, -s.dragVelocity));

    if (s.loopWidth > 0) s.offset = wrapOffset(s.offset, s.loopWidth);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const root = rootRef.current;
    if (!root) return;

    root.setPointerCapture(e.pointerId);
    root.classList.add('marquee-grabbing');

    const s = stateRef.current;
    s.dragging = true;
    s.pointerId = e.pointerId;
    s.lastPointerX = e.clientX;
    s.lastMoveTime = performance.now();
    s.dragVelocity = 0;
    s.boostVelocity = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;

    const now = performance.now();
    const dx = e.clientX - s.lastPointerX;
    const dt = Math.max(now - s.lastMoveTime, 1) / 1000;

    s.offset += dx;

    const instantV = dx / dt;
    s.dragVelocity =
      s.dragVelocity * (1 - DRAG_VELOCITY_SMOOTHING) + instantV * DRAG_VELOCITY_SMOOTHING;

    s.lastPointerX = e.clientX;
    s.lastMoveTime = now;

    if (s.loopWidth > 0) s.offset = wrapOffset(s.offset, s.loopWidth);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    rootRef.current?.releasePointerCapture(e.pointerId);
    endDrag(e.pointerId);
  };

  return (
    <div
      ref={rootRef}
      className={`marquee overflow-x-hidden overflow-y-visible py-3 ${variant === 'band' ? 'marquee-band' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={(e) => endDrag(e.pointerId)}
    >
      <div ref={trackRef} className="marquee-track flex w-max">
        <div ref={segmentRef} className="marquee-segment flex shrink-0 gap-10 sm:gap-14 pr-10 sm:pr-14">
          {renderMarqueeItems(items, 'a', variant, theme)}
        </div>
        <div className="marquee-segment flex shrink-0 gap-10 sm:gap-14" aria-hidden="true">
          {renderMarqueeItems(items, 'b', variant, theme, true)}
        </div>
      </div>
    </div>
  );
}
