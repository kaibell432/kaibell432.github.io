/**
 * Decorative topographic contour map, generated once at module load.
 * Each "hill" is a stack of closed, wobbly rings drawn as smooth
 * Catmull-Rom curves.
 */
import { useId } from 'react';
import { cn } from './ui';

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

/**
 * The contour map. `dark` is the full sheet for the main-colour bands (grid,
 * radial fade, one accent contour). `light` is the same terrain in faint ink
 * with no grid or mask, used by `TerrainSeam` to carry a dark band's contours
 * across its edge onto the paper.
 */
export function TopoBackground({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  // Hero and Contact both render the dark sheet, so the defs need unique ids.
  const uid = useId().replace(/:/g, '');

  if (tone === 'light') {
    return (
      <svg
        aria-hidden
        className={cn('pointer-events-none absolute inset-0 size-full overflow-visible', className)}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="var(--color-ink)">
          {CONTOURS.map((c) => (
            <path
              key={c.key}
              d={c.d}
              strokeOpacity={c.index ? 0.11 : 0.06}
              strokeWidth={c.index ? 1.25 : 1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 size-full', className)}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`${uid}-grid`} width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="var(--color-on-main)" strokeOpacity="0.035" />
        </pattern>
        <radialGradient id={`${uid}-fade`} cx="62%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
        </radialGradient>
        <mask id={`${uid}-mask`}>
          <rect width="1200" height="800" fill={`url(#${uid}-fade)`} />
        </mask>
      </defs>

      <rect width="1200" height="800" fill={`url(#${uid}-grid)`} />
      <g mask={`url(#${uid}-mask)`} fill="none">
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

/**
 * Where a light section meets a dark band, the band's terrain keeps going onto
 * the paper in faint ink and fades out, so the edge reads as one map rather
 * than a change of sheet. The light SVG is laid out on the dark band's exact
 * box (its height comes from `--{band}-h`, set by `useHeightVar`) and allowed
 * to overflow, so every contour continues from where the band cuts it.
 */
export function TerrainSeam({ band, edge }: { band: 'hero' | 'contact'; edge: 'top' | 'bottom' }) {
  const h = `var(--${band}-h, 48rem)`;
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 h-[22rem] overflow-hidden sm:h-[28rem]',
        edge === 'top'
          ? 'top-0 [mask-image:linear-gradient(to_bottom,black,transparent)]'
          : 'bottom-0 [mask-image:linear-gradient(to_top,black,transparent)]',
      )}
    >
      <div
        className="absolute inset-x-0"
        style={edge === 'top' ? { height: h, bottom: '100%' } : { height: h, top: '100%' }}
      >
        <TopoBackground tone="light" />
      </div>
    </div>
  );
}
