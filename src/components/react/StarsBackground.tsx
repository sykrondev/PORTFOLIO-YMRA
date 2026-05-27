import { useEffect, useRef } from 'react';
import { applyCanvasViewport, getBackgroundViewport, type BackgroundViewport } from '../../lib/backgroundViewport';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseA: number;
  phase: number;
  speed: number;
  hue: number;
}

interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

interface Props {
  variant?: 'dark' | 'light';
}

export function StarsBackground({ variant = 'dark' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let shooters: Shooting[] = [];
    let raf = 0;
    let lastShoot = performance.now();
    let viewport: BackgroundViewport | null = null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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
      const density = (viewport.width * viewport.height) / 2800;
      const count = Math.min(800, Math.max(300, Math.floor(density)));
      stars = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const spd = (Math.random() * 0.063 + 0.014) * dpr;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          r: (Math.random() * 1.3 + 0.3) * dpr,
          baseA: Math.random() * 0.7 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.005 + 0.002,
          hue: Math.random() < 0.18 ? 42 : Math.random() < 0.5 ? 210 : 0,
        };
      });
    };

    const spawnShooter = () => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height * 0.4;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
      const speed = (6 + Math.random() * 5) * dpr;
      shooters.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 60 + Math.random() * 30,
      });
    };

    const palette = variant === 'light'
      ? {
          a: '#0a1e44',
          b: '#143063',
          c: '#081634',
          neb1: 'rgba(70, 140, 220, 0.32)',
          neb2: 'rgba(40, 90, 170, 0.26)',
        }
      : {
          a: '#122E6A',
          b: '#1A3F80',
          c: '#0D2250',
          neb1: 'rgba(60, 115, 220, 0.52)',
          neb2: 'rgba(40, 85, 175, 0.44)',
        };

    const draw = (t: number) => {
      const base = ctx.createLinearGradient(0, 0, 0, canvas.height);
      base.addColorStop(0, palette.a);
      base.addColorStop(0.5, palette.b);
      base.addColorStop(1, palette.c);
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(
        canvas.width * 0.22,
        canvas.height * 0.28,
        0,
        canvas.width * 0.22,
        canvas.height * 0.28,
        canvas.width * 0.7
      );
      grad.addColorStop(0, palette.neb1);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.85,
        canvas.height * 0.78,
        0,
        canvas.width * 0.85,
        canvas.height * 0.78,
        canvas.width * 0.55
      );
      grad2.addColorStop(0, palette.neb2);
      grad2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // move stars + wrap around edges
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x += canvas.width;
        if (s.x > canvas.width) s.x -= canvas.width;
        if (s.y < 0) s.y += canvas.height;
        if (s.y > canvas.height) s.y -= canvas.height;
      }

      // stars
      for (const s of stars) {
        const a = s.baseA;
        ctx.beginPath();
        if (s.hue === 42) {
          ctx.fillStyle = `rgba(230, 196, 120, ${a})`;
        } else if (s.hue === 210) {
          ctx.fillStyle = `rgba(190, 210, 255, ${a})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        }
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.2 * dpr) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${a * 0.15})`;
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // shooting stars
      if (t - lastShoot > 3000 + Math.random() * 3000 && shooters.length < 3) {
        spawnShooter();
        lastShoot = t;
      }
      shooters = shooters.filter(sh => sh.life < sh.max);
      for (const sh of shooters) {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life++;
        const tailLen = 14 * dpr;
        const grad3 = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - sh.vx * tailLen * 0.05,
          sh.y - sh.vy * tailLen * 0.05
        );
        const alpha = 1 - sh.life / sh.max;
        grad3.addColorStop(0, `rgba(255, 240, 200, ${alpha})`);
        grad3.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad3;
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 6, sh.y - sh.vy * 6);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div id="stars-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
