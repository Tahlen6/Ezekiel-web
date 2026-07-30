'use client';

import { useMemo, useState } from 'react';
import { SIMULATIONS } from '@/data/content';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

type Phase = 'before' | 'after';

/**
 * See the consequence before the decision.
 *
 * Pick a question, switch to "Utána", and the change spreads through the model
 * node by node — which is the actual argument: an organisation is a system, and
 * touching one point produces effects somewhere else.
 */
export function DecisionSupport() {
  const [index, setIndex] = useState(1);
  const [phase, setPhase] = useState<Phase>('after');
  const simulation = SIMULATIONS[index]!;

  // Origin first, then everything the change reaches — the order is the
  // propagation the graph animates.
  const highlight = useMemo(
    () => (phase === 'after' ? [...simulation.origin, ...simulation.affected] : []),
    [phase, simulation],
  );

  return (
    <section
      id="dontestamogatas"
      aria-labelledby="dontestamogatas-cim"
      className="section-y scroll-mt-[var(--nav-h)]"
    >
      <div className="container-content">
        <SectionHeader
          eyebrow="Szimuláció"
          headline={<span id="dontestamogatas-cim">A döntés előtt lásd a következményeket.</span>}
          lead="A modellen a vezetői kérdés futtatható. A változás végigfut a kapcsolatokon, és megmutatja, hol keletkezik új szűk keresztmetszet."
        />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
          {/* Questions */}
          <Reveal>
            <fieldset>
              <legend className="text-eyebrow uppercase text-fg-3">Forgatókönyv</legend>
              <div className="mt-3 flex flex-col gap-1.5">
                {SIMULATIONS.map((item, i) => {
                  const selected = i === index;
                  return (
                    <label
                      key={item.id}
                      className={
                        'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors duration-[var(--dur-fast)] ' +
                        (selected
                          ? 'border-line-blue bg-blue-400/[0.08]'
                          : 'border-transparent hover:border-line hover:bg-white/[0.02]')
                      }
                    >
                      <input
                        type="radio"
                        name="szimulacio"
                        value={item.id}
                        checked={selected}
                        onChange={() => setIndex(i)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={
                          'mt-[0.4375rem] size-2 shrink-0 rounded-full transition-all duration-[var(--dur-base)] peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-base ' +
                          (selected ? 'bg-blue-400 shadow-[0_0_8px_var(--color-blue-400)]' : 'bg-fg-3/40')
                        }
                      />
                      <span className={'text-body-sm ' + (selected ? 'text-fg' : 'text-fg-2')}>
                        {item.question}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </Reveal>

          {/* The model, and what the change does to it */}
          <Reveal index={1}>
            <div>
              <div className="relative overflow-hidden rounded-xl border border-line bg-[radial-gradient(120%_100%_at_50%_0%,rgba(20,26,34,0.85)_0%,var(--color-base)_70%)]">
                <div className="grid-substrate absolute inset-0 opacity-30" aria-hidden="true" />

                <div className="relative h-[20rem] sm:h-[24rem] lg:h-[27rem]">
                  <GraphCanvas
                    progress={1}
                    highlight={highlight}
                    dim={phase === 'after'}
                    labels="key"
                    camera={{ zoom: 0.92 }}
                    pulses={false}
                    ariaLabel={
                      phase === 'before'
                        ? 'A szervezeti modell a változás előtti állapotban.'
                        : `A változás terjedése a modellen: ${simulation.affected.length + simulation.origin.length} érintett objektum.`
                    }
                  />
                </div>

                {/* Before / after */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
                  <div
                    role="group"
                    aria-label="Állapot"
                    className="relative isolate flex rounded-full border border-line bg-void/80 p-1 backdrop-blur-sm"
                  >
                    {/* The indicator slides between the two halves. */}
                    <span
                      aria-hidden="true"
                      className={
                        'absolute inset-y-1 left-1 -z-10 w-[calc(50%-0.25rem)] rounded-full bg-blue-300 ' +
                        'transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] ' +
                        (phase === 'after' ? 'translate-x-full' : 'translate-x-0')
                      }
                    />
                    {(['before', 'after'] as const).map((value) => {
                      const selected = phase === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPhase(value)}
                          aria-pressed={selected}
                          className={
                            'min-h-9 w-24 rounded-full text-body-sm transition-colors duration-[var(--dur-base)] ' +
                            (selected ? 'text-void' : 'text-fg-2 hover:text-fg')
                          }
                        >
                          {value === 'before' ? 'Előtte' : 'Utána'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* What it means */}
              <div className="mt-4 rounded-xl border border-line bg-raised/60 p-5" aria-live="polite">
                <div key={`${simulation.id}-${phase}`} className="animate-enter">
                    {phase === 'before' ? (
                      <p className="measure-body text-body text-fg-2">
                        A jelen állapot. Válts az <span className="text-fg">Utána</span> nézetre, és a
                        modell megmutatja, hova terjed a változás.
                      </p>
                    ) : (
                      <>
                        <p className="measure-body text-body text-fg">{simulation.answer}</p>

                        <dl className="mt-5 grid gap-x-8 gap-y-3 border-t border-line-subtle pt-4 sm:grid-cols-3">
                          {simulation.effects.map((effect) => (
                            <div key={effect.label}>
                              <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">
                                {effect.label}
                              </dt>
                              <dd data-numeric className="mt-1 text-display-3 text-fg">
                                {effect.value}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        <p className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-subtle pt-4 text-body-sm">
                          <span className="text-fg-3">Szűk keresztmetszet:</span>
                          {simulation.bottleneck ? (
                            <span className="rounded-full border border-[rgb(232_163_61/0.35)] bg-[rgb(232_163_61/0.08)] px-2.5 py-0.5 text-signal-gap">
                              {simulation.bottleneck}
                            </span>
                          ) : (
                            <span className="rounded-full border border-[rgb(61_190_139/0.35)] bg-[rgb(61_190_139/0.08)] px-2.5 py-0.5 text-signal-ok">
                              Nem keletkezik új
                            </span>
                          )}
                        </p>
                      </>
                    )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
