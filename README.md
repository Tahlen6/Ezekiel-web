# Ezekiel — weboldal

Az Ezekiel hivatalos weboldala. Egyetlen narratív one-pager, amely scrollvezérelt
történetvezetéssel és interaktív termékdemókkal mutatja be a platformot.

## Indítás

```bash
npm install
```

```bash
npm run dev
```

| Script | Mit tesz |
|---|---|
| `npm run dev` | Fejlesztői szerver (Turbopack) |
| `npm run build` | Éles build |
| `npm start` | Éles szerver |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:pages` | Statikus export a GitHub Pages előnézethez (`out/`) |

## GitHub Pages előnézet

Az oldal megnézhető statikus előnézetként:
**https://tahlen6.github.io/Ezekiel-web/**

A deploy a [`.github/workflows/pages.yml`](.github/workflows/pages.yml) workflow-val
történik, minden `main`-re pusholás után automatikusan.

**Egyszeri beállítás a repóban** (ezt kézzel kell megtenni):
Settings → Pages → Build and deployment → Source = **GitHub Actions**.

### Mit tud és mit nem az előnézet

A GitHub Pages fájlokat szolgál ki, nem Node szervert. Az előnézet ezért a valódi
telepítés **szándékos részhalmaza**:

| | Pages előnézet | Éles (Node/Vercel) |
|---|---|---|
| Teljes oldal, animációk, interaktív demók | ✅ | ✅ |
| Kapcsolatfelvételi űrlap elküldése | ❌ közvetlen e-mail-címet mutat | ✅ webhookra továbbít |
| `/api/kapcsolat` route | kimarad a buildből | ✅ |
| Biztonsági HTTP-fejlécek | ❌ nem beállíthatók | ✅ |
| Indexelés | letiltva (`noindex` + `robots.txt`) | engedélyezve |

Az űrlap statikus módban **nem tesz úgy, mintha elküldte volna** – ugyanaz az elv,
mint a szerver `no_sink` válaszánál: a látogató a közvetlen e-mail-címet kapja.

A statikus mód csak akkor aktiválódik, ha `EZEKIEL_STATIC_EXPORT=1`; a normál
`npm run build` érintetlen. Az env-változók:

| Változó | Mire jó |
|---|---|
| `EZEKIEL_STATIC_EXPORT=1` | `output: 'export'` bekapcsolása |
| `EZEKIEL_BASE_PATH=/Ezekiel-web` | Projekt-oldal alkönyvtára (assetek, linkek) |
| `NEXT_PUBLIC_STATIC_DEMO=1` | Űrlap-fallback + `noindex` |
| `NEXT_PUBLIC_SITE_URL` | Kanonikus URL a metaadatokhoz |

## Élesítés Vercelre

Sorrendben. Az 1–3. lépés után az oldal él a saját domaineden; a 4. teszi
működővé az űrlapot; az 5. jogi kötelezettség.

### 1. Vercel-projekt

1. [vercel.com](https://vercel.com) → **Add New → Project** → a GitHub-repó
   importálása. A Next.js-t magától felismeri, build-parancsot ne állíts át.
2. Deploy. Kapsz egy `*.vercel.app` címet — ezen már minden működik az űrlap
   kivételével.

### 2. Domain rákötése

Vercel → **Settings → Domains** → add hozzá a domained. A Vercel megmutatja a
szükséges DNS-rekordot (általában egy `A` a csúcsdomainhez és egy `CNAME` a
`www`-hez). A TLS-tanúsítványt magától kezeli.

### 3. Környezeti változók

Vercel → **Settings → Environment Variables**. A teljes lista magyarázattal:
[`.env.example`](.env.example). Minimum:

| Változó | Érték |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<a-domained>` — záró perjel nélkül |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ahol elérnek |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | adatvédelmi megkeresésekre |

Ezek után **újra kell deployolni**, hogy beépüljenek.

### 4. Az űrlap bekötése

Két út; elég az egyik. Amíg egyik sincs, a `/api/kapcsolat` `503 no_sink`
választ ad, és az űrlap a közvetlen e-mail-címet mutatja — szándékosan, hogy
egyetlen megkeresés se vesszen el csendben.

**E-mail (Resend)** — ez az egyszerűbb, ha nincs CRM-ed:

