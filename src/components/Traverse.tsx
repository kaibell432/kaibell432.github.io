import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { projects } from '../content';
import { StationMark } from './StationMark';
import { MAIN_HILL, ringPoint, summit, TOPO_VIEW, type Point } from './TopoBackground';
import { cn } from './ui';

/**
 * The hero's survey traverse: the route up the hero's main hill. Every project is
 * a station on one dashed line; the oldest sits low on the slope and the route
 * switchbacks up across the contours to the newest at the summit. Each station
 * links down to its data sheet.
 *
 * From 1360px (the `route` breakpoint) the stations are plotted on the topography itself: each is a point on
 * one of the hill's contour rings (or its summit), mapped through the same
 * `xMidYMid slice` transform the hero's TopoBackground uses, so the route sits
 * exactly on the terrain at any viewport size. Below it the same list runs down
 * a vertical dashed line, newest at the top.
 */

/**
 * The climb, oldest first: contour level and angle (degrees, 90 = straight down
 * the page) for each station; the last is the summit. Angles alternate either
 * side of the fall line so the route switchbacks.
 */
const CLIMB: (readonly [level: number, deg: number] | 'summit')[] = [
  [11, 112],
  [8, 92],
  [6, 128],
  [3, 84],
  'summit',
];

/** Projects are listed newest first; climb index 0 is the oldest. */
const climbIndex = (i: number) => projects.length - 1 - i;

/** Load-in timing, bottom to top: each leg draws, then the station it reaches appears. */
const LEG_MS = 380;
const START_MS = 420;
const stationDelay = (climb: number) => START_MS + climb * LEG_MS;

/** A label starts 23px from its station's centre (half the 22px mark plus the 12px gap) and keeps 8px clear of the edge. */
const LABEL_OFFSET = 23 + 8;

type Plotted = { x: number; y: number; side: 'left' | 'right' };

