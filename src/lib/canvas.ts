/** Canvas helpers shared by the graph visuals. */

export type RGB = readonly [number, number, number];

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function parseColor(value: string): RGB | null {
  const raw = value.trim();
  if (!raw) return null;

  const hex = HEX.exec(raw);
  if (hex?.[1]) {
    const h = hex[1];
    if (h.length === 3) {
      return [
        parseInt(h[0]! + h[0]!, 16),
        parseInt(h[1]! + h[1]!, 16),
        parseInt(h[2]! + h[2]!, 16),
      ];
    }
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }

  // rgb(…) / rgba(…) / space-separated `rgb(10 13 18 / 0.5)`
  const nums = raw.match(/[\d.]+/g);
  if (nums && nums.length >= 3) {
    return [Number(nums[0]), Number(nums[1]), Number(nums[2])];
  }
  return null;
}

/**
 * Reads a design token straight off :root so the canvas and the CSS cannot
 * drift apart. Tailwind's @theme emits every token as a custom property, which
 * makes the stylesheet the single source of truth for graph colours too.
 */
export function readToken(name: string, fallback: RGB): RGB {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseColor(value) ?? fallback;
}

export function rgba(color: RGB, alpha: number): string {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

/** Device pixel ratio, capped at 2 — 3x on phones buys nothing but fill cost. */
export function dpr(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Maps v from [from, to] onto [0, 1], clamped. */
export function range(v: number, from: number, to: number): number {
  if (to === from) return v >= to ? 1 : 0;
  return clamp01((v - from) / (to - from));
}

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/**
 * Frame-rate-independent exponential approach. `halfLife` is the time in ms for
 * the remaining distance to halve, so state settling looks identical at 60 and
 * 120 Hz.
 */
export function approach(current: number, target: number, dt: number, halfLife = 90): number {
  if (current === target) return target;
  const t = 1 - 2 ** (-dt / halfLife);
  const next = current + (target - current) * t;
  return Math.abs(target - next) < 0.001 ? target : next;
}

/**
 * Sizes the backing store to the element and returns the CSS-pixel box.
 * Returns null when the element has no layout yet.
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  ratio: number,
): { width: number; height: number } | null {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const w = Math.round(rect.width * ratio);
  const h = Math.round(rect.height * ratio);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { width: rect.width, height: rect.height };
}