1. [resend.com](https://resend.com) → regisztráció → **API Keys** → új kulcs.
2. Vercelen: `RESEND_API_KEY` = a kulcs, `EZEKIEL_LEAD_TO` = a postafiókod.
3. Ezzel már működik, `onboarding@resend.dev` feladóval — de az csak a Resend-
   fiókod saját címére kézbesít.
4. Saját feladóhoz: Resend → **Domains** → a domain hozzáadása → a kiírt
   DNS-rekordok felvétele. Utána `EZEKIEL_LEAD_FROM` = pl. `noreply@<domained>`.

**Webhook** — ha van CRM-ed vagy automatizálásod: `EZEKIEL_LEAD_WEBHOOK` = a
végpont URL-je. JSON POST-ot kap. Ha mindkettő be van állítva, az e-mail nyer.

### 5. Adatvédelmi tájékoztató kitöltése

A [`/adatvedelem`](src/app/adatvedelem/page.tsx) oldalon két „kitöltendő" jelölés
van: az **adatkezelő** megnevezése, székhelye és nyilvántartási száma, valamint
az igénybe vett **adatfeldolgozók** (Vercel mint hosting, és a Resend, ha azt
használod). Ezek jogi adatok, nem vezethetők le a kódból.

Az oldal figyelmeztető sávot is megjelenít, amíg ez nincs kitöltve.

### Ami magától jó lesz

- **Indexelés**: az előnézeten `noindex` van, éles buildben nincs — a
  `NEXT_PUBLIC_STATIC_DEMO`-hoz kötött, amit csak a Pages workflow állít be.
- **Biztonsági fejlécek**: a szerveres buildben aktívak.
- **Sütibanner**: nincs rá szükség, mert nincs analitika és nincs nyomkövetés.
  Ha később mérést teszel be, a tájékoztatót és a bannert is pótolni kell.

### Amit érdemes, de nem blokkol

- Lighthouse-audit éles buildre (a kezdeti JS ~216 kB gzip, ebből ~160 kB a
  Next + React alap).
- A példafolyamat számai illusztratívak, és az oldal jelöli is. Ha valós
  ügyféladatra cserélnéd, a jelölést is át kell írni.

## Tervezési dokumentáció

A brief szerinti tervezési anyagok, a kódolás előtt készültek:

- [`docs/01-narrativa-es-sitemap.md`](docs/01-narrativa-es-sitemap.md) — narratíva,
  sitemap, szekciótervek, vezetői üzenethierarchia
- [`docs/02-designrendszer.md`](docs/02-designrendszer.md) — színtokenek, tipográfiai
  skála, animációs rendszer, akadálymentesség, termékképernyők, teljesítménybüdzsé
- [`docs/03-wireframe.md`](docs/03-wireframe.md) — desktop és mobil wireframe-ek

## Architektúra

```
src/
  app/                     App Router: layout, oldal, SEO route-ok, API
  components/
    graph/GraphCanvas.tsx  A szervezeti gráf renderelője (Canvas 2D)
    layout/                Navigáció, lábléc
    sections/              A tíz narratív szekció
    ui/                    Design system primitívek
  data/content.ts          Minden szekció szövege és mérőszáma
  lib/
    model.ts               A demó szervezeti modell — a teljes oldal adatforrása
    canvas.ts              Canvas segédfüggvények, token beolvasás
    scroll.ts              Scroll progresszió (getter / step / auto)
    animate.ts             Scrollvezérelt imperatív animáció
    hooks.ts               Media query, denzitás, reduced motion
```

### Egy modell, több nézet

[`src/lib/model.ts`](src/lib/model.ts) egyetlen szervezeti modellt definiál: 49
objektum, 75 kapcsolat, nyolc réteg. Minden vizuál – a hero gráfja, a rétegböngésző,
a diagnosztikai nézet, a szimuláció és a záró gráf – **ugyanebből** olvas. Ez a
termékállítás szerkezetbe fordítva: egy modell van, a szekciók ennek a nézetei. Ha
egy csomópont új kapcsolatot kap, az minden szekcióban megjelenik.

A csomópontpozíciók id-alapú deterministic hashből származnak (`seed()`), így a
kiosztás szerveren és kliensen bitre azonos – nincs hidratálási elcsúszás –, és
organikus marad, nem rácsos.

### Miért nincs animációs könyvtár

A brief a Framer Motiont javasolja, de egyben tiltja a szükségtelen JavaScriptet.
A tényleges igény négy dologra szűkült: scrollhoz kötött transzformációk, be- és
kilépő átmenetek, egy sliding indikátor és számlálók. Mindet fedi a CSS és egy
rAF-ciklus, amely stílusokat ír – a Motion 46,5 kB gzip volt ezért. Így a
scrollvezérelt logika ugyanazt a mintát követi, mint a canvas renderer:

- `lib/animate.ts` → `useScrollDrive` — egy rAF-ciklus, közvetlen stílusírás
- `ui/Collapse.tsx` → `grid-template-rows: 0fr → 1fr` — magasságanimáció mérés nélkül
- `.animate-enter` → keyed remount újrajátssza a CSS belépést
- `ui/AnimatedNumber.tsx` → rAF tween, `textContent`-be ír, React render nélkül

### Teljesítmény

| Metrika | Mért érték |
|---|---|
| Kezdeti JS (`/`, gzip) | ~216 kB, ebből ~160 kB a Next + React alap |
| Alkalmazáskód | ~53 kB gzip |
| Külső kérés futásidőben | 0 (a betűtípus self-hosted) |

A gráfok csak akkor rajzolnak, amikor láthatók (IntersectionObserver), mobilon
harmadannyi csomóponttal, `devicePixelRatio` 2-re vágva. A rajzoló méri a saját
frame-idejét, és 11 ms felett visszavesz az adatimpulzusokból.

### Akadálymentesség

- A canvas soha nem egyetlen információforrás: minden gráfállapothoz tartozik
  szöveges megfelelő (panel, lista, `aria-live` összegzés), és a vezérlők valódi
  `button`/`input` elemek.
- A státuszszínek mellett mindig van glyph és szöveges címke.
- `prefers-reduced-motion` esetén a scrollvezérelt szekciók a végállapotukat
  mutatják, a gráf nem animál, és a rajzoló ciklus leáll – nem csak elrejti a
  mozgást, hanem nem is költi rá a frame-eket.
