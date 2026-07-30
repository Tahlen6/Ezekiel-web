'use client';

import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '@/data/content';
import { ButtonLink } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';

/**
 * Sticky navigation. Transparent over the hero, then a blurred near-black plate
 * once the page moves — present enough to read, quiet enough to stay out of the
 * way of the model behind it.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // rAF-throttled: scroll handlers must not do layout work per event.
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        queued = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Which section the reader is in, so the menu reflects position in the story. */
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The entry closest to the top of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Mobile menu: lock the page, close on Escape, restore focus. */
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open]);

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] ' +
        'duration-[var(--dur-base)] ease-[var(--ease-out-expo)] ' +
        (scrolled || open
          ? 'border-b border-line-subtle bg-void/[0.72] backdrop-blur-[16px] backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent')
      }
    >
      <nav
        aria-label="Főnavigáció"
        className="container-content flex h-[var(--nav-h)] items-center justify-between gap-6"
      >
        <a
          href="#hero"
          className="-m-2 flex items-center rounded-md p-2"
          aria-label="Ezekiel — vissza az oldal elejére"
        >
          <Wordmark />
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={
                    'relative rounded-md px-3 py-2 text-body-sm transition-colors duration-[var(--dur-fast)] ' +
                    (isActive ? 'text-fg' : 'text-fg-2 hover:text-fg')
                  }
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={
                      'absolute inset-x-3 -bottom-px h-px origin-left bg-blue-400 transition-transform ' +
                      'duration-[var(--dur-base)] ease-[var(--ease-out-expo)] ' +
                      (isActive ? 'scale-x-100' : 'scale-x-0')
                    }
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="#platform" variant="ghost" arrow className="px-3 text-body-sm">
            Az Ezekiel működése
          </ButtonLink>
          <ButtonLink href="#bemutato" variant="primary">
            Bemutatót kérek
          </ButtonLink>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobil-menu"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-fg lg:hidden"
        >
          <span className="sr-only">{open ? 'Menü bezárása' : 'Menü megnyitása'}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d={open ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 13h14'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobil-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line-subtle bg-void/[0.96] backdrop-blur-xl lg:hidden"
      >
        <ul className="container-content flex flex-col py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center border-b border-line-subtle text-lead text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-content flex flex-col gap-3 pb-8 pt-6">
          <ButtonLink href="#bemutato" variant="primary" size="lg" onClick={() => setOpen(false)}>
            Bemutatót kérek
          </ButtonLink>
          <ButtonLink
            href="#platform"
            variant="secondary"
            size="lg"
            onClick={() => setOpen(false)}
            arrow
          >
            Az Ezekiel működése
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
