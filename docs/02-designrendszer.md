# Ezekiel — designrendszer

## 1. Alapelv

A hideg kék az oldalon **nem dekoráció, hanem jelentés**. Egyetlen szabály vezeti az egész
színhasználatot:

> Kék = kapcsolat, adat, összefüggés. Amit az Ezekiel feltár.

Ebből következik: a kék soha nem tölt ki nagy felületet, és soha nem díszít. Ott jelenik meg,
ahol kapcsolat, adatáramlás vagy feltárt összefüggés látható. A felület maga grafit és
semleges szürke — a kéknek kontrasztot és csendet ad.

## 2. Színtokenek

### Felületek

| Token | Érték | Használat |
|---|---|---|
| `--surface-void` | `#05070A` | Navigáció, footer — majdnem fekete |
| `--surface-base` | `#0A0D12` | Az oldal alap háttere, mély grafit |
| `--surface-raised` | `#0E1319` | Szekciófelületek, kártyák |
| `--surface-overlay` | `#141A22` | Panelek, aktív kártyák, tooltipek |
| `--surface-ice` | `#E8F1FB` | Halvány jégkék felület (világos betétszekció) |

### Tipográfia

| Token | Érték | Kontraszt `--surface-base`-en |
|---|---|---|
| `--text-primary` | `#F7F9FC` | 18.4:1 — címsorok, kiemelt szöveg |
| `--text-secondary` | `#A8B3C2` | 8.1:1 — bevezetők, leírások |
| `--text-tertiary` | `#6E7A8A` | 4.1:1 — csak nagy méretben (≥18.66px bold / ≥24px), metaadat |
| `--text-on-ice` | `#0A0D12` | 17.9:1 — világos felületen |

`--text-tertiary` szándékosan nem használható normál törzsszövegre. Ahol kis méretű
másodlagos szöveg kell, `--text-secondary` a minimum.

### Kék skála (a kapcsolat nyelve)

| Token | Érték | Használat |
|---|---|---|
| `--blue-100` | `#D3E6FB` | Jégkék szövegkiemelés sötét felületen |
| `--blue-300` | `#7FC0FF` | Aktív gráfél, kiemelt kapcsolat |
| `--blue-400` | `#4FA3FF` | Elsődleges akcentus, fókuszgyűrű, aktív állapot |
| `--blue-500` | `#2B7FE8` | CTA alap, gradiensmélység |
| `--blue-700` | `#17457F` | Inaktív kapcsolatvonal, halvány raszter |
| `--blue-glow` | `rgba(79,163,255,0.35)` | Fényhatás, csak `box-shadow`/`filter` |

### Vonalak és elválasztók

| Token | Érték |
|---|---|
| `--line-subtle` | `rgba(255,255,255,0.06)` |
| `--line` | `rgba(255,255,255,0.10)` |
| `--line-strong` | `rgba(255,255,255,0.18)` |
| `--line-blue` | `rgba(79,163,255,0.28)` |

### Státuszszínek (minimális, funkcionális)

Csak diagnosztikai jelentéssel, soha dekorációként. Mindegyik mellett ikon vagy szöveges
jelölés is szerepel — a szín nem lehet egyetlen információhordozó.

| Token | Érték | Jelentés |
|---|---|---|
| `--signal-gap` | `#E8A33D` | Hiányosság — nincs felelős / nincs szabályozott folyamat |
| `--signal-conflict` | `#C77DFF` | Konfliktus — ellentmondó szabály vagy gyakorlat |
| `--signal-risk` | `#E5595E` | Kockázat — kritikus függőség |
| `--signal-loss` | `#F2C14E` | Veszteség — idő- és költségelfolyás |
| `--signal-ok` | `#3DBE8B` | Szabályozott, mért, rendben |

## 3. Tipográfia

**Betűtípus:** Inter Variable (self-hosted `next/font`-tal, `display: swap`, latin +
latin-ext subset a magyar ékezetek miatt). Tabuláris számjegyek (`tnum`) minden
mérőszámnál, hogy az animált számlálók ne ugráljanak.

### Skála

Fluid, `clamp()`-pel. Hét szint — szándékosan kevés.

