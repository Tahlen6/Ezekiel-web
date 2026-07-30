import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main
        id="tartalom"
        className="container-content flex min-h-[70svh] flex-col justify-center pb-24 pt-[calc(var(--nav-h)+5rem)]"
      >
        <p className="text-eyebrow uppercase text-blue-300">404</p>
        <h1 className="mt-5 max-w-[22ch] text-display-2 text-fg" style={{ marginLeft: '-0.02em' }}>
          Ez az oldal nem szerepel a modellben.
        </h1>
        <p className="measure-lead mt-6 text-lead text-fg-2">
          A keresett cím nem létezik, vagy megváltozott. Innen visszatalálsz.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="primary" size="lg">
            Vissza a főoldalra
          </ButtonLink>
          <ButtonLink href="/#bemutato" variant="secondary" size="lg" arrow>
            Bemutatót kérek
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
