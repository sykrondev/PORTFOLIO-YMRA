import { useEffect, useRef } from 'react';
import { applyCanvasViewport, getBackgroundViewport, type BackgroundViewport } from '../../lib/backgroundViewport';

// Math / logistics expressions relevant to the portfolio
const EXPRS = [
  'f(x) = ∫₀ˣ sin(t) dt',
  'ROI = (V₁ - V₀) / V₀',
  'σ = √(Σ(xᵢ - μ)² / n)',
  'E[X] = Σ xᵢ · p(xᵢ)',
  'límₕ→₀ [f(x+h) - f(x)] / h',
  'KPI = Σ wᵢ·kᵢ ≥ θ',
  'P(A|B) = P(A∩B) / P(B)',
  'y = β₀ + β₁·x + ε',
  'Δ = b² - 4ac',
  'CAGR = (Vₙ/V₀)^{1/n} - 1',
  'η = W_out / W_in',
  '∇²φ = 0',
  'R² = 1 - SS_res / SS_tot',
  'F = m · a',
  'OTIF = on_time / total',
  'Q = v · t',
  'ETA = route / avg_speed',
  'KPI = (real - base) / base',
  'FIFO / FEFO / stock_turn',
  'util = carga / capacidad',
];

const TARGET_FPS = 18;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const CHAR_SPEED = 16;
const MAX_ALPHA = 0.34;
const HOLD_MIN = 3200;
const HOLD_MAX = 5200;
const FADE_DUR = 1800;
const INITIAL_STAGGER = 260;
const RESET_DELAY_MIN = 700;
const RESET_DELAY_MAX = 1700;
const MAX_DPR = 1.2;

const REGIONS = [
  { side: 'left', xMin: 0.04, xMax: 0.18, yMin: 0.08, yMax: 0.21 },
  { side: 'right', xMin: 0.78, xMax: 0.94, yMin: 0.08, yMax: 0.22 },
  { side: 'left', xMin: 0.05, xMax: 0.18, yMin: 0.3, yMax: 0.44 },
  { side: 'right', xMin: 0.78, xMax: 0.94, yMin: 0.3, yMax: 0.46 },
  { side: 'left', xMin: 0.04, xMax: 0.18, yMin: 0.56, yMax: 0.7 },
  { side: 'right', xMin: 0.79, xMax: 0.95, yMin: 0.56, yMax: 0.74 },
  { side: 'left', xMin: 0.05, xMax: 0.18, yMin: 0.78, yMax: 0.9 },
  { side: 'right', xMin: 0.78, xMax: 0.95, yMin: 0.78, yMax: 0.92 },
] as const;

type Variant = 'light' | 'dark';

interface Palette {
  ghostBlur: number;
  shadowColor: string;
  shadowBlur: number;
  ghostFill: (inkTint: number) => string;
  mainFill: (inkTint: number) => string;
}

interface Slot {
  x: number;
  y: number;
  text: string;
  exprIdx: number;
  slotIdx: number;
  chars: number;       // float 0..text.length
  alpha: number;
  rot: number;         // radians
  size: number;        // px font size (unscaled)
  seed: number;
  textWidth: number;
  bitmapWidth: number;
  bitmapHeight: number;
  baseline: number;
  revealInset: number;
  bitmap: HTMLCanvasElement | null;
  phase: 'wait' | 'write' | 'hold' | 'fade';
  timer: number;       // ms remaining in phase
}

function getPalette(variant: Variant): Palette {
  if (variant === 'dark') {
    return {
      ghostBlur: 1.1,
      shadowColor: 'rgba(80, 120, 220, 0.16)',
      shadowBlur: 1.2,
      ghostFill: (inkTint) =>
        `rgba(${120 + inkTint}, ${156 + Math.floor(inkTint * 0.35)}, ${224 + Math.floor(inkTint * 0.22)}, 0.42)`,
      mainFill: (inkTint) =>
        `rgba(${164 + inkTint}, ${194 + Math.floor(inkTint * 0.28)}, ${255}, 0.94)`,
    };
  }

  return {
    ghostBlur: 0.9,
    shadowColor: 'rgba(92, 68, 34, 0.14)',
    shadowBlur: 0.9,
    ghostFill: (inkTint) =>
      `rgba(${132 + inkTint}, ${104 + Math.floor(inkTint * 0.46)}, ${74 + Math.floor(inkTint * 0.24)}, 0.5)`,
    mainFill: (inkTint) =>
      `rgba(${74 + inkTint}, ${56 + Math.floor(inkTint * 0.36)}, ${34 + Math.floor(inkTint * 0.18)}, 1)`,
  };
}

