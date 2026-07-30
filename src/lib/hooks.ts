'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * SSR-safe media query subscription. useSyncExternalStore avoids the
 * mount-then-flash pattern of the usual useEffect approach: the server snapshot
 * is committed on the first paint and only corrected if it was wrong.
 */
export function useMediaQuery(query: string, serverSnapshot = false): boolean {
  const subscribe = useMemo(
    () => (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export type Density = 'mobile' | 'tablet' | 'desktop';

/**
 * Visual density tier. Drives how many graph nodes get drawn and how much
 * motion runs — the spec asks for a genuinely simpler mobile experience, not a
 * scaled-down desktop one.
 */
export function useDensity(): Density {
  const isDesktop = useMediaQuery('(min-width: 1024px)', true);
  const isTablet = useMediaQuery('(min-width: 640px)', true);
  if (isDesktop) return 'desktop';
  if (isTablet) return 'tablet';
  return 'mobile';
}

/**
 * Laptop-height and below. Sticky storytelling scenes have to fit the viewport
 * exactly — there is no scrolling out of a pinned pane — so on short screens
 * they shed secondary copy rather than clipping the visual.
 *
 * Must stay in sync with the `short` variant in globals.css.
 */
export function useShortViewport(): boolean {
  return useMediaQuery('(max-height: 880px)');
}

/**
 * How much of a scrollytelling scene fits at once.
 *
 * `full`     — the source document plus up to two artefacts.
 * `anchored` — the document plus one artefact. For wide but short screens: the
 *              document is only ~120px and it is what every other block refers
 *              back to, so dropping it leaves a lone card floating in a wide
 *              empty column. Keeping it costs little and preserves the context.
 * `minimal`  — one artefact. Phones only, where even the document plus one
 *              block overruns the budget (440px needed, 364px available at
 *              375x667).
 *
 * Thresholds are measured, not chosen: `full` needs ~426px of stage, which a
 * 1280px-wide viewport provides from 760px tall and a narrower one from 820px.
 */
export type StageMode = 'full' | 'anchored' | 'minimal';

export function useStageMode(): StageMode {
  const phone = useMediaQuery('(max-width: 639px)');
  const roomyWide = useMediaQuery('(min-width: 1280px) and (min-height: 760px)');
  const roomyTall = useMediaQuery('(min-height: 820px)');

  if (phone) return 'minimal';
  return roomyWide || roomyTall ? 'full' : 'anchored';
}

/** Coarse pointer — used to widen hit targets and skip hover-only affordances. */
export function useCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}
