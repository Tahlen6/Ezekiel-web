import type { MetadataRoute } from 'next';

/* Reading env at module scope makes Next treat the route as dynamic; these are
   static files in every deployment, including `output: export`. */
export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ezekiel.hu';

/** Static preview deployment — placeholder details, so keep crawlers off it. */
const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1';

export default function robots(): MetadataRoute.Robots {
  if (IS_STATIC_DEMO) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
