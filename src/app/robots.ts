import type { MetadataRoute } from 'next';
import { IS_STATIC_DEMO, SITE_URL } from '@/lib/site';

/* Reading env at module scope makes Next treat the route as dynamic; these are
   static files in every deployment, including `output: export`. */
export const dynamic = 'force-static';


export default function robots(): MetadataRoute.Robots {
  if (IS_STATIC_DEMO) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
