'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

const DURATION = 700;

/**
 * Counter that eases from its previous value to the new one.
 *
 * Writes textContent directly rather than re-rendering: React must not own this
 * text, or a value change would paint the final number before the tween starts.
 * The JSX child stays constant for exactly that reason, so reconciliation never
 * touches the node after mount.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  className = '',
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduced = usePrefersReducedMotion();

  const format = useCallback(
    (v: number) =>
      v.toLocaleString('hu-HU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  // Server and first client paint show the real value — no flash, no CLS.
  const initial = useRef(format(value)).current;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = previous.current;
    previous.current = value;

    if (reduced || from === value) {
      el.textContent = format(value);
      return;
    }

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / DURATION);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = format(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced, format]);

  return (
    <span ref={ref} data-numeric className={className}>
      {initial}
    </span>
  );
}
