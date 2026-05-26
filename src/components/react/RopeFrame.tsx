'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Pt = [number, number];
type Seg = { front: 1 | 2; s1: Pt[]; s2: Pt[] };
type Colors = { dk: string; md: string; br: string; hi: string };

const MARGIN   = 13;  // px rope extends outside the shell on each side
const BORDER_R = 28;  // shell border-radius (1.75rem @ 16px)
const TWISTS   = 12;
const SR       = 5;   // strand offset radius in px
const SAMPLES  = 280;
const SW       = 8;   // stroke width in px

// Navy palette — slightly brighter for better contrast
const CA: Colors = { dk: '#16305b', md: '#254983', br: '#3b68ad', hi: '#5d89cd' };
const CB: Colors = { dk: '#102446', md: '#1d3c6d', br: '#315894', hi: '#4d78b7' };

function getRRPoint(s: number, W: number, H: number, R: number) {
  const QL = (Math.PI / 2) * R;
  const segs = [
    { L: W-2*R, p:(t:number):Pt=>[R+t*(W-2*R),0],             nx:(_t:number)=>0,  ny:(_t:number)=>-1 },
    { L: QL,    p:(t:number):Pt=>{ const a=-Math.PI/2+t*Math.PI/2; return [W-R+R*Math.cos(a),R+R*Math.sin(a)]; },
                nx:(t:number)=>Math.cos(-Math.PI/2+t*Math.PI/2), ny:(t:number)=>Math.sin(-Math.PI/2+t*Math.PI/2) },
    { L: H-2*R, p:(t:number):Pt=>[W,R+t*(H-2*R)],              nx:(_t:number)=>1,  ny:(_t:number)=>0 },
    { L: QL,    p:(t:number):Pt=>{ const a=t*Math.PI/2;         return [W-R+R*Math.cos(a),H-R+R*Math.sin(a)]; },
                nx:(t:number)=>Math.cos(t*Math.PI/2),            ny:(t:number)=>Math.sin(t*Math.PI/2) },
    { L: W-2*R, p:(t:number):Pt=>[W-R-t*(W-2*R),H],            nx:(_t:number)=>0,  ny:(_t:number)=>1 },
    { L: QL,    p:(t:number):Pt=>{ const a=Math.PI/2+t*Math.PI/2; return [R+R*Math.cos(a),H-R+R*Math.sin(a)]; },
                nx:(t:number)=>Math.cos(Math.PI/2+t*Math.PI/2),  ny:(t:number)=>Math.sin(Math.PI/2+t*Math.PI/2) },
    { L: H-2*R, p:(t:number):Pt=>[0,H-R-t*(H-2*R)],            nx:(_t:number)=>-1, ny:(_t:number)=>0 },
    { L: QL,    p:(t:number):Pt=>{ const a=Math.PI+t*Math.PI/2; return [R+R*Math.cos(a),R+R*Math.sin(a)]; },
                nx:(t:number)=>Math.cos(Math.PI+t*Math.PI/2),    ny:(t:number)=>Math.sin(Math.PI+t*Math.PI/2) },
  ];
  const totalL = segs.reduce((sum, seg) => sum + seg.L, 0);
  let rem = ((s % totalL) + totalL) % totalL;
  for (const seg of segs) {
    if (rem <= seg.L + 1e-9) {
      const t = Math.min(rem / seg.L, 1);
      const [x, y] = seg.p(t);
      return { x, y, nx: seg.nx(t), ny: seg.ny(t) };
    }
    rem -= seg.L;
  }
  return { x: R, y: 0, nx: 0, ny: -1 };
}

