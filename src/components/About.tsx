import { about } from '../content';
import { Reveal, Section } from './ui';

export function About() {
  return (
    <Section id="about" index="01" label="About" title={about.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="space-y-6 text-lg leading-relaxed text-pretty text-ink/90">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={100}>
            <ul className="grid gap-px overflow-hidden rounded-xl bg-black/[0.07] ring-1 ring-black/[0.07] sm:grid-cols-2 lg:grid-cols-1">
              {about.focus.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 bg-white p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent-ink">
                    <Icon aria-hidden className="size-[18px]" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180}>
            <h3 className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Off the clock</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {about.hobbies.map((hobby) => (
                <li key={hobby} className="rounded-full bg-white px-3.5 py-1.5 text-sm ring-1 ring-black/[0.08]">
                  {hobby}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
