'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { progressOf, type ProgressMode } from '@/lib/scroll';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Scroll-linked animation without a React render per frame.
 *
 * `apply` receives the track's progress (0→1) every frame while the track is
 * near the viewport, and writes styles imperatively — the same pattern the graph
 * renderer uses. This is why the page needs no animation library: everything
 * scroll-driven is one rAF loop writing transforms, and everything else is a
 * CSS transition.
 */
export function useScrollDrive(
  ref: RefObject<HTMLElement | null>,
  apply: (progress: number) => void,
  mode: ProgressMode = 'through',
): void {
  const applyRef = useRef(apply);
  useLayoutEffect(() => {
    applyRef.current = apply;
  });

  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: present the resolved end state once and never animate.
    if (reduced) {
      applyRef.current(1);
      return;
    }

    let frame = 0;

    const tick = () => {
      applyRef.current(progressOf(el, mode));
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && frame === 0) {
          frame = requestAnimationFrame(tick);
        } else if (!visible && frame !== 0) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: '120px' },
    );

    observer.observe(el);
    applyRef.current(progressOf(el, mode));

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref, mode, reduced]);
}

/** Maps v from [from, to] onto [0, 1], clamped. Mirrors lib/canvas `range`. */
export function span(v: number, from: number, to: number): number {
  if (to === from) return v >= to ? 1 : 0;
  const t = (v - from) / (to - from);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeOut = (t: number): number => 1 - (1 - t) ** 3;
