// Static SVG rope — all math at module level, zero hydration needed.
type Pt = [number, number];

function bez(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const m = 1 - t;
  return [
    m**3*p0[0] + 3*m**2*t*p1[0] + 3*m*t**2*p2[0] + t**3*p3[0],
    m**3*p0[1] + 3*m**2*t*p1[1] + 3*m*t**2*p2[1] + t**3*p3[1],
  ];
}

function bezD(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const m = 1 - t;
  return [
    3*(m**2*(p1[0]-p0[0]) + 2*m*t*(p2[0]-p1[0]) + t**2*(p3[0]-p2[0])),
    3*(m**2*(p1[1]-p0[1]) + 2*m*t*(p2[1]-p1[1]) + t**2*(p3[1]-p2[1])),
  ];
}

// Rope arch control points — arch from bottom-left → peak-top → bottom-right
// P0/P3 y=50 keeps rope ends at plaque-top level so it doesn't cover logos
const P0: Pt = [0, 50], P1: Pt = [75, 4], P2: Pt = [925, 4], P3: Pt = [1000, 50];

const TWISTS   = 10;  // full twist cycles
const SR       = 4;   // strand radius from rope center (px in viewBox)
const SAMPLES  = 450;

type Sample = { s1: Pt; s2: Pt; front: 1 | 2 };

const _samples: Sample[] = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const t = i / SAMPLES;
  const [px, py] = bez(t, P0, P1, P2, P3);
  const [dx, dy] = bezD(t, P0, P1, P2, P3);
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  // Normal perpendicular to tangent
  const nx = -dy / len, ny = dx / len;
  const sinA = Math.sin(TWISTS * 2 * Math.PI * t);
  return {
    s1: [px + SR * sinA * nx, py + SR * sinA * ny],
    s2: [px - SR * sinA * nx, py - SR * sinA * ny],
    // strand displaced in positive normal direction = closer to viewer
    front: sinA >= 0 ? 1 : 2,
  };
});

type Seg = { front: 1 | 2; s1: Pt[]; s2: Pt[] };

const _segs: Seg[] = [];
{
  let cur: Seg = { front: _samples[0].front, s1: [_samples[0].s1], s2: [_samples[0].s2] };
  for (let i = 1; i < _samples.length; i++) {
    const s = _samples[i];
    if (s.front !== cur.front) {
      _segs.push(cur);
      cur = { front: s.front, s1: [_samples[i-1].s1, s.s1], s2: [_samples[i-1].s2, s.s2] };
    } else {
      cur.s1.push(s.s1);
      cur.s2.push(s.s2);
    }
  }
  _segs.push(cur);
}

function pts2d(pts: Pt[]): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
}

// Warm gold strand
const GA = { dk: '#3A2200', md: '#8B6010', br: '#D4A020', hi: '#F0CC58' };
// Dark bronze strand
const GB = { dk: '#1C1400', md: '#4A3C08', br: '#7E6818', hi: '#A89030' };

type StrandColors = typeof GA;

function StrandPaths({ d, c, sw }: { d: string; c: StrandColors; sw: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={c.dk} strokeWidth={sw + 5} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={c.md} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={c.br} strokeWidth={sw * 0.45} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={c.hi} strokeWidth={sw * 0.15} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function RopeDecor() {
  const SW = 11;

  return (
    <div className="companies-band-rope" aria-hidden="true">
      <svg
        className="companies-band-rope-svg"
        viewBox="0 0 1000 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="cbr-drop" x="-5%" y="-80%" width="110%" height="260%">
            <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/>
          </filter>
        </defs>

        {/* Outer dark rope body + drop shadow */}
        <path
          d="M0,50 C75,4 925,4 1000,50"
          fill="none"
          stroke="#120900"
          strokeWidth={SW + 7}
          strokeLinecap="round"
          filter="url(#cbr-drop)"
        />

        {/* Twisted strand segments — correct z-order per crossing */}
        {_segs.map((seg, idx) => {
          const d1 = pts2d(seg.s1), d2 = pts2d(seg.s2);
          const [back, front] = seg.front === 1
            ? [{ d: d2, c: GB }, { d: d1, c: GA }]
            : [{ d: d1, c: GA }, { d: d2, c: GB }];
          return (
            <g key={idx}>
              <StrandPaths d={back.d}  c={back.c}  sw={SW} />
              <StrandPaths d={front.d} c={front.c} sw={SW} />
            </g>
          );
        })}

        {/* Global specular sheen */}
        <path
          d="M35,48 C85,3 915,3 965,48"
          fill="none"
          stroke="rgba(255,230,110,0.18)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
