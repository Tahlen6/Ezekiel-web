import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/**
 * Self-hosted via next/font: zero external requests at runtime, and the font
 * file is preloaded with the page. latin-ext carries the Hungarian long vowels
 * (ő, ű) — without it those fall back and the headline reflows.
 */
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  axes: ['opsz'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ezekiel.hu';

/** Static preview deployment: real content, placeholder details, keep it out of search. */
const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1';

const DESCRIPTION =
  'Az Ezekiel összekapcsolja a folyamatokat, szerepköröket, rendszereket, ' +
  'költségeket és kockázatokat egyetlen szervezeti modellben — hogy a vezetői ' +
  'döntések ne feltételezésekre épüljenek.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ezekiel — A szervezet digitális modellje',
    template: '%s | Ezekiel',
  },
  description: DESCRIPTION,
  applicationName: 'Ezekiel',
  keywords: [
    'szervezeti diagnosztika',
    'szervezeti modell',
    'folyamatfelmérés',
    'működési átvilágítás',
    'vezetői döntéstámogatás',
    'folyamatoptimalizálás',
    'digitális transzformáció',
  ],
  authors: [{ name: 'Ezekiel' }],
  creator: 'Ezekiel',
  publisher: 'Ezekiel',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: SITE_URL,
    siteName: 'Ezekiel',
    title: 'Ezekiel — A szervezet digitális modellje',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ezekiel — A szervezet digitális modellje',
    description: DESCRIPTION,
  },
  robots: IS_STATIC_DEMO
    ? { index: false, follow: false, nocache: true }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
      },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05070a',
  colorScheme: 'dark',
};

/**
 * Structured data limited to what is verifiable from the site itself: who
 * publishes it and what the product is. Deliberately no ratings, client counts
 * or awards — the brief forbids unproven claims, and that includes markup.
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Ezekiel',
      url: SITE_URL,
      description: DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Ezekiel',
      inLanguage: 'hu-HU',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#product`,
      name: 'Ezekiel',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Vállalati diagnosztikai és szervezeti intelligenciaplatform. Összekapcsolt ' +
        'szervezeti modellt épít folyamatokból, szerepkörökből, rendszerekből, ' +
        'adatokból, költségekből és kockázatokból.',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={inter.variable}>
      <body className="bg-base text-fg antialiased">
        <a
          href="#tartalom"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-blue-500 focus:px-5 focus:py-3 focus:text-body-sm focus:font-medium focus:text-white"
        >
          Ugrás a tartalomra
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
