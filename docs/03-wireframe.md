# Ezekiel — wireframe (desktop / mobil)

Jelölés: `▓` vizuál/canvas · `───` hajszálvonal · `[ ]` gomb · `( )` toggle · `│` kolumnaszél

## Hero — `#hero`

**Desktop (≥1280px)**
```
┌──────────────────────────────────────────────────────────────────────┐
│ EZEKIEL        Platform  Módszertan  Megoldások  Eredmények  Rólunk  │
│                              Az Ezekiel működése   [ Bemutatót kérek ]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ▓▓▓  animált szervezeti gráf — teljes bleed, mélységélességgel  ▓▓▓ │
│   ▓                                                                ▓ │
│   ▓   A SZERVEZET DIGITÁLIS MODELLJE                (eyebrow)      ▓ │
│   ▓                                                                ▓ │
│   ▓   Lásd a szervezetet úgy,                     (display-1,      ▓ │
│   ▓   ahogy valójában működik.                     max 18ch/sor)   ▓ │
│   ▓                                                                ▓ │
│   ▓   Az Ezekiel összekapcsolja a folyamatokat,   (lead, 34ch)     ▓ │
│   ▓   szerepköröket, rendszereket, költségeket…                    ▓ │
│   ▓                                                                ▓ │
│   ▓   [ Fedezd fel az Ezekielt ]   Bemutatót kérek →               ▓ │
│   ▓                                                                ▓ │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                          ↓ görgess                                   │
└──────────────────────────────────────────────────────────────────────┘
```
A szöveg a bal 6 kolumnán, a gráf sűrűbb tömege a jobb oldalon — a szöveg mögött a
gráf ritkul (olvashatósági maszk, radiális gradienssel), nem sötétítjük le az egészet.

**Mobil (375px)**
```
┌────────────────────────┐
│ EZEKIEL            ☰   │
├────────────────────────┤
│  ▓ gráf (ritkított,    │
│  ▓ 1/3 csomópont)      │
│  ▓                     │
│  A SZERVEZET DIG.…     │
│  Lásd a szervezetet    │
│  úgy, ahogy valójában  │
│  működik.              │
│                        │
│  Az Ezekiel összekap-  │
│  csolja a folyamato…   │
│                        │
│  [ Fedezd fel  ]       │◄ full-width CTA
│  [ Bemutatót kérek ]   │
│         ↓              │
└────────────────────────┘
```
A gráf mobilon a headline **fölött** él (felső 38vh), nem alatta — így a szöveg
mindig maszk nélkül olvasható.

## Problémafelvetés — `#problema` (sticky, 300vh)

```
┌──────────────────────────────────────────────────────────────────────┐
│  A KIINDULÓPONT                                                      │
│  A szervezetek nem azért átláthatatlanok, mert nincs adat.           │
│  Hanem mert az adatok nem kapcsolódnak össze.        (display-2, 2 sor)│
│                                                                      │
│   ┌────────┐        ┌────────┐                                       │
│   │Szabály-│   ┌────────┐  │Excel-  │      ▒ 0.0–0.35: szórt         │
│   │zatok   │   │Interjúk│  │táblák  │      ▒ 0.35–0.7: rácsra rendez │
│   └────────┘   └────────┘  └────────┘      ▒ 0.7–1.0: kapcsolatok    │
│        ┌────────┐    ┌────────┐                     kirajzolása      │
│        │Rendsze-│    │Fejekben│   ┌────────┐                         │
│        │rek     │    │        │   │E-mailek│                         │
│        └────────┘    └────────┘   └────────┘                         │
│              ┌────────┐                                              │
│              │Folyamat-│         ─── progresszió-indikátor ───       │
│              │leírások │                                             │
│              └────────┘                                              │
└──────────────────────────────────────────────────────────────────────┘
```
Mobilon: 7 kártya → 2 kolumnás rács, a kapcsolatvonalak egyszerűsítve (csak a
középpontba futó élek), a szekció 220vh.

## A szervezeti modell — `#platform`

