import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory makes Next infer the wrong workspace
  // root; pin it to this project.
  turbopack: { root: path.resolve(import.meta.dirname) },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
