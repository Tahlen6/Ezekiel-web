# Ezekiel — narratíva, sitemap és üzenethierarchia

## 1. A vezetői narratíva

A weboldal egyetlen gondolatmenetet vezet végig, öt lépésben. Minden szekció egy vezetői
felismerést készít elő, és a következőt indokolja.

| # | Narratív lépés | Vezetői felismerés |
|---|---|---|
| 1 | **Felismerés** | „Nem látom, hogyan működik valójában a szervezetem." |
| 2 | **Ok** | „Nem az adat hiányzik. Az összefüggés hiányzik." |
| 3 | **Módszer** | „Ez leképezhető, strukturáltan és visszakövethetően." |
| 4 | **Következtetés** | „A hiányosságok, kockázatok és veszteségek számszerűsíthetők." |
| 5 | **Döntés** | „Előre látom a döntéseim következményét, és mérem az eredményt." |

A narratíva íve **absztraktból konkrétba** tart: a hero absztrakt pontfelhőjétől a záró
szekció rendezett, teljesen összekapcsolt modelljéig. A vizuális rendezettség növekedése
maga a történet: a szervezet a görgetés során válik érthetővé.

Központi állítás, amely a hero és a záró szekció között zárójelbe fogja az oldalt:

> **A szervezet digitális modellje. Nem csak megmutatja, mi történik. Megmutatja, miért.**

## 2. Sitemap

Egyetlen, hosszú narratív oldal (one-pager), horgonyzott navigációval. Ez a szerkezet
támogatja a scrollvezérelt történetmesélést, és elkerüli, hogy a látogató a döntéshez
szükséges összefüggést több aloldalról rakja össze.

```
/                                    Ezekiel — a szervezet digitális modellje
├── #hero            Hero                       — a tézis
├── #problema        Problémafelvetés            — az ok
├── #platform        A szervezeti modell         → nav: Platform
├── #felmeres        Felmérés                    → nav: Módszertan
├── #elemzes         Elemzés (diagnózis)         → nav: Megoldások
├── #megterules      Költség és megtérülés       → nav: Eredmények
├── #dontestamogatas Vezetői döntéstámogatás
├── #eredmeny        Az eredmény
├── #modszertan      Bizalom és módszertan       → nav: Rólunk
├── #bemutato        Záró szekció + kapcsolat
└── footer           Jogi, kapcsolat, navigáció

/adatvedelem                          Adatvédelmi tájékoztató (jogi háttéroldal)
/sitemap.xml, /robots.txt             SEO
```

A navigáció öt pontja szándékosan a narratíva öt csomópontjára mutat, nem külön aloldalakra.
Így a menü nem elhagyja a történetet, hanem belép a megfelelő pontján.

## 3. Szekciótervek

Minden szekció azonos raszter szerint van megtervezve: **vezetői üzenet → mit lát →
mit ért meg → animáció/interakció → következő lépés.**

---

### 3.1. Hero — `#hero`

- **Vezetői üzenet:** A szervezet valós működése látható és modellezhető.
- **Mit lát:** Mély grafit felület, monumentális rövid headline, keskeny alcím, két CTA.
  A háttérben lassan élő szervezeti gráf: mélységélességgel elhelyezett csomópontok,
  vékony kék kapcsolatvonalak, halvány adatimpulzusok a kapcsolatok mentén.
- **Mit ért meg:** Az Ezekiel nem dashboard és nem riport — összefüggő modell.
- **Animáció:** A gráf absztrakt pontfelhőként indul, majd 8 másodperc alatt magától
  rendeződik: kirajzolódnak a kapcsolatok, és néhány csomópont felirata megjelenik
  (Pénzügy, Beszerzés, Szerződéskötés, ERP, Kockázat…). A scroll első 100vh-ján a kamera
  finoman beljebb húz, a fókusz eltolódik.
- **Következő lépés:** „Fedezd fel az Ezekielt" → `#problema`. Görgetésjelző.

### 3.2. Problémafelvetés — `#problema`