```
┌──────────────────────────────────────────────────────────────────────┐
│  A MODELL                                                            │
│  Egyetlen modell. A teljes működés.                                  │
│  Ugyanaz a szervezet nyolc nézőpontból. Az alapmodell nem változik.   │
│                                                                      │
│  ┌── rétegek ────────┐  ┌──────────────────────────────────────────┐ │
│  │ (•) Szervezet     │  │                                          │ │
│  │ (•) Szerepkörök   │  │   ▓▓  interaktív gráf, rétegmetszetek ▓▓ │ │
│  │ ( ) Szolgáltatások│  │   ▓                                    ▓ │ │
│  │ (•) Folyamatok    │  │   ▓        ● kiválasztott csomópont     ▓ │ │
│  │ (•) Rendszerek    │  │   ▓                                    ▓ │ │
│  │ ( ) Adatok        │  │   ▓                    ┌──────────────┐ ▓ │ │
│  │ (•) Költségek     │  │   ▓                    │ Szerződéskö- │ ▓ │ │
│  │ ( ) Kockázatok    │  │   ▓                    │ tés          │ ▓ │ │
│  │                   │  │   ▓                    │ Folyamat     │ ▓ │ │
│  │ 5/8 réteg aktív   │  │   ▓                    │ Felelős: …   │ ▓ │ │
│  │ 34 objektum       │  │   ▓                    │ Rendszer: …  │ ▓ │ │
│  └───────────────────┘  │   ▓                    │ Bizonyosság  │ ▓ │ │
│                         │   ▓                    └──────────────┘ ▓ │ │
│                         └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```
Mobilon: a rétegkapcsoló vízszintesen scrollozható chip-sor a gráf **alatt**
(nem fölött — a gráf kapja a felső fókuszt), a részletpanel alulról felcsúszó lap.

## Felmérés — `#felmeres` (sticky, 300vh)

```
┌──────────────────────────────────────────────────────────────────────┐
│  FELMÉRÉS                                                            │
│  A dokumentumoktól a valós működésig.                                │
│                                                                      │
│  1 Dokumentált állapot     │  ┌────────────────────────────────────┐ │
│  2 Szervezeti struktúra    │  │ „A beszerzési igényt a szervezeti  │ │
│ ▸3 Interjúk és kérdőívek   │  │  egység vezetője hagyja jóvá…"     │ │
│  4 Folyamatok rögzítése    │  │              ↓ morfolás            │ │
│  5 Rendszerek és adatok    │  │  ┌────────┐  ┌────────┐            │ │
│  6 Dokumentált vs. valós   │  │  │Szerep- │──│Folyamat│            │ │
│  7 Adatminőség             │  │  │kör     │  │lépés   │            │ │
│                            │  │  └────────┘  └────────┘            │ │
│  (aktív lépés kiemelve,    │  │       jóváhagyja                   │ │
│   a többi --text-secondary)│  └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```
Mobilon: a lépéslista vízszintes progresszió-sorrá egyszerűsödik (`3/7`), a
morfoló vizuál teljes szélességű.

## Elemzés — `#elemzes`

```
┌──────────────────────────────────────────────────────────────────────┐
│  DIAGNÓZIS                                                           │
│  Nem csak térképet készít. Diagnózist ad.                            │
│                                                                      │
│  [Hiányosságok] [Konfliktusok] [Kockázatok] [Veszteségek]   ← fülek  │
│  ─────────────                                                       │
│  ┌───────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ Mely feladatoknak     │  │  ▓ gráf, találatok kiemelve ▓        │  │
│  │ nincs egyértelmű      │  │  ▓  ⚠ 3 érintett csomópont ▓        │  │
│  │ felelőse vagy         │  │  ▓                          ▓        │  │
│  │ szabályozott          │  └─────────────────────────────────────┘  │
│  │ folyamata?            │  ┌─────────────────────────────────────┐  │
│  │                       │  │ ⚠ Szállítói minősítés               │  │
│  │ 3 találat             │  │   Nincs kijelölt felelős            │  │
│  └───────────────────────┘  │   Érinti: Beszerzés, Jogi · 2 folyamat│ │
│                             │   Következmény: átfutás +6 nap      │  │
│                             └─────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## Költség és megtérülés — `#megterules`

```
┌──────────────────────────────────────────────────────────────────────┐
│  KÖLTSÉG ÉS HATÁS                                                    │
│  Minden működési probléma mögött van egy szám.                       │
│  Példa: Beszerzési igény → szerződéskötés                            │
│                                                                      │
│  ┌── jelen állapot ─────────┐   ┌── fejlesztési szint ─────────────┐ │
│  │ Átfutási idő      18 nap │   │ [1 Szabályozott]                 │ │
│  │ Manuális munka   62 óra/hó│  │ [2 Workflow]  ◄ aktív            │ │
│  │ Érintett FTE       2,4   │   │ [3 Automatizáció]                │ │
│  │ Éves költség    18,4 MFt │   ├──────────────────────────────────┤ │
│  │ Hibaköltség      2,1 MFt │   │ Fejlesztési költség     6,5 MFt  │ │
│  │ Késedelmi kockázat közép │   │ Időmegtakarítás      −41%  ▼     │ │
│  │ Automatizálhatóság  64%  │   │ FTE-hatás            −0,9 FTE    │ │
│  └──────────────────────────┘   │ Kockázatcsökkenés    közép→alacs │ │
│                                 │ Megtérülési idő      11 hónap    │ │
│                                 └──────────────────────────────────┘ │
│  Az értékek egy illusztratív példafolyamatra vonatkoznak.             │
└──────────────────────────────────────────────────────────────────────┘
```
Mobilon: a két panel egymás alá kerül, a forgatókönyv-választó tapadó chip-sor.

