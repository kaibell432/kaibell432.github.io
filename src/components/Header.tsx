import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import {
  Cross1Icon,
  EnvelopeClosedIcon,
  FileTextIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { profile, site } from '../content';
import { useActiveSection } from '../hooks';
import { ThemePicker } from './ThemePicker';
import { button, cn } from './ui';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

const NAV_IDS = NAV.map((item) => item.id);

export function Header() {
  const active = useActiveSection(NAV_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-on-main/10 bg-main/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 rounded-md text-on-main" aria-label="Kai Bell, back to top">
          <Monogram />
          <span className="text-base font-semibold tracking-tight font-stretch-semi-expanded">Kai Bell</span>
        </a>

        <div className="flex items-center gap-1">
          <nav aria-label="Primary" className="mr-1 hidden md:block">
            <ul className="flex items-center">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-active={active === item.id || undefined}
                    className="relative block rounded-md px-3 py-2 text-sm text-on-main-muted transition-colors after:absolute after:inset-x-3 after:-bottom-[14px] after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-on-main data-active:text-on-main data-active:after:scale-x-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {site.themePicker ? <ThemePicker /> : null}

          {profile.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(button.primaryCompact, 'ml-1 hidden md:inline-flex')}
            >
              <FileTextIcon aria-hidden />
              Résumé
            </a>
          ) : null}

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger
              aria-label="Open menu"
              className="-mr-2 grid size-11 place-items-center rounded-lg text-on-main hover:bg-on-main/10 md:hidden"
            >
              <HamburgerMenuIcon aria-hidden className="size-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 supports-[-webkit-touch-callout:none]:absolute bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
              <Dialog.Popup className="fixed inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col bg-main px-6 pt-4 pb-8 text-on-main shadow-2xl ring-1 ring-on-main/10 transition-transform duration-300 ease-out-expo data-ending-style:translate-x-full data-starting-style:translate-x-full">
                <div className="flex h-12 items-center justify-between">
                  <Dialog.Title className="font-mono text-xs tracking-[0.18em] text-on-main-subtle uppercase">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="-mr-2 grid size-11 place-items-center rounded-lg hover:bg-on-main/10"
                  >
                    <Cross1Icon aria-hidden className="size-4" />
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="mt-6">
                  <ul className="space-y-1">
                    {NAV.map((item, i) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setMenuOpen(false)}
                          data-active={active === item.id || undefined}
                          className="flex items-baseline gap-4 rounded-lg px-2 py-3 text-2xl font-semibold font-stretch-semi-expanded hover:bg-on-main/5 data-active:text-accent"
                        >
                          <span className="font-mono text-xs font-normal text-on-main-subtle">0{i + 1}</span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto space-y-4">
                  {profile.resumeUrl ? (
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className={cn(button.primary, 'w-full')}>
                      <FileTextIcon aria-hidden />
                      Résumé
                    </a>
                  ) : null}
                  <div className="flex gap-2 border-t border-on-main/10 pt-4 text-on-main-muted">
                    <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-11 place-items-center rounded-lg hover:bg-on-main/10 hover:text-on-main">
                      <GitHubLogoIcon aria-hidden className="size-5" />
                    </a>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-11 place-items-center rounded-lg hover:bg-on-main/10 hover:text-on-main">
                      <LinkedInLogoIcon aria-hidden className="size-5" />
                    </a>
                    <a href={`mailto:${profile.email}`} aria-label="Email" className="grid size-11 place-items-center rounded-lg hover:bg-on-main/10 hover:text-on-main">
                      <EnvelopeClosedIcon aria-hidden className="size-5" />
                    </a>
                  </div>
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

function Monogram() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
      <rect width="32" height="32" rx="7" fill="var(--color-main-700)" />
      <path
        d="M7 11V7h4M21 7h4v4M25 21v4h-4M11 25H7v-4"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M12.5 10.5v11M12.5 16.5l6.5-6M14.8 14.3l4.7 7.2"
        fill="none"
        stroke="var(--color-on-main)"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
