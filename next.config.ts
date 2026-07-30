import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * Static-export mode, used only by the GitHub Pages preview workflow.
 *
 * Pages serves files, not a Node server, so this mode is a genuine subset of the
 * real site: no route handlers, no header configuration, and the contact form
 * degrades to the direct e-mail address. The normal server build is unaffected —
 * nothing below changes unless EZEKIEL_STATIC_EXPORT is set.
 */
const isStaticExport = process.env.EZEKIEL_STATIC_EXPORT === '1';

/** e.g. `/Ezekiel-web` for a GitHub project page. Empty for a root domain. */
const basePath = process.env.EZEKIEL_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory makes Next infer the wrong workspace
  // root; pin it to this project.
  turbopack: { root: path.resolve(import.meta.dirname) },

  /*
   * `next build` and `next dev` share `.next` by default, so a build run while a
   * dev server is up deletes the files that server is reading and leaves it
   * hung. The static-export build sets this to `out` instead, which is both the
   * published directory and somewhere the dev server never reads — so a Pages
   * build can run alongside `npm run dev` safely.
   */
  distDir: process.env.EZEKIEL_DIST_DIR ?? '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  ...(isStaticExport
    ? {
        output: 'export' as const,
        basePath,
        assetPrefix: basePath || undefined,
        // Pages has no directory-index rewriting, so every route needs to be a
        // real directory with an index.html.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        // Static hosting cannot honour these; they belong to the server build.
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
      }),
};

export default nextConfig;
