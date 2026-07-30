'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

interface RevealProps {
  children: ReactNode;
  /** Stagger index. Capped at 6 steps so nobody waits on a long list. */
  index?: number;
  as?: ElementType;
  className?: string;
  /** Fraction of the element that must be visible before revealing. */
  amount?: number;
}

const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 6;

/**
 * Entry animation for content that becomes relevant on scroll.
 *
 * Deliberately not a motion component: this runs on dozens of elements, and an
 * IntersectionObserver plus a compositor-only CSS transition costs no JS per
 * element and cannot drop frames. Reduced motion collapses it to a short
 * opacity fade with no offset and no stagger.
 */
export function Reveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  amount = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If it is already past the fold on load, show it without animating in.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  const delay = reduced ? 0 : Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: reduced || visible ? 'none' : 'translateY(16px)',
        transition: reduced
          ? `opacity 120ms linear ${delay}ms`
          : `opacity var(--dur-slow) var(--ease-out-expo) ${delay}ms, transform var(--dur-slow) var(--ease-out-expo) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
