import type { CSSProperties } from 'react';
import {
  ArrowRightIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { facts, profile } from '../content';
import { TopoBackground } from './TopoBackground';
import { button, cn, IconLink } from './ui';

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden bg-main text-on-main">
      <TopoBackground />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-32 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 lg:pt-40 lg:pb-24">
        <div>
          <p
            className="hero-in flex items-center gap-2.5 font-mono text-label text-accent-glow uppercase"
            style={delay(0)}
          >
            <span aria-hidden className="size-1.5 bg-accent" />
            {profile.role} · {profile.company}
          </p>

          <h1
            className="hero-in mt-5 text-6xl leading-[0.95] font-extrabold tracking-tight font-stretch-semi-expanded sm:text-7xl lg:text-8xl"
            style={delay(80)}
          >
            Kai Bell
          </h1>

          <p
            className="hero-in mt-7 max-w-2xl text-2xl leading-snug font-medium text-balance sm:text-[1.75rem]"
            style={delay(160)}
          >
            I build React front ends for data-heavy work, from{' '}
            <span className="text-accent">geospatial analysis</span> to data repositories.
          </p>

          <p className="hero-in mt-5 max-w-xl leading-relaxed text-pretty text-on-main-muted" style={delay(240)}>
            I work alongside systems engineers in KBR’s National Security Solutions group. Before that, I was on the
            other end of the pipeline, labeling and quality-checking the geospatial data that trains AI models.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={delay(320)}>
            <a href="#projects" className={button.primary}>
              See my work
              <ArrowRightIcon aria-hidden />
            </a>
            {profile.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className={button.ghostDark}>
                <FileTextIcon aria-hidden />
                Résumé
              </a>
            ) : (
              <a href="#contact" className={button.ghostDark}>
                Get in touch
              </a>
            )}
            <div className="flex items-center sm:ml-2">
              <IconLink href={profile.github} label="GitHub">
                <GitHubLogoIcon aria-hidden className="size-5" />
              </IconLink>
              <IconLink href={profile.linkedin} label="LinkedIn">
                <LinkedInLogoIcon aria-hidden className="size-5" />
              </IconLink>
              <IconLink href={`mailto:${profile.email}`} label="Email">
                <EnvelopeClosedIcon aria-hidden className="size-5" />
              </IconLink>
            </div>
          </div>
        </div>

        <Portrait />
      </div>

      <div className="relative border-t border-on-main/10 bg-main-800/70 backdrop-blur-sm">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={cn(
                'py-5 pr-4 sm:py-6',
                i % 2 === 1 && 'border-l border-on-main/10 pl-4',
                i >= 2 && 'border-t border-on-main/10 lg:border-t-0',
                i > 0 && 'lg:border-l lg:pl-6',
              )}
            >
              <dt className="flex items-center gap-2 font-mono text-label-sm text-on-main-subtle uppercase">
                <fact.icon aria-hidden className="size-3.5 shrink-0 text-accent-glow" />
                {fact.label}
              </dt>
              <dd className="mt-2 pl-5.5 text-sm font-medium text-pretty sm:text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Point on a circle of radius r centred at (50, 50), angle in degrees from 12 o'clock. */
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
};

function Portrait() {
  return (
    <figure className="hero-in relative mx-auto size-56 sm:size-64 lg:size-76" style={delay(200)}>
      {/* Survey-reticle ring: slow dashed orbit, compass ticks, and an accent arc */}
      <div aria-hidden className="pointer-events-none absolute -inset-7 sm:-inset-9">
        <svg viewBox="0 0 100 100" className="size-full overflow-visible motion-safe:animate-[spin_90s_linear_infinite]">
          <circle
            cx="50"
            cy="50"
            r="49.5"
            fill="none"
            stroke="var(--color-on-main)"
            strokeOpacity="0.22"
            strokeWidth="0.35"
            strokeDasharray="0.5 1.6"
          />
          <path
            d={`M ${polar(49.5, 28)} A 49.5 49.5 0 0 1 ${polar(49.5, 74)}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="-1.5"
              x2="50"
              y2="3.5"
              stroke="var(--color-accent)"
              strokeWidth="0.7"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative size-full overflow-hidden rounded-full bg-main-700 ring-2 ring-accent ring-offset-[6px] ring-offset-main">
        <img
          src="/kai-bell.webp"
          width={800}
          height={800}
          alt="Portrait of Kai Bell"
          fetchPriority="high"
          className="size-full object-cover"
        />
      </div>
    </figure>
  );
}
