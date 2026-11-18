import { Dialog } from '@base-ui/react/dialog';
import { ArrowTopRightIcon, Cross1Icon, LockClosedIcon, PlusIcon } from '@radix-ui/react-icons';
import { projects, type Project } from '../content';
import { cn, Section, Tag } from './ui';

export function Projects() {
  const work = projects.filter((p) => p.kind === 'work');
  const other = projects.filter((p) => p.kind !== 'work');

  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title="Selected work."
      intro="Two React apps I’ve built at KBR, plus personal and university projects. Open any card for the details."
    >
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          {work.map((p) => (
            <div key={p.id}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {other.map((p, i) => (
            <div key={p.id} className={cn(i === other.length - 1 && 'md:col-span-2 lg:col-span-1')}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const dark = p.kind === 'work';
  const Icon = p.icon;

  return (
    <Dialog.Root>
      <article
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-xl p-6 transition-[box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-0.5 sm:p-7',
          dark
            ? 'bg-main text-on-main ring-1 ring-on-main/10 hover:shadow-xl hover:shadow-black/20'
            : 'bg-white ring-1 ring-black/[0.07] hover:shadow-lg hover:shadow-black/[0.06]',
        )}
      >
        {dark ? <CornerContours /> : null}

        <div className="relative flex items-start justify-between gap-4">
          <span
            className={cn(
              'grid size-11 place-items-center rounded-lg',
              dark ? 'bg-accent text-on-accent' : 'bg-accent/10 text-accent-ink',
            )}
          >
            <Icon aria-hidden className="size-5" />
          </span>
          <p
            className={cn(
              'flex items-center gap-1.5 pt-1 text-right font-mono text-[11px] tracking-wider uppercase',
              dark ? 'text-on-main-subtle' : 'text-muted',
            )}
          >
            {dark ? <LockClosedIcon aria-hidden className="size-3" /> : null}
            {p.context}
          </p>
        </div>

        <h3 className="relative mt-6 text-xl font-bold tracking-tight font-stretch-semi-expanded sm:text-2xl">
          {p.title}
        </h3>
        <p className={cn('relative mt-2 leading-relaxed text-pretty', dark ? 'text-on-main-muted' : 'text-muted')}>
          {p.summary}
        </p>

        <ul className="relative mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
          {p.stack.map((s) => (
            <li key={s}>
              <Tag tone={dark ? 'dark' : 'light'}>{s}</Tag>
            </li>
          ))}
        </ul>

        <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
          {/* Stretched trigger: the whole card opens the dialog */}
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
            <ExternalLink key={link.href} link={link} dark={dark} className="relative z-10" />
          ))}
        </div>
      </article>

      <ProjectDialog project={p} />
    </Dialog.Root>
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
            <span className="grid size-11 place-items-center rounded-lg bg-accent text-on-accent">
              <Icon aria-hidden className="size-5" />
            </span>
            <Dialog.Close
              aria-label="Close"
              className="-mt-1 -mr-2 grid size-10 place-items-center rounded-lg text-muted hover:bg-black/5 hover:text-ink"
            >
              <Cross1Icon aria-hidden />
            </Dialog.Close>
          </div>

          <p className="mt-5 font-mono text-[11px] tracking-wider text-muted uppercase">
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

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
            {p.stack.map((s) => (
              <li key={s}>
                <Tag>{s}</Tag>
              </li>
            ))}
          </ul>

          {p.note ? (
            <p className="mt-6 flex items-start gap-2.5 rounded-lg bg-paper p-3.5 text-sm text-muted">
              <LockClosedIcon aria-hidden className="mt-0.5 shrink-0" />
              {p.note}
            </p>
          ) : null}

          {p.links?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {p.links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors',
                    i === 0
                      ? 'bg-accent text-on-accent hover:bg-accent-600'
                      : 'border border-black/15 hover:border-black/30 hover:bg-black/[0.03]',
                  )}
                >
                  {link.label}
                  <ArrowTopRightIcon aria-hidden />
                </a>
              ))}
            </div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  );
}

function ExternalLink({
  link,
  dark,
  className,
}: {
  link: { label: string; href: string };
  dark: boolean;
  className?: string;
}) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex items-center gap-1 rounded-md text-sm font-medium underline-offset-4 hover:underline',
        dark ? 'text-on-main-muted' : 'text-ink',
        className,
      )}
    >
      {link.label}
      <ArrowTopRightIcon aria-hidden className="size-3.5" />
    </a>
  );
}

function CornerContours() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -top-16 -right-16 size-64 text-on-main opacity-[0.07] transition-transform duration-700 ease-out-expo group-hover:scale-110"
    >
      {[20, 38, 56, 74, 92].map((r, i) => (
        <ellipse
          key={r}
          cx={100 + i * 2}
          cy={100 - i}
          rx={r}
          ry={r * 0.82}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