- **Vezetői üzenet:** Az átláthatatlanság oka nem adathiány, hanem a kapcsolatok hiánya.
- **Mit lát:** Hét forráskártya (szabályzat, Excel, interjú, vállalati rendszer,
  munkatársak tudása, e-mail, folyamatleírás) szétszórva, egymástól elszigetelve.
  Scroll közben a kártyák egy közös rácsra rendeződnek, és kapcsolatvonalak kötik össze őket.
- **Mit ért meg:** Az információ megvan a szervezetben — csak nincs egy helyen, egy nyelven.
- **Animáció:** Sticky szekció. A scroll progresszió 0→1 között: szórt elhelyezés →
  rendezett rács → kapcsolatok kirajzolása → középen összeáll az Ezekiel-modell csomópontja.
- **Következő lépés:** A modell bemutatása.

### 3.3. A szervezeti modell — `#platform`

- **Vezetői üzenet:** Egyetlen modell, amely nyolc nézőpontból vizsgálható.
- **Mit lát:** Nagy, interaktív gráf. Mellette nyolc rétegkapcsoló:
  Szervezet, Szerepkörök, Szolgáltatások, Folyamatok, Rendszerek, Adatok, Költségek, Kockázatok.
- **Mit ért meg:** Nem nyolc külön dokumentum, hanem egy modell nyolc metszete.
  A rétegek ki-be kapcsolásakor az alapstruktúra nem változik — csak amit látunk belőle.
- **Interakció:** Rétegek togglelése (billentyűzettel is), csomópontra kattintva
  részletpanel: típus, felelős, kapcsolódó folyamatok, rendszerek, költség, bizonyossági szint.
- **Következő lépés:** „Honnan tudja ezt az Ezekiel?" → felmérés.

### 3.4. Felmérés — `#felmeres`

- **Vezetői üzenet:** A modell strukturált felmérésből épül, nem feltételezésekből.
- **Mit lát:** Hét lépésű, sticky idővonal. Balra a lépések listája, jobbra egy
  élő átalakulás: egy szabályzatrészlet szövege fokozatosan strukturált objektumokká
  és kapcsolatokká alakul (mondat → kiemelt entitások → objektumkártyák → gráfélek).
- **Mit ért meg:** A dokumentált és a tényleges működés két külön adat, és az Ezekiel
  külön kezeli őket.
- **Animáció:** Filmszerű morfolás, scrollhoz kötve. A dokumentált/tényleges eltérés
  a hetedik lépésben vizuálisan is megjelenik (eltérésjelölés a gráfon).
- **Következő lépés:** Ha megvan a modell, mit mond?

### 3.5. Elemzés — `#elemzes`

- **Vezetői üzenet:** Az Ezekiel nem térképet ad, hanem diagnózist.
- **Mit lát:** Négy diagnosztikai terület (hiányosságok, konfliktusok, kockázatok,
  veszteségek), mindegyikhez egy konkrét vezetői kérdés. A kiválasztott területhez tartozó
  találatok kiemelkednek a gráfból; a panel mutatja az érintett folyamatot, szerepkört és
  a következményt.
- **Mit ért meg:** A probléma nem elvont: nevesített folyamathoz, szerepkörhöz és számhoz kötött.
- **Interakció:** Négy fül. Váltásnál a gráf fókusza és a kiemelt csomópontok morfolnak.
- **Következő lépés:** Minden probléma mögött van egy szám.

### 3.6. Költség és megtérülés — `#megterules`

- **Vezetői üzenet:** A működési problémák forintosíthatók, a fejlesztések megtérülése számolható.
- **Mit lát:** Egy konkrét folyamat (Beszerzési igény → szerződéskötés) mérőszámai:
  átfutási idő, manuális munkaigény, érintett FTE, éves működési költség, hibaköltség,
  késedelmi kockázat, automatizálhatóság. Alatta három fejlesztési szint összehasonlítása.
- **Mit ért meg:** A döntés nem „digitalizáljunk-e", hanem „melyik szint térül meg leghamarabb".
- **Interakció:** Fejlesztési szint választása (Szabályozott működés / Workflow és
  digitalizáció / Automatizáció és intelligens támogatás). A mérőszámok animált
  számlálóval a kiválasztott forgatókönyv értékére állnak, a delta jelölve.
- **Következő lépés:** És ha előre látnám a következményt?

