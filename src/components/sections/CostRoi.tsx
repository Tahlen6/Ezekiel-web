'use client';

import { useState } from 'react';
import { EXAMPLE_PROCESS, PROCESS_METRICS, SCENARIOS } from '@/data/content';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * Behind every operational problem there is a number.
 *
 * One example process, measured, then the same process under three levels of
 * improvement. The comparison is the point: the decision is not "should we
 * digitise" but "which level pays back first".
 */

/** Automatability is a property of the process, not of a scenario. */
const COMPARED = PROCESS_METRICS.filter((m) => m.key !== 'auto');
const AUTOMATABILITY = PROCESS_METRICS.find((m) => m.key === 'auto')!;

function MetricRow({
  label,
  unit,
  current,
  after,
  decimals = 0,
}: {
  label: string;
  unit: string;
  current: number;
  after: number;
  decimals?: number;
}) {
  const ratio = current > 0 ? Math.min(1, after / current) : 0;
  const change = current > 0 ? Math.round(((after - current) / current) * 100) : 0;

  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 py-3.5">
      <p className="text-body-sm text-fg-2">
        {label}
        <span className="ml-1.5 text-fg-3">{unit}</span>
      </p>

      <p className="flex items-baseline gap-2 text-right">
        <span className="text-body-sm text-fg-3 line-through decoration-fg-3/50">
          <span data-numeric>
            {current.toLocaleString('hu-HU', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        </span>
        <span aria-hidden="true" className="text-fg-3">
          →
        </span>
        <AnimatedNumber value={after} decimals={decimals} className="text-display-3 text-fg" />
        {change !== 0 ? (
          <span
            data-numeric
            className="w-12 text-body-sm text-signal-ok"
            aria-label={`változás ${change} százalék`}
          >
            {change > 0 ? '+' : ''}
            {change}%
          </span>
        ) : (
          <span className="w-12 text-body-sm text-fg-3">—</span>
        )}
      </p>

      {/* Magnitude bar: the remaining share after the improvement. */}
      <div className="col-span-2 h-[3px] overflow-hidden rounded-full bg-line" role="presentation">
        <div
          className="h-full rounded-full bg-blue-400 transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

export function CostRoi() {
  const [index, setIndex] = useState(1);
  const scenario = SCENARIOS[index]!;

  return (
    <section id="megterules" aria-labelledby="megterules-cim" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="container-content">
        <SectionHeader
          eyebrow="Költség és hatás"
          headline={<span id="megterules-cim">Minden működési probléma mögött van egy szám.</span>}
          lead="Az Ezekiel a folyamat átfutását, munkaigényét és költségét méri – majd megmutatja, mit hoz három különböző fejlesztési szint."
        />

        <Reveal>
          <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-line pb-5 lg:mt-14">
            <div>
              <p className="text-eyebrow uppercase text-fg-3">Vizsgált folyamat</p>
              <p className="mt-1.5 text-display-3 text-fg">{EXAMPLE_PROCESS.name}</p>
            </div>
            <div className="text-right">
              <p className="text-eyebrow uppercase text-fg-3">{AUTOMATABILITY.label}</p>
              <p className="mt-1.5 text-display-3 text-blue-300">
                <span data-numeric>{AUTOMATABILITY.value}</span>
                {AUTOMATABILITY.unit}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* Before → after, per metric */}
          <Reveal>
            <div className="rounded-xl border border-line bg-raised/60 p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-eyebrow uppercase text-fg-3">Jelen állapot → fejlesztés után</h3>
                <p className="text-[0.6875rem] text-blue-300">{scenario.label}</p>
              </div>

              <div className="mt-2 divide-y divide-line-subtle">
                {COMPARED.map((metric) => (
                  <MetricRow
                    key={metric.key}
                    label={metric.label}
                    unit={metric.unit}
                    current={metric.value}
                    after={scenario.after[metric.key] ?? metric.value}
                    decimals={metric.decimals}
                  />
                ))}
              </div>

              <p className="mt-5 border-t border-line-subtle pt-4 text-[0.6875rem] leading-relaxed text-fg-3">
                {EXAMPLE_PROCESS.scope} Az értékek egy illusztratív példafolyamatra vonatkoznak.
              </p>
            </div>
          </Reveal>

          {/* Scenario picker and its outcome */}
          <Reveal index={1}>
            <div>
              <h3 className="text-eyebrow uppercase text-fg-3">Fejlesztési szint</h3>

              <div className="mt-3 flex flex-col gap-2">
                {SCENARIOS.map((item, i) => {
                  const selected = i === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-pressed={selected}
                      className={
                        'rounded-xl border p-4 text-left transition-colors duration-[var(--dur-fast)] ' +
                        (selected
                          ? 'border-line-blue bg-blue-400/[0.08]'
                          : 'border-line-subtle hover:border-line')
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span
                          data-numeric
                          aria-hidden="true"
                          className={
                            'flex size-6 shrink-0 items-center justify-center rounded-full text-[0.6875rem] transition-colors duration-[var(--dur-fast)] ' +
                            (selected ? 'bg-blue-400 text-void' : 'bg-overlay text-fg-3')
                          }
                        >
                          {item.n}
                        </span>
                        <span className={selected ? 'text-body text-fg' : 'text-body text-fg-2'}>
                          {item.label}
                        </span>
                      </span>
                      <span className="mt-2 block pl-9 text-body-sm text-fg-3">{item.summary}</span>
                    </button>
                  );
                })}
              </div>

              {/* Outcome */}
              <div className="mt-5 rounded-xl border border-line bg-overlay/70 p-5" aria-live="polite">
                <h4 className="text-eyebrow uppercase text-fg-3">Várható hatás</h4>
                <dl className="mt-3 divide-y divide-line-subtle">
                  {[
                    {
                      label: 'Fejlesztési költség',
                      node: (
                        <>
                          <AnimatedNumber value={scenario.outcome.investmentMHUF} decimals={1} /> MFt
                        </>
                      ),
                    },
                    {
                      label: 'Időmegtakarítás',
                      node: (
                        <span className="text-signal-ok">
                          −<AnimatedNumber value={scenario.outcome.timeSavedPct} />%
                        </span>
                      ),
                    },
                    {
                      label: 'FTE-hatás',
                      node: (
                        <>
                          <AnimatedNumber value={scenario.outcome.fteDelta} decimals={1} /> FTE
                        </>
                      ),
                    },
                    {
                      label: 'Kockázatcsökkenés',
                      node: (
                        <span>
                          <span className="text-fg-3">{scenario.outcome.riskFrom}</span>
                          <span aria-hidden="true" className="mx-1.5 text-fg-3">
                            →
                          </span>
                          <span className="text-signal-ok">{scenario.outcome.riskTo}</span>
                        </span>
                      ),
                    },
                    {
                      label: 'Megtérülési idő',
                      node: (
                        <>
                          <AnimatedNumber value={scenario.outcome.paybackMonths} /> hónap
                        </>
                      ),
                    },
                  ].map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-body-sm text-fg-2">{row.label}</dt>
                      <dd className="text-body text-fg">{row.node}</dd>
                    </div>
                  ))}
                </dl>

                <h4 className="mt-5 border-t border-line-subtle pt-4 text-eyebrow uppercase text-fg-3">
                  Mi változik a működésben
                </h4>
                <ul className="mt-3 space-y-2">
                  {scenario.changes.map((change) => (
                    <li key={change} className="flex gap-2.5 text-body-sm text-fg-2">
                      <span aria-hidden="true" className="mt-[0.4375rem] size-1 shrink-0 rounded-full bg-blue-400" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
