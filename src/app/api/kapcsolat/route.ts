import { NextResponse } from 'next/server';

/**
 * Contact endpoint.
 *
 * Deliberately fails loudly rather than silently: if no delivery target is
 * configured, the request is rejected with `no_sink` and the form shows the
 * direct e-mail address instead. A form that appears to submit while the lead
 * goes nowhere is worse than no form.
 *
 * To activate, set EZEKIEL_LEAD_WEBHOOK to an endpoint that accepts a JSON POST
 * (CRM intake, Zapier/Make hook, or an internal service). Swap the fetch below
 * for a transactional e-mail provider if that suits the stack better.
 */

interface Payload {
  name: string;
  email: string;
  organisation: string;
  role: string;
  interest: string;
  message: string;
}

const MAX_LENGTHS: Record<keyof Payload, number> = {
  name: 120,
  email: 200,
  organisation: 160,
  role: 120,
  interest: 40,
  message: 4000,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readString(source: Record<string, unknown>, key: keyof Payload): string {
  const value = source[key];
  return typeof value === 'string' ? value.trim().slice(0, MAX_LENGTHS[key]) : '';
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: a real person never fills a field they cannot see.
  if (readString(body, 'role') !== '') {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const payload: Payload = {
    name: readString(body, 'name'),
    email: readString(body, 'email'),
    organisation: readString(body, 'organisation'),
    role: '',
    interest: readString(body, 'interest') === 'pilot' ? 'pilot' : 'bemutato',
    message: readString(body, 'message'),
  };

  const errors: Record<string, string> = {};
  if (payload.name.length < 2) errors.name = 'Kérjük, add meg a neved.';
  if (!EMAIL.test(payload.email)) errors.email = 'Érvényes e-mail-címet adj meg.';
  if (payload.organisation.length < 2) errors.organisation = 'Kérjük, add meg a szervezet nevét.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, code: 'validation', errors }, { status: 422 });
  }

  const webhook = process.env.EZEKIEL_LEAD_WEBHOOK;
  if (!webhook) {
    console.error(
      '[kapcsolat] EZEKIEL_LEAD_WEBHOOK is not configured — the submission was rejected ' +
        'so the visitor is told to e-mail directly instead of losing the message.',
    );
    return NextResponse.json({ ok: false, code: 'no_sink' }, { status: 503 });
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`webhook responded ${response.status}`);
  } catch (error) {
    console.error('[kapcsolat] delivery failed', error);
    return NextResponse.json({ ok: false, code: 'delivery_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
