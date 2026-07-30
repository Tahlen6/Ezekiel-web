import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  eyebrow: string;
  /** Kept to 8–12 words per the content rules. */
  headline: ReactNode;
  lead?: ReactNode;
  /** Centre alignment is used only for the hero and closing sections. */
  align?: 'start' | 'center';
  className?: string;
  /**
   * Extra classes for the lead paragraph. Sticky scenes pass `short:hidden` so
   * the intro gives way on laptop-height screens instead of the visual.
   */
  leadClassName?: string;
  /** Heading level — every section uses h2; the hero owns the single h1. */
  as?: 'h1' | 'h2';
}

export function SectionHeader({
  eyebrow,
  headline,
  lead,
  align = 'start',
  className = '',
  leadClassName = '',
  as: Heading = 'h2',
}: SectionHeaderProps) {
  const centred = align === 'center';

  return (
    <div className={`${centred ? 'flex flex-col items-center text-center' : ''} ${className}`}>
      <Reveal index={0}>
        <p className="text-eyebrow uppercase text-blue-300">{eyebrow}</p>
      </Reveal>

      <Reveal index={1}>
        <Heading
          className={`mt-5 max-w-[20ch] text-display-2 text-fg ${centred ? 'mx-auto' : ''}`}
          // Optical alignment: pull the cap edge back onto the grid line.
          style={centred ? undefined : { marginLeft: '-0.02em' }}
        >
          {headline}
        </Heading>
      </Reveal>

      {lead ? (
        <Reveal index={2}>
          <p
            className={`measure-lead mt-6 text-lead text-fg-2 ${centred ? 'mx-auto' : ''} ${leadClassName}`}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Section shell: consistent vertical rhythm and anchor offset in one place. */
export function Section({
  id,
  children,
  className = '',
  label,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`section-y relative scroll-mt-[var(--nav-h)] ${className}`}
    >
      {children}
    </section>
  );
}
