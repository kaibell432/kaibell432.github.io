import { Dialog } from '@base-ui/react/dialog';
import { ArrowTopRightIcon, Cross1Icon, FileTextIcon, LockClosedIcon, PlusIcon } from '@radix-ui/react-icons';
import type { CSSProperties } from 'react';
import { projects, type Project, type ProjectLink as ProjectLinkData } from '../content';
import { useReveal } from '../hooks';
import { StationMark } from './StationMark';
import { ring, type Hill } from './TopoBackground';
import { button, cn, InlineList, Section } from './ui';
import { ViewerLink, viewableFromHref } from './Viewer';

export function Projects() {
  const railRef = useReveal<HTMLOListElement>();

  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title="Selected work."
      intro="Two React apps I’ve built at KBR, plus personal and university projects. Open any card for the details."
    >
      {/* The hero's traverse continues here: one dashed line past every station's data sheet. */}
      <ol ref={railRef} className="reveal relative space-y-6 [--draw-pace:1.8]">
        {projects.map((p, i) => (
          <DataSheet key={p.id} project={p} order={i} last={i === projects.length - 1} />
        ))}
      </ol>
    </Section>
  );
}

function DataSheet({ project: p, order, last }: { project: Project; order: number; last: boolean }) {
  const dark = p.kind === 'work';
  const station = `03.${order + 1}`;
  const delay = { '--draw-delay': `${300 + order * 280}ms` } as CSSProperties;

  return (
    <li id={`project-${p.id}`} className="relative scroll-mt-24 sm:pl-12 lg:pl-56">
      {/* Leg of the traverse from this station down to the next one (24px gap + 44px to its centre). */}
      {last ? null : (
        <span
          aria-hidden
          style={delay}
          className="draw-clip-y absolute top-[44px] -bottom-[68px] left-[10px] hidden border-l border-dashed border-ink/30 sm:block lg:left-[167px]"
        />
      )}
      {/* Station on the traverse; from lg its number sits in the margin like a coordinate. */}
      <span style={delay} className="draw-dot absolute top-[33px] left-0 hidden sm:block lg:left-[157px]">
        <StationMark signal={dark} tone="light" />
      </span>
      <p className="hidden font-mono text-xs text-muted lg:absolute lg:top-[36px] lg:left-0 lg:block lg:w-38 lg:text-right">
        Stn {station}
        {p.year ? ` · ${p.year}` : null}
      </p>
      <span
        aria-hidden
        style={delay}
        className="draw-x absolute top-[44px] left-[179px] hidden h-px w-[45px] bg-black/15 lg:block"
      />

      <Dialog.Root>
        <article
          className={cn(
            'group relative grid gap-6 overflow-hidden rounded-xl p-6 transition-[box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-0.5 sm:p-7 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-10',
            dark
              ? 'bg-main text-on-main ring-1 ring-on-main/10 hover:shadow-xl hover:shadow-black/20'
              : 'bg-white ring-1 ring-black/[0.08] hover:shadow-lg hover:shadow-black/[0.06]',
          )}
        >
          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl leading-tight font-bold tracking-tight text-balance font-stretch-semi-expanded sm:text-[1.75rem]">
                {p.title}
              </h3>
              <span
                className={cn(
                  'shrink-0 pt-1.5 font-mono text-xs lg:hidden',
                  dark ? 'text-on-main-subtle' : 'text-muted',
                )}
              >
                {station}
              </span>
            </div>
            <p
              className={cn(
                'mt-2 flex items-center gap-1.5 font-mono text-label-sm uppercase',
                dark ? 'text-accent-glow' : 'text-muted',
              )}
            >
              {dark ? <LockClosedIcon aria-hidden className="size-3" /> : null}
              {p.context}
            </p>
            <p className={cn('mt-4 max-w-2xl leading-relaxed text-pretty', dark ? 'text-on-main-muted' : 'text-muted')}>
              {p.summary}
            </p>

            <InlineList className="mt-5" label="Built with" tone={dark ? 'dark' : 'light'} items={p.stack} />

            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
              {/* Stretched trigger: the whole sheet opens the dialog */}
              <Dialog.Trigger
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md text-sm font-semibold after:absolute after:inset-0 after:content-['']",
                  dark ? 'text-accent-glow' : 'text-accent-ink',
                )}
              >
                <PlusIcon aria-hidden className="transition-transform duration-300 group-hover:rotate-90" />
                Details
                <span className="sr-only"> about {p.title}</span>
              </Dialog.Trigger>
              {p.links?.map((link) => (
                <ProjectLink
                  key={link.href}
                  link={link}
                  title={p.title}
                  className={cn(
                    'relative z-10 inline-flex items-center gap-1 rounded-md text-sm font-medium underline-offset-4 hover:underline',
                    dark ? 'text-on-main-muted' : 'text-ink',
                  )}
                />
              ))}
            </div>
          </div>

          <StationSketch order={order} signal={dark} dark={dark} />
        </article>

        <ProjectDialog project={p} />
      </Dialog.Root>
    </li>
  );
}

