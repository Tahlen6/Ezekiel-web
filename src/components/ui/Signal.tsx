import { SIGNAL_LABEL, type Certainty, type SignalId } from '@/lib/model';

/**
 * Diagnostic markers. Colour never carries the meaning on its own — each badge
 * pairs it with a glyph and the written label, so the state survives greyscale,
 * colour-blindness and a screen reader.
 */

const SIGNAL_STYLE: Record<SignalId, { colour: string; ring: string; glyph: string }> = {
  gap: { colour: 'var(--color-signal-gap)', ring: 'rgb(232 163 61 / 0.3)', glyph: '○' },
  conflict: { colour: 'var(--color-signal-conflict)', ring: 'rgb(199 125 255 / 0.3)', glyph: '⇄' },
  risk: { colour: 'var(--color-signal-risk)', ring: 'rgb(229 89 94 / 0.3)', glyph: '△' },
  loss: { colour: 'var(--color-signal-loss)', ring: 'rgb(242 193 78 / 0.3)', glyph: '↓' },
};

export function SignalBadge({ signal, className = '' }: { signal: SignalId; className?: string }) {
  const style = SIGNAL_STYLE[signal];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium ${className}`}
      style={{ color: style.colour, borderColor: style.ring, backgroundColor: `${style.ring}` }}
    >
      <span aria-hidden="true" className="text-[0.75em] leading-none">
        {style.glyph}
      </span>
      {SIGNAL_LABEL[signal]}
    </span>
  );
}

const CERTAINTY_FILLED: Record<Certainty, number> = { high: 3, medium: 2, low: 1 };

/** Three-step evidence meter. The written level always accompanies it. */
export function CertaintyMeter({ certainty }: { certainty: Certainty }) {
  const filled = CERTAINTY_FILLED[certainty];
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={
            'block size-1.5 rounded-full ' +
            (i < filled
              ? certainty === 'low'
                ? 'bg-signal-gap'
                : 'bg-blue-400'
              : 'bg-fg-3/35')
          }
        />
      ))}
    </span>
  );
}
