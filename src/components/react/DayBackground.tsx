import { useEffect, useRef } from 'react';
import { applyCanvasViewport, getBackgroundViewport, type BackgroundViewport } from '../../lib/backgroundViewport';

const TECH_LINES = [
  'OTIF / ETA / KPI',
  'LT12 · LT15 · MIGO',
  'RECSS · CLOA · SMAS',
  '6.000.000 km / ano',
  'F30 · F30-1 / 100%',
  'DS160 / SEC TC8',
  'FIFO · FEFO',
  '24/7 · mineria',
];

const TECH_FORMULAS = [
  'Q = v · t',
  'ROI = (V1 - V0) / V0',
  'OTIF = on_time / total',
  'eta = route / speed',
  'sigma <= 0.10',
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function drawPaperTexture(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, '#f7f1e6');
  base.addColorStop(0.52, '#efe4d3');
  base.addColorStop(1, '#e4d5bf');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.18, width * 0.62);
  glow.addColorStop(0, 'rgba(255, 250, 240, 0.72)');
  glow.addColorStop(1, 'rgba(255, 250, 240, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.52, width * 0.28, width * 0.5, height * 0.52, width * 0.86);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(94, 72, 45, 0.12)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  for (let i = 0; i < 220; i += 1) {
    ctx.fillStyle = `rgba(112, 86, 52, ${rand(0.018, 0.04)})`;
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = rand(0.6, 2.4);
    const h = rand(0.6, 1.8);
    ctx.fillRect(x, y, w, h);
  }

  ctx.strokeStyle = 'rgba(118, 92, 56, 0.04)';
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 40; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const len = rand(18, 56);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + rand(-4, 4));
    ctx.stroke();
  }
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const minor = 40;
  const major = 160;

  ctx.save();
  ctx.strokeStyle = 'rgba(48, 82, 116, 0.075)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(48, 82, 116, 0.12)';
  for (let x = 0; x <= width; x += major) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += major) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(118, 92, 56, 0.035)';
  for (let i = -height; i < width + height; i += 180) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - height * 0.22, height);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTechnicalNotes(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.textBaseline = 'top';
  ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

  const noteClusters = [
    { x: width * 0.08, y: height * 0.12 },
    { x: width * 0.7, y: height * 0.18 },
    { x: width * 0.12, y: height * 0.74 },
    { x: width * 0.68, y: height * 0.78 },
  ];

  noteClusters.forEach((cluster, clusterIndex) => {
    for (let i = 0; i < 4; i += 1) {
      const line = TECH_LINES[(clusterIndex * 2 + i) % TECH_LINES.length];
      ctx.fillStyle = `rgba(36, 78, 108, ${0.06 - i * 0.008})`;
      ctx.fillText(line, cluster.x, cluster.y + i * 18);
    }
  });

  const blocks = [
    { x: width * 0.16, y: height * 0.44, w: width * 0.16, h: height * 0.11, label: 'FLOW' },
    { x: width * 0.64, y: height * 0.54, w: width * 0.18, h: height * 0.12, label: 'OPS' },
  ];

  ctx.lineWidth = 1;
  blocks.forEach((block, blockIndex) => {
    ctx.fillStyle = 'rgba(255, 251, 244, 0.12)';
    ctx.strokeStyle = 'rgba(36, 78, 108, 0.12)';
    ctx.beginPath();
    ctx.roundRect(block.x, block.y, block.w, block.h, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(122, 86, 8, 0.22)';
    ctx.fillText(block.label, block.x + 12, block.y + 10);

    ctx.fillStyle = 'rgba(36, 78, 108, 0.10)';
    for (let i = 0; i < 3; i += 1) {
      const formula = TECH_FORMULAS[(blockIndex * 2 + i) % TECH_FORMULAS.length];
      ctx.fillText(formula, block.x + 12, block.y + 30 + i * 16);
    }
  });

  ctx.restore();
}

export function DayBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let viewport: BackgroundViewport | null = null;

    const drawScene = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      drawPaperTexture(ctx, width, height);
      drawGrid(ctx, width, height);
      drawTechnicalNotes(ctx, width, height);
      ctx.restore();
    };

    const resize = () => {
      const nextViewport = getBackgroundViewport(viewport);
      if (
        viewport &&
        viewport.width === nextViewport.width &&
        viewport.height === nextViewport.height
      ) {
        return;
      }

      viewport = nextViewport;
      applyCanvasViewport(canvas, viewport, dpr);
      drawScene();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div id="day-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
