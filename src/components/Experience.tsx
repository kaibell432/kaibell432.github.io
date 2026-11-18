import type { CSSProperties } from 'react';
import { experience, type Job } from '../content';
import { useReveal } from '../hooks';
import { cn, Section, Tag } from './ui';

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
        <span aria-hidden className="draw-y absolute top-3 bottom-3 left-[7px] hidden w-px bg-black/10 sm:block" />
        {experience.map((job, i) => (
          <li key={job.company} className="relative sm:pl-12">
            <span
              aria-hidden
              style={{ '--draw-delay': `${250 + i * 300}ms` } as CSSProperties}
              className={cn(
                'draw-dot absolute top-7 left-0 hidden size-[15px] rounded-full border-2 sm:block',
                job.current ? 'border-accent bg-accent ring-[5px] ring-accent/15' : 'border-black/25 bg-white',
              )}
            />
            <div>
              <JobCard job={job} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-xl bg-paper p-6 ring-1 ring-black/[0.06] sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="text-xl font-bold tracking-tight font-stretch-semi-expanded sm:text-2xl">{job.company}</h3>
          {job.detail || job.location ? (
            <p className="mt-1 text-sm text-muted">{[job.detail, job.location].filter(Boolean).join(' · ')}</p>
          ) : null}
        </div>
        {job.current ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider text-accent-ink uppercase">
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
            Current
          </span>
        ) : null}
      </header>

      <div className="mt-6 space-y-7">
        {job.roles.map((role, r) => (
          <section key={role.title} className={cn(r > 0 && 'border-t border-black/[0.08] pt-7')}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-lg font-semibold">{role.title}</h4>
              <p className="font-mono text-xs tracking-wide text-muted">
                {role.start} – {role.end}
              </p>
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
        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies and focus areas">
          {job.stack.map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
