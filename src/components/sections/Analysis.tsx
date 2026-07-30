'use client';

import { useMemo, useRef, useState } from 'react';
import { DIAGNOSTIC_AREAS } from '@/data/content';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SignalBadge } from '@/components/ui/Signal';
import { neighbours } from '@/lib/model';

/**
 * Not a map — a diagnosis.
 *
 * Each tab is one executive question. Selecting it lifts the matching objects
 * out of the model and lists what they affect and what it costs, so a finding
 * is never an abstraction: it has a name, an owner and a consequence.
 */
export function Analysis() {
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const area = DIAGNOSTIC_AREAS[index]!;

  /* Findings first, then what they touch — the order drives the propagation
     stagger in the graph, so the consequence visibly follows the cause. */
  const highlight = useMemo(() => {
    const ids = area.findings.map((f) => f.nodeId);
    const related = new Set<string>();
    for (const id of ids) {
      for (const n of neighbours(id)) if (!ids.includes(n)) related.add(n);
    }
    return [...ids, ...related];
  }, [area]);

  function onTabKey(event: React.KeyboardEvent) {
    const last = DIAGNOSTIC_AREAS.length - 1;
    let next = index;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    setIndex(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <section id="elemzes" aria-labelledby="elemzes-cim" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="container-content">
        <SectionHeader
          eyebrow="Diagnózis"
          headline={<span id="elemzes-cim">Nem csak térképet készít. Diagnózist ad.</span>}
          lead="Négy elemzési terület, négy vezetői kérdés. Minden találat nevesített folyamathoz, szerepkörhöz és következményhez kötött."
        />

        {/* Tabs */}
        <Reveal>
          <div
            role="tablist"
            aria-label="Elemzési területek"
            onKeyDown={onTabKey}
            className="mt-12 flex gap-2 overflow-x-auto border-b border-line-subtle pb-px lg:mt-14"
          >
            {DIAGNOSTIC_AREAS.map((item, i) => {
              const selected = i === index;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`elemzes-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`elemzes-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={
                    'relative min-h-11 shrink-0 rounded-t-md px-4 text-body-sm transition-colors duration-[var(--dur-fast)] ' +
                    (selected ? 'text-fg' : 'text-fg-2 hover:text-fg')
                  }
                >
                  {item.label}
                  <span data-numeric className="ml-2 text-[0.6875rem] text-fg-3">
                    {item.findings.length}
                  </span>
                  <span
                    aria-hidden="true"
                    className={
                      'absolute inset-x-0 -bottom-px block h-px origin-left bg-blue-400 ' +
                      'transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] ' +
                      (selected ? 'scale-x-100' : 'scale-x-0')
                    }
                  />
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`elemzes-panel-${area.id}`}
          aria-labelledby={`elemzes-tab-${area.id}`}
          tabIndex={0}
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10"
        >
          {/* The question */}
          <div>
            {/* Keyed on the area so switching tabs replays the entrance. */}
            <div key={area.id} className="animate-enter">
                <div className="flex items-center gap-3">
                  <SignalBadge signal={area.id} />
                </div>
                <p className="measure-lead mt-5 text-display-3 text-fg">{area.question}</p>

                <ul className="mt-8 space-y-3">
                  {area.findings.map((finding, i) => (
                    <li
                      key={finding.nodeId}
                      style={{ animationDelay: `${80 + i * 70}ms` }}
                      className="animate-enter rounded-xl border border-line bg-raised/60 p-4 sm:p-5"
                    >
                      <p className="text-body font-medium text-fg">{finding.title}</p>
                      <p className="mt-1.5 text-body-sm text-fg-2">{finding.statement}</p>

                      <p className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">
                          Érinti
                        </span>
                        {finding.affects.map((label) => (
                          <span
                            key={label}
                            className="rounded-full border border-line-subtle px-2 py-0.5 text-[0.6875rem] text-fg-2"
                          >
                            {label}
                          </span>
                        ))}
                      </p>

                      <p className="mt-3 border-t border-line-subtle pt-3 text-body-sm text-fg-2">
                        <span className="text-fg-3">Következmény: </span>
                        {finding.consequence}
                      </p>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* The findings, in the model */}
          <Reveal className="tall:lg:sticky tall:lg:top-[calc(var(--nav-h)+1.5rem)] lg:self-start">
            <div className="relative overflow-hidden rounded-xl border border-line bg-[radial-gradient(120%_100%_at_50%_0%,rgba(20,26,34,0.85)_0%,var(--color-base)_70%)]">
              <div className="grid-substrate absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="relative h-[22rem] sm:h-[26rem] lg:h-[30rem]">
                <GraphCanvas
                  progress={1}
                  highlight={highlight}
                  dim
                  labels="key"
                  camera={{ zoom: 0.92 }}
                  pulses={false}
                  ariaLabel={`A modell a(z) ${area.label.toLowerCase()} találataival kiemelve: ${area.findings
                    .map((f) => f.title)
                    .join(', ')}.`}
                />
              </div>
              <p className="pointer-events-none absolute bottom-3 left-4 text-[0.6875rem] text-fg-3">
                <span data-numeric>{area.findings.length}</span> találat ·{' '}
                <span data-numeric>{highlight.length - area.findings.length}</span> érintett objektum
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
