import type { CSSProperties } from 'react';
import {
  ArrowRightIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { facts, profile } from '../content';
import { SURVEY_MARGIN, useHeightVar, useReveal } from '../hooks';
import { TopoBackground } from './TopoBackground';
import { ViewerLink } from './Viewer';
import { Traverse } from './Traverse';
import { button, cn, IconLink } from './ui';

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties;

export function Hero() {
  const ref = useHeightVar<HTMLElement>('--hero-h');
  const factsRef = useReveal<HTMLDListElement>(SURVEY_MARGIN);

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative overflow-hidden bg-main text-on-main">
      <TopoBackground />

      <div className="container-site relative grid items-center gap-14 pt-32 pb-16 lg:grid-cols-2 lg:gap-12 lg:pt-36 lg:pb-20">
        <div>
          <h1
            className="hero-in text-6xl leading-[0.95] font-extrabold tracking-tight font-stretch-semi-expanded sm:text-7xl lg:text-8xl"
            style={delay(0)}
          >
            Kai Bell
          </h1>

          {/* Current title as the name's byline; the accent square marks the current position. */}
          <p
            className="hero-in mt-4 flex items-center gap-3 text-lg font-medium text-on-main-muted sm:text-xl"
            style={delay(80)}
          >
            <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
            {profile.role} · {profile.company}
          </p>

          <p
            className="hero-in mt-7 max-w-2xl text-2xl leading-snug font-medium text-balance sm:text-[1.75rem]"
            style={delay(160)}
          >
            I build React front ends for <span className="whitespace-nowrap">data-heavy</span> work, from{' '}
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
              <ViewerLink item={{ kind: 'pdf', title: 'Résumé', src: profile.resumeUrl }} className={button.ghostDark}>
                <FileTextIcon aria-hidden />
                Résumé
              </ViewerLink>
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

        <Traverse />
      </div>

      <div className="relative border-t border-on-main/10 bg-main-800/70 backdrop-blur-sm">
        <dl
          ref={factsRef}
          className="survey-cols survey-cols-2 reveal container-site grid grid-cols-2 [--dash:color-mix(in_oklab,var(--color-on-main)_30%,transparent)] [--pen:var(--color-accent-glow)] [--rule:color-mix(in_oklab,var(--color-on-main)_10%,transparent)] lg:grid-cols-4 lg:survey-cols-4"
        >
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={cn(
                'py-5 pr-4 sm:py-6',
                i % 2 === 1 && 'pl-4',
                i > 0 && 'lg:pl-6',
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
