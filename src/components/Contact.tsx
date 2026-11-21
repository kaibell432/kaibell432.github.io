import { useState } from 'react';
import { Toast } from '@base-ui/react/toast';
import {
  CheckIcon,
  CopyIcon,
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { profile } from '../content';
import { useHeightVar } from '../hooks';
import { TopoBackground } from './TopoBackground';
import { button, Section } from './ui';

export function Contact() {
  const toast = Toast.useToastManager();
  const [copied, setCopied] = useState(false);
  // The backdrop fills the section, so its height is the band's: Skills lays its TerrainSeam out on it.
  const backdropRef = useHeightVar<HTMLDivElement>('--contact-h');

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.add({ title: 'Email copied', description: profile.email });
    } catch {
      toast.add({ title: 'Couldn’t copy automatically', description: profile.email });
    }
  }

  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      tone="dark"
      title="Let’s talk."
      intro="Whether it’s a role, a project, or a question about something on this page, email is the best way to reach me."
      className="overflow-hidden"
      backdrop={
        // Contours reach the top edge (faintly) so they meet the ink ones coming down from Skills.
        <div
          ref={backdropRef}
          aria-hidden
          className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,rgb(0_0_0/0.4),black_45%)]"
        >
          <TopoBackground />
        </div>
      }
    >
      <div className="flex flex-col gap-4 rounded-xl bg-main-800/80 p-5 ring-1 ring-on-main/10 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <a
          href={`mailto:${profile.email}`}
          className="min-w-0 rounded-md text-xl font-semibold break-all text-on-main decoration-accent decoration-2 underline-offset-[6px] hover:underline sm:text-3xl sm:font-stretch-semi-expanded"
        >
          {profile.email}
        </a>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={copyEmail} className={button.ghostDark} aria-live="polite">
            {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <a href={`mailto:${profile.email}`} className={button.primary}>
            <EnvelopeClosedIcon aria-hidden />
            Email me
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className={button.ghostDark}>
          <LinkedInLogoIcon aria-hidden />
          LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer" className={button.ghostDark}>
          <GitHubLogoIcon aria-hidden />
          GitHub
        </a>
      </div>
    </Section>
  );
}
