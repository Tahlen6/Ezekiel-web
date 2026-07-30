import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ezekiel.hu';

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