| Szint | Méret | Line-height | Tracking | Használat |
|---|---|---|---|---|
| `display-1` | `clamp(2.5rem, 6.2vw, 5.5rem)` | 1.02 | `-0.03em` | Hero headline |
| `display-2` | `clamp(2rem, 4.2vw, 3.5rem)` | 1.06 | `-0.025em` | Szekció headline |
| `display-3` | `clamp(1.5rem, 2.4vw, 2.125rem)` | 1.15 | `-0.02em` | Alszekció, kártyacím |
| `lead` | `clamp(1.0625rem, 1.35vw, 1.375rem)` | 1.5 | `-0.01em` | Szekcióbevezető |
| `body` | `1rem` | 1.6 | `0` | Törzsszöveg |
| `body-sm` | `0.875rem` | 1.55 | `0` | Panelszöveg, metaadat |
| `eyebrow` | `0.75rem` | 1.2 | `0.14em` | Szekciócímke, uppercase |

### Hierarchia szabályai

- A hierarchiát **méret, térköz és elhelyezés** teremti meg, nem félkövérség.
- Súlyok: `display-*` → 500 (medium). `lead` → 400. `body` → 400. `eyebrow` → 500.
  A 700-as súly csak inline kiemelésre, szekcióban legfeljebb egyszer.
- Mérőszámok (`display-3`, tabular) → 500.
- Sorhossz: bevezetők max `34ch`, törzsszöveg max `62ch`.
- Optikai igazítás: a `display-1` és `display-2` bal oldalt `-0.02em`
  kompenzációt kap, hogy a nagybetű optikailag a rasztervonalra essen.

## 4. Térrendszer

**Alap:** 4px-es skála. Használt lépcsők: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.

**Raszter:** 12 kolumna, max tartalomszélesség `1240px`, gutter `24px` (mobil `20px`).
Széles desktopon (≥1600px) a tartalom nem nyúlik tovább — a whitespace nő.

**Szekcióritmus:** vertikális padding `clamp(96px, 12vh, 176px)`. A sticky storytelling
szekciók magassága `300vh` (desktop) / `220vh` (mobil), a sticky viewport `100vh`/`100dvh`.

**Whitespace-elv:** egy szekcióban a headline és a hozzá tartozó vizuál között legalább
`64px`; a szekciók között legalább `96px`. A nagyvonalú whitespace nem üresség, hanem a
fókusz eszköze — egy képernyőn egy dolog kap figyelmet.

### Viewportmagasság — a sticky elemek büdzséje

A vertikális hely a szűkös erőforrás, nem a vízszintes. Egy laptop kb. **620–800px**
használható magasságot ad, egy külső monitor **950px+**-t. Ez a designrendszer
legkönnyebben megszegett szabálya, mert nagy kijelzőn fejlesztve nem látszik.

Két szabály, mindkettő kötelező:

1. **Sticky panel csak akkor tapadjon, ha teljesen elérhető.** Egy `position: sticky`
   elem, amely magasabb, mint `viewport − top`, a saját alsó felét elérhetetlenné
   teszi, és a következő szekcióra csúszik. Ezért minden oldalpanel a `tall:`
   varianton keresztül tapad (`@media (min-height: 700px)`); ez alatt egyszerűen
   végigfut a tartalommal. Amelyik panel 700px alatt sem férne be, az nem lehet
   sticky – a költség/megtérülés szekció panelje 940px-t kért, ezért ott elhagytuk.

2. **A kitűzött scrollszínpad tartalma nem múlhatja meg a viewportot.** A pinnelt
   panelből nem lehet kigörgetni, tehát ami nem fér be, az elérhetetlen. Rövid
   képernyőn ezért a **másodlagos szöveg ad utat, nem a vizuál**: a `short:`
   varianton (`@media (max-height: 880px)`) a szekcióbevezető és a lépésleírás
   eltűnik, a felmérési színpad pedig kevesebb blokkot tart egyszerre.

   **A küszöb 880px, és ez nem kerekítés kérdése.** A szekcióbevezető ~180px
   fejlécet jelent. 820px-es küszöbbel egy 830px magas ablakban visszatért a
   bevezető, és ettől *kevesebb* hely maradt, mint egy 760px magas ablakban
   (401px vs 443px) – tehát a magasabb képernyő vágott. Ha egy elem a küszöb
   fölött visszatér, a küszöböt oda kell tenni, ahol az az elem **ténylegesen
   elfér**, nem oda, ahol elvileg „már van hely".

### Kitűzött színpad: egy lépés, egy artefaktum

A pinnelt panel nem görgethető, tehát **a színpad tartalmának budget-je van**, nem
csak a panelnek. Mérve (375×812): a fejléc, a lépésjelző és a térközök 274px-et
esznek, a vizuálra 434px marad; egy 667px magas telefonon 364px.

