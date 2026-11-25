import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Smoothly scroll to an element id (or an absolute y position). Falls back to native scrolling. */
export function scrollToTarget(target: string | number) {
  if (typeof target === 'number') {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.8 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