### 3.7. Vezetői döntéstámogatás — `#dontestamogatas`

- **Vezetői üzenet:** A döntés következménye a döntés előtt látható.
- **Mit lát:** Hat szimulációs kérdés választható listája. A gráf „előtte–utána"
  állapotot vesz fel: a változás terjedése végigfut a kapcsolatokon, az érintett
  csomópontok állapota átbillen, új szűk keresztmetszet keletkezik vagy megszűnik.
- **Mit ért meg:** A szervezet rendszer: egy pontot megérintve máshol keletkezik hatás.
- **Interakció:** Forgatókönyv kiválasztása + „Előtte / Utána" csúszka.
- **Következő lépés:** Ez nem egyszeri elemzés.

### 3.8. Az eredmény — `#eredmeny`

- **Vezetői üzenet:** Az eredmény egy folyamatosan használható modell, nem egy riport.
- **Mit lát:** Hét tulajdonság (frissíthető, összehasonlítható, verziózható, mérhető,
  továbbfejleszthető, döntéstámogató, integrálható) rendezett listában, mellette
  verzió-idővonal: ugyanaz a szervezet két időpontban, mért eltéréssel.
- **Mit ért meg:** A modell a szervezettel együtt él, és a változás mérhető rajta.
- **Animáció:** Visszafogott; a verziók közötti váltás finom morfolás.
- **Következő lépés:** Miért hihetek ennek?

### 3.9. Bizalom és módszertan — `#modszertan`

- **Vezetői üzenet:** Az Ezekiel nem fekete doboz. Minden következtetés visszavezethető.
- **Mit lát:** Hat módszertani alapelv, és egy „forrásvisszavezetés" demonstráció:
  egy megállapítás → a hozzá tartozó forrás(ok) → bizonyossági szint.
- **Mit ért meg:** Az állítások ellenőrizhetők, a bizonytalanság jelölve van.
- **Fontos:** Ez a szekció nem tartalmaz ügyfélszámot, tanúsítványt vagy nem igazolt
  eredményállítást.
- **Következő lépés:** Beszéljünk.

### 3.10. Záró szekció — `#bemutato`

- **Vezetői üzenet:** Amit nem látunk, azon nem tudunk javítani.
- **Mit lát:** A hero gráfja tér vissza, most teljesen összekapcsolt, rendezett állapotban.
  Két CTA: „Kérek egy bemutatót", „Beszéljünk egy pilotról". Rövid kapcsolatfelvételi űrlap.
- **Mit ért meg:** A következő lépés kis kötelezettségű és konkrét.

## 4. Vezetői üzenethierarchia

Három szinten, csökkenő absztrakcióval. Egy látogató bármelyik szinten megállhat, és
önmagában érvényes üzenetet kap.

**1. szint — a tézis (5 másodperc, hero)**
Lásd a szervezetet úgy, ahogy valójában működik.

**2. szint — a négy vezetői érv (30 másodperc, szekció-headline-ok)**
1. Az adatok nem kapcsolódnak össze → az Ezekiel összekapcsolja őket.
2. Nem térkép, hanem diagnózis → hiányosság, konfliktus, kockázat, veszteség.
3. Minden probléma mögött van egy szám → költség és megtérülés.
4. A döntés előtt látod a következményt → szimuláció.

**3. szint — a bizonyíték (2–5 perc, interakciók és mérőszámok)**
Rétegek, csomópontrészletek, folyamatmérőszámok, forgatókönyvek, forrásvisszavezetés,
bizonyossági szintek.

## 5. Tartalmi elvek

- Egy szekció = egy üzenet. Headline maximum 8–12 szó.
- Szekcióbevezető maximum 1–3 mondat, 60–70 karakteres szövegoszlopban.
- Minden szövegblokk válaszol legalább egy kérdésre: Mit látok? Miért fontos?
  Milyen problémát old meg? Milyen döntésben segít? Milyen mérhető eredményhez vezet?
- Számok csak illusztratív, példaként jelölt folyamatra vonatkoznak — a felületen
  egyértelműen „példa" jelöléssel.
- Nincs „revolutionary", „game-changing", nincs nem igazolt ügyfélszám vagy tanúsítvány.
