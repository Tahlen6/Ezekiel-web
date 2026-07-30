'use client';

import { useCallback, useRef } from 'react';
import { PROBLEM_SOURCES, type ProblemSource } from '@/data/content';
import { Reveal } from '@/components/ui/Reveal';
import { useDensity } from '@/lib/hooks';
import { easeOut, mix, span, useScrollDrive } from '@/lib/animate';

/**
 * The sources exist. The connections do not.
 *
 * Scroll drives one progression: scattered evidence → an ordered ring → drawn
 * connections → a single model at the centre. The animation is the argument, so
 * the copy does not have to make it twice.
 *
 * Everything here is written imperatively from one rAF loop (useScrollDrive).
 * Card positions, path lengths and the hub are plain style writes, which is both
 * cheaper and simpler than keeping ~20 animated values in a library's graph.
 */

const TOTAL = PROBLEM_SOURCES.length;

/**
 * Smallest vertical spacing on the ring, as a fraction of its y-radius. It
 * occurs between the top card and its neighbours, and is what determines
 * whether cards collide.
 */
const RING_TIGHTEST = 1 - Math.cos((2 * Math.PI) / TOTAL);

/**
 * Ring y-radius, in percent, solved from the actual stage and card height.
 *
 * A fixed percentage is what made cards overlap: the same 30% is 134px of
 * spacing on a tall monitor and 50px on a laptop, while the cards stay the same
 * size. So the radius is derived from geometry — grow it until neighbours clear
 * each other, then cap it so the outermost cards stay inside the stage.
 */
function ringRadiusY(stageH: number, cardH: number): number {
  if (stageH <= 0) return 30;
  const needed = ((cardH + 10) * 100) / (RING_TIGHTEST * stageH);
  const fits = 50 - ((cardH / 2 + 6) * 100) / stageH;
  return Math.max(20, Math.min(needed, fits));
}

/** Ring position for card `i`, in percent of the stage. */
function ringPosition(i: number, radiusY: number): { x: number; y: number } {
  const angle = (-90 + (360 / TOTAL) * i) * (Math.PI / 180);
  return { x: 50 + Math.cos(angle) * 35, y: 50 + Math.sin(angle) * radiusY };
}

/** Scatter position, from the source's authored coordinates. */
function scatterPosition(source: ProblemSource): { x: number; y: number } {
  return { x: 50 + source.x * 44, y: 50 + source.y * 42 };
}