/** One small contour sketch per station, from the same generator as the hero topography. Schematic only. */
const SKETCH_HILL = (order: number): Hill => ({ cx: 660, cy: 430, radius: 470, levels: 7, seed: 0.9 + order * 1.37 });
const SKETCHES = projects.map((_, i) => {
  const hill = SKETCH_HILL(i);
  return Array.from({ length: hill.levels }, (_, level) => ring(hill, level));
});

function StationSketch({ order, signal, dark }: { order: number; signal: boolean; dark: boolean }) {
  const hill = SKETCH_HILL(order);
  const t = 1 / hill.levels;
  const summit = { x: hill.cx - (1 - t) * 60, y: hill.cy + (1 - t) * 30 };
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 840"
      className={cn(
        'hidden h-full max-h-44 w-full self-center transition-transform duration-700 ease-out-expo group-hover:scale-105 md:block',
        dark ? 'text-on-main' : 'text-ink',
      )}
    >
      {SKETCHES[order]!.map((d, level) => (
        <path
          key={level}
          d={d}
          fill="none"
          stroke={signal && level === 2 ? 'var(--color-accent)' : 'currentColor'}
          strokeOpacity={signal && level === 2 ? 0.8 : dark ? 0.16 : 0.2}
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={`M${summit.x} ${summit.y - 34}L${summit.x + 32} ${summit.y + 24}H${summit.x - 32}Z`}
        fill={signal ? 'var(--color-accent)' : 'currentColor'}
        fillOpacity={signal ? 1 : 0.5}
      />
    </svg>
  );
}

function ProjectDialog({ project: p }: { project: Project }) {
  const Icon = p.icon;
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 supports-[-webkit-touch-callout:none]:absolute bg-main-950/60 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <Dialog.Viewport className="fixed inset-0 grid place-items-end overflow-y-auto sm:place-items-center sm:p-6">
        <Dialog.Popup className="relative w-full max-w-xl rounded-t-xl bg-white p-6 text-ink shadow-2xl transition-[translate,scale,opacity] duration-300 ease-out-expo data-ending-style:translate-y-6 data-ending-style:opacity-0 data-starting-style:translate-y-6 data-starting-style:opacity-0 sm:rounded-xl sm:p-8 sm:data-ending-style:translate-y-0 sm:data-ending-style:scale-[0.97] sm:data-starting-style:translate-y-0 sm:data-starting-style:scale-[0.97]">
          <div className="flex items-start justify-between gap-4">
            <Icon aria-hidden className="mt-1 size-6 text-accent-ink" />
            <Dialog.Close
              aria-label="Close"
              className="-mt-1 -mr-2 grid size-10 place-items-center rounded-lg text-muted hover:bg-black/5 hover:text-ink"
            >
              <Cross1Icon aria-hidden />
            </Dialog.Close>
          </div>

          <p className="mt-5 font-mono text-label-sm text-muted uppercase">
            {[p.context, p.year].filter(Boolean).join(' · ')}
          </p>
          <Dialog.Title className="mt-1.5 text-2xl font-bold tracking-tight font-stretch-semi-expanded sm:text-3xl">
            {p.title}
          </Dialog.Title>
          <Dialog.Description className="mt-3 leading-relaxed text-pretty text-muted">{p.summary}</Dialog.Description>

          <ul className="mt-6 space-y-3 border-t border-black/[0.08] pt-6">
            {p.details.map((d) => (
              <li key={d.slice(0, 32)} className="flex gap-3 leading-relaxed text-pretty">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-accent" />
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <InlineList className="mt-6" label="Built with" items={p.stack} />

          {p.note ? (
            <p className="mt-6 flex items-start gap-2.5 rounded-lg bg-paper p-3.5 text-sm text-muted">
              <LockClosedIcon aria-hidden className="mt-0.5 shrink-0" />
              {p.note}
            </p>
          ) : null}

          {p.links?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {p.links.map((link, i) => (
                <ProjectLink key={link.href} link={link} title={p.title} className={i === 0 ? button.primary : button.ghostLight} />
              ))}
            </div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  );
}

/** A project link: PDFs open in the on-page viewer, everything else in a new tab. */
function ProjectLink({ link, title, className }: { link: ProjectLinkData; title: string; className: string }) {
  const viewable = viewableFromHref(link.href, title);
  if (viewable) {
    return (
      <ViewerLink item={viewable} className={className}>
        {link.label}
        <FileTextIcon aria-hidden className="size-3.5" />
      </ViewerLink>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noreferrer" className={className}>
      {link.label}
      <ArrowTopRightIcon aria-hidden className="size-3.5" />
    </a>
  );
}