function getSlotCount(w: number) {
  if (w < 640) return 9;
  if (w < 1024) return 11;
  return 13;
}

function getSlotPosition(w: number, h: number, slotIdx: number, bitmapWidth: number) {
  const region = REGIONS[slotIdx % REGIONS.length];
  const outerPad = Math.max(18, w * 0.018);
  const maxX = Math.max(outerPad, w - bitmapWidth - outerPad);
  const minCenterGap = w * 0.28;
  const maxCenterGap = w * 0.72 - bitmapWidth;
  let x: number;

  if (region.side === 'left') {
    const leftMin = Math.min(maxX, Math.max(outerPad, w * region.xMin));
    const leftMax = Math.min(maxX, Math.max(leftMin, Math.min(w * region.xMax, minCenterGap - bitmapWidth)));
    x = leftMin + Math.random() * Math.max(0, leftMax - leftMin);
  } else {
    const rightMin = Math.max(outerPad, Math.max(w * region.xMin, maxCenterGap));
    const rightMax = Math.max(rightMin, Math.min(maxX, w * region.xMax));
    x = rightMin + Math.random() * Math.max(0, rightMax - rightMin);
  }

  return {
    x,
    y: h * (region.yMin + Math.random() * (region.yMax - region.yMin)),
  };
}

function createSlotBitmap(text: string, size: number, seed: number, variant: Variant) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      bitmap: canvas,
      textWidth: 0,
      bitmapWidth: 0,
      bitmapHeight: 0,
      baseline: 0,
      revealInset: 0,
    };
  }

  const font = `italic ${size}px "Times New Roman", Georgia, serif`;
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';

  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const ascent = Math.ceil(metrics.actualBoundingBoxAscent || size * 0.8);
  const descent = Math.ceil(metrics.actualBoundingBoxDescent || size * 0.25);
  const padX = Math.ceil(10 + size * 0.24);
  const padY = Math.ceil(8 + size * 0.18);
  const width = Math.max(1, textWidth + padX * 2);
  const height = Math.max(1, ascent + descent + padY * 2 + 2);

  canvas.width = width;
  canvas.height = height;

  const drawCtx = canvas.getContext('2d');
  if (!drawCtx) {
    return {
      bitmap: canvas,
      textWidth,
      bitmapWidth: width,
      bitmapHeight: height,
      baseline: padY + ascent,
      revealInset: padX,
    };
  }

  const baseline = padY + ascent;
  const ghostOffset = 0.32 + seed * 0.38;
  const inkTint = 6 + Math.floor(seed * 14);
  const palette = getPalette(variant);

  drawCtx.font = font;
  drawCtx.textBaseline = 'alphabetic';
  drawCtx.shadowColor = palette.shadowColor;
  drawCtx.shadowBlur = palette.shadowBlur;

  drawCtx.fillStyle = palette.ghostFill(inkTint);
  drawCtx.fillText(text, padX + ghostOffset, baseline + ghostOffset);

  drawCtx.shadowBlur = palette.ghostBlur;
  drawCtx.fillStyle = palette.mainFill(inkTint);
  drawCtx.fillText(text, padX, baseline);

  return {
    bitmap: canvas,
    textWidth,
    bitmapWidth: width,
    bitmapHeight: height,
    baseline,
    revealInset: padX,
  };
}

function newSlot(
  w: number,
  h: number,
  exprIdx: number,
  slotIdx: number,
  variant: Variant,
  reduced: boolean,
  delay = 0,
): Slot {
  const idx  = exprIdx % EXPRS.length;
  const text = EXPRS[idx];
  const seed = Math.random();
  const size = reduced ? 18 + Math.random() * 8 : 18 + Math.random() * 12;
  const alpha = reduced
    ? variant === 'dark'
      ? 0.14 + Math.random() * 0.06
      : 0.18 + Math.random() * 0.08
    : 0;
  const bitmapData = createSlotBitmap(text, size, seed, variant);
  const { x, y } = getSlotPosition(w, h, slotIdx, bitmapData.bitmapWidth);
  return {
    x,
    y,
    text,
    exprIdx: idx,
    slotIdx,
    chars:   reduced ? text.length : 0,
    alpha,
    rot:     (Math.random() - 0.5) * 0.08,
    size,
    seed,
    textWidth: bitmapData.textWidth,
    bitmapWidth: bitmapData.bitmapWidth,
    bitmapHeight: bitmapData.bitmapHeight,
    baseline: bitmapData.baseline,
    revealInset: bitmapData.revealInset,
    bitmap: bitmapData.bitmap,
    phase:   reduced ? 'hold' : 'wait',
    timer:   reduced ? 0 : delay,
  };
}

