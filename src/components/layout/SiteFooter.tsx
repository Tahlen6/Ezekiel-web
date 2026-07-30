import Link from 'next/link';
import { NAV_ITEMS } from '@/data/content';
import { Wordmark } from '@/components/ui/Wordmark';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-subtle bg-void">
      <div className="container-content flex flex-col gap-10 py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-[30ch] text-body-sm text-fg-2">
            A szervezet digitális modellje. Nem csak megmutatja, mi történik. Megmutatja, miért.
          </p>
        </div>

        <nav aria-label="Lábléc navigáció" className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <div>
            <h2 className="text-eyebrow uppercase text-fg-3">Az oldalon</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-body-sm text-fg-2 transition-colors duration-[var(--dur-fast)] hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-eyebrow uppercase text-fg-3">Kapcsolat</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="#bemutato"
                  className="text-body-sm text-fg-2 transition-colors duration-[var(--dur-fast)] hover:text-fg"
                >
                  Bemutatót kérek
                </a>
              </li>
              <li>
                <a
                  href="mailto:kapcsolat@ezekiel.hu"
                  className="text-body-sm text-fg-2 transition-colors duration-[var(--dur-fast)] hover:text-fg"
                >
                  kapcsolat@ezekiel.hu
                </a>
              </li>
              <li>
                <Link
                  href="/adatvedelem"
                  className="text-body-sm text-fg-2 transition-colors duration-[var(--dur-fast)] hover:text-fg"
                >
                  Adatvédelmi tájékoztató
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="container-content border-t border-line-subtle py-6">
        <p className="text-[0.6875rem] text-fg-3">
          © {year} Ezekiel. Az oldalon szereplő mérőszámok illusztratív példafolyamatra
          vonatkoznak.
        </p>
      </div>
    </footer>
  );
}