Ezért a felmérési szekció nem halmozza a blokkokat, hanem **ablakot** használ:

| | Egyszerre látható artefaktum | Legnagyobb lépés |
|---|---|---|
| Mobil, vagy ≤759px magas, vagy <1280px széles és ≤819px magas | **1** | 279px |
| Minden más | 2 + a forrásdokumentum | 426px (443–640px büdzséből) |

**A tömörítés küszöbe nem azonos a szövegritkításéval.** A szövegritkítás olcsó
(egy bekezdés tűnik el), a tömörítés drága: eltűnik a forrásdokumentum, amire az
egész jelenet épül, és a blokkok egyesével váltják egymást ahelyett, hogy
egymásra épülnének. Ezt csak akkor szabad bekapcsolni, ha tényleg nem fér el –
egy 1440×760-as laptopon például elfér (426px a 443px-ből).

**A szélesség is számít, nem csak a magasság.** Keskenyebb hasábban a blokkok
~25px-szel magasabbak és a címsor két sorba tör: 1024×720-on 451px kellene a
430px-es büdzséből. Ezért van a küszöbben szélességi tag is.

Amelyik blokk nem fér be egyedül sem, az külön lépést kap – így került a
„támogató rendszerek" mobilon a lánc mellől saját lépésbe.

**A `scrollHeight` nem használható erre az ellenőrzésre.** Flex-konténerben a
túlnyúló gyerek nem növeli a szülő `scrollHeight`-ját, ezért egy scrollHeight-alapú
vizsgálat nulla problémát jelez ott is, ahol 177px elérhetetlen. Blokkonként a
panel alsó széléhez kell hasonlítani.

### Sorozat csak akkor sorozat, ha látszik a sorrend

A folyamatlánc mobilon 2×2-es rácsban állt, sorszám és összekötő nélkül – négy
egymás mellé tett kártyaként olvasódott, nem négy egymást követő lépésként.
Szabály: **ahol a sorrend az információ, ott vizuális sorrendjelzés kell** –
sorszám és összekötő –, nem elég a DOM-sorrend vagy a balról jobbra olvasás.

### `cover` illesztés portrait nézetben

A `cover` a nagyobb méretet választja, hogy a vizuál túlfolyjon a kereten. Magas és
keskeny dobozban (telefon portrait) viszont a magasságból számolt méret annyira
dominál, hogy a modell a vászon többszörösére nagyul, és nagy része kikerül a
képből: a hero 943px széles modellt rajzolt egy 375px-es vászonra.

Szabály: a `cover` mérete a **vászon szélességéhez korlátozva** (`≤ w * 0.6`).
Fekvő képernyőn nem aktiválódik, tehát a desktop látvány változatlan.

**Geometria méretből, ne százalékból.** A problémafelvetés gyűrűje fix 30%-os
y-rádiusszal indult. Ugyanez a 30% egy magas monitoron 134px térköz, egy laptopon
50px – miközben a kártyák ugyanolyan magasak maradnak, tehát összecsúsznak. A rádiuszt
ezért a `ringRadiusY()` a **mért** színpad- és kártyamagasságból oldja meg: annyira nő,
hogy a szomszédos kártyák elkerüljék egymást, majd annyira korlátozódik, hogy a
legkülső kártyák a színpadon belül maradjanak. Ahol elemek egymáshoz képest
pozicionálódnak, ott a méretet mérni kell, nem megtippelni.

## 5. Animációs rendszer

### Elv

Minden animáció egy működési összefüggést magyaráz el. Ha egy animáció eltávolítása után
a szekció ugyanannyit közöl, az animáció felesleges.

Négy engedélyezett animációtípus:

1. **Belépés (reveal)** — az elem megjelenik, amikor relevánssá vált.
2. **Összeállás (assembly)** — szétszórt elemekből struktúra épül. Ez a fő narratív eszköz.
3. **Fókuszváltás (focus shift)** — ugyanaz a modell, más metszet.
4. **Terjedés (propagation)** — egy változás végigfut a kapcsolatokon.

### Easing és időzítés

| Token | Görbe | Használat |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Belépés, feltárás — a fő görbe |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Állapotváltás, morfolás |
| `--ease-linear` | `linear` | Folyamatos adatimpulzus, gráfpulzálás |

