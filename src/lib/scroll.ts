'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { clamp01 } from '@/lib/canvas';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * `through` — for tall sticky containers: 0 when the container's top reaches the
 *   viewport top, 1 when its bottom reaches the viewport bottom.
 * `exit` — for full-height sections: 0 at rest, 1 once scrolled fully past.
 */
export type ProgressMode = 'through' | 'exit';

export function progressOf(el: HTMLElement, mode: ProgressMode): number {
  const rect = el.getBoundingClientRect();
  if (mode === 'exit') {
    return rect.height > 0 ? clamp01(-rect.top / rect.height) : 0;
  }
  const travel = rect.height - window.innerHeight;
  return travel > 0 ? clamp01(-rect.top / travel) : clamp01(-rect.top / rect.height);
}

/**
 * Scroll progress as a getter, computed on demand.
 *
 * Canvas visuals already run a frame loop, so they can just ask for the value
 * when they need it. No scroll listener, no React state, nothing to keep in
 * sync — and one rect read per frame is cheaper than the alternatives.
 */
export function useScrollProgressGetter(
  ref: RefObject<HTMLElement | null>,
  mode: ProgressMode = 'through',
): () => number {
  return useCallback(() => {
    const el = ref.current;
    return el ? progressOf(el, mode) : 0;
  }, [ref, mode]);
}

/**
 * Scroll progress quantised into discrete steps, as React state.
 *
 * For content that genuinely changes — the active assessment step, the source
 * cards' phase — where a re-render per step is correct and a per-frame value
 * would be wasteful.
 */
export function useScrollStep(
  ref: RefObject<HTMLElement | null>,
  steps: number,
  mode: ProgressMode = 'through',
): { step: number; progress: number } {
  const [state, setState] = useState({ step: 0, progress: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // With reduced motion the story must not depend on scroll position, so the
    // section presents its resolved end state as soon as it is reached.
    if (reduced) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setState({ step: steps - 1, progress: 1 });
            io.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      io.observe(el);
      return () => io.disconnect();
    }

    let queued = false;
    let lastStep = -1;

    const read = () => {
      queued = false;
      const target = ref.current;
      if (!target) return;
      const progress = progressOf(target, mode);
      // Bias the boundary slightly late so a step holds while it is being read.
      const step = Math.min(steps - 1, Math.floor(progress * steps * 0.999));
      if (step !== lastStep) {
        lastStep = step;
        setState({ step, progress });
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, steps, mode, reduced]);

  return state;
}

/**
 * One-shot timed progress, used for the hero's self-assembling model: it plays
 * once on load so the page explains itself before anyone scrolls.
 * Reduced motion skips straight to the assembled state.
 */
export function useAutoProgress(durationMs: number, delayMs = 0): () => number {
  const reduced = usePrefersReducedMotion();
  const startRef = useRef<number | null>(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    startRef.current = performance.now() + delayMs;
  }, [delayMs]);

  return useCallback(() => {
    if (reducedRef.current) return 1;
    const start = startRef.current;
    if (start === null) return 0;
    const t = clamp01((performance.now() - start) / durationMs);
    // easeInOutCubic: settles rather than stops, which reads as deliberate.
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  }, [durationMs]);
}
