import { cn } from './ui';

/** Point on a circle of radius r centred at (50, 50), angle in degrees from 12 o'clock. */
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
};

/**
 * Circular portrait inside the survey reticle: a slow dashed orbit, four compass
 * ticks and an accent arc. `tone` matches the band it sits on.
 */
export function Portrait({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const line = tone === 'dark' ? 'var(--color-on-main)' : 'var(--color-ink)';
  return (
    <figure className={cn('relative', className)}>
      <div aria-hidden className="pointer-events-none absolute -inset-6 sm:-inset-7">
        <svg viewBox="0 0 100 100" className="size-full overflow-visible motion-safe:animate-[spin_90s_linear_infinite]">
          <circle cx="50" cy="50" r="49.5" fill="none" stroke={line} strokeOpacity="0.28" strokeWidth="0.35" strokeDasharray="0.5 1.6" />
          <path
            d={`M ${polar(49.5, 28)} A 49.5 49.5 0 0 1 ${polar(49.5, 74)}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="-1.5"
              x2="50"
              y2="3.5"
              stroke="var(--color-accent)"
              strokeWidth="0.7"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div
        className={cn(
          'relative size-full overflow-hidden rounded-full ring-2 ring-accent ring-offset-[6px]',
          tone === 'dark' ? 'bg-main-700 ring-offset-main' : 'bg-black/5 ring-offset-paper',
        )}
      >
        <img
          src="/kai-bell.webp"
          width={800}
          height={800}
          alt="Portrait of Kai Bell"
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </div>
    </figure>
  );
}
