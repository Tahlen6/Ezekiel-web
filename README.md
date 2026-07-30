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

## Élesítés előtt kötelező

1. **`EZEKIEL_LEAD_WEBHOOK`** — a kapcsolatfelvételi űrlap célpontja. Lásd
   [`.env.example`](.env.example). Amíg nincs beállítva, a `/api/kapcsolat` végpont
   `503 no_sink` választ ad, és az űrlap a közvetlen e-mail-címet mutatja a
   látogatónak. Ez szándékos: egy űrlap, amely látszólag elküldi az adatot, de
   sehova nem juttatja el, rosszabb, mint ha nem lenne űrlap.
2. **Adatvédelmi tájékoztató** — a [`/adatvedelem`](src/app/adatvedelem/page.tsx)
   oldalon az adatkezelő megnevezése és az adatfeldolgozók listája „kitöltendő"
   jelöléssel szerepel. Ezek jogi adatok, nem vezethetők le a kódból.
3. **Domain** — a `SITE_URL` három helyen szerepel: [`layout.tsx`](src/app/layout.tsx),
   [`sitemap.ts`](src/app/sitemap.ts), [`robots.ts`](src/app/robots.ts).
4. **Kapcsolati e-mail-címek** — `kapcsolat@ezekiel.hu` és `adatvedelem@ezekiel.hu`
   szerepel a lábléc, a záró szekció és az adatvédelmi oldal szövegében.

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
