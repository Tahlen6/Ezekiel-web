import type { Metadata } from 'next';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PRIVACY_EMAIL, SITE_DOMAIN } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Adatvédelmi tájékoztató',
  description:
    `Tájékoztatás a(z) ${SITE_DOMAIN} weboldalon megadott személyes adatok kezeléséről: milyen adatot kezelünk, milyen célból, mennyi ideig, és milyen jogok illetnek meg.`,
  robots: { index: true, follow: true },
};

/**
 * Privacy notice.
 *
 * Everything here is derivable from what the site actually does — the contact
 * form's fields, its purpose, and the rights the GDPR grants. The controller's
 * identification cannot be derived from the code, so it is marked as an
 * explicit gap rather than invented. That block must be completed before the
 * site goes live.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main id="tartalom" className="container-content pb-24 pt-[calc(var(--nav-h)+5rem)]">
        <article className="mx-auto max-w-[65ch]">
          <p className="text-eyebrow uppercase text-blue-300">Jogi tájékoztatás</p>
          <h1 className="mt-5 text-display-2 text-fg" style={{ marginLeft: '-0.02em' }}>
            Adatvédelmi tájékoztató
          </h1>
          <p className="mt-6 text-lead text-fg-2">
            Ez a tájékoztató azt írja le, hogyan kezeljük a(z) {SITE_DOMAIN} weboldalon
            megadott személyes adatokat.
          </p>

          <div
            role="note"
            className="mt-10 rounded-xl border border-[rgb(232_163_61/0.35)] bg-[rgb(232_163_61/0.07)] p-5"
          >
            <p className="text-body-sm font-medium text-signal-gap">Kitöltendő az élesítés előtt</p>
            <p className="mt-2 text-body-sm text-fg-2">
              Az adatkezelő megnevezése, székhelye, nyilvántartási száma és kapcsolattartási
              adatai, valamint az esetleges adatfeldolgozók (hosting, CRM, e-mail-szolgáltató)
              felsorolása jogi adat, amely nem vezethető le a weboldalból. Ezt a szakaszt a
              tényleges céginformációkkal kell kitölteni, mielőtt az oldal élesbe kerül.
            </p>
          </div>

          <Section title="1. Az adatkezelő">
            <p>
              Adatkezelő: <Blank /> (székhely: <Blank />, nyilvántartási szám: <Blank />).
              Adatvédelmi kérdésekben elérhetőségünk:{' '}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="text-blue-300 underline decoration-line-blue underline-offset-2"
              >
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="2. Milyen adatokat kezelünk">
            <p>
              A weboldalon egyetlen helyen gyűjtünk személyes adatot: a kapcsolatfelvételi
              űrlapon. Az itt megadott adatok:
            </p>
            <ul>
              <li>név,</li>
              <li>e-mail-cím,</li>
              <li>a szervezet neve,</li>
              <li>a megkeresés típusa (bemutató vagy pilot),</li>
              <li>az üzenet szövege, ha kitöltöd (opcionális).</li>
            </ul>
            <p>
              Az űrlap nem kér és nem tárol különös kategóriába tartozó adatot. Kérjük, ne adj
              meg az üzenetben bizalmas üzleti információt vagy harmadik személyre vonatkozó
              személyes adatot.
            </p>
          </Section>

          <Section title="3. Az adatkezelés célja és jogalapja">
            <p>
              Cél: a megkeresés megválaszolása, és – ha ezt kéred – egy bemutató vagy pilot
              egyeztetése. Az adatokat kizárólag erre használjuk.
            </p>
            <p>
              Jogalap: az érintett hozzájárulása, illetve a szerződés megkötését megelőző
              lépések megtétele (GDPR 6. cikk (1) bekezdés a) és b) pont). Az űrlap elküldése
              önkéntes.
            </p>
            <p>
              Az adatokat nem használjuk automatizált döntéshozatalra vagy profilalkotásra, és
              nem küldünk marketingüzenetet külön hozzájárulás nélkül.
            </p>
          </Section>

          <Section title="4. Adatmegőrzés">
            <p>
              A megkeresést a válaszadást követően legfeljebb 12 hónapig tartjuk meg, hogy egy
              esetleges folytatásnál legyen előzmény. Ezt követően törlünk. Ha korábbi törlést
              kérsz, azt haladéktalanul elvégezzük.
            </p>
          </Section>

          <Section title="5. Adatfeldolgozók és továbbítás">
            <p>
              Az űrlapon megadott adatok az általunk használt hosting- és
              ügyfélkezelő-szolgáltatáson keresztül jutnak el hozzánk. Az igénybe vett
              adatfeldolgozók: <Blank />. Az adatokat harmadik félnek marketing célból nem adjuk
              át, és az EGT-n kívülre nem továbbítjuk, kivéve ha erről itt külön tájékoztatunk.
            </p>
          </Section>

          <Section title="6. Sütik és mérés">
            <p>
              A weboldal működéséhez nem használunk analitikai vagy marketingsütit, és nem
              helyezünk el nyomkövető szkriptet. Ezért nem is jelenítünk meg sütibanner-t. A
              betűtípusokat saját kiszolgálásban töltjük be, így külső szolgáltató felé nem
              indul kérés a látogatásodról.
            </p>
          </Section>

          <Section title="7. Az érintett jogai">
            <p>A GDPR alapján jogod van:</p>
            <ul>
              <li>tájékoztatást kérni a rólad kezelt adatokról,</li>
              <li>az adatok helyesbítését kérni,</li>
              <li>az adatok törlését kérni,</li>
              <li>az adatkezelés korlátozását kérni,</li>
              <li>a hozzájárulásodat bármikor visszavonni,</li>
              <li>az adataid hordozhatóságát kérni,</li>
              <li>tiltakozni az adatkezelés ellen.</li>
            </ul>
            <p>
              Kérésedet az{' '}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="text-blue-300 underline decoration-line-blue underline-offset-2"
              >
                {PRIVACY_EMAIL}
              </a>{' '}
              címen jelezheted; 30 napon belül válaszolunk.
            </p>
          </Section>

          <Section title="8. Jogorvoslat">
            <p>
              Ha úgy ítéled meg, hogy az adatkezelés nem felel meg a jogszabályoknak, panasszal
              fordulhatsz a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH), vagy
              bírósághoz.
            </p>
          </Section>

          <p className="mt-12 border-t border-line-subtle pt-6 text-body-sm text-fg-3">
            A tájékoztató a weboldal jelenlegi működésére vonatkozik. Ha az adatkezelés
            megváltozik, a tájékoztatót frissítjük.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-display-3 text-fg">{title}</h2>
      <div className="mt-4 space-y-4 text-body text-fg-2 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6875rem] [&_li]:before:size-1 [&_li]:before:rounded-full [&_li]:before:bg-blue-400 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}

/** Marks a value that has to come from the operator, not from the code. */
function Blank() {
  return (
    <span className="rounded bg-[rgb(232_163_61/0.12)] px-1.5 py-0.5 text-body-sm text-signal-gap">
      kitöltendő
    </span>
  );
}