| Token | Idő | Használat |
|---|---|---|
| `--dur-fast` | `160ms` | Hover, fókusz, kis állapotváltás |
| `--dur-base` | `320ms` | Panelváltás, toggle |
| `--dur-slow` | `640ms` | Reveal, morfolás |
| `--dur-cinematic` | `1200ms` | Gráf-összeállás, kameramozgás |

**Reveal stagger:** 60ms elemenként, maximum 6 elem (utána 0 — nem várakoztatjuk a
felhasználót). Reveal távolság: 16px felfelé, opacitás 0→1. Nincs scale, nincs rotate,
nincs blur-in a szövegen (olvashatóság).

### Scrollvezérlés

- **Nincs scrolljacking.** A natív görgetés sebessége soha nem változik.
- Sticky szekciók: a tartalom `position: sticky`, a progresszió a szekció
  `scrollYProgress`-éből származik. A felhasználó bármikor kigörgethet.
- A scrollhoz kötött animációk `transform` és `opacity` alapúak (compositor-only).
  Kivétel a canvas gráf, amely a saját rAF ciklusában rajzol.
- Minden scroll-progresszió értéke egy `0→1` skalár, amelyet a komponens saját
  szakaszokra oszt. Így a szekció hossza változtatható a logika átírása nélkül.

### `prefers-reduced-motion`

Csökkentett mozgás esetén:
- a reveal-ek azonnali, opacitás-only átmenetre váltanak (`120ms`);
- a gráf **nem animál**, hanem azonnal a végállapotában (teljesen összekapcsolt) rajzolódik ki;
- a sticky storytelling szekciók progresszióját nem a scroll vezérli, hanem a szekció
  belépésekor egyszer a végállapotra ugranak — a tartalom így nem veszik el;
- az automatikus adatimpulzusok és pulzálások leállnak;
- az interaktív elemek (rétegkapcsoló, fülek, forgatókönyvek) továbbra is működnek,
  csak átmenet nélkül váltanak.

### Mobil visszafogás

- A canvas gráf csomópontszáma harmadára csökken, a kapcsolatok száma felére.
- A `devicePixelRatio` felső korlátja 2 (nem 3), a canvas felbontás így kezelhető marad.
- Parallax kikapcsol.
- A sticky szekciók rövidebbek, kevesebb szakaszra oszlanak.
- Az adatimpulzusok száma csökken; 60 FPS alatti mért frame-időnél a rajzoló magától
  visszavesz (adaptív degradálás).

## 6. Komponensek

| Komponens | Leírás |
|---|---|
| `SiteNav` | Sticky, alapállapotban átlátszó. Görgetés után `backdrop-blur(16px)` + `rgba(5,7,10,0.72)` háttér + alsó hajszálvonal. Mobilon full-screen overlay menü. |
| `Button` | `primary` (kék, tömör), `secondary` (vonalas, áttetsző), `ghost` (csak szöveg + nyíl). Fókuszgyűrű: 2px `--blue-400`, 2px offset. Min. 44×44px érintési cél. |
| `SectionHeader` | eyebrow + `display-2` headline + opcionális `lead` bevezető. Egységes térközök. |
| `Reveal` | Belépésanimáció-wrapper, `prefers-reduced-motion`-tudatos, stagger-támogatással. |
| `OrgGraph` | Canvas 2D gráfrenderer. Pszeudo-3D mélységélesség (z → méret, opacitás, blur). Ez az oldal vizuális főszereplője. |
| `LayerToggle` | Rétegkapcsoló. Checkbox-szemantika, billentyűzetkezelés, `aria-pressed`. |
| `MetricRow` | Mérőszám címke + tabuláris érték + delta. Animált számláló. |
| `SignalBadge` | Diagnosztikai jelölés: ikon + szöveg + szín (a szín nem egyedüli jelentéshordozó). |
| `SourceTrace` | Forrásvisszavezetés: megállapítás → forrás → bizonyossági szint. |

## 7. Fókusz és akadálymentesség

- Minden interaktív elem natív fókuszálható elem (`button`, `a`, `input`), nem `div`-re
  kötött kattintás.
- `:focus-visible` gyűrű: `outline: 2px solid var(--blue-400); outline-offset: 2px`.
  Soha nincs `outline: none` alternatíva nélkül.
- A canvas gráf **nem az egyetlen információforrás**: minden gráfállapothoz tartozik
  szöveges megfelelője (lista, panel, `aria-live` összegzés). A canvas
  `role="img"` + `aria-label`, a hozzá tartozó vezérlők valódi gombok.