export function Problem() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const hubRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const density = useDensity();

  const apply = useCallback((p: number) => {
    // Ring geometry is resolved from the live box, so the layout is correct on a
    // 660px laptop and a 1200px monitor alike.
    const stageH = stageRef.current?.clientHeight ?? 0;
    const cardH = cardRefs.current[0]?.offsetHeight ?? 60;
    const radiusY = ringRadiusY(stageH, cardH);

    // Cards: scattered → ring, settling one after another.
    for (let i = 0; i < TOTAL; i += 1) {
      const el = cardRefs.current[i];
      const source = PROBLEM_SOURCES[i];
      if (!el || !source) continue;

      const start = 0.06 + i * 0.028;
      const t = easeOut(span(p, start, start + 0.34));
      const from = scatterPosition(source);
      const to = ringPosition(i, radiusY);

      el.style.left = `${mix(from.x, to.x, t)}%`;
      el.style.top = `${mix(from.y, to.y, t)}%`;
      el.style.setProperty('--tilt', `${mix(i % 2 === 0 ? -6 : 5, 0, t)}deg`);
      el.style.opacity = String(span(p, 0, 0.08) * 0.55 + t * 0.45);
      el.style.borderColor = `rgba(255,255,255,${mix(0.08, 0.24, t)})`;
    }

    // Connections draw outward-in, after the points have settled.
    for (let i = 0; i < TOTAL; i += 1) {
      const path = pathRefs.current[i];
      if (!path) continue;
      if (stageH > 0) {
        const to = ringPosition(i, radiusY);
        path.setAttribute('d', `M ${to.x} ${to.y} L 50 50`);
      }
      const start = 0.46 + i * 0.026;
      path.style.strokeDashoffset = String(1 - span(p, start, start + 0.24));
      path.style.opacity = String(span(p, start, start + 0.1));
    }

    // The model the sources resolve into.
    if (hubRef.current) {
      hubRef.current.style.opacity = String(span(p, 0.58, 0.82));
      hubRef.current.style.setProperty(
        '--hub-scale',
        String(mix(0.6, 1, easeOut(span(p, 0.6, 0.9)))),
      );
    }
    if (haloRef.current) {
      haloRef.current.style.opacity = String(span(p, 0.6, 1) * 0.5);
    }
  }, []);

  useScrollDrive(trackRef, apply);

  const isMobile = density === 'mobile';

  return (
    <section id="problema" aria-labelledby="problema-cim" className="relative">
      {/* Tall scroll track; the stage inside it stays put. */}
      <div ref={trackRef} className="relative h-[220vh] sm:h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-10 pt-[calc(var(--nav-h)+1.5rem)]">
          <div className="container-content shrink-0">
            <Reveal>
              <p className="text-eyebrow uppercase text-blue-300">A kiindulópont</p>
            </Reveal>
            <Reveal index={1}>
              <h2
                id="problema-cim"
                className="mt-5 max-w-[24ch] text-display-2 text-fg"
                style={{ marginLeft: '-0.02em' }}
              >
                A szervezetek nem azért átláthatatlanok, mert nincs adat.
              </h2>
            </Reveal>
            <Reveal index={2}>
              <p className="measure-lead mt-5 text-lead text-fg-2 short:hidden">
                Hanem mert az adatok nem kapcsolódnak össze. A működés minden része dokumentált –
                csak hét különböző helyen, hét különböző nyelven.
              </p>
            </Reveal>
          </div>

          <div className="container-content mt-8 flex min-h-0 flex-1 items-center">
            {isMobile ? (
              /* Phone stage: a compact grid that converges. Same three beats,
                 simplified visualisation — no ring, no scatter. */
              <div className="mx-auto w-full max-w-sm">
                <ul className="grid grid-cols-2 gap-2">
                  {PROBLEM_SOURCES.map((source, i) => (
                    <li
                      key={source.id}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                      style={{ opacity: 0 }}
                      className="flex min-h-11 items-center gap-2.5 rounded-lg border border-line bg-raised/85 px-3 last:col-span-2"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 rounded-full bg-blue-400"
                      />
                      <span className="text-body-sm leading-tight text-fg">{source.label}</span>
                    </li>
                  ))}
                </ul>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="mt-1 h-10 w-full"
                >
                  {PROBLEM_SOURCES.map((source, i) => (
                    <path
                      key={source.id}
                      ref={(el) => {
                        pathRefs.current[i] = el;
                      }}
                      d={`M ${(100 / (TOTAL - 1)) * i} 0 L 50 100`}
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1}
                      stroke="var(--color-blue-400)"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      fill="none"
                      style={{ opacity: 0 }}
                    />
                  ))}
                </svg>

                <div
                  ref={hubRef}
                  style={{ opacity: 0 }}
                  className="rounded-xl border border-line-blue bg-blue-500/[0.1] px-4 py-3.5 text-center shadow-[0_0_32px_-10px_rgba(43,127,232,0.6)]"
                >
                  <p className="text-eyebrow uppercase text-blue-300">Ezekiel</p>
                  <p className="mt-1.5 text-body-sm text-fg">Egy összekapcsolt modell</p>
                </div>
              </div>
            ) : (
              <div ref={stageRef} className="relative mx-auto h-full max-h-[30rem] w-full max-w-4xl">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  {PROBLEM_SOURCES.map((source, i) => {
                    const to = ringPosition(i, 30);
                    return (
                      <path
                        key={source.id}
                        ref={(el) => {
                          pathRefs.current[i] = el;
                        }}
                        d={`M ${to.x} ${to.y} L 50 50`}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1}
                        stroke="var(--color-blue-400)"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        fill="none"
                        style={{ opacity: 0 }}
                      />
                    );
                  })}
                </svg>

                <div
                  ref={hubRef}
                  style={{ opacity: 0 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[var(--hub-scale,0.6)]"
                >
                  <span
                    ref={haloRef}
                    aria-hidden="true"
                    style={{ opacity: 0 }}
                    className="absolute left-1/2 top-1/2 block size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-blue-500)_0%,transparent_68%)]"
                  />
                  <span className="relative flex flex-col items-center gap-1 rounded-xl border border-line-blue bg-void/90 px-6 py-4 shadow-[0_0_40px_-8px_rgba(43,127,232,0.5)] backdrop-blur-sm">
                    <span className="text-eyebrow uppercase text-blue-300">Ezekiel</span>
                    <span className="whitespace-nowrap text-body text-fg">
                      Egy összekapcsolt modell
                    </span>
                  </span>
                </div>

                <ul>
                  {PROBLEM_SOURCES.map((source, i) => (
                    <li
                      key={source.id}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                      style={{ opacity: 0 }}
                      className="absolute w-[9.5rem] -translate-x-1/2 -translate-y-1/2 rotate-[var(--tilt,0deg)] rounded-lg border border-line-subtle bg-raised/90 px-3.5 py-3 backdrop-blur-sm short:py-2 lg:w-[11rem]"
                    >
                      <p className="text-body-sm font-medium leading-snug text-fg">
                        {source.label}
                      </p>
                      <p className="mt-1 text-[0.6875rem] leading-snug text-fg-3 short:hidden">
                        {source.holds}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
