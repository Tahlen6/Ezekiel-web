'use client';

import { useRef } from 'react';
import {
  ASSESSMENT_ENTITIES,
  ASSESSMENT_SOURCE_SENTENCE,
  ASSESSMENT_STEPS,
  type ParsedEntity,
} from '@/data/content';
import { Collapse, CollapseItem } from '@/components/ui/Collapse';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CertaintyMeter } from '@/components/ui/Signal';
import { useStageMode, type StageMode } from '@/lib/hooks';
import { useScrollStep } from '@/lib/scroll';

/**
 * From documents to how the organisation actually runs.
 *
 * One scene builds up across seven scroll steps: a sentence from a policy
 * document becomes tagged entities, then structured objects, then a measured
 * process, then a documented-vs-actual comparison with its evidence. The
 * transformation is the point — this is what "structured assessment" means.
 */

const KIND_STYLE: Record<ParsedEntity['kind'], { colour: string; label: string }> = {
  process: { colour: 'var(--color-blue-100)', label: 'Folyamat' },
  role: { colour: 'var(--color-blue-300)', label: 'Szerepkör' },
  system: { colour: 'var(--color-blue-400)', label: 'Rendszer' },
  org: { colour: 'var(--color-blue-400)', label: 'Szervezeti egység' },
};

interface Token {
  text: string;
  entity?: ParsedEntity;
}

