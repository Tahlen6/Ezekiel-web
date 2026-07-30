import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/* Reading env at module scope makes Next treat the route as dynamic; these are
   static files in every deployment, including `output: export`. */
export const dynamic = 'force-static';


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${SITE_URL}/adatvedelem`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
