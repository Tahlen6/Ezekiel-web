'use client';

import { MODEL_VERSIONS, OUTCOME_PROPERTIES } from '@/data/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * Not another report.
 *
 * Deliberately the quietest section on the page: the claim is continuity, and
 * continuity does not need animation to argue for itself. The version comparison
 * carries the weight — the same organisation, two points in time, measured.
 */
export function Outcome() {
  const [before, after] = MODEL_VERSIONS;
  if (!before || !after) return null;

  return (
    <section id="eredmeny" aria-labelledby="eredmeny-cim" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="container-content">
        <SectionHeader
          eyebrow="Az eredmény"
          headline={
            <span id="eredmeny-cim">Nem egy újabb riport. Egy folyamatosan használható modell.</span>
          }
          lead="A felmérés végén nem egy dokumentumot kapsz, hanem a szervezet működő modelljét – amely a szervezettel együtt változik."
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* What the model is */}
          <div>
            <h3 className="text-eyebrow uppercase text-fg-3">A modell tulajdonságai</h3>
            <ul className="mt-4 divide-y divide-line-subtle border-t border-line-subtle">
              {OUTCOME_PROPERTIES.map((property, i) => (
                <Reveal as="li" key={property.title} index={i} className="flex gap-5 py-4">
                  <span data-numeric aria-hidden="true" className="w-5 shrink-0 pt-0.5 text-body-sm text-fg-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block text-body text-fg">{property.title}</span>
                    <span className="mt-1 block text-body-sm text-fg-2">{property.body}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* The same organisation, measured twice */}
          <Reveal>
            <div className="rounded-xl border border-line bg-raised/60 p-5 sm:p-6 tall:lg:sticky tall:lg:top-[calc(var(--nav-h)+1.5rem)]">
              <h3 className="text-eyebrow uppercase text-fg-3">Modellverziók összehasonlítása</h3>

              <table className="mt-5 w-full border-collapse text-left">
                <caption className="sr-only">
                  Ugyanazon szervezet modellje két időpontban, mért eltérésekkel
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="pb-3 text-body-sm font-normal text-fg-3">
                      Mutató
                    </th>
                    <th scope="col" className="pb-3 text-right text-body-sm font-normal text-fg-3">
                      Q1
                    </th>
                    <th scope="col" className="pb-3 text-right text-body-sm font-normal text-blue-300">
                      Q3
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  {before.metrics.map((metric, i) => {
                    const later = after.metrics[i];
                    return (
                      <tr key={metric.label}>
                        <th scope="row" className="py-3 pr-4 text-body-sm font-normal text-fg-2">
                          {metric.label}
                        </th>
                        <td data-numeric className="py-3 text-right text-body-sm text-fg-3">
                          {metric.value}
                        </td>
                        <td data-numeric className="py-3 text-right text-body text-fg">
                          {later?.value ?? metric.value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-5 flex items-center gap-3 border-t border-line-subtle pt-4 text-[0.6875rem] text-fg-3">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-3/50" />
                  {before.label}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-blue-400" />
                  {after.label}
                </span>
              </div>

              <p className="mt-4 text-body-sm text-fg-2">
                Ugyanaz a modell, két időpontban. A szabályozás hatása nem véleményként, hanem
                mutatóként jelenik meg – így a következő fejlesztés is mérhető alapról indul.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
