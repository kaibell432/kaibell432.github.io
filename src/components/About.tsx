import { about } from '../content';
import { Portrait } from './Portrait';
import { InlineList, Section } from './ui';

export function About() {
  return (
    <Section id="about" index="01" label="About" title={about.title}>
      {/* Portrait beside the story, then the focus areas as an even strip across the full width. */}
      <div className="grid items-center gap-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20">
        <Portrait className="mx-auto size-52 sm:size-60 lg:mx-0 lg:ml-8 lg:size-64" />
        <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-pretty text-ink/90">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>

      <ul className="mt-16 grid gap-px overflow-hidden rounded-xl bg-black/[0.08] ring-1 ring-black/[0.08] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {about.focus.map(({ icon: Icon, title, body }) => (
          <li key={title} className="bg-white p-6">
            <Icon aria-hidden className="size-5 text-accent-ink" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted">{body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h3 className="font-mono text-label text-muted uppercase">Off the clock</h3>
        <InlineList mono={false} items={about.hobbies} />
      </div>
    </Section>
  );
}
