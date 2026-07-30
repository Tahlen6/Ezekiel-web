'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { ButtonLink } from '@/components/ui/Button';
import { useDensity, usePrefersReducedMotion } from '@/lib/hooks';
import { useAutoProgress, useScrollProgressGetter } from '@/lib/scroll';

/** The point-cloud legend: what the abstract dots turn out to have been. */
const LEGEND = [
  { label: 'Szervezeti egység', colour: 'var(--color-blue-400)' },
  { label: 'Szerepkör', colour: 'var(--color-blue-300)' },
  { label: 'Folyamat', colour: 'var(--color-blue-100)' },
  { label: 'Rendszer', colour: 'var(--color-blue-700)' },
  { label: 'Költség', colour: 'var(--color-signal-loss)' },
  { label: 'Kockázat', colour: 'var(--color-signal-risk)' },
] as const;

/** True after `ms`, or immediately when the viewer has asked for less motion. */
function useDelayedFlag(ms: number): boolean {
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduced) {
      setOn(true);
      return;
    }
    const id = window.setTimeout(() => setOn(true), ms);
    return () => window.clearTimeout(id);
  }, [ms, reduced]);

  return on;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const getAssembly = useAutoProgress(7600, 500);
  const getScroll = useScrollProgressGetter(sectionRef, 'exit');
  const legendVisible = useDelayedFlag(5200);

  /* Slow push-in as the hero leaves: the camera moves into the model rather
     than the model moving for the camera. On wide screens the model is offset
     to the right so its dense centre sits beside the copy, not under it. */
  const density = useDensity();
  const getCamera = useCallback(() => {
    const t = getScroll();
    const offset = density === 'mobile' ? 0 : 0.24;
    return { x: offset, zoom: 1 + t * 0.16, y: -t * 0.06 };
  }, [getScroll, density]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden sm:justify-center"
    >
      {/*
        The model. On a phone it occupies a band above the copy and fades out at
        its lower edge — full-bleed would centre it behind the headline, where the
        scrim hides the very thing the section is about. From `sm` up it is full
        bleed as designed.
      */}
      <div className="absolute inset-x-0 top-0 -z-20 h-[42svh] [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] sm:inset-0 sm:h-auto sm:[mask-image:none]">
        <GraphCanvas
          getProgress={getAssembly}
          getCamera={getCamera}
          fit="cover"
          labels="key"
          /* Keeps node labels out of the headline column. Mobile puts the copy
             low and the model high, so the excluded band moves with it. */
          labelSafeArea={
            density === 'mobile'
              ? { x0: 0, y0: 0.42, x1: 1, y1: 1 }
              : { x0: 0, y0: 0.12, x1: 0.56, y1: 0.94 }
          }
          pulses
          ariaLabel="Az Ezekiel szervezeti modellje: szervezeti egységek, szerepkörök, folyamatok, rendszerek, költségek és kockázatok összekapcsolt hálózata, amely absztrakt pontokból rendeződik összefüggő modellé."
        />
      </div>

      {/* Measurement substrate. Fades out toward the edges so it never reads as
          a decorative pattern. */}
      <div
        aria-hidden="true"
        className="grid-substrate absolute inset-0 -z-20 opacity-70"
        style={{
          maskImage: 'radial-gradient(70% 60% at 50% 45%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 45%, black 0%, transparent 100%)',
        }}
      />

      {/* Readability. On mobile the graph lives above the copy and fades into the
          page; on desktop a soft radial well sits behind the copy only, so the
          model stays visible instead of being dimmed wholesale. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(10,13,18,0.3)_0%,rgba(10,13,18,0)_20%,rgba(10,13,18,0.84)_48%,var(--color-base)_72%)] sm:bg-[radial-gradient(78%_86%_at_18%_52%,rgba(10,13,18,0.96)_0%,rgba(10,13,18,0.86)_32%,rgba(10,13,18,0.42)_62%,rgba(10,13,18,0)_100%)]"
      />

      <div className="container-content relative pb-16 pt-[calc(var(--nav-h)+30svh)] sm:pb-20 sm:pt-[calc(var(--nav-h)+2rem)]">
        <div className="max-w-[46rem]">
          <p
            className="text-eyebrow uppercase text-blue-300"
            style={{
              opacity: 0,
              animation: 'ez-fade-up var(--dur-slow) var(--ease-out-expo) 200ms forwards',
            }}
          >
            A szervezet digitális modellje
          </p>

          <h1
            className="mt-6 max-w-[17ch] text-display-1 text-fg"
            style={{
              marginLeft: '-0.02em',
              opacity: 0,
              animation: 'ez-fade-up var(--dur-cinematic) var(--ease-out-expo) 320ms forwards',
            }}
          >
            Lásd a szervezetet úgy, ahogy valójában működik.
          </h1>

          <p
            className="mt-7 max-w-[38ch] text-lead text-fg-2"
            style={{
              opacity: 0,
              animation: 'ez-fade-up var(--dur-slow) var(--ease-out-expo) 620ms forwards',
            }}
          >
            Az Ezekiel összekapcsolja a folyamatokat, szerepköröket, rendszereket, költségeket és
            kockázatokat – hogy a vezetői döntések ne feltételezésekre épüljenek.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={{
              opacity: 0,
              animation: 'ez-fade-up var(--dur-slow) var(--ease-out-expo) 820ms forwards',
            }}
          >
            <ButtonLink href="#problema" variant="primary" size="lg">
              Fedezd fel az Ezekielt
            </ButtonLink>
            <ButtonLink href="#bemutato" variant="secondary" size="lg" arrow>
              Bemutatót kérek
            </ButtonLink>
          </div>

          {/* The reveal in words: the dots were never abstract. */}
          <ul
            className="mt-11 flex flex-wrap gap-x-6 gap-y-2.5"
            style={{
              opacity: legendVisible ? 1 : 0,
              transform: legendVisible ? 'none' : 'translateY(10px)',
              transition:
                'opacity var(--dur-cinematic) var(--ease-out-expo), transform var(--dur-cinematic) var(--ease-out-expo)',
            }}
          >
            {LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-body-sm text-fg-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.colour, boxShadow: `0 0 8px ${item.colour}` }}
                />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll affordance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-eyebrow uppercase text-fg-3">Görgess</span>
          <span className="relative block h-8 w-px bg-line">
            <span className="animate-scroll-hint absolute left-1/2 top-0 block h-2 w-px -translate-x-1/2 bg-blue-400" />
          </span>
        </div>
      </div>
    </section>
  );
}