- Skip-link a fő tartalomra.
- Szemantikus szerkezet: egy `h1`, szekciónként `h2`, ugrás nélküli szinttartás.
- Az interaktív demók billentyűzettel teljesen kezelhetők: `Tab` a vezérlők között,
  `Enter`/`Space` aktiválás, nyilak a listákban.
- Kontraszt: minden szöveg ≥4.5:1, nagy szöveg ≥3:1. A `--text-tertiary` csak nagy
  méretben engedélyezett.

## 8. Ezekiel termékképernyők listája

A weboldalon megjelenő termékfelületek. Ezek nem stockfotók és nem absztrakt
marketinggrafikák, hanem az Ezekiel valós felületének célzottan renderelt részletei
(vektorosan, komponensként újraépítve — így élesek, könnyűek és témázhatók).

| # | Képernyő | Hol jelenik meg | Mit bizonyít |
|---|---|---|---|
| 1 | **Szervezeti modell — gráfnézet** | Hero, záró szekció | A modell összefüggő, nem lista |
| 2 | **Rétegválasztó + gráf metszetei** | `#platform` | Egy modell, nyolc nézőpont |
| 3 | **Csomópont-részletpanel** | `#platform` | Minden objektum strukturált és forrásolt |
| 4 | **Felmérési idővonal + dokumentum-parszolás** | `#felmeres` | A modell felmérésből épül |
| 5 | **Dokumentált vs. tényleges eltérésnézet** | `#felmeres` | A két állapot külön kezelt |
| 6 | **Diagnosztikai találatlista** (4 kategória) | `#elemzes` | Diagnózis, nem térkép |
| 7 | **Folyamat-mérőszám tábla** | `#megterules` | A probléma forintosított |
| 8 | **Fejlesztési forgatókönyv-összehasonlító** | `#megterules` | A megtérülés számolható |
| 9 | **Szimulációs előtte–utána nézet** | `#dontestamogatas` | A hatás előre látható |
| 10 | **Verzió-idővonal / modell-összehasonlítás** | `#eredmeny` | A modell él és mérhető |
| 11 | **Forrásvisszavezetés + bizonyossági szint** | `#modszertan` | Nem fekete doboz |

## 9. Teljesítménybüdzsé

| Metrika | Cél | Mért (build után) |
|---|---|---|
| CLS | < 0.02 | — |
| Animációs frame-idő | < 12 ms | a rajzoló önmagát méri és visszavesz |
| Első JS payload (gzip) | < 130 kB | **~216 kB** |
| ↳ ebből Next + React alap | — | ~160 kB |
| ↳ ebből alkalmazáskód | — | ~53 kB |
| Külső kérés futásidőben | 0 | 0 |

**A JS-büdzsé nem teljesült, és ezt érdemes nyíltan rögzíteni.** A 130 kB-os cél
a tervezés elején készült, a Next.js App Router valós alapterhelésének ismerete
nélkül. Egy szerverkomponens-alapú, de interaktív szigetekkel dolgozó App Router
oldal alapja önmagában ~160 kB gzip: a React DOM kliens, a Next futásidő és a
router. Ez az architektúra padlója, nem a mi kódunké.

Ami a saját kezünkben volt, az megtörtént:

- **Animációs könyvtár eltávolítva.** A Framer Motion 46,5 kB gzip volt, négy
  effektusért, amelyet a CSS és egy rAF-ciklus is elvégez. Ez −51 kB.
- A hero – az egyetlen első képernyőn látható vizuál – nem használ semmilyen
  animációs futásidőt, csak canvast és CSS-t.
- Nincs ikonkönyvtár: minden ikon inline SVG.
- `next/font` self-hosting: nulla külső kérés, nulla harmadik felé menő adat.
- A gráfok csak láthatóan rajzolnak; mobilon harmadannyi csomóponttal.

**Ami nem oldható meg deferrálással:** a szekciók szerveren renderelődnek (SEO és
LCP miatt), és interaktívak – ezért a JS-üket a hidratáláshoz be kell tölteni.
A `next/dynamic` külön chunkokra vágja őket, de nem késlelteti a letöltést.
A valódi további csökkentés csak azzal járna, ha szekciók lemondanának a
szerveroldali renderelésről, ami SEO-t áldozna teljesítményért – ezt a brief
prioritásai mellett nem tartjuk jó cserének.

Az LCP és INP mérése éles környezetben, valós hálózaton érvényes; a fejlesztői
build számai félrevezetők, ezért itt nem szerepelnek.
