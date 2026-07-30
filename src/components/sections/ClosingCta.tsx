'use client';

import { useCallback, useRef, useState } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { useScrollProgressGetter } from '@/lib/scroll';

const CONTACT_EMAIL = 'kapcsolat@ezekiel.hu';

type Interest = 'bemutato' | 'pilot';
type Status = 'idle' | 'sending' | 'sent' | 'no_sink' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  organisation?: string;
}

/**
 * What we cannot see, we cannot improve.
 *
 * The hero's model returns, now fully assembled and ordered — the visual close
 * of the argument the page opened with.
 */
export function ClosingCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const getScroll = useScrollProgressGetter(sectionRef, 'exit');
  const formRef = useRef<HTMLFormElement>(null);

  const [interest, setInterest] = useState<Interest>('bemutato');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  // Settling camera: the model drifts fractionally closer as the page ends.
  const getCamera = useCallback(() => ({ zoom: 0.95 + getScroll() * 0.08 }), [getScroll]);

  const focusForm = useCallback((next: Interest) => {
    setInterest(next);
    formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    formRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setErrors({});

    try {
      const response = await fetch('/api/kapcsolat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          organisation: data.get('organisation'),
          role: data.get('role'),
          interest,
          message: data.get('message'),
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        errors?: FieldErrors;
      };

      if (result.ok) {
        setStatus('sent');
        form.reset();
        return;
      }
      if (result.code === 'validation' && result.errors) {
        setErrors(result.errors);
        setStatus('idle');
        return;
      }
      setStatus(result.code === 'no_sink' ? 'no_sink' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="bemutato"
      ref={sectionRef}
      aria-labelledby="bemutato-cim"
      className="relative isolate overflow-hidden scroll-mt-[var(--nav-h)]"
    >
      {/* The model, resolved. */}
      <div className="absolute inset-0 -z-20">
        <GraphCanvas
          progress={1}
          getCamera={getCamera}
          fit="cover"
          labels="none"
          pulses
          ariaLabel="Az Ezekiel szervezeti modellje teljesen összekapcsolt, rendezett állapotban."
        />
      </div>
      <div
        aria-hidden="true"
        className="grid-substrate absolute inset-0 -z-20 opacity-60"
        style={{
          maskImage: 'radial-gradient(65% 60% at 50% 40%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(65% 60% at 50% 40%, black 0%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(85%_75%_at_50%_42%,rgba(10,13,18,0.8)_0%,rgba(10,13,18,0.55)_45%,rgba(10,13,18,0.2)_100%)]"
      />

      <div className="container-content section-y relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 id="bemutato-cim" className="text-display-2 text-fg">
              Amit nem látunk, azon nem tudunk javítani.
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="mx-auto mt-6 max-w-[38ch] text-lead text-fg-2">
              Az Ezekiel láthatóvá, mérhetővé és fejleszthetővé teszi a szervezet működését.
            </p>
          </Reveal>
          <Reveal index={2}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button variant="primary" size="lg" onClick={() => focusForm('bemutato')}>
                Kérek egy bemutatót
              </Button>
              <Button variant="secondary" size="lg" arrow onClick={() => focusForm('pilot')}>
                Beszéljünk egy pilotról
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Contact */}
        <Reveal index={3}>
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-line bg-void/75 p-6 backdrop-blur-md sm:p-8">
            {status === 'sent' ? (
              <div role="status" className="py-6 text-center">
                <p className="text-display-3 text-fg">Megkaptuk a megkeresést.</p>
                <p className="mx-auto mt-3 max-w-[34ch] text-body-sm text-fg-2">
                  Két munkanapon belül jelentkezünk egy rövid, konkrét egyeztetéssel.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate>
                <fieldset className="border-0 p-0">
                  <legend className="text-eyebrow uppercase text-fg-3">Miről beszélgessünk</legend>
                  <div className="mt-3 flex gap-2">
                    {(
                      [
                        { value: 'bemutato', label: 'Bemutató' },
                        { value: 'pilot', label: 'Pilot' },
                      ] as const
                    ).map((option) => (
                      <label
                        key={option.value}
                        className={
                          'flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-lg border text-body-sm transition-colors duration-[var(--dur-fast)] ' +
                          (interest === option.value
                            ? 'border-line-blue bg-blue-400/[0.1] text-fg'
                            : 'border-line-subtle text-fg-2 hover:border-line')
                        }
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={option.value}
                          checked={interest === option.value}
                          onChange={() => setInterest(option.value)}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    name="name"
                    label="Név"
                    autoComplete="name"
                    error={errors.name}
                    required
                  />
                  <Field
                    name="email"
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    error={errors.email}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Field
                      name="organisation"
                      label="Szervezet"
                      autoComplete="organization"
                      error={errors.organisation}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-body-sm text-fg-2">
                      Mi az a kérdés, amire most nincs jó válasz?{' '}
                      <span className="text-fg-3">(opcionális)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      maxLength={4000}
                      className="mt-2 w-full resize-y rounded-lg border border-line bg-base/80 px-3.5 py-2.5 text-body text-fg placeholder:text-fg-3 focus-visible:border-line-blue"
                      placeholder="Például: hol folyik el a legtöbb idő a beszerzésben?"
                    />
                  </div>
                </div>

                {/* Honeypot — hidden from people, visible to bots. */}
                <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                  <label htmlFor="role-field">Beosztás</label>
                  <input id="role-field" name="role" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Küldés…' : 'Elküldöm'}
                  </Button>

                  <p aria-live="polite" className="text-body-sm">
                    {status === 'no_sink' ? (
                      <span className="text-signal-gap">
                        Az űrlap továbbítása még nincs beállítva ezen a példányon. Írj közvetlenül:{' '}
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-blue-300 underline decoration-line-blue underline-offset-2"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </span>
                    ) : status === 'error' ? (
                      <span className="text-signal-risk">
                        A küldés nem sikerült. Próbáld újra, vagy írj a{' '}
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-blue-300 underline decoration-line-blue underline-offset-2"
                        >
                          {CONTACT_EMAIL}
                        </a>{' '}
                        címre.
                      </span>
                    ) : (
                      <span className="text-fg-3">
                        Az adataidat kizárólag a megkeresés megválaszolására használjuk.{' '}
                        <a
                          href="/adatvedelem"
                          className="text-fg-2 underline decoration-line underline-offset-2 hover:text-fg"
                        >
                          Adatvédelmi tájékoztató
                        </a>
                      </span>
                    )}
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  error,
  type = 'text',
  autoComplete,
  required = false,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = `kapcsolat-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-body-sm text-fg-2">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-fg-3">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-hiba` : undefined}
        className={
          'mt-2 min-h-11 w-full rounded-lg border bg-base/80 px-3.5 text-body text-fg placeholder:text-fg-3 ' +
          (error ? 'border-signal-risk' : 'border-line focus-visible:border-line-blue')
        }
      />
      {error ? (
        <p id={`${id}-hiba`} className="mt-1.5 text-[0.8125rem] text-signal-risk">
          {error}
        </p>
      ) : null}
    </div>
  );
}
