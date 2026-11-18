import type { CSSProperties } from 'react';
import { experience, legend, type Job } from '../content';
import { useReveal } from '../hooks';
import { cn, InlineList, Section } from './ui';

export function Experience() {
  const railRef = useReveal<HTMLOListElement>();

  return (
    <Section
      id="experience"
      index="02"
      label="Experience"
      title="Where I’ve worked."
      intro="Building the tools now. Before that, getting to know the data that flows through them."
      className="bg-white"
    >
      <ol ref={railRef} className="reveal relative space-y-6 sm:space-y-8">
        {/* timeline rail */}
        <span aria-hidden className="draw-y absolute top-3 bottom-3 left-[7px] hidden w-px bg-black/10 sm:block lg:left-42" />
        {experience.map((job, i) => (
          <li key={job.company} className="relative sm:pl-12 lg:pl-56">
            <span
              aria-hidden
              style={{ '--draw-delay': `${250 + i * 300}ms` } as CSSProperties}
              className={cn(
                'draw-dot absolute top-7 left-0 hidden size-[15px] rounded-full border-2 sm:block lg:left-[161px]',
                job.current ? 'border-accent bg-accent ring-[5px] ring-accent/15' : 'border-black/25 bg-white',
              )}
            />
            <JobCard job={job} order={i} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

function JobCard({ job, order }: { job: Job; order: number }) {
  return (
    <article className="rounded-xl bg-paper p-6 ring-1 ring-black/[0.08] sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-balance font-stretch-semi-expanded sm:text-2xl">{job.company}</h3>
          {job.detail || job.location ? (
            <p className="mt-1 text-sm text-muted">{[job.detail, job.location].filter(Boolean).join(' · ')}</p>
          ) : null}
        </div>
        {job.current ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-label-sm font-medium text-accent-ink uppercase">
            <legend.now aria-hidden className="size-3 shrink-0" />
            Current
          </span>
        ) : null}
      </header>

      <div className="mt-6 space-y-7">
        {job.roles.map((role, r) => (
          <section key={role.title} className={cn(r > 0 && 'border-t border-black/[0.08] pt-7')}>
            <div className="relative flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-lg font-semibold">{role.title}</h4>
              {/* From lg up the dates sit in the margin like coordinates (card starts 224px in, padded 28px), with a leader line across the rail. */}
              <p className="font-mono text-xs text-muted lg:absolute lg:top-[7px] lg:-left-[252px] lg:w-38 lg:text-right lg:whitespace-nowrap">
                {role.start} – {role.end}
              </p>
              <span
                aria-hidden
                style={{ '--draw-delay': `${450 + order * 300 + r * 200}ms` } as CSSProperties}
                className="draw-x absolute top-[14px] -left-[92px] hidden h-px w-16 bg-black/15 lg:block"
              />
              {/* A move within the same company gets a waypoint on the rail. */}
              {r === 0 && job.roles.length > 1 ? (
                <span
                  aria-hidden
                  style={{ '--draw-delay': `${650 + order * 300}ms` } as CSSProperties}
                  className="draw-dot absolute top-[11px] -left-[87px] hidden size-[7px] bg-accent lg:block"
                />
              ) : null}
            </div>
            <ul className="mt-3 max-w-3xl space-y-2.5">
              {role.bullets.map((b) => (
                <li key={b.slice(0, 32)} className="flex gap-3 leading-relaxed text-pretty text-ink/90">
                  <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {job.stack ? (
        <InlineList className="mt-6" label="Technologies and focus areas" items={job.stack} />
      ) : null}
    </article>
  );
}
