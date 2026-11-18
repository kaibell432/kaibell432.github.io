import type { CSSProperties, ReactNode } from 'react';
import { Toast } from '@base-ui/react/toast';
import { Tooltip } from '@base-ui/react/tooltip';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useReveal, useShrinkWrap } from '../hooks';

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const buttonCore =
  'items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-150 select-none active:translate-y-px';
const buttonBase = cn('inline-flex h-11 px-5', buttonCore);

export const button = {
  primary: cn(buttonBase, 'bg-accent text-on-accent hover:bg-accent-600'),
  /** Compact primary button. Sets no display, so callers choose it (e.g. `hidden md:inline-flex`). */
  primaryCompact: cn(buttonCore, 'h-9 px-4 bg-accent text-on-accent hover:bg-accent-600'),
  ghostDark: cn(buttonBase, 'border border-on-main/20 text-on-main hover:border-on-main/40 hover:bg-on-main/5'),
  ghostLight: cn(buttonBase, 'border border-black/15 text-ink hover:border-black/30 hover:bg-black/[0.03]'),
};

export function Tag({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 font-mono text-label-sm whitespace-nowrap',
        tone === 'dark'
          ? 'bg-on-main/[0.07] text-on-main-muted ring-1 ring-on-main/10'
          : 'bg-black/[0.04] text-ink ring-1 ring-black/[0.08]',
      )}
    >
      {children}
    </span>
  );
}

export function Section({
  id,
  index,
  label,
  title,
  intro,
  tone = 'light',
  className,
  backdrop,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
  /** Full-bleed decorative layer rendered behind the content */
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  const headerRef = useReveal<HTMLDivElement>();
  const titleRef = useShrinkWrap<HTMLHeadingElement>();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'relative py-20 sm:py-28',
        tone === 'dark' ? 'bg-main text-on-main' : 'text-ink',
        className,
      )}
    >
      {backdrop ?? (tone === 'light' ? <div aria-hidden className="map-grid pointer-events-none absolute inset-0" /> : null)}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={headerRef} className="reveal mb-12 sm:mb-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-6">
            <h2
              ref={titleRef}
              id={`${id}-title`}
              className="max-w-3xl min-w-0 text-3xl leading-[1.1] font-bold tracking-tight font-stretch-semi-expanded sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            {/* Map callout: a leader line runs from the heading out to the section's marker and name. */}
            <p
              aria-hidden
              className={cn(
                'flex min-w-36 flex-1 items-center gap-3 font-mono text-label uppercase',
                tone === 'dark' ? 'text-accent-glow' : 'text-accent-ink',
              )}
            >
              <span className={cn('draw-x h-px flex-1', tone === 'dark' ? 'bg-on-main/25' : 'bg-ink/20')} />
              <span className="draw-dot size-1.5 shrink-0 bg-accent" style={{ '--draw-delay': '650ms' } as CSSProperties} />
              <span className="shrink-0 whitespace-nowrap">
                {index} · {label}
              </span>
            </p>
          </div>
          {intro ? (
            <p
              className={cn(
                'mt-5 max-w-2xl text-lg leading-relaxed text-pretty',
                tone === 'dark' ? 'text-on-main-muted' : 'text-muted',
              )}
            >
              {intro}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export const tooltipPopup =
  'rounded-md bg-main-950 px-2.5 py-1.5 font-mono text-label-sm text-on-main shadow-lg ring-1 ring-on-main/10 origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none';

/** Icon-only link with an accessible name and a Base UI tooltip. */
export function IconLink({
  href,
  label,
  children,
  tone = 'dark',
}: {
  href: string;
  label: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
}) {
  const external = href.startsWith('http');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <a
            href={href}
            aria-label={label}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className={cn(
              'grid size-11 place-items-center rounded-lg transition-colors',
              tone === 'dark'
                ? 'text-on-main-muted hover:bg-on-main/10 hover:text-on-main'
                : 'text-ink hover:bg-black/5',
            )}
          />
        }
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup className={tooltipPopup}>{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** Renders toasts queued with Toast.useToastManager(). */
export function Toaster() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] sm:right-6 sm:bottom-6 sm:w-80">
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            className="absolute right-0 bottom-0 w-full overflow-hidden rounded-xl bg-main-950 text-on-main shadow-2xl shadow-black/30 ring-1 ring-on-main/10 transition-[translate,opacity] duration-300 ease-out-expo data-ending-style:translate-y-3 data-ending-style:opacity-0 data-limited:opacity-0 data-starting-style:translate-y-3 data-starting-style:opacity-0"
          >
            <Toast.Content className="flex items-start gap-3 p-4">
              <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-glow" />
              <div className="min-w-0 flex-1">
                <Toast.Title className="text-sm font-semibold" />
                <Toast.Description className="mt-0.5 text-sm break-words text-on-main-muted" />
              </div>
              <Toast.Close
                aria-label="Dismiss"
                className="-m-1 grid size-7 shrink-0 place-items-center rounded-md text-on-main-subtle hover:bg-on-main/10 hover:text-on-main"
              >
                <Cross2Icon aria-hidden />
              </Toast.Close>
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}
