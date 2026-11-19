import { useId, useState, type CSSProperties } from 'react';
import { projects } from '../content';
import { StationMark } from './StationMark';
import { cn } from './ui';

/**
 * The hero's survey traverse: every project is a numbered station on one dashed
 * line, linking down to its data sheet. From lg the stations are plotted on a
 * 600×500 sheet with labels on alternating sides; below lg the same list runs
 * down a vertical dashed line.
 */
const SHEET = { w: 600, h: 500 };
const PLOT: { x: number; y: number; side: 'left' | 'right' }[] = [
  { x: 372, y: 46, side: 'right' },
  { x: 214, y: 148, side: 'left' },
  { x: 384, y: 252, side: 'right' },
  { x: 206, y: 352, side: 'left' },
  { x: 368, y: 452, side: 'right' },
];

/** Load-in timing: each leg draws, then the station it reaches appears. */
const LEG_MS = 380;
const START_MS = 420;
const stationDelay = (i: number) => START_MS + i * LEG_MS;

export function Traverse() {
  const [active, setActive] = useState<number | null>(null);
  const uid = useId().replace(/:/g, '');

  return (
    <nav aria-label="Projects" className="relative lg:mx-auto lg:w-full lg:max-w-[600px]">
      <ol className="relative space-y-5 lg:aspect-[6/5] lg:space-y-0">
        {/* Phones and tablets: the traverse runs straight down the list. */}
        <span aria-hidden className="absolute top-3 bottom-3 left-[10px] border-l border-dashed border-on-main/35 lg:hidden" />

        {/* lg: the plotted traverse. Legs are dashed; each draws in through a solid mask. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${SHEET.w} ${SHEET.h}`}
          className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block"
        >
          <defs>
            {PLOT.slice(1).map((p, k) => {
              const a = PLOT[k]!;
              return (
                <mask key={k} id={`${uid}-leg-${k}`} maskUnits="userSpaceOnUse">
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={p.x}
                    y2={p.y}
                    stroke="#fff"
                    strokeWidth="8"
                    pathLength={1}
                    className="leg-draw"
                    style={{ '--leg-delay': `${stationDelay(k) + 120}ms`, '--leg-ms': `${LEG_MS}ms` } as CSSProperties}
                  />
                </mask>
              );
            })}
          </defs>
          {PLOT.slice(1).map((p, k) => {
            const a = PLOT[k]!;
            const lit = active === k + 1;
            return (
              <line
                key={k}
                x1={a.x}
                y1={a.y}
                x2={p.x}
                y2={p.y}
                mask={`url(#${uid}-leg-${k})`}
                strokeDasharray="5 6"
                className={cn(
                  'transition-[stroke,stroke-width,stroke-opacity] duration-200',
                  lit ? 'stroke-accent' : 'stroke-on-main',
                )}
                strokeOpacity={lit ? 1 : 0.5}
                strokeWidth={lit ? 2 : 1.25}
              />
            );
          })}
        </svg>

        {projects.map((p, i) => {
          const at = PLOT[i]!;
          const left = at.side === 'left';
          const signal = p.kind === 'work';
          return (
            <li
              key={p.id}
              style={
                {
                  '--x': `${(at.x / SHEET.w) * 100}%`,
                  '--y': `${(at.y / SHEET.h) * 100}%`,
                  '--reveal-delay': `${stationDelay(i)}ms`,
                } as CSSProperties
              }
              className="hero-in relative lg:absolute lg:top-(--y) lg:left-(--x)"
            >
              <a
                href={`#project-${p.id}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  'group flex items-start gap-3 rounded-md text-on-main lg:w-max lg:max-w-52 lg:-translate-y-[11px]',
                  left ? 'lg:-translate-x-[calc(100%-11px)] lg:flex-row-reverse lg:text-right' : 'lg:-translate-x-[11px]',
                )}
              >
                <StationMark signal={signal} active={active === i} className="relative" />
                <span className="min-w-0 pt-px">
                  <span className="block text-base leading-snug font-semibold text-balance font-stretch-semi-expanded decoration-accent decoration-2 underline-offset-4 group-hover:underline lg:text-lg">
                    {p.title}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block font-mono text-label-sm uppercase lg:whitespace-nowrap',
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
