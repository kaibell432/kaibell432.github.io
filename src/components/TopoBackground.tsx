/**
 * Decorative topographic contour map, generated once at module load.
 * Each "hill" is a stack of closed, wobbly rings drawn as smooth
 * Catmull-Rom curves.
 */

type Point = [number, number];

export type Hill = {
  cx: number;
  cy: number;
  radius: number;
  levels: number;
  seed: number;
  /** Contour indexes drawn in the accent colour */
  accent?: number[];
};

const HILLS: Hill[] = [
  { cx: 940, cy: 330, radius: 560, levels: 15, seed: 1.3, accent: [3] },
  { cx: 90, cy: 780, radius: 420, levels: 11, seed: 4.1 },
  { cx: 520, cy: -40, radius: 220, levels: 6, seed: 2.6 },
];

export function ring(hill: Hill, level: number): string {
  const steps = 72;
  const t = (level + 1) / hill.levels;
  const r0 = hill.radius * t;
  // Inner rings drift so the summit sits off-centre, like real terrain.
  const cx = hill.cx - (1 - t) * 60;
  const cy = hill.cy + (1 - t) * 30;

  const pts: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wobble =
      1 +
      0.11 * Math.sin(3 * a + hill.seed + level * 0.21) +
      0.06 * Math.sin(5 * a + hill.seed * 1.7 - level * 0.33) +
      0.04 * Math.sin(2 * a + hill.seed * 0.6 + level * 0.12);
    pts.push([cx + r0 * wobble * Math.cos(a), cy + r0 * wobble * 0.8 * Math.sin(a)]);
  }

  const f = (p: Point) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  let d = `M${f(pts[0]!)}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[(i - 1 + steps) % steps]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % steps]!;
    const p3 = pts[(i + 2) % steps]!;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1)} ${f(c2)} ${f(p2)}`;
  }
  return `${d}Z`;
}

const CONTOURS = HILLS.flatMap((hill, h) =>
  Array.from({ length: hill.levels }, (_, level) => ({
    key: `${h}-${level}`,
    d: ring(hill, level),
    accent: hill.accent?.includes(level) ?? false,
    index: (hill.levels - level) % 5 === 0,
  })),
);

export function TopoBackground() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="topo-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="var(--color-on-main)" strokeOpacity="0.035" />
        </pattern>
        <radialGradient id="topo-fade" cx="62%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
        </radialGradient>
        <mask id="topo-mask">
          <rect width="1200" height="800" fill="url(#topo-fade)" />
        </mask>
      </defs>

      <rect width="1200" height="800" fill="url(#topo-grid)" />
      <g mask="url(#topo-mask)" fill="none">
        {CONTOURS.map((c) => (
          <path
            key={c.key}
            d={c.d}
            stroke={c.accent ? 'var(--color-accent)' : 'var(--color-on-main)'}
            strokeOpacity={c.accent ? 0.45 : c.index ? 0.11 : 0.06}
            strokeWidth={c.accent || c.index ? 1.25 : 1}
          />
        ))}
      </g>
    </svg>
  );
}