## Vezetői döntéstámogatás — `#dontestamogatas`

```
┌──────────────────────────────────────────────────────────────────────┐
│  SZIMULÁCIÓ                                                          │
│  A döntés előtt lásd a következményeket.                             │
│                                                                      │
│  ┌── forgatókönyv ────────┐  ┌──────────────────────────────────┐    │
│  │ ▸ Új munkatárs         │  │  ▓ gráf: a változás terjedése ▓   │    │
│  │   Kulcsszereplő kiesik │  │  ▓  ●→●→◐  propagáció         ▓   │    │
│  │   Rendszercsere        │  │  └────────────────────────────┘    │
│  │   Új szűk keresztmetsz.│  │  [ Előtte ]═══◉═══[ Utána ]       │    │
│  │   Leggyorsabb megtérül.│  │  Hatás: 3 folyamat, 2 szerepkör   │    │
│  │   Kockázati profil     │  │  Új szűk keresztmetszet: Jogi     │    │
│  └────────────────────────┘  └──────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

## Az eredmény — `#eredmeny`

Kétkolumnás: balra a hét tulajdonság rendezett listája, jobbra verzió-idővonal
(`2026 Q1 → 2026 Q3`) mért eltérésekkel. Visszafogott, animáció minimális.

## Bizalom és módszertan — `#modszertan`

```
┌──────────────────────────────────────────────────────────────────────┐
│  MÓDSZERTAN                                                          │
│  Minden következtetés visszavezethető a forrásáig.                   │
│                                                                      │
│  ┌ 6 alapelv (3×2 rács) ──┐  ┌── forrásvisszavezetés ─────────────┐  │
│  │ Strukturált felmérés   │  │ Megállapítás                       │  │
│  │ Dokumentált vs. valós  │  │ „A szállítói minősítésnek nincs     │  │
│  │ Bizonyossági szint     │  │  kijelölt felelőse."               │  │
│  │ Forrásvisszavezetés    │  │  ├ Beszerzési szabályzat 4.2 §      │  │
│  │ Nem fekete doboz       │  │  ├ Interjú — beszerzési vezető      │  │
│  │ Emberi ellenőrzés      │  │  └ ERP jogosultsági kiosztás        │  │
│  └────────────────────────┘  │ Bizonyossági szint: magas ●●●○      │  │
│                              └────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## Záró szekció — `#bemutato`

```
┌──────────────────────────────────────────────────────────────────────┐
│   ▓▓▓ a hero gráfja — most teljesen összekapcsolt, rendezett ▓▓▓     │
│   ▓                                                              ▓   │
│   ▓        Amit nem látunk, azon nem tudunk javítani.     (display-2)│
│   ▓                                                              ▓   │
│   ▓        Az Ezekiel láthatóvá, mérhetővé és fejleszthetővé      ▓   │
│   ▓        teszi a szervezet működését.                    (lead)▓   │
│   ▓                                                              ▓   │
│   ▓        [ Kérek egy bemutatót ]   Beszéljünk egy pilotról →    ▓   │
│   ▓                                                              ▓   │
│   ▓        ┌── kapcsolatfelvétel ──────────────────────┐          ▓   │
│   ▓        │ Név · E-mail · Szervezet · Üzenet  [Küldés]│         ▓   │
│   ▓        └───────────────────────────────────────────┘          ▓   │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
├──────────────────────────────────────────────────────────────────────┤
│ EZEKIEL   Platform Módszertan Megoldások Eredmények Rólunk           │
│ A szervezet digitális modellje.        Adatvédelem · Kapcsolat       │
└──────────────────────────────────────────────────────────────────────┘
```

## Töréspontok

| Név | Szélesség | Fő eltérés |
|---|---|---|
| `mobile` | < 640px | 1 kolumna, gráf ritkított, parallax ki, sticky szekciók rövidebbek, CTA full-width |
| `tablet` | 640–1023px | 2 kolumna, gráf közepes sűrűség, oldalpanelek a vizuál alá kerülnek |
| `laptop` | 1024–1439px | Teljes elrendezés, 12 kolumna |
| `desktop` | 1440–1799px | Teljes elrendezés, nagyobb display-méretek |
| `wide` | ≥ 1800px | A tartalom 1240px-en megáll, a whitespace nő, a gráf tovább terjed |
