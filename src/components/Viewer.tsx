import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowTopRightIcon, Cross1Icon, DownloadIcon, FileTextIcon } from '@radix-ui/react-icons';
import { button, cn } from './ui';

/**
 * Anything that opens in the on-page viewer. PDFs only for now; add a new `kind`
 * here and a matching branch in `ViewerBody` to pop up other content later.
 */
export type Viewable = { kind: 'pdf'; title: string; src: string };

/** Links whose target the viewer can show inline. */
export const viewableFromHref = (href: string, title: string): Viewable | null =>
  /\.pdf($|[?#])/i.test(href) ? { kind: 'pdf', title, src: href } : null;

/**
 * A real link to the file that opens it in the viewer on a plain click. Modified
 * clicks (new tab, download) and no-JS visits still follow the link. Each link owns
 * its dialog, so it nests correctly inside other dialogs such as project details.
 */
export function ViewerLink({
  item,
  className,
  children,
}: {
  item: Viewable;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <a href={item.src} target="_blank" rel="noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 supports-[-webkit-touch-callout:none]:absolute bg-main-950/70 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          {/* Sized to the page's content width: 70% of the viewport from 1024px. */}
          <Dialog.Popup className="fixed inset-x-3 top-3 bottom-3 flex flex-col overflow-hidden rounded-xl bg-white text-ink shadow-2xl ring-1 ring-black/10 transition-[translate,opacity] duration-300 ease-out-expo data-ending-style:translate-y-4 data-ending-style:opacity-0 data-starting-style:translate-y-4 data-starting-style:opacity-0 sm:inset-x-6 sm:top-6 sm:bottom-6 lg:inset-x-[15%] lg:top-8 lg:bottom-8">
            <header className="flex items-center gap-3 border-b border-black/[0.08] py-2.5 pr-2.5 pl-5">
              <FileTextIcon aria-hidden className="size-4 shrink-0 text-accent-ink" />
              <Dialog.Title className="min-w-0 flex-1 truncate font-semibold font-stretch-semi-expanded">
                {item.title}
              </Dialog.Title>
              <a
                href={item.src}
                target="_blank"
                rel="noreferrer"
                className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted hover:bg-black/5 hover:text-ink sm:inline-flex"
              >
                Open in new tab
                <ArrowTopRightIcon aria-hidden />
              </a>
              <a
                href={item.src}
                download
                aria-label={`Download ${item.title}`}
                className="grid size-10 place-items-center rounded-lg text-muted hover:bg-black/5 hover:text-ink"
              >
                <DownloadIcon aria-hidden />
              </a>
              <Dialog.Close
                aria-label="Close"
                className="grid size-10 place-items-center rounded-lg text-muted hover:bg-black/5 hover:text-ink"
              >
                <Cross1Icon aria-hidden />
              </Dialog.Close>
            </header>
            <ViewerBody item={item} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/** True where the browser can show a PDF inside the page (desktop browsers; not most phones). */
function useInlinePdf() {
  const [inline, setInline] = useState(true);
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    setInline(navigator.pdfViewerEnabled !== false && !coarse);
  }, []);
  return inline;
}

function ViewerBody({ item }: { item: Viewable }) {
  const inline = useInlinePdf();

  if (inline) {
    return <iframe src={`${item.src}#view=FitH&navpanes=0`} title={item.title} className="min-h-0 w-full flex-1 bg-paper" />;
  }

  return (
    <div className="grid flex-1 place-items-center bg-paper p-6 text-center">
      <div className="max-w-xs">
        <FileTextIcon aria-hidden className="mx-auto size-8 text-accent-ink" />
        <p className="mt-4 text-muted">This device opens PDFs in its own viewer.</p>
        <div className="mt-6 flex flex-col gap-3">
          <a href={item.src} target="_blank" rel="noreferrer" className={cn(button.primary, 'w-full')}>
            Open PDF
            <ArrowTopRightIcon aria-hidden />
          </a>
          <a href={item.src} download className={cn(button.ghostLight, 'w-full')}>
            <DownloadIcon aria-hidden />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
