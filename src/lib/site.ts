/**
 * Everything that changes when the site gets a real home.
 *
 * These values appear in metadata, structured data, the sitemap, the footer, the
 * contact form and the privacy notice. Keeping them here means going live is a
 * config change, not a search-and-replace across a dozen files.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides the domain per deployment, so the same build
 * serves a preview and production without editing code.
 */

const FALLBACK_DOMAIN = 'ezekiel.hu';

/** Canonical origin, no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${FALLBACK_DOMAIN}`).replace(
  /\/$/,
  '',
);

/** Bare host, used in prose ("az ezekiel.hu weboldalon…"). */
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, '');

/**
 * Where enquiries and privacy requests go. Override per deployment; the
 * defaults are derived from the domain so nothing reads as a stale placeholder.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? `kapcsolat@${FALLBACK_DOMAIN}`;
export const PRIVACY_EMAIL =
  process.env.NEXT_PUBLIC_PRIVACY_EMAIL ?? `adatvedelem@${FALLBACK_DOMAIN}`;

export const SITE_NAME = 'Ezekiel';

/**
 * Static preview deployment (GitHub Pages): real content, placeholder details,
 * no server behind the form — so it stays out of search engines.
 */
export const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1';