/** Station positions in the list's own pixel space, re-measured whenever the hero resizes. */
function usePlot() {
  const ref = useRef<HTMLOListElement>(null);
  const [plot, setPlot] = useState<{ points: Plotted[]; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const list = ref.current;
    const band = list?.closest('section');
    if (!list || !band) return;

    const measure = () => {
      const b = band.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      // TopoBackground: viewBox 1200×800, preserveAspectRatio xMidYMid slice over the band.
      const s = Math.max(b.width / TOPO_VIEW.w, b.height / TOPO_VIEW.h);
      const ox = (b.width - TOPO_VIEW.w * s) / 2 - (l.left - b.left);
      const oy = (b.height - TOPO_VIEW.h * s) / 2 - (l.top - b.top);
      const toList = ([x, y]: Point) => ({ x: ox + x * s, y: oy + y * s });

      const peak = toList(summit(MAIN_HILL));
      const climb = CLIMB.map((c) =>
        toList(c === 'summit' ? summit(MAIN_HILL) : ringPoint(MAIN_HILL, c[0], (c[1] * Math.PI) / 180)),
      );
      const rightEdge = b.right - l.left;
      // Each label's real width (its text block), so the fit test matches what renders.
      const widths = [...list.querySelectorAll<HTMLElement>('[data-station-label]')].map((el) => el.offsetWidth);
      const fitsRight = (c: number) => climb[c]!.x + LABEL_OFFSET + (widths[climbIndex(c)] ?? 0) <= rightEdge;
      // Labels sit on the outside of each switchback, flipping left where they would leave the hero.
      // The summit's label goes opposite the station just below it, so the two never stack.
      const last = climb.length - 1;
      const sides = climb.map((p, c): Plotted['side'] => (p.x < peak.x - 1 || !fitsRight(c) ? 'left' : 'right'));
      sides[last] = sides[last - 1] === 'right' || !fitsRight(last) ? 'left' : 'right';
      const points = projects.map((_, i) => ({ ...climb[climbIndex(i)]!, side: sides[climbIndex(i)]! }));
      setPlot({ points, w: l.width, h: l.height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(band);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return [ref, plot] as const;
}

export function Traverse() {
  const [active, setActive] = useState<number | null>(null);
  const uid = useId().replace(/:/g, '');
  const [listRef, plot] = usePlot();

  // Legs in climb order: leg c runs from climb station c up to c + 1.
  const byClimb = plot ? projects.map((_, c) => plot.points[climbIndex(c)]!) : [];
  const legs = byClimb.slice(1).map((to, c) => ({ from: byClimb[c]!, to, c }));
  const activeClimb = active === null ? null : climbIndex(active);

  return (
    <nav aria-label="Projects" className="relative route:mx-auto route:w-full route:max-w-[600px]">
      <ol ref={listRef} className="relative space-y-5 route:aspect-[6/5] route:space-y-0">
        {/* Below route: the route runs straight up the list, drawing from the oldest station. */}
        <span
          aria-hidden
          className="climb-draw absolute top-3 bottom-3 left-[10px] border-l border-dashed border-on-main/35 route:hidden"
          style={{ '--climb-delay': `${START_MS}ms`, '--climb-ms': `${LEG_MS * (projects.length - 1)}ms` } as CSSProperties}
        />

        {/* route: the route on the terrain. Legs are dashed; each draws upward through a solid mask. */}
        {plot ? (
          <svg
            aria-hidden
            viewBox={`0 0 ${plot.w} ${plot.h}`}
            className="pointer-events-none absolute inset-0 hidden size-full overflow-visible route:block"
          >
            <defs>
              {legs.map(({ from, to, c }) => (
                <mask key={c} id={`${uid}-leg-${c}`} maskUnits="userSpaceOnUse">
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#fff"
                    strokeWidth="8"
                    pathLength={1}
                    className="leg-draw"
                    style={{ '--leg-delay': `${stationDelay(c) + 120}ms`, '--leg-ms': `${LEG_MS}ms` } as CSSProperties}
                  />
                </mask>
              ))}
            </defs>
            {legs.map(({ from, to, c }) => {
              const lit = activeClimb === c + 1;
              return (
                <line
                  key={c}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  mask={`url(#${uid}-leg-${c})`}
                  strokeDasharray="5 6"
                  style={{ '--leg-delay': `${stationDelay(c) + 120}ms` } as CSSProperties}
                  className={cn(
                    'leg-pen transition-[stroke,stroke-width,stroke-opacity] duration-200',
                    lit ? 'stroke-accent' : 'stroke-on-main',
                  )}
                  strokeOpacity={lit ? 1 : 0.5}
                  strokeWidth={lit ? 2 : 1.25}
                />
              );
            })}
          </svg>
        ) : null}

        {projects.map((p, i) => {
          const at = plot?.points[i];
          const left = at?.side === 'left';
          const signal = p.kind === 'work';
          const delay = stationDelay(climbIndex(i));
          return (
            <li
              key={p.id}
              style={
                {
                  '--x': at ? `${at.x}px` : undefined,
                  '--y': at ? `${at.y}px` : undefined,
                  '--reveal-delay': `${delay}ms`,
                } as CSSProperties
              }
              className="hero-in relative route:absolute route:top-(--y) route:left-(--x)"
            >
              <a
                href={`#project-${p.id}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  'group flex items-start gap-3 rounded-md text-on-main route:w-max route:-translate-y-[11px]',
                  left ? 'route:-translate-x-[calc(100%-11px)] route:flex-row-reverse route:text-right' : 'route:-translate-x-[11px]',
                )}
              >
                <StationMark signal={signal} active={active === i} className="pen-mark relative" />
                {/* The label is as wide as its longest line (the station number line never wraps); titles wrap at 13rem. */}
                <span data-station-label className="min-w-0 pt-px">
                  <span
                    className={cn(
                      'block text-base leading-snug font-semibold text-balance font-stretch-semi-expanded decoration-accent decoration-2 underline-offset-4 group-hover:underline route:max-w-52 route:text-lg',
                      left && 'route:ml-auto',
                    )}
                  >
                    {p.title}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block font-mono text-label-sm uppercase route:whitespace-nowrap',
                      signal ? 'text-accent-glow' : 'text-on-main-subtle',
                    )}
                  >
                    03.{i + 1} · {p.context}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
