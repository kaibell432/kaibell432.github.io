import { useEffect, useRef, useState } from 'react';

/**
 * Same-page anchor links scroll to their section without writing a hash into
 * the URL, and the browser doesn't restore an old scroll position on reload, so
 * opening or refreshing the page starts at the top. An explicit deep link
 * (e.g. /#projects from elsewhere) still lands on its section.
 */
export function installInPageLinks() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link?.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();
    // Defer a tick so a closing dialog (mobile menu) releases its scroll lock first.
    setTimeout(() => {
      target.scrollIntoView({ block: 'start' }); // CSS scroll-behavior decides smooth vs instant
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true }); // keeps keyboard and screen-reader position in step
    }, 0);
  });
}

/** After the first render, jump to a section named in the URL hash (deep links). */
export function useInitialHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, []);
}

/**
 * Returns the id of the section currently crossing the middle of the viewport.
 * `ids` must be a stable array (define it at module scope).
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        setActive(ids.find((id) => (ratios.get(id) ?? 0) > 0) ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.01] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** Adds `data-shown` to the element the first time it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.dataset.shown = '';
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.shown = '';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Shrinks a wrapping block to its widest rendered line. A wrapped heading
 * otherwise keeps the full available width, leaving a gap before whatever
 * follows it on the row (here, the section callout's leader line).
 * Use with greedy wrapping: lines that fit the old width still fit the new one.
 */
export function useShrinkWrap<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    const row = el?.parentElement;
    if (!el || !row || !('ResizeObserver' in window)) return;

    const fit = () => {
      el.style.width = '';
      const range = document.createRange();
      range.selectNodeContents(el);
      const left = el.getBoundingClientRect().left;
      let right = left;
      for (const rect of range.getClientRects()) right = Math.max(right, rect.right);
      if (right > left) el.style.width = `${Math.ceil(right - left) + 1}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    void document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  return ref;
}
