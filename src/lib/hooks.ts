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
 * Too little height to build a scene up. Distinct from `useShortViewport`: that
 * one only trims secondary copy, while this one changes how many artefacts a
 * scrollytelling stage shows at once — a much heavier degradation.
 *
 * The threshold comes from measurement, not taste: the assessment stage needs
 * ~426px for its heaviest step, and a desktop-width viewport yields roughly
 * `height - 248px` of room, so anything above ~700px fits comfortably.
 */
export function useCompactStage(): boolean {
  const mobile = useMediaQuery('(max-width: 639px)');
  // Any desktop-width screen below this cannot hold the heaviest step.
  const short = useMediaQuery('(max-height: 759px)');
  // Narrower columns wrap more, so the same blocks grow ~25px taller and the
  // headline takes a second line — measured 451px of a 430px budget at 1024x720.
  const narrowAndShort = useMediaQuery('(max-width: 1279px) and (max-height: 819px)');
  return mobile || short || narrowAndShort;
}

/** Coarse pointer — used to widen hit targets and skip hover-only affordances. */
export function useCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}