/** Splits the source sentence around the entities the model extracts from it. */
const TOKENS: readonly Token[] = (() => {
  const found = ASSESSMENT_ENTITIES.map((entity) => ({
    entity,
    at: ASSESSMENT_SOURCE_SENTENCE.indexOf(entity.text),
  }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at);

  const out: Token[] = [];
  let cursor = 0;
  for (const { entity, at } of found) {
    if (at > cursor) out.push({ text: ASSESSMENT_SOURCE_SENTENCE.slice(cursor, at) });
    out.push({ text: entity.text, entity });
    cursor = at + entity.text.length;
  }
  if (cursor < ASSESSMENT_SOURCE_SENTENCE.length) {
    out.push({ text: ASSESSMENT_SOURCE_SENTENCE.slice(cursor) });
  }
  return out;
})();

/** The measured process chain, as the model records it. */
const CHAIN = [
  { label: 'Beszerzési igény', meta: '1 nap', kind: 'process' as const },
  { label: 'Jóváhagyás', meta: '7 nap várakozás', kind: 'process' as const, slow: true },
  { label: 'Szállítói minősítés', meta: '4–6 nap', kind: 'process' as const },
  { label: 'Szerződéskötés', meta: '6 nap', kind: 'process' as const },
];

function Chip({
  label,
  kind,
  meta,
  slow = false,
  metaClassName = '',
}: {
  label: string;
  kind: ParsedEntity['kind'];
  meta?: string;
  slow?: boolean;
  /** e.g. `hidden sm:block` where the meta is too long to carry on a phone. */
  metaClassName?: string;
}) {
  const style = KIND_STYLE[kind];
  return (
    /* Label and meta sit on one line on a phone and stack from `sm` up — halving
       the chip height is what lets the pinned scene fit a small viewport. */
    <span
      className="flex flex-row flex-wrap items-baseline gap-x-2 rounded-lg border bg-raised/90 px-3 py-2 sm:flex-col sm:items-stretch sm:gap-0.5"
      style={{ borderColor: slow ? 'rgb(242 193 78 / 0.4)' : 'rgb(255 255 255 / 0.1)' }}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: slow ? 'var(--color-signal-loss)' : style.colour }}
        />
        <span className="text-body-sm text-fg sm:whitespace-nowrap">{label}</span>
      </span>
      {meta ? (
        <span
          data-numeric
          className={`text-[0.6875rem] sm:pl-3.5 ${metaClassName}`}
          style={{ color: slow ? 'var(--color-signal-loss)' : 'var(--color-fg-3)' }}
        >
          {meta}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Which blocks are on screen at a given step.
 *
 * A pinned pane cannot be scrolled, so anything that does not fit is simply
 * unreachable — on a phone the scene therefore shows fewer artefacts at once and
 * hands off from one to the next. The story is identical; the window is smaller.
 */
function stageWindow(step: number, mode: StageMode) {
  if (mode === 'minimal') {
    return {
      doc: step === 0,
      objects: step === 1,
      interview: step === 2,
      chain: step === 3,
      systems: step === 4,
      compare: step === 5,
      quality: step === 6,
    };
  }

  /* One artefact at a time, but the source document stays put as the anchor —
     peaks at 378px against a ~408px budget on a 1280x720 laptop. */
  if (mode === 'anchored') {
    return {
      doc: true,
      objects: step === 1,
      interview: step === 2,
      chain: step >= 3 && step <= 4,
      systems: step === 4,
      compare: step === 5,
      quality: step === 6,
    };
  }

  /* At most two artefacts beside the source document. Measured: the heaviest
     step is 426px of a 471px budget at 1440x900. */
  return {
    doc: true,
    objects: step === 1,
    interview: step >= 2 && step <= 3,
    chain: step >= 3 && step <= 4,
    systems: step === 4,
    compare: step >= 5 && step <= 6,
    quality: step === 6,
  };
}

/** Systems attach to the steps they actually support. */
function SupportingSystems() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">
        Támogató rendszerek
      </span>
      <Chip label="ERP" kind="system" meta="igény, szerződés" metaClassName="hidden sm:block" />
      <Chip
        label="Excel-nyilvántartás"
        kind="system"
        meta="minősítés · nincs verziókövetés"
        metaClassName="hidden sm:block"
      />
      <Chip
        label="E-mail"
        kind="system"
        meta="jóváhagyás · nem auditálható"
        metaClassName="hidden sm:block"
      />
    </div>
  );
}

function Stage({ step, mode }: { step: number; mode: StageMode }) {
  const show = stageWindow(step, mode);

  return (
    <div className="flex flex-col">
      {/* The source document — the anchor the whole scene grows out of. */}
      <div
        hidden={!show.doc}
        className="rounded-xl border border-line bg-raised/70 p-4 transition-opacity duration-[var(--dur-slow)] sm:p-5"
        style={{ opacity: step >= 3 ? 0.5 : 1 }}
      >
        <p className="text-eyebrow uppercase text-fg-3">Beszerzési szabályzat · 4.2 §</p>
        <p className="mt-3 text-body text-fg-2">
          {TOKENS.map((token, i) => {
            if (!token.entity) return <span key={i}>{token.text}</span>;
            const style = KIND_STYLE[token.entity.kind];
            const tagged = step >= 1;
            return (
              <span
                key={i}
                className="rounded px-0.5 transition-[color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]"
                style={{
                  color: tagged ? style.colour : 'inherit',
                  boxShadow: tagged ? `inset 0 -1px 0 0 ${style.colour}` : 'none',
                }}
              >
                {token.text}
              </span>
            );
          })}
        </p>
      </div>

      {/* Extracted objects */}
      <Collapse open={show.objects}>
        <div className="rounded-xl border border-line bg-raised/70 p-4 sm:p-5">
          <p className="text-eyebrow uppercase text-fg-3">Kinyert objektumok</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ASSESSMENT_ENTITIES.map((entity, i) => (
              <CollapseItem key={entity.label} index={i}>
                <Chip
                  label={entity.label}
                  kind={entity.kind}
                  meta={KIND_STYLE[entity.kind].label}
                  metaClassName="hidden sm:block"
                />
              </CollapseItem>
            ))}
          </div>
        </div>
      </Collapse>

      {/* What the interview adds that the policy does not say */}
      <Collapse open={show.interview}>
        <blockquote className="rounded-xl border border-line-blue bg-blue-500/[0.07] p-4 sm:p-5">
          <p className="text-eyebrow uppercase text-blue-300">Interjú · beszerzési vezető</p>
          <p className="mt-2.5 text-body text-fg">
            „A minősítést nem csináljuk külön. Ha ismerjük a szállítót, megy tovább az igény."
          </p>
          <footer className="mt-2.5 text-body-sm text-fg-2">
            Ez nem szerepel a szabályzatban. A modell tényleges gyakorlatként rögzíti.
          </footer>
        </blockquote>
      </Collapse>

      {/* The measured chain */}
      <Collapse open={show.chain}>
        <div className="rounded-xl border border-line bg-raised/70 p-4 sm:p-5">
          <p className="text-eyebrow uppercase text-fg-3">Folyamat · mért lépések</p>
          {/*
            The sequence has to be legible as a sequence. A two-column grid of
            chips reads as an unordered set — the reader cannot tell that these
            are four consecutive steps, which is the whole point of the section.
            On a phone it becomes a numbered vertical flow with a connecting rail;
            from `sm` up the horizontal chain has room to carry the order itself.
          */}
          <ol className="mt-3 flex flex-col sm:flex-row sm:items-stretch">
            {CHAIN.map((node, i) => {
              const isLast = i === CHAIN.length - 1;
              return (
                <li
                  key={node.label}
                  className="relative flex items-start gap-3 pb-3 last:pb-0 sm:flex-1 sm:items-center sm:gap-2 sm:pb-0"
                >
                  {/* Vertical rail between steps — mobile only. */}
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[0.6875rem] top-6 w-px bg-line-blue sm:hidden"
                    />
                  ) : null}

                  {/* Step ordinal. The <ol> carries the order for assistive tech. */}
                  <span
                    aria-hidden="true"
                    data-numeric
                    className="relative z-10 flex size-[1.375rem] shrink-0 items-center justify-center rounded-full border border-line-blue bg-base text-[0.625rem] text-blue-300 sm:hidden"
                  >
                    {i + 1}
                  </span>

                  <CollapseItem index={i} className="min-w-0 flex-1 sm:flex-none">
                    <Chip label={node.label} kind={node.kind} meta={node.meta} slow={node.slow} />
                  </CollapseItem>

                  {!isLast ? (
                    <span aria-hidden="true" className="hidden flex-1 sm:block">
                      <span className="block h-px bg-line-blue" />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {/* Desktop: attached under the chain, where it belongs visually. */}
          <div className="hidden sm:block">
            <Collapse open={show.systems}>
              <div className="border-t border-line-subtle pt-4">
                <SupportingSystems />
              </div>
            </Collapse>
          </div>
        </div>
      </Collapse>

      {/* Mobile: its own step, so a phone never has to fit two artefacts at once. */}
      <div className="sm:hidden">
        <Collapse open={show.systems}>
          <div className="rounded-xl border border-line bg-raised/70 p-4">
            <SupportingSystems />
          </div>
        </Collapse>
      </div>

      {/* Documented vs actual — the divergence becomes the finding */}
      <Collapse open={show.compare}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-raised/70 p-4">
            <p className="text-eyebrow uppercase text-fg-3">Dokumentált</p>
            <p className="mt-2 text-body-sm text-fg-2">
              Minden igényt szállítói minősítés előz meg, jóváhagyási ponttal.
            </p>
          </div>
          <div className="rounded-xl border border-[rgb(232_163_61/0.35)] bg-[rgb(232_163_61/0.06)] p-4">
            <p className="text-eyebrow uppercase text-signal-gap">Tényleges</p>
            <p className="mt-2 text-body-sm text-fg-2">
              Az igények <span data-numeric>62%</span>-a minősítés nélkül jut szerződéskötésre.
            </p>
          </div>
        </div>
      </Collapse>

      {/* Evidence and confidence */}
      <Collapse open={show.quality}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-line bg-overlay/70 p-4 sm:p-5">
          <span className="flex items-center gap-2 text-body-sm text-fg-2">
            <CertaintyMeter certainty="high" />
            Bizonyossági szint: magas
          </span>
          <span className="text-body-sm text-fg-3">
            4 egyező forrás · szabályzat, interjú, ERP-kivonat, folyamatleírás
          </span>
        </div>
      </Collapse>
    </div>
  );
}

export function Assessment() {
  const trackRef = useRef<HTMLDivElement>(null);
  const mode = useStageMode();
  const { step } = useScrollStep(trackRef, ASSESSMENT_STEPS.length);
  const current = ASSESSMENT_STEPS[step] ?? ASSESSMENT_STEPS[0]!;

  return (
    <section id="felmeres" aria-labelledby="felmeres-cim" className="relative">
      <div ref={trackRef} className="relative h-[320vh] sm:h-[460vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-8 pt-[calc(var(--nav-h)+0.5rem)] sm:pt-[calc(var(--nav-h)+1rem)]">
          <div className="container-content flex min-h-0 flex-1 flex-col">
            <SectionHeader
              eyebrow="Felmérés"
              headline={<span id="felmeres-cim">A dokumentumoktól a valós működésig.</span>}
              lead="A modell strukturált felmérésből épül. Minden objektum forráshoz kötött, és a dokumentált állapot külön létezik a ténylegestől."
              leadClassName="short:hidden"
            />

            <div className="mt-8 grid min-h-0 flex-1 gap-8 lg:mt-10 lg:grid-cols-[17rem_1fr] lg:gap-12">
              {/* Steps — full list on desktop, current step on mobile */}
              <div>
                <ol className="hidden lg:block">
                  {ASSESSMENT_STEPS.map((item, i) => {
                    const isCurrent = i === step;
                    const isPast = i < step;
                    return (
                      <li key={item.n} className="relative flex gap-4 pb-5 last:pb-0 short:pb-3">
                        {i < ASSESSMENT_STEPS.length - 1 ? (
                          <span
                            aria-hidden="true"
                            className="absolute left-[0.6875rem] top-6 h-full w-px bg-line-subtle"
                          />
                        ) : null}
                        <span
                          aria-hidden="true"
                          className={
                            'relative z-10 flex size-[1.375rem] shrink-0 items-center justify-center rounded-full border text-[0.625rem] transition-all duration-[var(--dur-base)] ' +
                            (isCurrent
                              ? 'border-blue-400 bg-blue-400 text-void'
                              : isPast
                                ? 'border-line-blue bg-base text-blue-300'
                                : 'border-line-subtle bg-base text-fg-3')
                          }
                        >
                          {item.n}
                        </span>
                        <span className="pt-0.5">
                          <span
                            className={
                              'block text-body-sm transition-colors duration-[var(--dur-base)] ' +
                              (isCurrent ? 'text-fg' : 'text-fg-2')
                            }
                          >
                            {item.title}
                          </span>
                          <Collapse open={isCurrent} lead="tight" className="short:hidden">
                            <span className="block text-[0.8125rem] leading-relaxed text-fg-3">
                              {item.body}
                            </span>
                          </Collapse>
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="lg:hidden" aria-live="polite">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-body-sm text-fg">{current.title}</p>
                    <p data-numeric className="shrink-0 text-body-sm text-fg-3">
                      {current.n}/{ASSESSMENT_STEPS.length}
                    </p>
                  </div>
                  <div className="mt-2.5 h-px w-full bg-line" role="presentation">
                    <div
                      className="h-px bg-blue-400 transition-[width] duration-[var(--dur-base)] ease-[var(--ease-out-expo)]"
                      style={{ width: `${((step + 1) / ASSESSMENT_STEPS.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-3 [@media(max-height:700px)]:hidden">
                    {current.body}
                  </p>
                </div>
              </div>

              <Reveal>
                <Stage step={step} mode={mode} />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
