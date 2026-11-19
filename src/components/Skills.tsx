import type { ReactNode } from 'react';
import { Accordion } from '@base-ui/react/accordion';
import { ArrowTopRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { certification, education, legend, skills } from '../content';
import { cn, InlineList, Section } from './ui';

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
              <ul className="mt-4 space-y-1.5 text-base font-medium">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-main p-6 text-on-main ring-1 ring-on-main/10 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <h3 className="text-xl leading-snug font-bold tracking-tight text-balance font-stretch-semi-expanded">
                {certification.name}
              </h3>
              <CornerTag tone="dark" icon={legend.certified}>
                Certification
              </CornerTag>
            </div>
            <p className="mt-2 font-mono text-xs text-on-main-subtle">
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <h3 className="text-xl leading-snug font-bold tracking-tight text-balance font-stretch-semi-expanded">
                {education.school}
              </h3>
              <CornerTag icon={legend.studied}>Education</CornerTag>
            </div>
            <p className="mt-2 text-muted">
              {education.degree} · {education.location}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">{education.graduated}</p>

            <Accordion.Root className="mt-5 border-t border-black/[0.08]">
              <CourseItem title="Relevant coursework">
                <InlineList mono={false} items={education.coursework} />
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

/** Legend symbol and label in a card's top-right corner, like the project cards' context line. */
function CornerTag({
  icon: Icon,
  tone = 'light',
  children,
}: {
  icon: (typeof legend)[keyof typeof legend];
  tone?: 'light' | 'dark';
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        'flex shrink-0 items-center gap-1.5 font-mono text-label-sm uppercase sm:pt-1.5',
        tone === 'dark' ? 'text-on-main-subtle' : 'text-muted',
      )}
    >
      <Icon aria-hidden className={cn('size-3.5 shrink-0', tone === 'dark' ? 'text-accent-glow' : 'text-accent-ink')} />
      {children}
    </p>
  );
}