function computeRope(shellW: number, shellH: number) {
  const W = shellW, H = shellH, R = BORDER_R;
  const QL = (Math.PI / 2) * R;
  const totalP = 2*(W-2*R) + 2*(H-2*R) + 4*QL;

  const samples: { s1: Pt; s2: Pt; front: 1|2 }[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / SAMPLES;
    const { x, y, nx, ny } = getRRPoint(t * totalP, W, H, R);
    const px = x + MARGIN, py = y + MARGIN;
    const sinA = Math.sin(TWISTS * 2 * Math.PI * t);
    samples.push({
      s1: [px + SR*sinA*nx, py + SR*sinA*ny],
      s2: [px - SR*sinA*nx, py - SR*sinA*ny],
      front: sinA >= 0 ? 1 : 2,
    });
  }
  // Close: repeat first sample
  samples.push({ ...samples[0] });

  const segs: Seg[] = [];
  let cur: Seg = { front: samples[0].front, s1: [samples[0].s1], s2: [samples[0].s2] };
  for (let i = 1; i < samples.length; i++) {
    const s = samples[i];
    if (s.front !== cur.front) {
      segs.push(cur);
      cur = { front: s.front, s1: [samples[i-1].s1, s.s1], s2: [samples[i-1].s2, s.s2] };
    } else {
      cur.s1.push(s.s1);
      cur.s2.push(s.s2);
    }
  }
  segs.push(cur);

  const M = MARGIN, r = R;
  const shadowD = [
    `M${M+r},${M}`,
    `L${M+W-r},${M}`,
    `Q${M+W},${M} ${M+W},${M+r}`,
    `L${M+W},${M+H-r}`,
    `Q${M+W},${M+H} ${M+W-r},${M+H}`,
    `L${M+r},${M+H}`,
    `Q${M},${M+H} ${M},${M+H-r}`,
    `L${M},${M+r}`,
    `Q${M},${M} ${M+r},${M}`,
    'Z',
  ].join(' ');

  return { segs, shadowD, vb: `0 0 ${W+2*MARGIN} ${H+2*MARGIN}` };
}

function pts2d(pts: Pt[]) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
}

function StrandPath({ d, c }: { d: string; c: Colors }) {
  return (
    <>
      <path d={d} fill="none" stroke={c.dk} strokeWidth={SW+4} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={c.md} strokeWidth={SW}   strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={c.br} strokeWidth={SW*0.38} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={c.hi} strokeWidth={SW*0.12} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function RopeFrame() {
  const elRef = useRef<HTMLDivElement>(null);
  const [rope, setRope] = useState<ReturnType<typeof computeRope> | null>(null);

  const getShell = useCallback(() =>
    elRef.current
      ?.closest('.companies-band-wrap')
      ?.querySelector('.companies-band-shell') as HTMLElement | null,
  []);

  const update = useCallback(() => {
    const shell = getShell();
    if (!shell) return;
    const { width, height } = shell.getBoundingClientRect();
    if (width > 0 && height > 0) setRope(computeRope(Math.round(width), Math.round(height)));
  }, [getShell]);

  useEffect(() => {
    update();
    const shell = getShell();
    if (!shell) return;
    const ro = new ResizeObserver(update);
    ro.observe(shell);
    return () => ro.disconnect();
  }, [update, getShell]);

  return (
    <div ref={elRef} className="companies-band-rope">
      {rope && (
        <svg className="companies-band-rope-svg" viewBox={rope.vb} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cbrf-drop" x="-8%" y="-8%" width="116%" height="116%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.55"/>
            </filter>
          </defs>

          {/* Drop shadow layer */}
          <path d={rope.shadowD} fill="none" stroke="#000" strokeWidth={SW+8} opacity="0.35" transform="translate(0,4)"/>

          {/* Twisted strand segments with correct z-ordering */}
          {rope.segs.map((seg, idx) => {
            const d1 = pts2d(seg.s1), d2 = pts2d(seg.s2);
            const [back, front] = seg.front === 1
              ? [{ d: d2, c: CB }, { d: d1, c: CA }]
              : [{ d: d1, c: CA }, { d: d2, c: CB }];
            return (
              <g key={idx}>
                <StrandPath d={back.d}  c={back.c}  />
                <StrandPath d={front.d} c={front.c} />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
