'use client';

import { useMemo, useState } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CertaintyMeter, SignalBadge } from '@/components/ui/Signal';
import {
  CERTAINTY_LABEL,
  LAYERS,
  NODES,
  NODE_BY_ID,
  SIGNAL_LABEL,
  neighbours,
  nodeLabel,
  type LayerId,
} from '@/lib/model';

const ALL_LAYERS: readonly LayerId[] = LAYERS.map((l) => l.id);

/** Layers on by default: enough to show structure without showing everything. */
const DEFAULT_LAYERS: readonly LayerId[] = ['org', 'roles', 'processes', 'systems', 'costs'];

/** Objects worth offering directly — the ones a manager would look for. */
const ENTRY_POINTS = [
  'proc-szerzodeskotes',
  'proc-minosites',
  'sys-excel',
  'role-szerzodeskezelo',
  'org-beszerzes',
  'cost-szerzodeskotes',
] as const;

function NodeDetail({ id }: { id: string }) {
  const node = NODE_BY_ID.get(id);
  if (!node) return null;

  const layer = LAYERS.find((l) => l.id === node.layer);
  const relatedProcesses = neighbours(id, 'processes').filter((n) => n !== id);
  const relatedSystems = neighbours(id, 'systems');
  const relatedRoles = neighbours(id, 'roles');

  const rows: { label: string; value: string }[] = [
    { label: 'Típus', value: layer?.label ?? node.layer },
    {
      label: 'Felelős',
      value: node.owner ? nodeLabel(node.owner) : 'Nincs kijelölt felelős',
    },
  ];
  if (relatedProcesses.length > 0) {
    rows.push({ label: 'Folyamatok', value: relatedProcesses.map(nodeLabel).join(', ') });
  }
  if (relatedSystems.length > 0) {
    rows.push({ label: 'Rendszerek', value: relatedSystems.map(nodeLabel).join(', ') });
  }
  if (relatedRoles.length > 0 && node.layer !== 'roles') {
    rows.push({ label: 'Szerepkörök', value: relatedRoles.map(nodeLabel).join(', ') });
  }
  if (node.annualCostMHUF !== undefined) {
    rows.push({
      label: 'Éves ráfordítás',
      value: `${node.annualCostMHUF.toLocaleString('hu-HU')} MFt`,
    });
  }

  return (
    <div className="rounded-xl border border-line bg-overlay/80 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow uppercase text-fg-3">{layer?.label}</p>
          <p className="mt-1.5 text-display-3 text-fg">{node.label}</p>
        </div>
        {node.signal ? <SignalBadge signal={node.signal} /> : null}
      </div>

      {node.note ? <p className="measure-body mt-4 text-body-sm text-fg-2">{node.note}</p> : null}

      <dl className="mt-5 space-y-2.5 border-t border-line-subtle pt-4">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-4 text-body-sm">
            <dt className="w-28 shrink-0 text-fg-3">{row.label}</dt>
            <dd
              className={
                row.value === 'Nincs kijelölt felelős' ? 'text-signal-gap' : 'text-fg-2'
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
        <div className="flex items-center gap-4 text-body-sm">
          <dt className="w-28 shrink-0 text-fg-3">Bizonyosság</dt>
          <dd className="flex items-center gap-2 text-fg-2">
            <CertaintyMeter certainty={node.certainty} />
            {CERTAINTY_LABEL[node.certainty]}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function ModelLayers() {
  const [active, setActive] = useState<readonly LayerId[]>(DEFAULT_LAYERS);
  const [selected, setSelected] = useState<string | null>('proc-szerzodeskotes');

  const activeSet = useMemo(() => new Set(active), [active]);

  const countsByLayer = useMemo(() => {
    const map = new Map<LayerId, number>();
    for (const node of NODES) map.set(node.layer, (map.get(node.layer) ?? 0) + 1);
    return map;
  }, []);

  const visibleCount = useMemo(
    () => NODES.filter((n) => activeSet.has(n.layer)).length,
    [activeSet],
  );

  function toggle(id: LayerId) {
    setActive((current) =>
      current.includes(id) ? current.filter((l) => l !== id) : [...current, id],
    );
  }

  // A hidden layer must not keep a selection alive in the panel.
  const selectedVisible = selected && activeSet.has(NODE_BY_ID.get(selected)?.layer ?? 'org');
  const shown = selectedVisible ? selected : null;

  return (
    <section id="platform" aria-labelledby="platform-cim" className="section-y relative scroll-mt-[var(--nav-h)]">
      <div className="container-content">
        <SectionHeader
          eyebrow="A modell"
          headline={<span id="platform-cim">Egyetlen modell. A teljes működés.</span>}
          lead="Ugyanaz a szervezet nyolc nézőpontból vizsgálható. A rétegek ki- és bekapcsolhatók, de az alapmodell nem változik – csak az, amit látunk belőle."
        />

        <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-[19rem_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-5">
          {/* Layer controls */}
          <Reveal className="order-2 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div className="rounded-xl border border-line bg-raised/60 p-4 tall:lg:sticky tall:lg:top-[calc(var(--nav-h)+1.5rem)]">
              <div className="flex items-center justify-between gap-3 px-1">
                <h3 className="text-eyebrow uppercase text-fg-3">Rétegek</h3>
                <button
                  type="button"
                  onClick={() => setActive(active.length === ALL_LAYERS.length ? DEFAULT_LAYERS : ALL_LAYERS)}
                  className="rounded px-1 py-0.5 text-[0.6875rem] text-blue-300 transition-colors hover:text-blue-100"
                >
                  {active.length === ALL_LAYERS.length ? 'Alaphelyzet' : 'Mind'}
                </button>
              </div>

              {/* Horizontal chips on mobile, a list on desktop. */}
              <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {LAYERS.map((layer) => {
                  const on = activeSet.has(layer.id);
                  return (
                    <li key={layer.id} className="shrink-0 lg:shrink">
                      <button
                        type="button"
                        onClick={() => toggle(layer.id)}
                        aria-pressed={on}
                        className={
                          'flex min-h-11 w-full items-center gap-2.5 rounded-lg border px-3 text-left transition-colors duration-[var(--dur-fast)] lg:gap-3 ' +
                          (on
                            ? 'border-line-blue bg-blue-400/[0.08]'
                            : 'border-line-subtle bg-transparent hover:border-line')
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={
                            'size-2 shrink-0 rounded-full transition-all duration-[var(--dur-base)] ' +
                            (on ? 'bg-blue-400 shadow-[0_0_8px_var(--color-blue-400)]' : 'bg-fg-3/40')
                          }
                        />
                        <span className="flex-1">
                          <span
                            className={
                              'block whitespace-nowrap text-body-sm lg:whitespace-normal ' +
                              (on ? 'text-fg' : 'text-fg-2')
                            }
                          >
                            {layer.label}
                          </span>
                          <span className="hidden text-[0.6875rem] leading-snug text-fg-3 lg:block">
                            {layer.hint}
                          </span>
                        </span>
                        <span
                          data-numeric
                          className="hidden text-[0.6875rem] text-fg-3 lg:block"
                          aria-hidden="true"
                        >
                          {countsByLayer.get(layer.id) ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 border-t border-line-subtle px-1 pt-3 text-[0.6875rem] text-fg-3">
                <span data-numeric>{active.length}</span>/8 réteg aktív ·{' '}
                <span data-numeric>{visibleCount}</span> objektum
              </p>
            </div>
          </Reveal>

          {/* The model */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-line bg-[radial-gradient(120%_100%_at_50%_0%,rgba(20,26,34,0.9)_0%,var(--color-base)_70%)]">
                <div className="grid-substrate absolute inset-0 opacity-40" aria-hidden="true" />
                <div className="relative h-[26rem] sm:h-[32rem] lg:h-[36rem]">
                  <GraphCanvas
                    progress={1}
                    visibleLayers={active}
                    selectedId={shown}
                    labels="key"
                    interactive
                    onSelect={setSelected}
                    camera={{ zoom: 0.94 }}
                    ariaLabel={`Interaktív szervezeti modell. Aktív rétegek: ${LAYERS.filter((l) => activeSet.has(l.id)).map((l) => l.label).join(', ')}. ${visibleCount} objektum látható.`}
                  />
                </div>

                <p className="pointer-events-none absolute bottom-3 left-4 text-[0.6875rem] text-fg-3">
                  Kattints egy csomópontra a részletekhez
                </p>
              </div>
            </Reveal>
          </div>

          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2">
            {/* Keyboard- and screen-reader-accessible route into the same data. */}
            <Reveal index={1}>
              <div>
                <h3 className="text-eyebrow uppercase text-fg-3">Kiemelt objektumok</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ENTRY_POINTS.map((id) => {
                    const node = NODE_BY_ID.get(id);
                    if (!node) return null;
                    const isSelected = shown === id;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(id);
                            if (!activeSet.has(node.layer)) toggle(node.layer);
                          }}
                          aria-pressed={isSelected}
                          className={
                            'min-h-11 rounded-full border px-4 text-body-sm transition-colors duration-[var(--dur-fast)] ' +
                            (isSelected
                              ? 'border-line-blue bg-blue-400/[0.1] text-fg'
                              : 'border-line-subtle text-fg-2 hover:border-line hover:text-fg')
                          }
                        >
                          {node.label}
                          {node.signal ? (
                            <span className="sr-only"> — {SIGNAL_LABEL[node.signal]}</span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <div className="mt-5" aria-live="polite">
              {shown ? (
                <NodeDetail id={shown} />
              ) : (
                <p className="rounded-xl border border-dashed border-line-subtle p-5 text-body-sm text-fg-2">
                  Válassz egy objektumot a modellből – a panel megmutatja a felelősét, a
                  kapcsolódó folyamatokat, rendszereket és az adat bizonyossági szintjét.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
