import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--dur-fast)] ' +
  'ease-[var(--ease-out-expo)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_0_0_rgba(79,163,255,0)] ' +
    'hover:shadow-[0_6px_28px_-6px_rgba(79,163,255,0.55)]',
  secondary:
    'border border-line-strong bg-white/[0.03] text-fg backdrop-blur-sm ' +
    'hover:border-line-blue hover:bg-blue-400/[0.08]',
  ghost: 'text-fg hover:text-blue-300 px-0',
};

// 44px minimum touch target at every size, per the spec's mobile requirements.
const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-body-sm',
  lg: 'min-h-13 px-7 text-body',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Trailing arrow, for "next step" affordances. */
  arrow?: boolean;
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
    >
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Uses next/link rather than a bare anchor so that absolute hrefs pick up any
 * configured basePath, which a hand-written <a href="/..."> would escape.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  arrow = false,
  href = '#',
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={`group ${base} ${variants[variant]} ${variant === 'ghost' ? '' : sizes[size]} ${className}`}
      {...rest}
    >
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  arrow = false,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`group ${base} ${variants[variant]} ${variant === 'ghost' ? '' : sizes[size]} ${className}`}
      {...rest}
    >
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}
