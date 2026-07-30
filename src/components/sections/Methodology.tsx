'use client';

import { PRINCIPLES, SOURCE_TRACE } from '@/data/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CertaintyMeter } from '@/components/ui/Signal';
import { CERTAINTY_LABEL } from '@/lib/model';

/**
 * Trust and method.
 *
 * The section that has to be the most restrained, because it is about not
 * overclaiming: how the model is built, how confidence is marked, how a finding
 * traces back to its sources. No client counts, no certifications, no numbers
 * the site cannot stand behind.
 */
export function Methodology() {
  return (
    <section id="modszertan" aria-labelledby="modszertan-cim" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="container-content">
        <SectionHeader
          eyebrow="Módszertan"
          headline={<span id="modszertan-cim">Minden következtetés visszavezethető a forrásáig.</span>}
          lead="Az Ezekiel nem fekete doboz. A megállapítás mögött ott van a forrás, a bizonyossági szint és a levezetés – ember által ellenőrizhető formában."
        />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* Principles */}
          <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line-subtle sm:grid-cols-2">
            {PRINCIPLES.map((principle, i) => (
              <Reveal
                as="li"
                key={principle.title}
                index={i}
                className="flex flex-col bg-base p-5"
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span className="text-body font-medium text-fg">{principle.title}</span>
                </span>
                <span className="mt-2.5 text-body-sm text-fg-2">{principle.body}</span>
              </Reveal>
            ))}
          </ul>

          {/* Source trace */}
          <Reveal>
            <div className="rounded-xl border border-line bg-raised/60 p-5 sm:p-6 tall:lg:sticky tall:lg:top-[calc(var(--nav-h)+1.5rem)]">
              <h3 className="text-eyebrow uppercase text-fg-3">Forrásvisszavezetés</h3>

              <figure className="mt-4">
                <blockquote className="rounded-lg border-l-2 border-blue-400 bg-blue-500/[0.06] px-4 py-3">
                  <p className="text-body text-fg">{SOURCE_TRACE.statement}</p>
                </blockquote>

                <figcaption className="mt-5">
                  <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">
                    Mire alapozza
                  </p>
                  <ol className="mt-3 space-y-2.5">
                    {SOURCE_TRACE.sources.map((source, i) => (
                      <li key={source.ref} className="flex gap-3">
                        <span
                          data-numeric
                          aria-hidden="true"
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-line-subtle text-[0.625rem] text-fg-3"
                        >
                          {i + 1}
                        </span>
                        <span>
                          <span className="block text-body-sm text-fg">{source.type}</span>
                          <span className="block text-body-sm text-fg-2">{source.ref}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </figcaption>
              </figure>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line-subtle pt-4">
                <span className="flex items-center gap-2 text-body-sm text-fg-2">
                  <CertaintyMeter certainty={SOURCE_TRACE.certainty} />
                  Bizonyossági szint: {CERTAINTY_LABEL[SOURCE_TRACE.certainty]}
                </span>
                <span className="text-body-sm text-fg-3">
                  <span data-numeric>{SOURCE_TRACE.sources.filter((s) => s.agrees).length}</span> egyező
                  forrás
                </span>
              </div>

              <p className="mt-4 text-body-sm text-fg-2">
                Ahol a források nem egyeznek, az Ezekiel nem választ közülük. Az eltérést
                megállapításként rögzíti, és jelzi az alacsonyabb bizonyossági szintet.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
