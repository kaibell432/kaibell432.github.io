import { cn } from './ui';

/**
 * Survey station symbol: a ring with a triangle inside, centred on its point.
 * `tone` follows the band it sits on; `signal` marks KBR work in the accent.
 */
export function StationMark({
  signal = false,
  tone = 'dark',
  active = false,
  className,
}: {
  signal?: boolean;
  tone?: 'dark' | 'light';
  active?: boolean;
  className?: string;
}) {
  const color = signal ? 'text-accent' : tone === 'dark' ? 'text-on-main' : 'text-ink';
  return (
    <svg aria-hidden viewBox="0 0 22 22" className={cn('size-[22px] shrink-0 overflow-visible', color, className)}>
      <circle
        cx="11"
        cy="11"
        r="9.5"
        fill={tone === 'dark' ? 'var(--color-main)' : 'var(--color-paper)'}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M11 5.5 16 14.5H6Z" fill="currentColor" />
      <circle
        cx="11"
        cy="11"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeOpacity={active ? 0.45 : 0}
        className="transition-[stroke-opacity] duration-200"
      />
    </svg>
  );
}
