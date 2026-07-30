import { NextResponse } from 'next/server';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

/**
 * Contact endpoint.
 *
 * Deliberately fails loudly rather than silently: if no delivery target is
 * configured, the request is rejected with `no_sink` and the form shows the
 * direct e-mail address instead. A form that appears to submit while the lead
 * goes nowhere is worse than no form.
 *
 * Two delivery routes, checked in order:
 *   1. RESEND_API_KEY + EZEKIEL_LEAD_TO — sends the enquiry as an e-mail.
 *   2. EZEKIEL_LEAD_WEBHOOK — POSTs the JSON to a CRM or automation endpoint.
 *
 * Resend is called over its REST API rather than its SDK: it is one fetch, and
 * the page has no other runtime dependencies worth breaking that streak for.
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

/** Escapes user input before it goes into the notification e-mail's HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function deliverByEmail(payload: Payload, apiKey: string, to: string): Promise<void> {
  const from = process.env.EZEKIEL_LEAD_FROM ?? 'onboarding@resend.dev';
  const kind = payload.interest === 'pilot' ? 'Pilot' : 'Bemutató';

  const rows: [string, string][] = [
    ['Név', payload.name],
    ['E-mail', payload.email],
    ['Szervezet', payload.organisation],
    ['Érdeklődés', kind],
    ['Üzenet', payload.message || '—'],
  ];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: `${SITE_NAME} <${from}>`,
      to: [to],
      // Replying goes straight to the enquirer rather than to the sending domain.
      reply_to: payload.email,
      subject: `${kind} – ${payload.organisation} (${payload.name})`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
      html:
        `<table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">` +
        rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 16px 6px 0;color:#6e7a8a;vertical-align:top">${label}</td>` +
              `<td style="padding:6px 0">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`,
          )
          .join('') +
        `</table>`,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`resend responded ${response.status}: ${await response.text()}`);
  }
}

async function deliverByWebhook(payload: Payload, url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`webhook responded ${response.status}`);
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

  const resendKey = process.env.RESEND_API_KEY;
  const leadTo = process.env.EZEKIEL_LEAD_TO;
  const webhook = process.env.EZEKIEL_LEAD_WEBHOOK;

  if (!((resendKey && leadTo) || webhook)) {
    console.error(
      '[kapcsolat] No delivery target configured (RESEND_API_KEY + EZEKIEL_LEAD_TO, or ' +
        `EZEKIEL_LEAD_WEBHOOK). The submission was rejected so the visitor is told to ` +
        `e-mail ${CONTACT_EMAIL} directly instead of losing the message.`,
    );
    return NextResponse.json({ ok: false, code: 'no_sink' }, { status: 503 });
  }

  try {
    if (resendKey && leadTo) {
      await deliverByEmail(payload, resendKey, leadTo);
    } else if (webhook) {
      await deliverByWebhook(payload, webhook);
    }
  } catch (error) {
    console.error('[kapcsolat] delivery failed', error);
    return NextResponse.json({ ok: false, code: 'delivery_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
