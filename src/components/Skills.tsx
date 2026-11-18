import type { ReactNode } from 'react';
import { Accordion } from '@base-ui/react/accordion';
import { ArrowTopRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { certification, education, legend, skills } from '../content';
import { Section } from './ui';

export function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      label="Skills & credentials"
      title="What I work with."
      className="bg-white"
    >
      <div className="space-y-6">
        <div className="grid gap-px overflow-hidden rounded-xl bg-black/[0.08] ring-1 ring-black/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <div key={group.group} className="bg-paper p-6">
              <h3 className="font-mono text-label text-accent-ink uppercase">{group.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-black/[0.08]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-main p-6 text-on-main ring-1 ring-on-main/10 sm:p-7">
            <p className="flex items-center gap-2 font-mono text-label text-accent-glow uppercase">
              <legend.certified aria-hidden className="size-3.5 shrink-0" />
              Certification
            </p>
            <h3 className="mt-3 text-xl leading-snug font-bold tracking-tight font-stretch-semi-expanded">
              {certification.name}
            </h3>
            <p className="mt-1 font-mono text-xs text-on-main-subtle">
              {certification.issuer} · {certification.code}
            </p>
            <p className="mt-4 mb-6 text-sm leading-relaxed text-pretty text-on-main-muted">{certification.description}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-on-main/10 pt-4">
              <p className="font-mono text-xs text-on-main-subtle">
                Issued {certification.issued} · Valid through {certification.expires}
              </p>
              <a
                href={certification.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md text-sm font-semibold text-accent-glow underline-offset-4 hover:underline"
              >
                Verify on Credly
                <ArrowTopRightIcon aria-hidden />
              </a>
            </div>
          </article>

          <article className="h-full rounded-xl bg-paper p-6 ring-1 ring-black/[0.08] sm:p-7">
            <p className="flex items-center gap-2 font-mono text-label text-accent-ink uppercase">
              <legend.studied aria-hidden className="size-3.5 shrink-0" />
              Education
            </p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-bold tracking-tight font-stretch-semi-expanded">{education.school}</h3>
              <p className="font-mono text-xs text-muted">{education.graduated}</p>
            </div>
            <p className="mt-1 text-muted">
              {education.degree} · {education.location}
            </p>

            <Accordion.Root className="mt-5 border-t border-black/[0.08]">
              <CourseItem title="Relevant coursework">
                <ul className="flex flex-wrap gap-1.5">
                  {education.coursework.map((c) => (
                    <li key={c} className="rounded-md bg-white px-2.5 py-1 text-sm ring-1 ring-black/[0.08]">
                      {c}
                    </li>
                  ))}
                </ul>
              </CourseItem>
              {education.highlights.map((h) => (
                <CourseItem key={h.course} title={h.course}>
                  <ul className="space-y-2">
                    {h.bullets.map((b) => (
                      <li key={b.slice(0, 32)} className="flex gap-3 text-sm leading-relaxed text-pretty text-ink/90">
                        <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CourseItem>
              ))}
            </Accordion.Root>
          </article>
        </div>
      </div>
    </Section>
  );
}

function CourseItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Accordion.Item className="border-b border-black/[0.08]">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-3.5 text-left text-base font-semibold hover:text-accent-ink">
          {title}
          <PlusIcon
            aria-hidden
            className="shrink-0 text-muted transition-transform duration-200 group-data-panel-open:rotate-45 group-data-panel-open:text-accent-ink"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-300 ease-out-expo data-ending-style:h-0 data-starting-style:h-0">
        <div className="pb-4">{children}</div>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