interface Props {
  variant?: Variant;
}

export function MathBackground({ variant = 'light' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr  = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let slots: Slot[] = [];
    let raf   = 0;
    let lastTick = performance.now();
    let visible = !document.hidden;
    let viewport: BackgroundViewport | null = null;

    const resize = () => {
      const nextViewport = getBackgroundViewport(viewport);
      if (
        viewport &&
        viewport.width === nextViewport.width &&
        viewport.height === nextViewport.height
      ) {
        return false;
      }

      viewport = nextViewport;
      applyCanvasViewport(canvas, viewport, dpr);
      return true;
    };

    const initSlots = () => {
      const w = canvas.width  / dpr;
      const h = canvas.height / dpr;
      const count = getSlotCount(w);
      slots = Array.from({ length: count }, (_, i) =>
        newSlot(w, h, i, i, variant, reduced, reduced ? 0 : i * INITIAL_STAGGER)
      );
    };

    const resetSlot = (sl: Slot) => {
      const w   = canvas.width  / dpr;
      const h   = canvas.height / dpr;
      const next = newSlot(
        w,
        h,
        sl.exprIdx + 1,
        sl.slotIdx,
        variant,
        false,
        RESET_DELAY_MIN + Math.random() * (RESET_DELAY_MAX - RESET_DELAY_MIN),
      );
      Object.assign(sl, next);
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      for (const sl of slots) {
        if (sl.alpha < 0.001 || !sl.bitmap || sl.bitmapWidth < 1) continue;

        const revealProgress = Math.min(1, sl.chars / sl.text.length);
        const revealWidth = sl.phase === 'hold'
          ? sl.bitmapWidth
          : Math.max(sl.revealInset, sl.revealInset + sl.textWidth * revealProgress);

        ctx.save();
        ctx.translate(sl.x, sl.y);
        ctx.rotate(sl.rot);
        ctx.globalAlpha = sl.alpha;
        ctx.beginPath();
        ctx.rect(0, -sl.baseline, revealWidth, sl.bitmapHeight);
        ctx.clip();
        ctx.drawImage(sl.bitmap, 0, -sl.baseline);

        ctx.restore();
      }

      ctx.restore();
    };

    const draw = (now: number) => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const elapsed = now - lastTick;
      if (elapsed < FRAME_INTERVAL) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const dt = Math.min(elapsed, 120);
      lastTick = now;

      for (const sl of slots) {
        sl.timer -= dt;

        if (sl.phase === 'wait') {
          if (sl.timer <= 0) {
            sl.phase = 'write';
            sl.timer = 0;
          }
        } else if (sl.phase === 'write') {
          sl.chars = Math.min(sl.chars + (CHAR_SPEED * dt) / 1000, sl.text.length);
          sl.alpha = Math.min(sl.alpha + (MAX_ALPHA * dt) / 280, MAX_ALPHA);
          if (sl.chars >= sl.text.length) {
            sl.phase = 'hold';
            sl.timer = HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN);
          }
        } else if (sl.phase === 'hold') {
          if (sl.timer <= 0) {
            sl.phase = 'fade';
            sl.timer = FADE_DUR;
          }
        } else if (sl.phase === 'fade') {
          const progress = Math.max(0, sl.timer / FADE_DUR);
          const eased = progress * progress * (3 - 2 * progress);
          const jitter = 0.88 + ((sl.seed + sl.x * 0.0004 + sl.y * 0.0007) % 0.2);
          sl.alpha = MAX_ALPHA * eased * jitter;
          if (sl.timer <= 0) {
            resetSlot(sl);
            continue;
          }
        }
      }

      drawFrame();
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) lastTick = performance.now();
    };

    resize();
    initSlots();

    const onResize = () => {
      if (!resize()) return;
      initSlots();
      lastTick = performance.now();
      drawFrame();
    };

    if (reduced) {
      drawFrame();
    } else {
      raf = requestAnimationFrame(draw);
      document.addEventListener('visibilitychange', onVisibility);
    }

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div id="math-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
