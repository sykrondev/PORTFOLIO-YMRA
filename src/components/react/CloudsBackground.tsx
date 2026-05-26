import { useEffect, useRef } from 'react';

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  alpha: number;
  puffs: { dx: number; dy: number; r: number }[];
}

export function CloudsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let clouds: Cloud[] = [];
    let raf = 0;
    let last = performance.now();

    const makeCloud = (xOverride?: number): Cloud => {
      const scale = 0.7 + Math.random() * 1.6;
      const puffCount = 5 + Math.floor(Math.random() * 4);
      const puffs = Array.from({ length: puffCount }, (_, i) => ({
        dx: (i - puffCount / 2) * (22 + Math.random() * 14),
        dy: (Math.random() - 0.5) * 14,
        r: (28 + Math.random() * 22) * scale * dpr,
      }));
      return {
        x: xOverride ?? Math.random() * canvas.width,
        y: 60 * dpr + Math.random() * (canvas.height * 0.75),
        scale,
        speed: (0.08 + Math.random() * 0.18) * dpr,
        alpha: 0.55 + Math.random() * 0.35,
        puffs,
      };
    };

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const count = Math.min(18, Math.max(7, Math.floor(window.innerWidth / 110)));
      clouds = Array.from({ length: count }, () => makeCloud());
    };

    const drawSky = () => {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, '#bcdcf6');
      g.addColorStop(0.55, '#d8e9f7');
      g.addColorStop(1, '#eef4fb');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // sun glow
      const sg = ctx.createRadialGradient(
        canvas.width * 0.78,
        canvas.height * 0.22,
        0,
        canvas.width * 0.78,
        canvas.height * 0.22,
        canvas.width * 0.55
      );
      sg.addColorStop(0, 'rgba(255, 235, 180, 0.55)');
      sg.addColorStop(0.4, 'rgba(255, 220, 160, 0.18)');
      sg.addColorStop(1, 'rgba(255, 235, 180, 0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawCloud = (c: Cloud) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      // shadow
      ctx.fillStyle = `rgba(110, 140, 175, ${c.alpha * 0.18})`;
      for (const p of c.puffs) {
        ctx.beginPath();
        ctx.arc(p.dx, p.dy + 6 * dpr, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // body
      const grad = ctx.createRadialGradient(0, -10 * dpr, 0, 0, 0, 60 * dpr * c.scale);
      grad.addColorStop(0, `rgba(255,255,255,${c.alpha})`);
      grad.addColorStop(1, `rgba(255,255,255,${c.alpha * 0.85})`);
      ctx.fillStyle = grad;
      for (const p of c.puffs) {
        ctx.beginPath();
        ctx.arc(p.dx, p.dy, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = (t: number) => {
      const dt = prefersReduced ? 0 : (t - last) / 16;
      last = t;
      drawSky();
      for (const c of clouds) {
        c.x += c.speed * dt;
        const maxR = Math.max(...c.puffs.map(p => Math.abs(p.dx) + p.r));
        if (c.x - maxR > canvas.width) {
          Object.assign(c, makeCloud(-maxR));
        }
        drawCloud(c);
      }
      if (!prefersReduced) raf = requestAnimationFrame(draw);
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
    <div id="clouds-bg" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
