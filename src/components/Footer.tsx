import { ArrowUpIcon } from '@radix-ui/react-icons';

export function Footer() {
  return (
    <footer className="border-t border-on-main/10 bg-main-800 text-sm text-on-main-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Kai Bell</p>
        <p className="font-mono text-xs">Built with React, Base UI &amp; Tailwind CSS</p>
        <a href="#top" className="inline-flex items-center gap-1.5 rounded-md hover:text-on-main">
          Back to top
          <ArrowUpIcon aria-hidden />
        </a>
      </div>
    </footer>
  );
}
